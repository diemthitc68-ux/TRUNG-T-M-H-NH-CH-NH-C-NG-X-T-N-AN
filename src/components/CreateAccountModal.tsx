import React, { useState } from 'react';
import { Member, MemberRole } from '../types';
import { UserPlus, X, AlertCircle } from 'lucide-react';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
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

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose, onAddMember }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<MemberRole>(AVAILABLE_ROLES[0]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    onAddMember({
      name: name.trim(),
      role,
      username: username.trim(),
      password: password.trim(),
    });

    onClose();
    setName('');
    setUsername('');
    setPassword('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Tạo Tài Khoản Mới
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMsg && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>}
          <input type="text" placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded text-sm" required />
          <select value={role} onChange={e => setRole(e.target.value as MemberRole)} className="w-full p-2 border rounded text-sm">
            {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input type="text" placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded text-sm" required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded text-sm" required />
          <button type="submit" className="w-full py-2 bg-red-900 text-white rounded font-bold text-sm hover:bg-red-800">Tạo Tài Khoản</button>
        </form>
      </div>
    </div>
  );
};
