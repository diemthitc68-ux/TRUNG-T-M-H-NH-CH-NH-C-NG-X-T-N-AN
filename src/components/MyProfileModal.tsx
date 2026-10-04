import React, { useState } from 'react';
import { Member, OfficialDocument } from '../types';
import { Calendar, Clock, Lock, Save, X, Printer, CheckCircle, AlertCircle } from 'lucide-react';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  documents: OfficialDocument[];
  onUpdateProfile: (updatedData: Partial<Member>) => void;
  onViewDocDetail: (doc: OfficialDocument) => void;
  onPrint: () => void;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  documents,
  onUpdateProfile,
  onViewDocDetail,
  onPrint,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const myDocs = documents.filter((d) => d.assignee && d.assignee.includes(currentUser.name));
  const today = new Date().toISOString().split('T')[0];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentPassword !== currentUser.password) {
      setError('Mật khẩu hiện tại không chính xác.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    onUpdateProfile({ password: newPassword });
    setSaveSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-4 border-b mb-6">
          <h3 className="text-lg font-bold text-red-900">Thông tin cá nhân & Nhiệm vụ</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        {/* Thông tin cá nhân */}
        <div className="mb-8 grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-slate-500">Họ tên:</p><p className="font-semibold">{currentUser.name}</p></div>
          <div><p className="text-slate-500">Chức vụ:</p><p className="font-semibold">{currentUser.role}</p></div>
          <div><p className="text-slate-500">Điện thoại:</p><p className="font-semibold">{currentUser.phone || 'Chưa cập nhật'}</p></div>
          <div><p className="text-slate-500">Email:</p><p className="font-semibold">{currentUser.email || 'Chưa cập nhật'}</p></div>
        </div>

        {/* Đổi mật khẩu */}
        <form onSubmit={handlePasswordChange} className="mb-8 p-4 bg-slate-50 rounded-lg border">
          <h4 className="font-bold mb-3 flex items-center gap-2"><Lock className="w-4 h-4" /> Đổi mật khẩu</h4>
          {error && <p className="text-xs text-red-600 mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
          {saveSuccess && <p className="text-xs text-emerald-600 mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Đổi mật khẩu thành công!</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="password" placeholder="Mật khẩu hiện tại" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="p-2 border rounded text-sm" required />
            <input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="p-2 border rounded text-sm" required />
            <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="p-2 border rounded text-sm" required />
          </div>
          <button type="submit" className="mt-3 px-4 py-2 bg-red-900 text-white rounded text-sm font-semibold hover:bg-red-800">Cập nhật mật khẩu</button>
        </form>

        {/* Danh sách văn bản */}
        <div className="mb-6">
          <h4 className="font-bold mb-3">Văn bản đang xử lý ({myDocs.length})</h4>
          <div className="border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-2">Số hiệu</th>
                  <th className="p-2">Nội dung</th>
                  <th className="p-2">Hạn</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myDocs.map(doc => (
                  <tr key={doc.id} onClick={() => { onViewDocDetail(doc); onClose(); }} className="hover:bg-slate-50 cursor-pointer">
                    <td className="p-2 font-mono">{doc.number}</td>
                    <td className="p-2 line-clamp-1">{doc.summary}</td>
                    <td className="p-2 font-mono">{doc.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button onClick={() => { onClose(); onPrint(); }} className="px-4 py-2 border rounded text-sm flex items-center gap-2 hover:bg-slate-100"><Printer className="w-4 h-4" /> In báo cáo tiến độ</button>
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded text-sm hover:bg-slate-300">Đóng</button>
        </div>
      </div>
    </div>
  );
};
