import React from 'react';
import { Member, OfficialDocument } from '../types';
import { Printer } from 'lucide-react';

interface PersonalProgressPrintModalProps {
  currentUser: Member;
  documents: OfficialDocument[];
  onClose: () => void;
}

export const PersonalProgressPrintModal: React.FC<PersonalProgressPrintModalProps> = ({
  currentUser,
  documents,
  onClose,
}) => {
  const myDocs = documents.filter((d) => d.assignee && d.assignee.includes(currentUser.name));
  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="fixed inset-0 z-[10000] bg-white p-8 print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Print Control */}
        <div className="flex justify-end mb-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-800"
          >
            <Printer className="w-4 h-4" /> In Báo Cáo
          </button>
          <button onClick={onClose} className="ml-4 text-slate-600 hover:text-slate-900">
            Đóng
          </button>
        </div>

        {/* Report Content */}
        <div className="text-slate-900 font-serif">
          <div className="text-center mb-8 border-b-2 border-double border-slate-400 pb-4">
            <h1 className="text-xl font-bold uppercase">ỦY BAN NHÂN DÂN XÃ TÂN AN</h1>
            <h2 className="text-lg font-semibold mt-1">BÁO CÁO TIẾN ĐỘ CÁ NHÂN</h2>
            <p className="text-sm mt-2">Ngày lập báo cáo: {today}</p>
          </div>

          <div className="mb-6">
            <p className="font-semibold">Cán bộ thực hiện: {currentUser.name}</p>
            <p className="text-sm text-slate-700">Chức vụ: {currentUser.role}</p>
          </div>

          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2">Số hiệu</th>
                <th className="border border-slate-300 p-2">Trích yếu nội dung</th>
                <th className="border border-slate-300 p-2">Hạn</th>
                <th className="border border-slate-300 p-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {myDocs.map((doc) => (
                <tr key={doc.id}>
                  <td className="border border-slate-300 p-2 font-mono">{doc.number}</td>
                  <td className="border border-slate-300 p-2">{doc.summary}</td>
                  <td className="border border-slate-300 p-2 text-center">{doc.deadline}</td>
                  <td className="border border-slate-300 p-2 text-center">{doc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
