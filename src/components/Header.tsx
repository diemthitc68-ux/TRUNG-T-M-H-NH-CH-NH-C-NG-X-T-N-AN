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
  FileText,
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
  onOpenProfileModal: () => void;
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
  onOpenProfileModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Upper Administrative Red Bar */}
      <div className="bg-gradient-to-r from-[#7f0000] to-[#b71c1c] text-white text-xs py-2 px-4 md:px-8 border-b-2 border-[#c69214]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-col gap-0.5 text-center">
            <span className="font-semibold tracking-wider uppercase text-[11px] text-yellow-300">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </span>
            <span className="italic text-[11px] text-red-100">
              Độc lập - Tự do - Hạnh phúc
            </span>
          </div>

          {/* User info & Logout panel */}
          <div className="flex items-center gap-3 text-[11px]">
            {/* Current Officer Profile */}
            <div className="flex items-center gap-2 bg-black/20 py-0.5 px-2 rounded-full border border-white/10">
              <div className="w-5 h-5 rounded-full bg-yellow-400 text-red-900 font-bold flex items-center justify-center text-[10px]">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(-2)
                  .join('')}
              </div>
              <span className="font-bold text-white truncate max-w-[130px]">
                {currentUser.name}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="px-3 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[11px] font-medium transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand | Nav Links | Actions */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title with Vietnamese Commune Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <NationalEmblem size={42} />
          <div className="hidden sm:block">
            <div className="text-lg font-bold text-red-900 tracking-tight leading-tight uppercase">
              UBND XÃ TÂN AN
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Hệ thống Quản lý thành viên & Luân chuyển văn bản
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
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
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenOfficialPrint}
            title="In văn bản theo đúng thể thức Nghị định 30/2020/NĐ-CP"
            className="p-2 text-white bg-red-900 hover:bg-red-800 rounded-md transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onExportCsv}
            title="Xuất bảng kê văn bản dạng CSV"
            className="p-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
          </button>

          <button
            onClick={onOpenPrint}
            title="In sổ theo dõi văn bản"
            className="p-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

