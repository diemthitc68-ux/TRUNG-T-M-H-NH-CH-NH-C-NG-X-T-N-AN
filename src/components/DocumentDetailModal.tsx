import React, { useState } from 'react';
import { OfficialDocument, DocumentStatus, Member, NoteLog } from '../types';
import {
  X,
  Printer,
  Calendar,
  User,
  Clock,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface DocumentDetailModalProps {
  document: OfficialDocument | null;
  members: Member[];
  currentUser?: Member;
  onClose: () => void;
  onUpdateStatus: (id: string, status: DocumentStatus) => void;
  onReassign: (id: string, newAssignee: string, newRole: string) => void;
  onAddLog: (id: string, log: Omit<NoteLog, 'id' | 'createdAt'>) => void;
  onPrintSlip: (doc: OfficialDocument) => void;
  onPrintOfficialDoc: (doc: OfficialDocument) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document: doc,
  members,
  currentUser,
  onClose,
  onUpdateStatus,
  onReassign,
  onAddLog,
  onPrintSlip,
  onPrintOfficialDoc,
}) => {
  if (!doc) return null;

  const [authorName, setAuthorName] = useState(currentUser?.name || 'Nguyễn Văn Thành');
  const [authorRole, setAuthorRole] = useState(currentUser?.role || 'Chủ tịch UBND');
  const [logText, setLogText] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(doc.assignee);

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logText.trim()) return;

    onAddLog(doc.id, {
      author: authorName,
      role: authorRole,
      content: logText.trim(),
    });

    setLogText('');
  };

  const handleReassignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newName = e.target.value;
    setSelectedAssignee(newName);
    const m = members.find((item) => item.name === newName);
    onReassign(doc.id, newName, m?.role || 'Công chức');
  };

  const steps: { key: DocumentStatus; title: string; desc: string }[] = [
    { key: 'Mới tiếp nhận', title: '1. Tiếp nhận & Vào sổ', desc: 'Văn thư vào sổ theo dõi' },
    { key: 'Đang xử lý', title: '2. Đang thụ lý', desc: 'Chuyên viên nghiên cứu giải quyết' },
    { key: 'Chờ phê duyệt', title: '3. Trình phê duyệt', desc: 'Trình Lãnh đạo UBND ký duyệt' },
    { key: 'Đã hoàn thành', title: '4. Đã hoàn tất', desc: 'Ban hành kết quả / Lưu trữ' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === doc.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="bg-[#991b1b] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/40 rounded-lg">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  HỒ SƠ VĂN BẢN: {doc.number}
                </h3>
                <span className="text-[11px] bg-red-950/60 text-amber-200 px-2 py-0.5 rounded font-mono font-medium">
                  {doc.kind}
                </span>
              </div>
              <p className="text-xs text-red-200 mt-0.5">
                {doc.docType} · Tiếp nhận ngày {doc.receivedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintOfficialDoc(doc)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="In văn bản theo thể thức chuẩn Nghị định 30/2020/NĐ-CP"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Văn Bản (NĐ 30)</span>
            </button>
            <button
              onClick={() => onPrintSlip(doc)}
              className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In Phiếu Trình</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-red-200 hover:text-white hover:bg-red-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Workflow Stepper */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Tiến độ luân chuyển hồ sơ
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={st.key}
                    onClick={() => onUpdateStatus(doc.id, st.key)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-white border-red-800 ring-2 ring-red-800/10 shadow-xs'
                        : isPassed
                        ? 'bg-white border-slate-300'
                        : 'bg-slate-100/60 border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {isPassed ? (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            isCurrent ? 'text-red-800' : 'text-emerald-600'
                          }`}
                        />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-red-900'
                            : isPassed
                            ? 'text-slate-800'
                            : 'text-slate-500'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{st.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document Detailed Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Trích yếu nội dung:</div>
                <div className="text-base font-semibold text-slate-900 leading-snug p-3 bg-slate-50 rounded-lg border border-slate-200">
                  {doc.summary}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500 mb-1">Cơ quan gửi / Người nộp:</div>
                  <div className="font-semibold text-sm text-slate-900">{doc.sender}</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="text-xs text-slate-500 mb-1">Nơi nhận / Đơn vị tiếp nhận:</div>
                  <div className="font-semibold text-sm text-slate-900">
                    {doc.receiver || 'Ủy ban Nhân dân Xã Tân An'}
                  </div>
                </div>
              </div>

              {doc.notes && (
                <div className="p-3 rounded-lg border border-slate-200 bg-amber-50/40 text-xs">
                  <span className="font-semibold text-amber-900">Ghi chú ban đầu: </span>
                  <span className="text-slate-700">{doc.notes}</span>
                </div>
              )}
            </div>

            {/* Side attributes */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wide pb-2 border-b border-slate-200">
                Thông tin thụ lý
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Cán bộ phụ trách thụ lý:</label>
                <select
                  value={selectedAssignee}
                  onChange={handleReassignChange}
                  className="w-full text-xs font-medium py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-800"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Trạng thái giải quyết:</label>
                <select
                  value={doc.status}
                  onChange={(e) => onUpdateStatus(doc.id, e.target.value as DocumentStatus)}
                  className="w-full text-xs font-semibold py-1.5 px-2 bg-white border border-slate-300 rounded text-red-900 focus:ring-1 focus:ring-red-800"
                >
                  <option value="Mới tiếp nhận">Mới tiếp nhận</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mức độ khẩn:</span>
                  <span className="font-semibold text-slate-800">{doc.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày vào sổ:</span>
                  <span className="font-mono text-slate-800 tabular-nums">{doc.receivedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hạn giải quyết:</span>
                  <span className="font-mono font-semibold text-red-900 tabular-nums">
                    {doc.deadline}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Nhật ký chỉ đạo & Báo cáo xử lý */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-800" />
                <span>Ý Kiến Chỉ Đạo Của Lãnh Đạo & Báo Cáo Xử Lý</span>
              </h4>
              <span className="text-xs text-slate-500">
                {doc.history?.length || 0} bút phê / ghi nhận
              </span>
            </div>

            {/* History Feed */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto p-1">
              {!doc.history || doc.history.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-lg">
                  Chưa có ý kiến chỉ đạo hoặc bút phê nào. Hãy nhập ý kiến bên dưới.
                </div>
              ) : (
                doc.history.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{h.author}</strong>
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {h.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {h.createdAt}
                      </span>
                    </div>
                    <div className="text-slate-700 leading-relaxed pl-1 border-l-2 border-red-800/40">
                      {h.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add note/remark form */}
            <form
              onSubmit={handleAddLogSubmit}
              className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5"
            >
              <div className="text-xs font-semibold text-slate-700">
                Thêm Bút Phê Chỉ Đạo / Báo Cáo Tiến Độ:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Người ký bút phê:</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    placeholder="VD: Nguyễn Văn Thành"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Chức danh:</label>
                  <select
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-800 text-xs"
                  >
                    <option value="Chủ tịch UBND">Chủ tịch UBND</option>
                    <option value="Phó Chủ tịch UBND">Phó Chủ tịch UBND</option>
                    <option value="Công chức thụ lý">Công chức thụ lý</option>
                    <option value="Văn phòng - Thống kê">Văn phòng - Thống kê</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  value={logText}
                  onChange={(e) => setLogText(e.target.value)}
                  required
                  rows={2}
                  placeholder="Nội dung chỉ đạo: Giao đồng chí hoàn thành trước ngày... hoặc Báo cáo tiến độ: Đã hoàn tất xác minh..."
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-800 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lưu Bút Phê / Chỉ Đạo</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Mã hệ thống: <span className="font-mono text-slate-700">{doc.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
