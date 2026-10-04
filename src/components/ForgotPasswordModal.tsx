import React, { useState } from 'react';
import { Member } from '../types';
import { X, Smartphone, KeyRound, ShieldCheck, CheckCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onUpdateMember: (id: string, updated: Partial<Member>) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  members,
  onUpdateMember,
}) => {
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [identifier, setIdentifier] = useState('');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [simulatedCode, setSimulatedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    const query = identifier.trim().toLowerCase();
    const member = members.find(
      (m) =>
        m.username?.toLowerCase() === query ||
        m.email?.toLowerCase() === query ||
        m.phone?.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
    );

    if (!member) {
      setError('Không tìm thấy cán bộ với thông tin này.');
      return;
    }

    setFoundMember(member);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(code);
    setError('');
    setStep('verify');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode === simulatedCode) {
      setStep('reset');
      setError('');
    } else {
      setError('Mã xác thực không chính xác.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (foundMember && newPassword.length >= 4) {
      onUpdateMember(foundMember.id, { password: newPassword });
      alert('Đã cấp lại mật khẩu thành công!');
      onClose();
      setStep('request');
      setIdentifier('');
      setEnteredCode('');
      setNewPassword('');
    } else {
      setError('Mật khẩu mới phải có ít nhất 4 ký tự.');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Khôi phục mật khẩu
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {error}
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <p className="text-xs text-slate-600">
              Nhập tên tài khoản, email hoặc số điện thoại công vụ để nhận mã xác thực qua SMS.
            </p>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="VD: 0912345678"
              className="w-full text-sm p-2.5 border rounded-lg"
              required
            />
            <button type="submit" className="w-full py-2.5 bg-red-900 text-white rounded-lg font-bold text-sm">
              Gửi mã xác thực
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <p className="font-semibold mb-1">Mã xác thực (SMS giả lập):</p>
              <p className="font-mono text-lg font-bold tracking-widest">{simulatedCode}</p>
            </div>
            <input
              type="text"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Nhập mã xác thực"
              className="w-full text-sm p-2.5 border rounded-lg"
              required
            />
            <button type="submit" className="w-full py-2.5 bg-red-900 text-white rounded-lg font-bold text-sm">
              Xác thực
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              className="w-full text-sm p-2.5 border rounded-lg"
              required
            />
            <button type="submit" className="w-full py-2.5 bg-emerald-700 text-white rounded-lg font-bold text-sm">
              Cập nhật mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
