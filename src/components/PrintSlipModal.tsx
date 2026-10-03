import React from 'react';
import { OfficialDocument } from '../types';
import { X, Printer } from 'lucide-react';

interface PrintSlipModalProps {
  document: OfficialDocument | null;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({ document: doc, onClose }) => {
  if (!doc) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">
            Xem trước Phiếu Trình Giải Quyết Văn Bản
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Phiếu Này (Print)</span>
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
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0">
          {/* Official Vietnam Administrative Header */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-400 text-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-tight">
                ỦY BAN NHÂN DÂN XÃ TÂN AN
              </div>
              <div className="text-[11px] font-semibold text-slate-700">
                BỘ PHẬN VĂN PHÒNG - MỘT CỬA
              </div>
              <div className="text-[11px] italic mt-1 font-mono">
                Số hồ sơ: {doc.number}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-tight">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-[11px] font-semibold underline decoration-slate-400 underline-offset-4">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="text-[11px] italic mt-1">
                Tân An, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
              PHIẾU TRÌNH GIẢI QUYẾT CÔNG VIỆC
            </h2>
            <div className="text-xs italic text-slate-600 mt-1">
              (Kèm theo văn bản số: {doc.number})
            </div>
          </div>

          {/* Form details table */}
          <table className="w-full text-xs border border-slate-400 border-collapse mb-6">
            <tbody>
              <tr>
                <td className="p-2.5 font-bold border border-slate-400 bg-slate-50 w-1/3">
                  1. Loại sổ & Thể loại văn bản:
                </td>
                <td className="p-2.5 border border-slate-400">
                  {doc.kind} · {doc.docType} (Độ khẩn: {doc.priority})
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold border border-slate-400 bg-slate-50">
                  2. Cơ quan gửi / Người nộp:
                </td>
                <td className="p-2.5 border border-slate-400 font-semibold">
                  {doc.sender}
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold border border-slate-400 bg-slate-50">
                  3. Ngày vào sổ tiếp nhận:
                </td>
                <td className="p-2.5 border border-slate-400 font-mono">
                  {doc.receivedDate}
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold border border-slate-400 bg-slate-50">
                  4. Hạn giải quyết theo quy định:
                </td>
                <td className="p-2.5 border border-slate-400 font-mono font-bold text-red-900">
                  {doc.deadline}
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold border border-slate-400 bg-slate-50 align-top">
                  5. Trích yếu nội dung văn bản:
                </td>
                <td className="p-2.5 border border-slate-400 font-medium leading-relaxed">
                  {doc.summary}
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold border border-slate-400 bg-slate-50">
                  6. Cán bộ phân công thụ lý chính:
                </td>
                <td className="p-2.5 border border-slate-400 font-bold">
                  {doc.assignee} ({doc.assigneeRole || 'Công chức chuyên môn'})
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold border border-slate-400 bg-slate-50 align-top">
                  7. Ý kiến đề xuất của Văn phòng:
                </td>
                <td className="p-2.5 border border-slate-400 text-slate-700 min-h-[40px]">
                  {doc.notes || 'Kính trình Lãnh đạo UBND xã xem xét cho ý kiến chỉ đạo phân công thụ lý.'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Leadership Remark Box */}
          <div className="border border-slate-400 p-4 mb-8 min-h-[140px] relative bg-slate-50/20">
            <div className="text-xs font-bold uppercase text-slate-800 mb-2">
              Ý KIẾN CHỈ ĐẠO CỦA LÃNH ĐẠO UBND XÃ:
            </div>
            <div className="text-xs text-slate-800 italic leading-relaxed space-y-1">
              {doc.history && doc.history.length > 0 ? (
                doc.history.map((h, i) => (
                  <div key={i}>
                    - <strong>{h.author} ({h.role}):</strong> {h.content} ({h.createdAt})
                  </div>
                ))
              ) : (
                <div className="text-slate-400 py-6 text-center">
                  (Dành cho Lãnh đạo UBND ghi bút phê và ký tên trực tiếp)
                </div>
              )}
            </div>
          </div>

          {/* Signature Grid */}
          <div className="grid grid-cols-2 text-center text-xs mt-10">
            <div>
              <div className="font-bold uppercase">CÁN BỘ THỤ LÝ</div>
              <div className="text-[11px] text-slate-500 italic mt-0.5">(Ký, ghi rõ họ tên)</div>
              <div className="h-16" />
              <div className="font-bold text-slate-800">{doc.assignee}</div>
            </div>

            <div>
              <div className="font-bold uppercase">CHỦ TỊCH / PHÓ CHỦ TỊCH UBND</div>
              <div className="text-[11px] text-slate-500 italic mt-0.5">(Ký duyệt, đóng dấu)</div>
              <div className="h-16" />
              <div className="font-bold text-slate-800">Nguyễn Văn Thành</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
