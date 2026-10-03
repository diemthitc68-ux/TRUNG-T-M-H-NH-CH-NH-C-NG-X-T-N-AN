import React, { useState } from 'react';
import { Member, MemberRole, OfficialDocument } from '../types';
import { UserPlus, Trash2, Phone, Mail, FileText, Check, AlertCircle, Edit2, Search } from 'lucide-react';

interface MemberListProps {
  members: Member[];
  documents: OfficialDocument[];
  onAddMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
  onUpdateMember: (id: string, updated: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
  onFilterByMember: (memberName: string) => void;
  selectedMemberFilter?: string;
}

const AVAILABLE_ROLES: MemberRole[] = [
  'Giám đốc Trung tâm Hành chính công',
  'Lãnh đạo UBND',
  'Bộ phận Một cửa',
  'Công chức Tư pháp - Hộ tịch',
  'Công chức Địa chính - Xây dựng',
  'Công chức Văn phòng - Thống kê',
  'Công chức Văn hóa - Xã hội',
  'Công chức Tài chính - Kế toán',
  'Chỉ huy trưởng Quân sự',
  'Trưởng Công an xã',
];

export const MemberList: React.FC<MemberListProps> = ({
  members,
  documents,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onFilterByMember,
  selectedMemberFilter,
}) => {
  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<MemberRole>('Công chức Văn phòng - Thống kê');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Count active documents per member
  const getMemberDocCount = (memberName: string) => {
    const total = documents.filter((d) => d.assignee === memberName).length;
    const pending = documents.filter(
      (d) => d.assignee === memberName && d.status !== 'Đã hoàn thành'
    ).length;
    return { total, pending };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên cán bộ');
      return;
    }

    if (editingId) {
      onUpdateMember(editingId, {
        name: name.trim(),
        role,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setEditingId(null);
    } else {
      onAddMember({
        name: name.trim(),
        role,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    // Reset
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setErrorMsg('');
  };

  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setName(m.name);
    setRole(m.role);
    setPhone(m.phone || '');
    setEmail(m.email || '');
    setNotes(m.notes || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setErrorMsg('');
  };

  const handleDelete = (member: Member) => {
    const { pending } = getMemberDocCount(member.name);
    let confirmPrompt = `Đồng chí có chắc chắn muốn xóa cán bộ "${member.name}" khỏi hệ thống UBND xã?`;
    if (pending > 0) {
      confirmPrompt = `Cán bộ "${member.name}" hiện đang thụ lý ${pending} văn bản chưa hoàn thành! Đồng chí có chắc chắn muốn xóa không?`;
    }
    if (window.confirm(confirmPrompt)) {
      onDeleteMember(member.id);
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      (m.notes && m.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Form column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <h2 className="text-sm font-bold text-red-900 uppercase tracking-wide flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-red-800" />
              {editingId ? 'Cập Nhật Cán Bộ / Chuyên Viên' : 'Thêm Cán Bộ / Chuyên Viên'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Hủy bỏ
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và Tên cán bộ <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn An"
                required
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vị trí đảm nhiệm <span className="text-red-600">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912.xxx.xxx"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hộp thư công vụ (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="canbo@ubnd.gov.vn"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phân công phụ trách / Ghi chú
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Phụ trách hồ sơ đất đai Thôn 1, 2; giải quyết đơn thư..."
                rows={2}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-red-900 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm rounded-md transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {editingId ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Lưu Thay Đổi Thông Tin</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>+ Thêm Cán Bộ Vào Hệ Thống</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Instructions Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 leading-relaxed">
          <div className="font-semibold text-slate-800 mb-1">
            Quy định phân công thụ lý văn bản UBND:
          </div>
          <p>
            Văn bản đến sau khi vào sổ sẽ do Lãnh đạo UBND hoặc Văn phòng xã giao cho công chức chuyên
            môn thụ lý theo thẩm quyền (Địa chính, Tư pháp, Một cửa...). Tiến độ giải quyết được giám
            sát tự động theo thời hạn giải quyết.
          </p>
        </div>
      </div>

      {/* List column */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
            <div>
              <h2 className="text-sm font-bold text-red-900 uppercase tracking-wide">
                Danh Sách Cán Bộ, Công Chức Xã Tân An
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Tổng số: <strong className="text-slate-800 tabular-nums">{members.length}</strong> đồng chí
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm cán bộ, chức vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md w-full sm:w-56 focus:outline-hidden focus:ring-1 focus:ring-red-800 focus:border-red-800"
              />
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Không tìm thấy cán bộ nào phù hợp với từ khóa.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredMembers.map((m) => {
                const { total, pending } = getMemberDocCount(m.name);
                const isSelected = selectedMemberFilter === m.name;

                return (
                  <div
                    key={m.id}
                    className={`py-3.5 px-3 rounded-lg transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected ? 'bg-red-50/70 border border-red-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Avatar Circle with initials */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                        {m.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(-2)
                          .join('')}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">{m.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-medium">
                            {m.role}
                          </span>
                        </div>

                        {/* Unboxed metadata */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                          {m.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span className="font-mono text-[11px]">{m.phone}</span>
                            </span>
                          )}
                          {m.phone && m.email && <span aria-hidden="true">·</span>}
                          {m.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[170px] text-[11px]">{m.email}</span>
                            </span>
                          )}
                        </div>

                        {m.notes && (
                          <div className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                            {m.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions and Workload Stats */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onFilterByMember(m.name)}
                        title={`Xem văn bản do đồng chí ${m.name} thụ lý`}
                        className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          isSelected
                            ? 'bg-red-800 text-white border-red-800'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>
                          {pending > 0 ? (
                            <strong className="text-red-700 tabular-nums">{pending}</strong>
                          ) : (
                            <span className="tabular-nums">0</span>
                          )}{' '}
                          đang xử lý
                        </span>
                      </button>

                      <button
                        onClick={() => startEdit(m)}
                        title="Chỉnh sửa thông tin cán bộ"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(m)}
                        title="Xóa cán bộ khỏi hệ thống"
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
