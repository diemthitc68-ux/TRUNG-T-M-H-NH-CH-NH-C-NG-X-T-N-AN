import React, { useState } from 'react';
import { Member } from '../types';
import { ADMIN_ACCOUNT } from '../data/initialData';
import { NationalEmblem } from './NationalEmblem';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Sparkles, UserPlus } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { RegistrationModal } from './RegistrationModal';

interface LoginScreenProps {
  members: Member[];
  onLogin: (member: Member) => void;
  onUpdateMember: (id: string, updated: Partial<Member>) => void;
  onAddMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ members, onLogin, onUpdateMember, onAddMember }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState(ADMIN_ACCOUNT.username);
  const [password, setPassword] = useState(ADMIN_ACCOUNT.password);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = usernameOrEmail.trim().toLowerCase();

    // Check against configured ADMIN_ACCOUNT directly
    const isAdminUsernameMatch =
      query === ADMIN_ACCOUNT.username.toLowerCase() ||
      query === 'admin' ||
      query === 'huynhphukinh' ||
      query === 'kinhhp.hcc@tanan.gov.vn';

    if (isAdminUsernameMatch) {
      if (password !== ADMIN_ACCOUNT.password) {
        setErrorMsg('Mật khẩu Quản trị viên không chính xác. Mật khẩu mặc định: ' + ADMIN_ACCOUNT.password);
        return;
      }

      // Find or create admin member object
      const adminMember = members.find((m) => m.name === ADMIN_ACCOUNT.username) || {
        id: 'ADMIN-001',
        name: ADMIN_ACCOUNT.username,
        username: ADMIN_ACCOUNT.username,
        password: ADMIN_ACCOUNT.password,
        role: ADMIN_ACCOUNT.role,
        phone: '0988.999.888',
        email: 'kinhhp.hcc@tanan.gov.vn',
        notes: 'Quản trị viên hệ thống - Giám đốc Trung tâm Hành chính công',
        createdAt: '2026-01-01',
      };

      setErrorMsg('');
      onLogin(adminMember);
      return;
    }

    // Otherwise check regular members
    const found = members.find((m) => {
      const emailMatch = m.email?.toLowerCase() === query;
      const phoneMatch = m.phone?.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '');
      const nameMatch = m.name.toLowerCase().includes(query);
      const usernameMatch = m.username?.toLowerCase() === query;
      return emailMatch || phoneMatch || nameMatch || usernameMatch;
    });

    if (!found) {
      setErrorMsg('Tài khoản hoặc mật khẩu không chính xác. Đồng chí vui lòng kiểm tra lại!');
      return;
    }

    if (found.password && found.password !== password) {
      setErrorMsg('Mật khẩu không chính xác.');
      return;
    }

    setErrorMsg('');
    onLogin(found);
  };

  const handleQuickLogin = (member: Member) => {
    setErrorMsg('');
    onLogin(member);
  };

  const handleAdminQuickLogin = () => {
    const adminMember = members.find((m) => m.name === ADMIN_ACCOUNT.username) || {
      id: 'ADMIN-001',
      name: ADMIN_ACCOUNT.username,
      username: ADMIN_ACCOUNT.username,
      password: ADMIN_ACCOUNT.password,
      role: ADMIN_ACCOUNT.role,
      phone: '0988.999.888',
      email: 'kinhhp.hcc@tanan.gov.vn',
      notes: 'Quản trị viên hệ thống - Giám đốc Trung tâm Hành chính công',
      createdAt: '2026-01-01',
    };
    setErrorMsg('');
    onLogin(adminMember);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#991b1b] via-[#7f1d1d] to-[#450a0a] relative overflow-hidden font-sans">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-md w-full my-auto z-10">
        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-red-950/20">
          {/* Emblem & Brand Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <NationalEmblem size={56} />
            </div>
            <div className="text-xs uppercase tracking-wider font-bold text-amber-700">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-red-900 uppercase tracking-tight mt-1">
              UBND XÃ TÂN AN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cổng Điều Hành Nội Bộ & Quản Lý Văn Bản Điện Tử
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tài khoản công vụ / Quản trị viên:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="VD: Huỳnh Phú Kính hoặc thanhnv.tanan@ubnd.gov.vn"
                  required
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 focus:bg-white transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-800/20 focus:border-red-800 focus:bg-white transition-colors font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="mt-1 text-[10px] text-red-800 hover:underline font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-red-800 focus:ring-red-800 w-3.5 h-3.5"
                />
                <span>Ghi nhớ phiên làm việc</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              <span>Đăng Nhập Cổng Điều Hành</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full py-2.5 px-4 bg-white border border-red-900 text-red-900 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer hover:bg-red-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng Ký Tài Khoản Mới</span>
            </button>
          </form>

          <ForgotPasswordModal
            isOpen={isForgotModalOpen}
            onClose={() => setIsForgotModalOpen(false)}
            members={members}
            onUpdateMember={onUpdateMember}
          />
          <RegistrationModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onRegister={onAddMember}
          />

          {/* Quick Demo Login Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Đăng Nhập Nhanh Theo Chức Danh:</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            {/* Special Administrator Quick Login Card */}
            <button
              type="button"
              onClick={handleAdminQuickLogin}
              className="w-full text-left p-2.5 mb-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 transition-colors flex items-center justify-between group cursor-pointer shadow-xs"
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-red-950 flex items-center gap-1.5 truncate">
                  <span className="text-amber-600">★</span>
                  <span>{ADMIN_ACCOUNT.username}</span>
                  <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded font-semibold uppercase">
                    Quản trị viên
                  </span>
                </div>
                <div className="text-[11px] text-red-800 font-medium truncate mt-0.5">
                  {ADMIN_ACCOUNT.role}
                </div>
              </div>
              <span className="text-[10px] font-bold text-white bg-red-900 group-hover:bg-red-800 shrink-0 px-2.5 py-1 rounded shadow-xs">
                Vào ngay →
              </span>
            </button>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {members
                .filter((m) => m.name !== ADMIN_ACCOUNT.username)
                .slice(0, 5)
                .map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleQuickLogin(m)}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-red-950 truncate">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{m.role}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-red-800 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Vào ngay →
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-4 text-[11px] text-red-200/80 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>Hệ thống bảo mật chính quyền điện tử cấp xã · Chuẩn ISO/IEC 27001</span>
        </div>
      </div>
    </div>
  );
};
