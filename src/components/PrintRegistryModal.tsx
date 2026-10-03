import React from 'react';
import { OfficialDocument } from '../types';
import { X, Printer } from 'lucide-react';

interface PrintRegistryModalProps {
  documents: OfficialDocument[];
  onClose: () => void;
}

export const PrintRegistryModal: React.FC<PrintRegistryModalProps> = ({ documents, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">
              In Sổ Đăng Ký Theo Dõi Văn Bản Đến & Đi
            </div>
            <div className="text-xs text-slate-500">
              Tổng số {documents.length} văn bản theo chuẩn lưu trữ hành chính
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Sổ Đăng Ký (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0">
          {/* Header */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-400 text-center mb-6">
            <div>
              <div className="text-xs font-bold uppercase">ỦY BAN NHÂN DÂN XÃ TÂN AN</div>
              <div className="text-[11px] font-semibold text-slate-700">VĂN PHÒNG HĐND & UBND</div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="text-[11px] font-semibold underline decoration-slate-400">
                Độc lập - Tự do - Hạnh phúc
              </div>
            </div>
          </div>

          <div className="text-center my-4">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
              SỔ ĐĂNG KÝ VÀ LUÂN CHUYỂN VĂN BẢN
            </h2>
            <div className="text-xs italic text-slate-600 mt-0.5">
              Năm công tác 2026 · Xuất ngày {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-[11px] border border-slate-400 border-collapse my-4">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                <th className="border border-slate-400 p-2 text-center w-10">STT</th>
                <th className="border border-slate-400 p-2 text-left w-24">Số/Ký hiệu</th>
                <th className="border border-slate-400 p-2 text-center w-20">Ngày đến</th>
                <th className="border border-slate-400 p-2 text-left w-36">Cơ quan gửi/Người nộp</th>
                <th className="border border-slate-400 p-2 text-left">Trích yếu nội dung</th>
                <th className="border border-slate-400 p-2 text-left w-28">Cán bộ thụ lý</th>
                <th className="border border-slate-400 p-2 text-center w-20">Hạn giải quyết</th>
                <th className="border border-slate-400 p-2 text-center w-24">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d, idx) => (
                <tr key={d.id} className="border-b border-slate-400">
                  <td className="border border-slate-400 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-400 p-1.5 font-bold font-mono">{d.number}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono">
                    {d.receivedDate}
                  </td>
                  <td className="border border-slate-400 p-1.5">{d.sender}</td>
                  <td className="border border-slate-400 p-1.5">{d.summary}</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">{d.assignee}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono font-semibold">
                    {d.deadline}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">
                    {d.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-2 text-center text-xs mt-12 pt-4">
            <div>
              <div className="font-bold uppercase">NGƯỜI VÀO SỔ THEO DÕI</div>
              <div className="text-[11px] text-slate-500 italic mt-0.5">(Ký, ghi rõ họ tên)</div>
              <div className="h-16" />
              <div className="font-bold text-slate-800">Đỗ Minh Tuấn</div>
            </div>

            <div>
              <div className="font-bold uppercase">TM. ỦY BAN NHÂN DÂN XÃ TÂN AN</div>
              <div className="text-[11px] font-bold">CHỦ TỊCH</div>
              <div className="text-[11px] text-slate-500 italic mt-0.5">(Ký duyệt, đóng dấu)</div>
              <div className="h-14" />
              <div className="font-bold text-slate-800">Nguyễn Văn Thành</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
