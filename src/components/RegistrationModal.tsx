import React, { useState } from 'react';
import { Member, MemberRole } from '../types';
import { UserPlus, X, AlertCircle, CheckCircle } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (member: Omit<Member, 'id' | 'createdAt'>) => void;
}

const AVAILABLE_ROLES: MemberRole[] = [
  'Bộ phận Một cửa',
  'Công chức Tư pháp - Hộ tịch',
  'Công chức Địa chính - Xây dựng',
  'Công chức Văn phòng - Thống kê',
  'Công chức Văn hóa - Xã hội',
  'Công chức Tài chính - Kế toán',
  'Chỉ huy trưởng Quân sự',
  'Trưởng Công an xã',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<MemberRole>(AVAILABLE_ROLES[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Họ tên và Mật khẩu.');
      return;
    }

    onRegister({
      name: name.trim(),
      role,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      password: password.trim(),
    });

    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        onClose();
        setName('');
        setPhone('');
        setEmail('');
        setPassword('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Đăng Ký Tài Khoản
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        {success ? (
          <div className="py-8 text-center text-emerald-700">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
            <p>Đăng ký thành công! Vui lòng chờ quản trị viên phê duyệt.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {errorMsg && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>}
            <input type="text" placeholder="Họ và tên" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded text-sm" required />
            <select value={role} onChange={e => setRole(e.target.value as MemberRole)} className="w-full p-2 border rounded text-sm">
              {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input type="text" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="email" placeholder="Email công vụ" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded text-sm" required />
            <button type="submit" className="w-full py-2 bg-red-900 text-white rounded font-bold text-sm hover:bg-red-800">Đăng Ký</button>
          </form>
        )}
      </div>
    </div>
  );
};
