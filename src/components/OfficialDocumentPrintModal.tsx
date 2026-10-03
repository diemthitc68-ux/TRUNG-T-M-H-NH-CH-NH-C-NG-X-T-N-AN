import React, { useState, useEffect } from 'react';
import { OfficialDocument, Member, DocumentType } from '../types';
import { Printer, X, FileText, Check, Stamp, Download, RefreshCw } from 'lucide-react';

interface OfficialDocumentPrintModalProps {
  document: OfficialDocument | null;
  documents: OfficialDocument[];
  members: Member[];
  onClose: () => void;
  onSelectDoc?: (doc: OfficialDocument) => void;
}

export const OfficialDocumentPrintModal: React.FC<OfficialDocumentPrintModalProps> = ({
  document: initialDoc,
  documents,
  members,
  onClose,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialDoc?.id || (documents[0]?.id || '')
  );

  const activeDoc = documents.find((d) => d.id === selectedDocId) || initialDoc || documents[0];

  // Editable fields for A4 Document
  const [docType, setDocType] = useState<DocumentType>(activeDoc?.docType || 'Công văn');
  const [docNumber, setDocNumber] = useState(activeDoc?.number || '142/UBND-VP');
  const [parentAgency, setParentAgency] = useState('UBND HUYỆN');
  const [agencyName, setAgencyName] = useState('ỦY BAN NHÂN DÂN XÃ TÂN AN');
  const [docDate, setDocDate] = useState(() => {
    const now = new Date();
    return `Tân An, ngày ${String(now.getDate()).padStart(2, '0')} tháng ${String(
      now.getMonth() + 1
    ).padStart(2, '0')} năm ${now.getFullYear()}`;
  });
  const [summary, setSummary] = useState(
    activeDoc?.summary ||
      'V/v tăng cường công tác phòng chống cháy nổ và đảm bảo trật tự an toàn mùa hanh khô năm 2026'
  );
  const [recipient, setRecipient] = useState(
    activeDoc?.receiver ||
      activeDoc?.sender ||
      'Trưởng các thôn 1, 2, 3, 4; các ban ngành, đoàn thể xã'
  );

  // Content body
  const [legalBasis, setLegalBasis] = useState(
    'Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm 2019;\nCăn cứ Nghị định số 30/2020/NĐ-CP ngày 05 tháng 3 năm 2020 của Chính phủ về công tác văn thư;\nTheo đề nghị của Công chức Văn phòng - Thống kê và Công chức Địa chính - Xây dựng xã Tân An,'
  );

  const [bodyContent, setBodyContent] = useState(
    'Để chủ động thực hiện tốt nhiệm vụ được giao và nâng cao hiệu quả công tác quản lý nhà nước tại địa phương, Ủy ban Nhân dân Xã Tân An yêu cầu các cơ quan, đơn vị, ban ngành đoàn thể và Trưởng các thôn tập trung triển khai thực hiện các nội dung sau:\n\n1. Tiếp tục quán triệt và triển khai nghiêm túc các chỉ đạo của Ủy ban Nhân dân Huyện về công tác quản lý trật tự, an toàn và giải quyết thủ tục hành chính cho tổ chức, công dân đúng thời hạn quy định.\n\n2. Bộ phận Một cửa xã chủ trì phối hợp với các công chức chuyên môn rà soát toàn bộ hồ sơ đang thụ lý, kịp thời đôn đốc giải quyết dứt điểm các hồ sơ tồn đọng, tuyệt đối không để hồ sơ trễ hạn mà không có văn bản xin lỗi theo quy định.\n\n3. Trưởng các thôn phối hợp với lực lượng An ninh cơ sở tăng cường công tác tuyên truyền, hướng dẫn nhân dân thực hiện nghiêm các quy định pháp luật và tham gia nộp hồ sơ dịch vụ công trực tuyến trên Cổng DVC Quốc gia.\n\nGiao Văn phòng HĐND & UBND xã theo dõi, đôn đốc và tổng hợp kết quả thực hiện, định kỳ báo cáo Chủ tịch UBND xã trước ngày 25 hàng tháng.'
  );

  const [signatoryTitle, setSignatoryTitle] = useState('CHỦ TỊCH');
  const [signatoryName, setSignatoryName] = useState(
    members.find((m) => m.role === 'Lãnh đạo UBND')?.name || 'Nguyễn Văn Thành'
  );
  const [recipientsList, setRecipientsList] = useState(
    '- Như kính gửi;\n- Thường trực Đảng ủy xã (b/c);\n- Thường trực HĐND xã (b/c);\n- Chủ tịch, các PCT UBND xã;\n- Lưu: VT, Hồ sơ.'
  );
  const [showRedSeal, setShowRedSeal] = useState(true);

  // Sync when doc selection changes
  useEffect(() => {
    if (activeDoc) {
      setDocNumber(activeDoc.number);
      setDocType(activeDoc.docType);
      setSummary(activeDoc.summary);
      if (activeDoc.receiver) setRecipient(activeDoc.receiver);
      else if (activeDoc.kind === 'Văn bản đến') setRecipient('Ủy ban Nhân dân Xã Tân An');
    }
  }, [activeDoc]);

  const handlePrint = () => {
    window.print();
  };

  const handleResetTemplate = (type: DocumentType) => {
    setDocType(type);
    if (type === 'Quyết định') {
      setSummary('Về việc kiện toàn Ban Chỉ đạo Chuyển đổi số và Đề án 06 xã Tân An năm 2026');
      setSignatoryTitle('CHỦ TỊCH');
      setBodyContent(
        'QUYẾT ĐỊNH:\n\nĐiều 1. Kiện toàn Ban Chỉ đạo Chuyển đổi số xã Tân An gồm các đồng chí có tên trong danh sách đính kèm, do đồng chí Chủ tịch UBND xã làm Trưởng ban.\n\nĐiều 2. Ban Chỉ đạo có nhiệm vụ xây dựng kế hoạch và tổ chức thực hiện các mục tiêu chuyển đổi số, số hóa 100% hồ sơ giải quyết TTHC theo Nghị định 30/2020/NĐ-CP.\n\nĐiều 3. Công chức Văn phòng - Thống kê, Tài chính - Kế toán và các đồng chí có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này kể từ ngày ký.'
      );
    } else if (type === 'Thông báo') {
      setSummary('Về việc niêm yết công khai thủ tục hành chính và lịch tiếp công dân định kỳ');
      setSignatoryTitle('KT. CHỦ TỊCH\nPHÓ CHỦ TỊCH');
      setBodyContent(
        'Ủy ban Nhân dân Xã Tân An trân trọng thông báo tới toàn thể nhân dân, các cơ quan, đơn vị trên địa bàn xã về việc:\n\n1. Lịch tiếp công dân định kỳ của Chủ tịch UBND xã được thực hiện vào Thứ Ba hàng tuần tại Phòng Tiếp công dân UBND xã.\n\n2. Toàn bộ thủ tục hành chính thuộc thẩm quyền giải quyết cấp xã được niêm yết công khai tại Bảng tin Bộ phận Một cửa và trên Trang thông tin điện tử của xã.\n\nUBND xã Tân An thông báo để nhân dân được biết và tiện liên hệ công tác.'
      );
    } else if (type === 'Tờ trình') {
      setSummary('V/v đề nghị phê duyệt kế hoạch nâng cấp, tu sửa hệ thống thoát nước liên thôn');
      setSignatoryTitle('CHỦ TỊCH');
      setBodyContent(
        'Kính gửi: Ủy ban Nhân dân Huyện\n\nCăn cứ nhu cầu thực tế về hạ tầng giao thông và thoát nước phục vụ sản xuất nông nghiệp của nhân dân xã Tân An;\nUBND xã Tân An kính trình UBND Huyện xem xét phê duyệt chủ trương đầu tư dự án nâng cấp hệ thống mương tiêu thoát nước với các nội dung sau:\n\n1. Tên công trình: Nâng cấp mương tiêu thoát nước Thôn 2 và Thôn 3 xã Tân An.\n2. Quy mô đầu tư: Chiều dài 650m, kết cấu bê tông cốt thép đúc sẵn.\n3. Tổng kinh phí dự toán: 450.000.000 VNĐ.\n\nKính trình UBND Huyện xem xét, quyết định.'
      );
    } else {
      // Công văn
      setSummary(activeDoc?.summary || 'V/v thực hiện nhiệm vụ công tác theo quy định');
      setSignatoryTitle('CHỦ TỊCH');
      setBodyContent(
        'Ủy ban Nhân dân Xã Tân An yêu cầu các cơ quan, ban ngành đoàn thể và Trưởng các thôn nghiêm túc triển khai các nhiệm vụ được giao đảm bảo đúng tiến độ, thẩm quyền và quy định của pháp luật.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-100 rounded-xl shadow-2xl max-w-7xl w-full max-h-[96vh] flex flex-col border border-slate-300 overflow-hidden my-auto">
        {/* Top Control Bar (Hidden on print) */}
        <div className="print:hidden bg-white border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-900 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                In Văn Bản Chuẩn Thể Thức Nghị Định 30/2020/NĐ-CP
              </h2>
              <p className="text-xs text-slate-500">
                Ủy ban Nhân dân Xã Tân An · Khổ A4 chuẩn (Căn lề: Trên 20mm, Dưới 20mm, Trái 30mm, Phải 15mm)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stamp toggle */}
            <button
              onClick={() => setShowRedSeal(!showRedSeal)}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
                showRedSeal
                  ? 'bg-red-50 text-red-800 border-red-300'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
              title="Bật/Tắt con dấu mộc đỏ điện tử của UBND xã"
            >
              <Stamp className="w-3.5 h-3.5 text-red-700" />
              <span>Dấu đỏ: {showRedSeal ? 'Bật' : 'Tắt'}</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-colors uppercase tracking-wider"
            >
              <Printer className="w-4 h-4" />
              <span>In Văn Bản (Print A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Workspace: Left Inspector Editor + Right A4 Paper Simulation */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Inspector / Settings Panel (Hidden on print) */}
          <div className="print:hidden lg:w-[380px] bg-white p-5 overflow-y-auto space-y-4 shrink-0">
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>Chọn Văn Bản Từ Sổ</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  ({documents.length} hồ sơ)
                </span>
              </div>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded font-medium focus:ring-1 focus:ring-red-800"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.number} - {d.summary.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Template Presets */}
            <div className="pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-800 block mb-1.5 uppercase tracking-wide">
                Mẫu Thể Thức NĐ 30/2020:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Công văn', 'Quyết định', 'Thông báo', 'Tờ trình'] as DocumentType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleResetTemplate(t)}
                    className={`py-1.5 px-2 text-xs rounded border text-left transition-colors flex items-center justify-between ${
                      docType === t
                        ? 'bg-red-50 text-red-900 border-red-300 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t}</span>
                    {docType === t && <Check className="w-3 h-3 text-red-800" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Edit Fields */}
            <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wide">
                Nội Dung Trực Tiếp:
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">
                  Số / Ký hiệu văn bản:
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">
                  Địa danh & ngày tháng:
                </label>
                <input
                  type="text"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded italic text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">
                  Trích yếu nội dung:
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">
                  Kính gửi:
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">
                  Chức vụ & Người ký:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={signatoryTitle}
                    onChange={(e) => setSignatoryTitle(e.target.value)}
                    placeholder="CHỦ TỊCH"
                    className="p-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold uppercase"
                  />
                  <input
                    type="text"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    placeholder="Nguyễn Văn Thành"
                    className="p-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">
                  Nơi nhận:
                </label>
                <textarea
                  value={recipientsList}
                  onChange={(e) => setRecipientsList(e.target.value)}
                  rows={3}
                  className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-800 leading-normal">
              <strong>Ghi chú thể thức:</strong> Lề chuẩn NĐ 30/2020: Trên 20-25mm, Dưới 20-25mm,
              Trái 30-35mm, Phải 15-20mm. Font chữ: Times New Roman, cỡ 13-14pt.
            </div>
          </div>

          {/* Right A4 Simulation Viewport (Print target) */}
          <div className="flex-1 bg-slate-300/80 p-4 sm:p-8 flex justify-center overflow-y-auto">
            {/* Simulated A4 Paper */}
            <div
              className="bg-white text-black shadow-xl mx-auto print:shadow-none print:m-0 print:w-full print:min-h-0"
              style={{
                width: '210mm',
                minHeight: '297mm',
                paddingTop: '20mm',
                paddingBottom: '20mm',
                paddingLeft: '30mm',
                paddingRight: '15mm',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: '13pt',
                lineHeight: '1.35',
                boxSizing: 'border-box',
              }}
            >
              {/* HEADER LAYOUT: 2-column table borderless */}
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: 'none',
                  marginBottom: '10px',
                }}
              >
                <tbody>
                  <tr>
                    {/* Left: Agency & Number */}
                    <td
                      style={{
                        width: '45%',
                        verticalAlign: 'top',
                        textAlign: 'center',
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12pt',
                          textTransform: 'uppercase',
                          color: '#000',
                          lineHeight: '1.2',
                        }}
                      >
                        {parentAgency}
                      </div>
                      <div
                        style={{
                          fontSize: '12pt',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          color: '#000',
                          lineHeight: '1.2',
                        }}
                      >
                        {agencyName}
                      </div>
                      {/* Short divider line */}
                      <div
                        style={{
                          width: '100px',
                          height: '1px',
                          background: '#000',
                          margin: '4px auto 6px auto',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '13pt',
                          textAlign: 'center',
                          marginTop: '4px',
                        }}
                      >
                        Số: {docNumber}
                      </div>
                      {/* Trích yếu nếu là Công văn */}
                      {docType === 'Công văn' && (
                        <div
                          style={{
                            fontSize: '12pt',
                            textAlign: 'left',
                            marginTop: '6px',
                            lineHeight: '1.2',
                            paddingLeft: '4px',
                          }}
                        >
                          <em>V/v {summary}</em>
                        </div>
                      )}
                    </td>

                    {/* Right: National Motto & Date */}
                    <td
                      style={{
                        width: '55%',
                        verticalAlign: 'top',
                        textAlign: 'center',
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12pt',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                        }}
                      >
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                      </div>
                      <div
                        style={{
                          fontSize: '13pt',
                          fontWeight: 'bold',
                          lineHeight: '1.2',
                          marginTop: '2px',
                        }}
                      >
                        Độc lập - Tự do - Hạnh phúc
                      </div>
                      {/* Divider line under motto */}
                      <div
                        style={{
                          width: '140px',
                          height: '1px',
                          background: '#000',
                          margin: '4px auto 6px auto',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '13pt',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          marginTop: '4px',
                        }}
                      >
                        {docDate}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Title Section (If not Công văn, e.g. QUYẾT ĐỊNH, THÔNG BÁO, TỜ TRÌNH, KẾ HOẠCH) */}
              {docType !== 'Công văn' && (
                <div style={{ textAlign: 'center', marginTop: '18px', marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '15pt',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {docType}
                  </div>
                  <div
                    style={{
                      fontSize: '13pt',
                      fontWeight: 'bold',
                      marginTop: '4px',
                      maxWidth: '85%',
                      margin: '4px auto 0 auto',
                    }}
                  >
                    {summary}
                  </div>
                  <div
                    style={{
                      width: '80px',
                      height: '1px',
                      background: '#000',
                      margin: '6px auto 0 auto',
                    }}
                  />
                </div>
              )}

              {/* Kính gửi Section */}
              <div
                style={{
                  marginTop: docType === 'Công văn' ? '16px' : '12px',
                  marginBottom: '14px',
                  fontSize: '13pt',
                  paddingLeft: '15px',
                  lineHeight: '1.3',
                }}
              >
                <strong>Kính gửi:</strong> {recipient}
              </div>

              {/* Căn cứ pháp lý (nếu có) */}
              {legalBasis && (
                <div
                  style={{
                    fontStyle: 'italic',
                    fontSize: '13pt',
                    lineHeight: '1.35',
                    textAlign: 'justify',
                    marginBottom: '12px',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {legalBasis}
                </div>
              )}

              {/* Thân bài viết - Editable directly on click */}
              <div
                style={{
                  textAlign: 'justify',
                  fontSize: '13pt',
                  lineHeight: '1.35',
                  textIndent: '1cm',
                  whiteSpace: 'pre-line',
                  minHeight: '180px',
                }}
              >
                {bodyContent}
              </div>

              {/* FOOTER SECTION: Nơi nhận (trái) & Chữ ký + Con dấu (phải) */}
              <div
                style={{
                  marginTop: '30px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
                {/* Nơi nhận (Bên trái) */}
                <div
                  style={{
                    width: '45%',
                    fontSize: '11pt',
                    lineHeight: '1.25',
                    borderTop: '1px solid #000',
                    paddingTop: '6px',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '2px' }}>
                    Nơi nhận:
                  </div>
                  <div style={{ whiteSpace: 'pre-line', fontStyle: 'italic' }}>
                    {recipientsList}
                  </div>
                </div>

                {/* Chữ ký & Thẩm quyền (Bên phải) */}
                <div
                  style={{
                    width: '50%',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      lineHeight: '1.2',
                    }}
                  >
                    TM. ỦY BAN NHÂN DÂN XÃ TÂN AN
                  </div>
                  <div
                    style={{
                      fontSize: '13pt',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      marginTop: '2px',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {signatoryTitle}
                  </div>

                  {/* Red Seal / Con dấu đỏ hành chính tròn (Mô phỏng chuẩn NĐ 30) */}
                  {showRedSeal && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '25px',
                        left: '12%',
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        border: '3px solid #dc2626',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#dc2626',
                        opacity: 0.88,
                        transform: 'rotate(-8deg)',
                        pointerEvents: 'none',
                        boxShadow: 'inset 0 0 0 1px #dc2626',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '7.5pt',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          textTransform: 'uppercase',
                          lineHeight: '1',
                          padding: '0 4px',
                        }}
                      >
                        ★ UBND XÃ TÂN AN ★
                      </div>
                      <div
                        style={{
                          fontSize: '6.5pt',
                          textAlign: 'center',
                          marginTop: '2px',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}
                      >
                        ĐÃ KÝ ĐIỆN TỬ
                      </div>
                      <div
                        style={{
                          fontSize: '6pt',
                          textAlign: 'center',
                          fontFamily: 'monospace',
                          marginTop: '2px',
                        }}
                      >
                        {new Date().toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  )}

                  {/* Empty space for physical signature */}
                  <div style={{ height: '70px' }} />

                  {/* Signatory Full Name */}
                  <div
                    style={{
                      fontSize: '13pt',
                      fontWeight: 'bold',
                    }}
                  >
                    {signatoryName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Status (Hidden on print) */}
        <div className="print:hidden bg-white border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mẫu văn bản đạt chuẩn thể thức & kỹ thuật trình bày Nghị định số 30/2020/NĐ-CP</span>
          </div>
          <div>
            Khuyến nghị máy in: Khổ <strong>A4</strong>, Tỷ lệ <strong>100%</strong>, Lề <strong>Default</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
