import React from 'react';
import { OfficialDocument, DocumentStatus, Member } from '../types';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  User,
  ArrowUpDown,
  Printer,
} from 'lucide-react';

interface DocumentTableProps {
  documents: OfficialDocument[];
  members: Member[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (assignee: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  kindFilter: string;
  setKindFilter: (kind: string) => void;
  showOverdueOnly: boolean;
  setShowOverdueOnly: (val: boolean) => void;
  onUpdateStatus: (id: string, status: DocumentStatus) => void;
  onViewDetail: (doc: OfficialDocument) => void;
  onDeleteDocument: (id: string) => void;
  onPrintSlip: (doc: OfficialDocument) => void;
  onPrintOfficialDoc: (doc: OfficialDocument) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  members,
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  searchQuery,
  setSearchQuery,
  kindFilter,
  setKindFilter,
  showOverdueOnly,
  setShowOverdueOnly,
  onUpdateStatus,
  onViewDetail,
  onDeleteDocument,
  onPrintSlip,
  onPrintOfficialDoc,
}) => {
  const today = new Date().toISOString().split('T')[0];

  // Helper to determine deadline status
  const getDeadlineStatus = (deadline: string, status: DocumentStatus) => {
    if (status === 'Đã hoàn thành') {
      return { label: 'Đã xong', style: 'text-emerald-700 bg-emerald-50' };
    }

    const todayDate = new Date(today);
    const deadlineDate = new Date(deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - todayDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return {
        label: `Quá hạn ${Math.abs(diffDays)} ngày`,
        style: 'text-rose-700 font-semibold bg-rose-50 border border-rose-200',
        isOverdue: true,
      };
    }
    if (diffDays <= 2) {
      return {
        label: `Còn ${diffDays} ngày`,
        style: 'text-amber-800 font-medium bg-amber-50 border border-amber-200',
        isNear: true,
      };
    }
    return {
      label: `Còn ${diffDays} ngày`,
      style: 'text-slate-600 bg-slate-50',
    };
  };

  // Filter logic
  const filteredDocs = documents.filter((doc) => {
    // Kind filter
    if (kindFilter !== 'all' && doc.kind !== kindFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;

    // Assignee filter
    if (assigneeFilter !== 'all' && doc.assignee !== assigneeFilter) return false;

    // Overdue filter
    if (showOverdueOnly) {
      if (doc.status === 'Đã hoàn thành' || doc.deadline >= today) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inNumber = doc.number.toLowerCase().includes(q);
      const inSummary = doc.summary.toLowerCase().includes(q);
      const inSender = doc.sender.toLowerCase().includes(q);
      const inAssignee = doc.assignee.toLowerCase().includes(q);
      const inType = doc.docType.toLowerCase().includes(q);
      if (!inNumber && !inSummary && !inSender && !inAssignee && !inType) return false;
    }

    return true;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Hỏa tốc':
        return 'text-red-700 bg-red-100 font-bold border border-red-300';
      case 'Thượng khẩn':
        return 'text-rose-700 bg-rose-50 font-semibold border border-rose-200';
      case 'Khẩn':
        return 'text-amber-800 bg-amber-50 font-semibold border border-amber-200';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Mới tiếp nhận':
        return {
          label: 'Mới tiếp nhận',
          classes: 'bg-blue-50 text-blue-800 border border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'Đang xử lý':
        return {
          label: 'Đang xử lý',
          classes: 'bg-amber-50 text-amber-800 border border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'Chờ phê duyệt':
        return {
          label: 'Chờ phê duyệt',
          classes: 'bg-purple-50 text-purple-800 border border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'Đã hoàn thành':
        return {
          label: 'Đã hoàn thành',
          classes: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
          dot: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Search & Filter Header Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo số ký hiệu, trích yếu nội dung, cơ quan gửi, cán bộ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-red-800 focus:border-red-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Segmented Sổ selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-md shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setKindFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                kindFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả sổ ({documents.length})
            </button>
            <button
              onClick={() => setKindFilter('Văn bản đến')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                kindFilter === 'Văn bản đến'
                  ? 'bg-white text-red-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Văn bản đến ({documents.filter((d) => d.kind === 'Văn bản đến').length})
            </button>
            <button
              onClick={() => setKindFilter('Văn bản đi')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                kindFilter === 'Văn bản đi'
                  ? 'bg-white text-red-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Văn bản đi ({documents.filter((d) => d.kind === 'Văn bản đi').length})
            </button>
          </div>
        </div>

        {/* Second Row of Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc nhanh:</span>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-800"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Mới tiếp nhận">Mới tiếp nhận</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
          </select>

          {/* Assignee Dropdown */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-800 max-w-[200px]"
          >
            <option value="all">Tất cả cán bộ thụ lý</option>
            {members.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name} ({m.role.replace('Công chức ', '')})
              </option>
            ))}
          </select>

          {/* Overdue Checkbox */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-300 bg-white cursor-pointer select-none text-slate-700 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={showOverdueOnly}
              onChange={(e) => setShowOverdueOnly(e.target.checked)}
              className="rounded text-red-800 focus:ring-red-800 w-3.5 h-3.5"
            />
            <span className={showOverdueOnly ? 'font-bold text-red-700' : ''}>
              Văn bản quá hạn
            </span>
          </label>

          {(statusFilter !== 'all' ||
            assigneeFilter !== 'all' ||
            searchQuery !== '' ||
            kindFilter !== 'all' ||
            showOverdueOnly) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setAssigneeFilter('all');
                setSearchQuery('');
                setKindFilter('all');
                setShowOverdueOnly(false);
              }}
              className="text-xs text-red-800 hover:text-red-950 font-medium underline px-1"
            >
              Xóa bộ lọc
            </button>
          )}

          <div className="ml-auto text-xs text-slate-500 tabular-nums">
            Hiển thị <strong>{filteredDocs.length}</strong> / {documents.length} văn bản
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider">
              <th className="py-3 px-3.5 whitespace-nowrap">Số / Ký hiệu</th>
              <th className="py-3 px-3.5 min-w-[240px]">Trích yếu nội dung</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Cơ quan ban hành / Gửi</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Cán bộ thụ lý</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Hạn xử lý</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Trạng thái</th>
              <th className="py-3 px-3.5 whitespace-nowrap text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="max-w-md mx-auto space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="text-sm font-semibold text-slate-700">
                      Không tìm thấy văn bản phù hợp
                    </div>
                    <p className="text-xs text-slate-500">
                      Vui lòng thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh các tiêu chí lọc.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => {
                const deadlineInfo = getDeadlineStatus(doc.deadline, doc.status);
                const statusBadge = getStatusBadge(doc.status);

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onViewDetail(doc)}
                  >
                    {/* Số / Ký hiệu */}
                    <td className="py-3 px-3.5 align-top">
                      <div className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
                        {doc.number}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="tabular-nums font-mono">{doc.receivedDate}</span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {doc.kind}
                      </span>
                    </td>

                    {/* Trích yếu nội dung */}
                    <td className="py-3 px-3.5 align-top">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-red-900 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          {doc.docType}
                        </span>
                        {doc.priority !== 'Thường' && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${getPriorityStyle(
                              doc.priority
                            )}`}
                          >
                            {doc.priority}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-800 font-medium line-clamp-2 leading-snug">
                        {doc.summary}
                      </div>
                      {doc.notes && (
                        <div className="text-xs text-slate-500 italic mt-1 line-clamp-1">
                          Ghi chú: {doc.notes}
                        </div>
                      )}
                    </td>

                    {/* Cơ quan gửi */}
                    <td className="py-3 px-3.5 align-top">
                      <div className="text-slate-800 font-medium text-xs sm:text-sm">
                        {doc.sender}
                      </div>
                      {doc.receiver && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Đến: {doc.receiver}
                        </div>
                      )}
                    </td>

                    {/* Cán bộ thụ lý */}
                    <td className="py-3 px-3.5 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.assignee}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {doc.assigneeRole || 'Công chức'}
                      </div>
                    </td>

                    {/* Hạn xử lý */}
                    <td className="py-3 px-3.5 align-top whitespace-nowrap">
                      <div className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                        {doc.deadline}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded inline-block tabular-nums ${deadlineInfo.style}`}
                        >
                          {deadlineInfo.label}
                        </span>
                      </div>
                    </td>

                    {/* Trạng thái - with quick select */}
                    <td
                      className="py-3 px-3.5 align-top whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${statusBadge.classes}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                          {statusBadge.label}
                        </span>

                        <div>
                          <select
                            value={doc.status}
                            onChange={(e) =>
                              onUpdateStatus(doc.id, e.target.value as DocumentStatus)
                            }
                            className="text-[11px] py-1 px-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-800 focus:outline-hidden text-slate-700 w-full"
                          >
                            <option value="Mới tiếp nhận">Mới tiếp nhận</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td
                      className="py-3 px-3.5 align-top text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewDetail(doc)}
                          title="Xem chi tiết & Ý kiến chỉ đạo"
                          className="p-1.5 text-slate-600 hover:text-red-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrintOfficialDoc(doc)}
                          title="In văn bản theo Nghị định 30/2020/NĐ-CP"
                          className="p-1.5 text-red-800 hover:text-red-950 hover:bg-red-50 rounded transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrintSlip(doc)}
                          title="In phiếu xử lý văn bản"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Đồng chí có chắc chắn muốn xóa văn bản số "${doc.number}"?`
                              )
                            ) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          title="Xóa văn bản khỏi sổ"
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span>
            Hệ thống quản lý văn bản điện tử xã Tân An tuân thủ quy chuẩn Nghị định 30/2020/NĐ-CP về
            công tác văn thư.
          </span>
        </div>
        <div className="font-mono text-slate-600">
          Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
        </div>
      </div>
    </div>
  );
};
