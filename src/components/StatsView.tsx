import React from 'react';
import { OfficialDocument, Member } from '../types';
import { CheckCircle2, Clock, AlertTriangle, Users, FileText, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatsViewProps {
  documents: OfficialDocument[];
  members: Member[];
  onSelectMember: (name: string) => void;
  onSelectStatus: (status: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  documents,
  members,
  onSelectMember,
  onSelectStatus,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const total = documents.length;
  const completed = documents.filter((d) => d.status === 'Đã hoàn thành').length;
  const processing = documents.filter((d) => d.status === 'Đang xử lý').length;
  const pending = documents.filter((d) => d.status === 'Chờ phê duyệt').length;
  const newDocs = documents.filter((d) => d.status === 'Mới tiếp nhận').length;

  const overdue = documents.filter((d) => d.status !== 'Đã hoàn thành' && d.deadline < today).length;

  const onTimeRate = total > 0 ? Math.round(((total - overdue) / total) * 100) : 100;

  // Group by document type
  const typeDistribution: Record<string, number> = {};
  documents.forEach((d) => {
    typeDistribution[d.docType] = (typeDistribution[d.docType] || 0) + 1;
  });

  // Officer workload
  const memberWorkload = members.map((m) => {
    const assigned = documents.filter((d) => d.assignee === m.name);
    const mCompleted = assigned.filter((d) => d.status === 'Đã hoàn thành').length;
    const mPending = assigned.filter((d) => d.status !== 'Đã hoàn thành').length;
    const mOverdue = assigned.filter((d) => d.status !== 'Đã hoàn thành' && d.deadline < today).length;

    return {
      name: m.name,
      totalAssigned: assigned.length,
      completed: mCompleted,
      pending: mPending,
      overdue: mOverdue,
      role: m.role,
      id: m.id,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="border-b border-slate-200 pb-3 mb-6">
          <h2 className="text-base font-bold text-red-900 uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-800" />
            <span>Báo Cáo Tình Hình Giải Quyết Văn Bản & Hồ Sơ Hành Chính</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tổng hợp điều hành tác nghiệp tại Ủy ban Nhân dân Xã Tân An
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
            <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
              <span>Tỷ lệ giải quyết đúng hạn</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-900 mt-2 font-mono tabular-nums">
              {onTimeRate}%
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-1">
              {total - overdue} / {total} văn bản đúng hoặc trước hạn
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200">
            <div className="text-xs font-semibold text-blue-800 flex items-center justify-between">
              <span>Đã hoàn thành giải quyết</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900 mt-2 font-mono tabular-nums">
              {completed}
            </div>
            <div className="text-[11px] text-blue-700/80 mt-1">
              Đã ban hành kết quả & lưu trữ
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200">
            <div className="text-xs font-semibold text-amber-800 flex items-center justify-between">
              <span>Đang trong luân chuyển</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-900 mt-2 font-mono tabular-nums">
              {processing + pending + newDocs}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-1">
              {processing} đang xử lý · {pending} chờ ký duyệt
            </div>
          </div>

          <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200">
            <div className="text-xs font-semibold text-rose-800 flex items-center justify-between">
              <span>Hồ sơ quá hạn giải quyết</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-3xl font-bold text-rose-900 mt-2 font-mono tabular-nums">
              {overdue}
            </div>
            <div className="text-[11px] text-rose-700/80 mt-1 font-medium">
              Cần lãnh đạo đôn đốc chỉ đạo khẩn
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-red-800" />
          <span>Biểu đồ khối lượng công việc theo cán bộ</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memberWorkload} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Legend fontSize={12} />
              <Bar dataKey="totalAssigned" name="Tổng nhận" fill="#991b1b" />
              <Bar dataKey="pending" name="Đang xử lý" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Workload Table & Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Officer Workload Breakdown */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-red-800" />
              <span>Bảng Phân Bổ Thụ Lý Hồ Sơ</span>
            </h3>
            <span className="text-xs text-slate-500">Bấm vào cán bộ để lọc</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Cán bộ / Chuyên viên</th>
                  <th className="py-2.5 px-3">Vị trí đảm nhiệm</th>
                  <th className="py-2.5 px-3 text-center">Tổng nhận</th>
                  <th className="py-2.5 px-3 text-center">Đang xử lý</th>
                  <th className="py-2.5 px-3 text-center">Đã hoàn thành</th>
                  <th className="py-2.5 px-3 text-center">Quá hạn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberWorkload.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => onSelectMember(m.name)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{m.role}</td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums font-semibold">
                      {m.totalAssigned}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-amber-700 font-semibold">
                      {m.pending}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-emerald-700">
                      {m.completed}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                      {m.overdue > 0 ? (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
                          {m.overdue}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Type Distribution */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-200 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-800" />
              <span>Phân Loại Thể Loại Văn Bản</span>
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(typeDistribution).map(([type, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={type} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-800">{type}</span>
                    <span className="text-slate-500 tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-900 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
