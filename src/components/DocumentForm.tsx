import React, { useState } from 'react';
import { Member, OfficialDocument, DocumentType, PriorityLevel, DocumentKind } from '../types';
import { FilePlus, CheckCircle2, Calendar, User, ArrowRight, ShieldAlert, FileText } from 'lucide-react';

interface DocumentFormProps {
  members: Member[];
  onAddDocument: (doc: Omit<OfficialDocument, 'id' | 'history'>) => void;
  onSuccess: (newDocId: string) => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  'Công văn',
  'Quyết định',
  'Thông báo',
  'Tờ trình',
  'Kế hoạch',
  'Báo cáo',
  'Giấy mời',
  'Đơn kiến nghị / Phản ánh',
];

const PRIORITIES: PriorityLevel[] = ['Thường', 'Khẩn', 'Thượng khẩn', 'Hỏa tốc'];

export const DocumentForm: React.FC<DocumentFormProps> = ({
  members,
  onAddDocument,
  onSuccess,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to add days
  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [kind, setKind] = useState<DocumentKind>('Văn bản đến');
  const [number, setNumber] = useState('');
  const [docType, setDocType] = useState<DocumentType>('Công văn');
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [summary, setSummary] = useState('');
  const [assignee, setAssignee] = useState(members[0]?.name || '');
  const [receivedDate, setReceivedDate] = useState(todayStr);
  const [deadline, setDeadline] = useState(addDays(7));
  const [priority, setPriority] = useState<PriorityLevel>('Thường');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) {
      setErrorMessage('Vui lòng nhập Số / Ký hiệu văn bản.');
      return;
    }
    if (!sender.trim()) {
      setErrorMessage('Vui lòng nhập Cơ quan gửi hoặc Người nộp.');
      return;
    }
    if (!summary.trim()) {
      setErrorMessage('Vui lòng nhập Trích yếu nội dung văn bản.');
      return;
    }
    if (!assignee) {
      setErrorMessage('Vui lòng chọn cán bộ phân công thụ lý.');
      return;
    }

    const assignedMember = members.find((m) => m.name === assignee);

    onAddDocument({
      number: number.trim(),
      kind,
      docType,
      summary: summary.trim(),
      sender: sender.trim(),
      receiver: receiver.trim() || undefined,
      assignee,
      assigneeRole: assignedMember?.role || 'Công chức',
      receivedDate,
      deadline,
      priority,
      status: 'Mới tiếp nhận',
      notes: notes.trim(),
    });

    setSubmitted(true);
    setErrorMessage('');
  };

  const handleResetForm = () => {
    setNumber('');
    setSender('');
    setReceiver('');
    setSummary('');
    setNotes('');
    setDeadline(addDays(7));
    setPriority('Thường');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg border border-slate-200 p-8 text-center shadow-xs">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Đã Vào Sổ Tiếp Nhận & Phân Công Thành Công!
        </h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Văn bản số <strong className="text-slate-900">{number}</strong> đã được ghi vào sổ theo dõi điện tử và chuyển đến tài khoản của đồng chí{' '}
          <strong className="text-slate-900">{assignee}</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onSuccess('')}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-900 hover:bg-red-800 text-white font-medium text-xs sm:text-sm rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Xem Danh Sách Sổ Văn Bản</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetForm}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs sm:text-sm rounded-md transition-colors"
          >
            + Tiếp Nhận Thêm Văn Bản Khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-xs">
        {/* Form Title */}
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2 text-red-900 mb-1">
            <FilePlus className="w-5 h-5 text-red-800" />
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Tiếp Nhận & Vào Sổ Văn Bản Điện Tử
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Ủy ban Nhân dân Xã Tân An · Bộ phận Văn thư - Một cửa tiếp nhận và điều phối luân chuyển
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sổ Văn bản Đến / Đi selector */}
          <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-lg max-w-sm">
            <button
              type="button"
              onClick={() => setKind('Văn bản đến')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                kind === 'Văn bản đến'
                  ? 'bg-white text-red-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📥 Sổ Văn Bản Đến (Cấp trên / Dân nộp)
            </button>
            <button
              type="button"
              onClick={() => setKind('Văn bản đi')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                kind === 'Văn bản đi'
                  ? 'bg-white text-red-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📤 Sổ Văn Bản Đi (UBND Xã phát hành)
            </button>
          </div>

          {/* Row 1: Số ký hiệu & Loại văn bản & Độ khẩn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số / Ký hiệu văn bản <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="VD: 148/UBND-VP hoặc 05/TB-UBND"
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thể loại văn bản <span className="text-red-600">*</span>
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white"
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mức độ khẩn
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Cơ quan gửi / Người nộp & Nơi nhận */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {kind === 'Văn bản đến'
                  ? 'Cơ quan gửi / Người nộp đơn *'
                  : 'Cơ quan / Đơn vị soạn thảo ban hành *'}
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={
                  kind === 'Văn bản đến'
                    ? 'VD: Sở Tư pháp, UBND Huyện hoặc Ông Trần Văn Nam'
                    : 'UBND Xã Tân An'
                }
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {kind === 'Văn bản đến'
                  ? 'Người nhận / Đơn vị tiếp nhận'
                  : 'Nơi nhận (Gửi các ban ngành / Thôn / Huyện)'}
              </label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="VD: Lãnh đạo UBND xã hoặc Các thôn 1, 2, 3, 4"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
              />
            </div>
          </div>

          {/* Row 3: Trích yếu nội dung văn bản */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trích yếu nội dung văn bản <span className="text-red-600">*</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="VD: V/v giải quyết thủ tục đăng ký đất đai và cấp giấy chứng nhận quyền sử dụng đất..."
              required
              rows={3}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 resize-y"
            />
          </div>

          {/* Row 4: Cán bộ thụ lý & Ngày tiếp nhận & Hạn giải quyết */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Cán bộ phân công xử lý *</span>
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Ngày vào sổ / Tiếp nhận</span>
              </label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Hạn giải quyết *</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white font-mono"
              />
              {/* Quick presets */}
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-[10px] text-slate-400">Gợi ý:</span>
                <button
                  type="button"
                  onClick={() => setDeadline(addDays(3))}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700"
                >
                  3 ngày
                </button>
                <button
                  type="button"
                  onClick={() => setDeadline(addDays(5))}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700"
                >
                  5 ngày
                </button>
                <button
                  type="button"
                  onClick={() => setDeadline(addDays(7))}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700"
                >
                  7 ngày
                </button>
                <button
                  type="button"
                  onClick={() => setDeadline(addDays(15))}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700"
                >
                  15 ngày
                </button>
              </div>
            </div>
          </div>

          {/* Row 5: Ý kiến chỉ đạo ban đầu / Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ý kiến chỉ đạo ban đầu của Lãnh đạo / Ghi chú lưu ý
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Giao đồng chí kiểm tra thực địa và báo cáo kết quả trước ngày hết hạn."
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors"
            >
              Làm mới form
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-900 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm rounded-md transition-colors shadow-xs flex items-center gap-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>Vào Sổ Tiếp Nhận & Phân Công Thụ Lý</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
