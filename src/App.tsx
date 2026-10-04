/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Member, OfficialDocument, DocumentStatus, NoteLog } from './types';
import { INITIAL_MEMBERS, INITIAL_DOCUMENTS, ADMIN_ACCOUNT } from './data/initialData';
import { Header } from './components/Header';
import { StatSummary } from './components/StatSummary';
import { DocumentTable } from './components/DocumentTable';
import { DocumentForm } from './components/DocumentForm';
import { MemberList } from './components/MemberList';
import { StatsView } from './components/StatsView';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { PrintRegistryModal } from './components/PrintRegistryModal';
import { OfficialDocumentPrintModal } from './components/OfficialDocumentPrintModal';
import { ToastProvider } from './components/ToastProvider';
import { PortalInterface } from './components/PortalInterface';
import { MyProfileModal } from './components/MyProfileModal';
import { PersonalProgressPrintModal } from './components/PersonalProgressPrintModal';
import { sendEmailNotification } from './services/emailService';

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

function AppContent() {
  // 1. Current Logged-in Official (Authentication State)
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    try {
      const saved = localStorage.getItem('tanan_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading current user from localStorage', e);
    }
    return null;
  });

  // 2. LocalStorage synchronization (matching tanan_members and tanan_docs from user prototype)
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('tanan_members');
      if (saved) {
        const parsed: Member[] = JSON.parse(saved);
        if (!parsed.some((m) => m.name === ADMIN_ACCOUNT.username)) {
          const adminMember = INITIAL_MEMBERS.find((m) => m.name === ADMIN_ACCOUNT.username);
          if (adminMember) return [adminMember, ...parsed];
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading members from localStorage', e);
    }
    return INITIAL_MEMBERS;
  });

  const [documents, setDocuments] = useState<OfficialDocument[]>(() => {
    try {
      const saved = localStorage.getItem('tanan_docs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading documents from localStorage', e);
    }
    return INITIAL_DOCUMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tanan_members', JSON.stringify(members));
    } catch (e) {
      console.error('Failed to save members to localStorage', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('tanan_docs', JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents to localStorage', e);
    }
  }, [documents]);

  // 2. Navigation & filter states
  const [activeTab, setActiveTab] = useState<'documents' | 'new-doc' | 'members' | 'stats'>('documents');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOverdueOnly, setShowOverdueOnly] = useState<boolean>(false);

  // 3. Modals
  const [selectedDetailDoc, setSelectedDetailDoc] = useState<OfficialDocument | null>(null);
  const [printSlipDoc, setPrintSlipDoc] = useState<OfficialDocument | null>(null);
  const [isPrintRegistryOpen, setIsPrintRegistryOpen] = useState<boolean>(false);
  const [isOfficialPrintOpen, setIsOfficialPrintOpen] = useState<boolean>(false);
  const [officialPrintDoc, setOfficialPrintDoc] = useState<OfficialDocument | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isProgressPrintOpen, setIsProgressPrintOpen] = useState<boolean>(false);

  // Synchronize modal doc if doc gets updated
  useEffect(() => {
    if (selectedDetailDoc) {
      const updated = documents.find((d) => d.id === selectedDetailDoc.id);
      if (updated) setSelectedDetailDoc(updated);
    }
  }, [documents]);

  const handleLogin = (member: Member) => {
    setCurrentUser(member);
    try {
      localStorage.setItem('tanan_current_user', JSON.stringify(member));
    } catch (e) {
      console.error('Failed to save current user to localStorage', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tanan_current_user');
    } catch (e) {
      console.error('Failed to remove current user from localStorage', e);
    }
  };

  const handleUpdateProfile = (updatedData: Partial<Member>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('tanan_current_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to save current user to localStorage', e);
    }
    setMembers((prev) =>
      prev.map((m) =>
        m.id === currentUser.id || m.name === currentUser.name ? { ...m, ...updatedData } : m
      )
    );
  };

  const myDocCount = currentUser
    ? documents.filter(
        (d) => d.assignee && d.assignee.includes(currentUser.name) && d.status !== 'Đã hoàn thành'
      ).length
    : 0;

  const isMyDocFilterActive = currentUser ? assigneeFilter === currentUser.name : false;

  const handleToggleMyDocFilter = () => {
    if (!currentUser) return;
    if (assigneeFilter === currentUser.name) {
      setAssigneeFilter('all');
    } else {
      setAssigneeFilter(currentUser.name);
      setActiveTab('documents');
    }
  };

  // 4. Document Operations
  const handleAddDocument = (newDocData: Omit<OfficialDocument, 'id' | 'history'>) => {
    const newDoc: OfficialDocument = {
      ...newDocData,
      id: 'DOC-' + Date.now(),
      history: [
        {
          id: 'LOG-' + Date.now(),
          author: 'Văn thư xã',
          role: 'Tiếp nhận',
          content: `Vào sổ theo dõi và phân công đồng chí ${newDocData.assignee} thụ lý giải quyết.`,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
      ],
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Gửi email thông báo cho cán bộ được phân công
    const assignee = members.find(m => m.name === newDocData.assignee);
    if (assignee && assignee.email) {
      sendEmailNotification(
        assignee.email,
        `Thông báo phân công văn bản mới: ${newDocData.number}`,
        `Đồng chí có văn bản mới cần thụ lý: ${newDocData.summary}. Hạn xử lý: ${newDocData.deadline}.`
      );
    }
  };

  const handleUpdateStatus = (id: string, newStatus: DocumentStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          const isDone = newStatus === 'Đã hoàn thành';
          return {
            ...doc,
            status: newStatus,
            completedAt: isDone ? new Date().toISOString().split('T')[0] : doc.completedAt,
            history: [
              ...doc.history,
              {
                id: 'LOG-' + Date.now(),
                author: 'Hệ thống điều hành',
                role: 'Cập nhật tiến độ',
                content: `Chuyển trạng thái sang: "${newStatus}".`,
                createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        }
        return doc;
      })
    );
  };

  const handleReassign = (id: string, newAssignee: string, newRole: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            assignee: newAssignee,
            assigneeRole: newRole,
            history: [
              ...doc.history,
              {
                id: 'LOG-' + Date.now(),
                author: 'Lãnh đạo UBND',
                role: 'Chỉ đạo điều phối',
                content: `Điều chuyển cán bộ thụ lý chính sang đồng chí ${newAssignee} (${newRole}).`,
                createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        }
        return doc;
      })
    );
  };

  const handleAddLog = (id: string, log: Omit<NoteLog, 'id' | 'createdAt'>) => {
    const newLogItem: NoteLog = {
      ...log,
      id: 'LOG-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            history: [...doc.history, newLogItem],
          };
        }
        return doc;
      })
    );
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (selectedDetailDoc?.id === id) setSelectedDetailDoc(null);
  };

  // 5. Member Operations
  const handleAddMember = (memberData: Omit<Member, 'id' | 'createdAt'>) => {
    const newMember: Member = {
      ...memberData,
      id: 'MEM-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFilterByMember = (memberName: string) => {
    setAssigneeFilter(memberName);
    setActiveTab('documents');
  };

  // 6. CSV Export
  const handleExportCsv = () => {
    const headers = [
      'STT',
      'Số / Ký hiệu',
      'Loại sổ',
      'Thể loại văn bản',
      'Cơ quan gửi / Người nộp',
      'Nơi nhận',
      'Trích yếu nội dung',
      'Cán bộ thụ lý',
      'Ngày tiếp nhận',
      'Hạn giải quyết',
      'Mức độ khẩn',
      'Trạng thái',
    ];

    const rows = documents.map((doc, idx) => [
      idx + 1,
      `"${doc.number.replace(/"/g, '""')}"`,
      `"${doc.kind}"`,
      `"${doc.docType}"`,
      `"${doc.sender.replace(/"/g, '""')}"`,
      `"${(doc.receiver || '').replace(/"/g, '""')}"`,
      `"${doc.summary.replace(/"/g, '""')}"`,
      `"${doc.assignee}"`,
      doc.receivedDate,
      doc.deadline,
      doc.priority,
      doc.status,
    ]);

    // UTF-8 BOM for Excel Vietnamese accents support
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `So_Van_Ban_UBND_Xa_Tan_An_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 7. Reset Data
  const handleResetData = () => {
    if (
      window.confirm(
        'Đồng chí có chắc chắn muốn khôi phục dữ liệu mẫu chuẩn của UBND Xã Tân An không? Dữ liệu tùy chỉnh sẽ được làm mới.'
      )
    ) {
      setMembers(INITIAL_MEMBERS);
      setDocuments(INITIAL_DOCUMENTS);
      setStatusFilter('all');
      setAssigneeFilter('all');
      setKindFilter('all');
      setCategoryFilter('all');
      setSearchQuery('');
      setShowOverdueOnly(false);
    }
  };

  const handleUpdateMember = (id: string, updated: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const [showLogin, setShowLogin] = useState(false);
  
  // If not logged in, render LoginScreen
  if (!currentUser) {
    if (showLogin) {
      return (
        <LoginScreen 
          members={members}
          onLogin={handleLogin}
          onUpdateMember={handleUpdateMember}
          onAddMember={handleAddMember}
        />
      );
    }
    return <PortalInterface onLoginClick={() => setShowLogin(true)} />;
  }

  return (
    <div className="min-h-screen bg-red-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (isMyDocFilterActive && tab !== 'documents') {
            setAssigneeFilter('all');
          }
        }}
        onOpenPrint={() => setIsPrintRegistryOpen(true)}
        onOpenOfficialPrint={() => {
          setOfficialPrintDoc(null);
          setIsOfficialPrintOpen(true);
        }}
        onExportCsv={handleExportCsv}
        onResetData={handleResetData}
        docCount={documents.length}
        memberCount={members.length}
        myDocCount={myDocCount}
        isMyDocFilterActive={isMyDocFilterActive}
        onToggleMyDocFilter={handleToggleMyDocFilter}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {/* Executive Summary Metrics */}
        <StatSummary
          documents={documents}
          currentStatusFilter={statusFilter}
          onSelectStatus={(st) => {
            setStatusFilter(st);
            if (activeTab !== 'documents') setActiveTab('documents');
          }}
          showOverdueOnly={showOverdueOnly}
          onToggleOverdueOnly={() => {
            setShowOverdueOnly(!showOverdueOnly);
            if (activeTab !== 'documents') setActiveTab('documents');
          }}
        />

        {/* Tab View Content */}
        {activeTab === 'documents' && (
          <DocumentTable
            documents={documents}
            members={members}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            assigneeFilter={assigneeFilter}
            setAssigneeFilter={setAssigneeFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            kindFilter={kindFilter}
            setKindFilter={setKindFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            showOverdueOnly={showOverdueOnly}
            setShowOverdueOnly={setShowOverdueOnly}
            onUpdateStatus={handleUpdateStatus}
            onViewDetail={(doc) => setSelectedDetailDoc(doc)}
            onDeleteDocument={handleDeleteDocument}
            onPrintSlip={(doc) => setPrintSlipDoc(doc)}
            onPrintOfficialDoc={(doc) => {
              setOfficialPrintDoc(doc);
              setIsOfficialPrintOpen(true);
            }}
          />
        )}

        {activeTab === 'new-doc' && (
          <DocumentForm
            members={members}
            onAddDocument={handleAddDocument}
            onSuccess={() => setActiveTab('documents')}
          />
        )}

        {activeTab === 'members' && (
          <MemberList
            members={members}
            documents={documents}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onFilterByMember={handleFilterByMember}
            selectedMemberFilter={assigneeFilter !== 'all' ? assigneeFilter : undefined}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            documents={documents}
            members={members}
            onSelectMember={(name) => {
              setAssigneeFilter(name);
              setActiveTab('documents');
            }}
            onSelectStatus={(st) => {
              setStatusFilter(st);
              setActiveTab('documents');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 md:px-8 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Ủy ban Nhân dân Xã Tân An</strong> · Cổng dịch vụ công & Luân chuyển văn bản nội bộ
          </div>
          <div className="text-slate-400">
            Hệ thống vận hành theo Nghị định số 30/2020/NĐ-CP về công tác văn thư lưu trữ nhà nước.
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedDetailDoc && (
        <DocumentDetailModal
          document={selectedDetailDoc}
          members={members}
          currentUser={currentUser}
          onClose={() => setSelectedDetailDoc(null)}
          onUpdateStatus={handleUpdateStatus}
          onReassign={handleReassign}
          onAddLog={handleAddLog}
          onPrintSlip={(doc) => setPrintSlipDoc(doc)}
          onPrintOfficialDoc={(doc) => {
            setOfficialPrintDoc(doc);
            setIsOfficialPrintOpen(true);
          }}
        />
      )}

      {printSlipDoc && (
        <PrintSlipModal
          document={printSlipDoc}
          onClose={() => setPrintSlipDoc(null)}
        />
      )}

      {isPrintRegistryOpen && (
        <PrintRegistryModal
          documents={documents}
          onClose={() => setIsPrintRegistryOpen(false)}
        />
      )}

      {isOfficialPrintOpen && (
        <OfficialDocumentPrintModal
          document={officialPrintDoc}
          documents={documents}
          members={members}
          onClose={() => setIsOfficialPrintOpen(false)}
        />
      )}

      {/* My Profile Modal */}
      {currentUser && (
        <MyProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          documents={documents}
          onUpdateProfile={handleUpdateProfile}
          onViewDocDetail={(doc) => setSelectedDetailDoc(doc)}
          onPrint={() => setIsProgressPrintOpen(true)}
        />
      )}

      {isProgressPrintOpen && currentUser && (
        <PersonalProgressPrintModal
          currentUser={currentUser}
          documents={documents}
          onClose={() => setIsProgressPrintOpen(false)}
        />
      )}
    </div>
  );
}
