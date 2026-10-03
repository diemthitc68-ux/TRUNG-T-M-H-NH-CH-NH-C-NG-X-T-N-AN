import React from 'react';
import { OfficialDocument, DocumentStatus } from '../types';
import { FileText, Inbox, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface StatSummaryProps {
  documents: OfficialDocument[];
  currentStatusFilter: string;
  onSelectStatus: (status: string) => void;
  showOverdueOnly: boolean;
  onToggleOverdueOnly: () => void;
}

export const StatSummary: React.FC<StatSummaryProps> = ({
  documents,
  currentStatusFilter,
  onSelectStatus,
  showOverdueOnly,
  onToggleOverdueOnly,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const total = documents.length;
  const newDocs = documents.filter((d) => d.status === 'Mới tiếp nhận').length;
  const processing = documents.filter((d) => d.status === 'Đang xử lý').length;
  const pendingApproval = documents.filter((d) => d.status === 'Chờ phê duyệt').length;
  const completed = documents.filter((d) => d.status === 'Đã hoàn thành').length;

  const overdueDocs = documents.filter((d) => {
    return d.status !== 'Đã hoàn thành' && d.deadline < today;
  }).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* 1. Tổng văn bản */}
      <button
        onClick={() => {
          if (showOverdueOnly) onToggleOverdueOnly();
          onSelectStatus('all');
        }}
        className={`p-3.5 rounded-lg border text-left transition-all ${
          currentStatusFilter === 'all' && !showOverdueOnly
            ? 'bg-white border-red-800 ring-2 ring-red-800/10 shadow-xs'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">Tổng văn bản</span>
          <FileText className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold text-slate-900 tabular-nums">{total}</div>
        <div className="text-[11px] text-slate-400 mt-1">Toàn bộ hồ sơ</div>
      </button>

      {/* 2. Mới tiếp nhận */}
      <button
        onClick={() => {
          if (showOverdueOnly) onToggleOverdueOnly();
          onSelectStatus('Mới tiếp nhận');
        }}
        className={`p-3.5 rounded-lg border text-left transition-all ${
          currentStatusFilter === 'Mới tiếp nhận' && !showOverdueOnly
            ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/10 shadow-xs'
            : 'bg-white border-slate-200 hover:border-blue-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-blue-700">Mới tiếp nhận</span>
          <Inbox className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-900 tabular-nums">{newDocs}</div>
        <div className="text-[11px] text-blue-600/80 mt-1">Chờ phân công thụ lý</div>
      </button>

      {/* 3. Đang xử lý */}
      <button
        onClick={() => {
          if (showOverdueOnly) onToggleOverdueOnly();
          onSelectStatus('Đang xử lý');
        }}
        className={`p-3.5 rounded-lg border text-left transition-all ${
          currentStatusFilter === 'Đang xử lý' && !showOverdueOnly
            ? 'bg-amber-50/50 border-amber-600 ring-2 ring-amber-600/10 shadow-xs'
            : 'bg-white border-slate-200 hover:border-amber-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-amber-700">Đang xử lý</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold text-amber-900 tabular-nums">{processing}</div>
        <div className="text-[11px] text-amber-600/80 mt-1">Chuyên viên đang giải quyết</div>
      </button>

      {/* 4. Chờ phê duyệt */}
      <button
        onClick={() => {
          if (showOverdueOnly) onToggleOverdueOnly();
          onSelectStatus('Chờ phê duyệt');
        }}
        className={`p-3.5 rounded-lg border text-left transition-all ${
          currentStatusFilter === 'Chờ phê duyệt' && !showOverdueOnly
            ? 'bg-purple-50/50 border-purple-600 ring-2 ring-purple-600/10 shadow-xs'
            : 'bg-white border-slate-200 hover:border-purple-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-purple-700">Chờ duyệt</span>
          <Sparkles className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-2xl font-bold text-purple-900 tabular-nums">{pendingApproval}</div>
        <div className="text-[11px] text-purple-600/80 mt-1">Trình Lãnh đạo UBND</div>
      </button>

      {/* 5. Đã hoàn thành */}
      <button
        onClick={() => {
          if (showOverdueOnly) onToggleOverdueOnly();
          onSelectStatus('Đã hoàn thành');
        }}
        className={`p-3.5 rounded-lg border text-left transition-all ${
          currentStatusFilter === 'Đã hoàn thành' && !showOverdueOnly
            ? 'bg-emerald-50/50 border-emerald-600 ring-2 ring-emerald-600/10 shadow-xs'
            : 'bg-white border-slate-200 hover:border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-emerald-700">Hoàn thành</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-bold text-emerald-900 tabular-nums">{completed}</div>
        <div className="text-[11px] text-emerald-600/80 mt-1">Đã lưu sổ & ban hành</div>
      </button>

      {/* 6. Quá hạn xử lý */}
      <button
        onClick={onToggleOverdueOnly}
        className={`p-3.5 rounded-lg border text-left transition-all ${
          showOverdueOnly
            ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-600/20 shadow-xs'
            : overdueDocs > 0
            ? 'bg-rose-50/30 border-rose-200 hover:border-rose-400'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-rose-700">Quá hạn</span>
          <AlertCircle className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-2xl font-bold text-rose-900 tabular-nums">{overdueDocs}</div>
        <div className="text-[11px] text-rose-600 mt-1 font-medium">
          {showOverdueOnly ? 'Đang lọc quá hạn' : 'Cần đôn đốc khẩn'}
        </div>
      </button>
    </div>
  );
};
