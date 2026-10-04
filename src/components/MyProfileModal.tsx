import React, { useState, useEffect } from 'react';
import { Member, OfficialDocument } from '../types';
import { Calendar, Clock, AlertTriangle, Save, X } from 'lucide-react';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  documents: OfficialDocument[];
  onUpdateProfile: (updatedData: Partial<Member>) => void;
  onViewDocDetail: (doc: OfficialDocument) => void;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  documents,
  onUpdateProfile,
  onViewDocDetail,
}) => {
  // Khởi tạo thông tin hồ sơ cá nhân ban đầu từ localStorage (fallback address: 'UBND Xã Tân An')
  const getInitialProfile = () => {
    try {
      const saved = localStorage.getItem('tanan_personal_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tanan_personal_profile', e);
    }
    return {
      cccd: currentUser.cccd || '',
      phone: currentUser.phone || '',
      dob: currentUser.dob || '',
      address: currentUser.address || 'UBND Xã Tân An',
    };
  };

  const [cccd, setCccd] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('UBND Xã Tân An');

  useEffect(() => {
    if (isOpen) {
      const p = getInitialProfile();
      setCccd(p.cccd || currentUser.cccd || '');
      setPhone(p.phone || currentUser.phone || '');
      setDob(p.dob || currentUser.dob || '');
      setAddress(p.address || currentUser.address || 'UBND Xã Tân An');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  // Danh sách hồ sơ được giao riêng cho cán bộ (chứa tên cán bộ)
  const myDocs = documents.filter((d) => d.assignee && d.assignee.includes(currentUser.name));

  // Lưu thông tin cá nhân
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      cccd: cccd.trim(),
      phone: phone.trim(),
      dob,
      address: address.trim() || 'UBND Xã Tân An',
    };

    try {
      localStorage.setItem('tanan_personal_profile', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save tanan_personal_profile', err);
    }

    onUpdateProfile(updated);
    alert('Đã cập nhật hồ sơ cá nhân thành công!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Mới tiếp nhận':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Đang xử lý':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Chờ phê duyệt':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Đã hoàn thành':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div
      id="profile-modal"
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2.5 mb-4 border-b-2 border-[#b71c1c]">
          <h3 className="text-[#b71c1c] uppercase font-bold text-sm sm:text-base m-0">
            Hồ Sơ Cán Bộ & Nhiệm Vụ Cá Nhân
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none transition-colors cursor-pointer bg-transparent border-none"
            title="Đóng cửa sổ"
          >
            &times;
          </button>
        </div>

        {/* 1. Biểu mẫu thông tin lý lịch cá nhân */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-200">
            Thông tin trích ngang
          </h4>

          <form id="profile-form" onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Họ và tên cán bộ:
                </label>
                <input
                  type="text"
                  id="prof-name"
                  value={currentUser.name}
                  disabled
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-100 border border-slate-300 rounded text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Chức vụ đảm nhiệm:
                </label>
                <input
                  type="text"
                  id="prof-role"
                  value={currentUser.role}
                  disabled
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-100 border border-slate-300 rounded text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Số CCCD / Định danh:
                </label>
                <input
                  type="text"
                  id="prof-cccd"
                  value={cccd}
                  onChange={(e) => setCccd(e.target.value)}
                  placeholder="Nhập 12 số CCCD"
                  maxLength={15}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-red-800/20 focus:border-red-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Số điện thoại công vụ:
                </label>
                <input
                  type="text"
                  id="prof-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xx..."
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-red-800/20 focus:border-red-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ngày sinh:
                </label>
                <input
                  type="date"
                  id="prof-dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-red-800/20 focus:border-red-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Địa chỉ thường trú:
                </label>
                <input
                  type="text"
                  id="prof-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Xã Tân An, Huyện..."
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="py-2 px-4 bg-[#7b1113] hover:bg-[#5c0b0d] text-white font-semibold text-xs sm:text-sm rounded transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>💾 Lưu Thông Tin Cá Nhân</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Danh sách các hồ sơ/văn bản đang trực tiếp thụ lý */}
        <div>
          <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Hồ sơ, văn bản đồng chí đang trực tiếp xử lý:
            </h4>
            <span className="text-[11px] text-slate-500">
              Tổng số:{' '}
              <strong className="text-red-700">{myDocs.length}</strong>
            </span>
          </div>

          <div className="border border-slate-200 rounded-md overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-3 whitespace-nowrap">Số hiệu</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Trích yếu nội dung</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Hạn giải quyết</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Tiến độ</th>
                </tr>
              </thead>
              <tbody id="my-docs-body" className="divide-y divide-slate-100">
                {myDocs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      Đồng chí hiện không có hồ sơ nào tồn đọng.
                    </td>
                  </tr>
                ) : (
                  myDocs.map((doc) => {
                    const isOverdue =
                      doc.status !== 'Đã hoàn thành' && Boolean(doc.deadline && doc.deadline < today);

                    return (
                      <tr
                        key={doc.id}
                        onClick={() => {
                          onViewDocDetail(doc);
                          onClose();
                        }}
                        className={`transition-colors cursor-pointer ${
                          isOverdue ? 'bg-red-50 hover:bg-red-100/80 text-red-950' : 'hover:bg-slate-50'
                        }`}
                        title="Bấm vào để xem chi tiết hồ sơ & chỉ đạo"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold whitespace-nowrap align-top">
                          <div className="flex items-center gap-1">
                            <span>{doc.number}</span>
                            {isOverdue && (
                              <span className="text-[9px] bg-red-600 text-white font-bold px-1 rounded">
                                Quá hạn
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          <div className="font-medium text-slate-800 line-clamp-2">
                            {doc.summary}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums whitespace-nowrap align-top">
                          <div
                            className={`flex items-center gap-1 ${
                              isOverdue ? 'text-red-700 font-bold' : 'text-slate-700'
                            }`}
                          >
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{doc.deadline}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap align-top">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(
                              doc.status
                            )}`}
                          >
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
