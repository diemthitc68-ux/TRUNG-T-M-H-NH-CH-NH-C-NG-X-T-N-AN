import React from 'react';
import { NationalEmblem } from './NationalEmblem';
import { Member } from '../types';
import {
  FilePlus,
  Printer,
  Download,
  RotateCcw,
  Clock,
  ShieldCheck,
  LogOut,
  UserCheck,
  Briefcase,
} from 'lucide-react';

interface HeaderProps {
  currentUser: Member;
  onLogout: () => void;
  activeTab: 'documents' | 'new-doc' | 'members' | 'stats';
  setActiveTab: (tab: 'documents' | 'new-doc' | 'members' | 'stats') => void;
  onOpenPrint: () => void;
  onOpenOfficialPrint: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
  docCount: number;
  memberCount: number;
  myDocCount: number;
  isMyDocFilterActive: boolean;
  onToggleMyDocFilter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  activeTab,
  setActiveTab,
  onOpenPrint,
  onOpenOfficialPrint,
  onExportCsv,
  onResetData,
  docCount,
  memberCount,
  myDocCount,
  isMyDocFilterActive,
  onToggleMyDocFilter,
}) => {
  // Current Vietnamese date format
  const currentDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Upper Administrative Red Bar */}
      <div className="bg-[#991b1b] text-white text-xs py-1.5 px-4 md:px-8 border-b border-red-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wider uppercase text-[11px] text-amber-200">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </span>
            <span className="hidden sm:inline text-red-300">·</span>
            <span className="hidden sm:inline italic text-[11px] text-red-100">
              Độc lập - Tự do - Hạnh phúc
            </span>
          </div>

          {/* User info & Logout panel */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="hidden sm:flex items-center gap-1.5 text-red-100">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>{currentDate}</span>
            </div>
            <span className="hidden sm:inline text-red-300">·</span>

            {/* Current Officer Profile */}
            <div className="flex items-center gap-2 bg-red-950/40 py-0.5 px-2 rounded border border-red-800/60">
              <div className="w-5 h-5 rounded-full bg-amber-400 text-red-950 font-bold flex items-center justify-center text-[10px]">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(-2)
                  .join('')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-red-200 text-[10px] hidden md:inline">
                  ({currentUser.role.replace('Công chức ', '')})
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Đăng xuất khỏi hệ thống"
              className="px-2 py-0.5 bg-red-900/80 hover:bg-red-800 text-red-100 hover:text-white border border-red-700/60 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand | Nav Links | Actions */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        {/* Zone 1: Brand Title with Vietnamese Commune Identity */}
        <div className="flex items-center gap-3">
          <NationalEmblem size={42} />
          <div>
            <div className="text-base sm:text-lg font-bold text-red-900 tracking-tight leading-tight uppercase">
              UBND XÃ TÂN AN
            </div>
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              Hệ thống Quản lý thành viên & Luân chuyển văn bản điện tử
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 order-3 md:order-2 w-full md:w-auto overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'documents' && !isMyDocFilterActive
                ? 'bg-red-50 text-red-900 font-semibold border border-red-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Sổ Văn Bản ({docCount})
          </button>

          {/* Hồ sơ của tôi (My assigned documents button) */}
          <button
            onClick={onToggleMyDocFilter}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              isMyDocFilterActive
                ? 'bg-red-900 text-white font-semibold shadow-xs'
                : 'text-slate-700 hover:text-red-900 hover:bg-red-50/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hồ sơ của tôi</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isMyDocFilterActive ? 'bg-white text-red-900' : 'bg-red-100 text-red-800'
              }`}
            >
              {myDocCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('new-doc')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'new-doc'
                ? 'bg-red-50 text-red-900 font-semibold border border-red-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Tiếp Nhận Mới</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'members'
                ? 'bg-red-50 text-red-900 font-semibold border border-red-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Cán Bộ Xã ({memberCount})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'stats'
                ? 'bg-red-50 text-red-900 font-semibold border border-red-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Báo Cáo Tiến Độ
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 order-2 md:order-3">
          <button
            onClick={onOpenOfficialPrint}
            title="In văn bản theo đúng thể thức Nghị định 30/2020/NĐ-CP"
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-white bg-red-900 hover:bg-red-800 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In Văn Bản NĐ 30</span>
          </button>

          <button
            onClick={onExportCsv}
            title="Xuất bảng kê văn bản dạng CSV"
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={onOpenPrint}
            title="In sổ theo dõi văn bản theo quy định hành chính"
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">In Sổ</span>
          </button>

          <button
            onClick={onResetData}
            title="Khôi phục dữ liệu mẫu ban đầu"
            className="p-2 text-xs font-medium text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

