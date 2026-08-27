import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  Building2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Eye,
  Edit3,
  FileCheck
} from 'lucide-react';
import { ScamAnalysisResult } from '../types';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: ScamAnalysisResult | null;
  evidenceText: string;
  evidenceImage: string | null;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  evidenceText,
  evidenceImage,
  onShowToast
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'preview' | 'edit'>('preview');

  // Form states for official report
  const [fullName, setFullName] = useState('');
  const [citizenId, setCitizenId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [scammerInfo, setScammerInfo] = useState('');
  const [estimatedLoss, setEstimatedLoss] = useState('');
  const [targetAuthority, setTargetAuthority] = useState(
    'Cơ quan Cảnh sát Điều tra Công an Quận/Huyện/Thị xã'
  );

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const reportDocId = useRef(`SHIELD-${Date.now().toString().slice(-6)}`).current;

  // Auto-extract info when modal opens or evidence changes
  useEffect(() => {
    if (evidenceText && !scammerInfo) {
      const detected: string[] = [];

      // Detect phone numbers (e.g., 024..., 098..., 03...)
      const phones = evidenceText.match(/(0[2|3|5|7|8|9][0-9]{8,9})/g);
      if (phones && phones.length > 0) {
        detected.push(`SĐT: ${Array.from(new Set(phones)).join(', ')}`);
      }

      // Detect links/domains
      const urls = evidenceText.match(/(https?:\/\/[^\s]+|[\w-]+\.(?:xyz|top|com|vn|net|vip|cc|online))/gi);
      if (urls && urls.length > 0) {
        detected.push(`Link/Tên miền: ${Array.from(new Set(urls)).join(', ')}`);
      }

      // Detect possible bank accounts (strings of 9 to 16 digits)
      const accounts = evidenceText.match(/\b\d{9,16}\b/g);
      if (accounts && accounts.length > 0) {
        const filteredAccounts = accounts.filter(
          (acc) => !phones?.includes(acc) && acc !== citizenId
        );
        if (filteredAccounts.length > 0) {
          detected.push(`STK nghi vấn: ${Array.from(new Set(filteredAccounts)).join(', ')}`);
        }
      }

      if (detected.length > 0) {
        setScammerInfo(detected.join(' | '));
      }
    }
  }, [evidenceText, scammerInfo, citizenId]);

  const generateFullDocumentHtml = () => {
    if (!analysisResult) return '';

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đơn Trình Báo & Tố Giác Tội Phạm - ${reportDocId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 20mm 15mm 20mm;
    }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 13pt;
      line-height: 1.45;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .header-box {
      text-align: center;
      margin-bottom: 20px;
    }
    .header-box h2 {
      font-size: 13pt;
      font-weight: bold;
      margin: 0;
      text-transform: uppercase;
    }
    .header-box p {
      font-size: 12pt;
      font-weight: bold;
      margin: 3px 0 0 0;
    }
    .divider {
      width: 150px;
      height: 1px;
      background: #000;
      margin: 4px auto 15px auto;
    }
    .title-box {
      text-align: center;
      margin-bottom: 20px;
    }
    .title-box h1 {
      font-size: 16pt;
      font-weight: bold;
      color: #b91c1c;
      margin: 0;
      text-transform: uppercase;
    }
    .title-box .subtitle {
      font-size: 12pt;
      font-style: italic;
      margin-top: 4px;
    }
    .recipient {
      font-size: 13pt;
      margin-bottom: 15px;
    }
    .section-title {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 13pt;
      margin-top: 15px;
      margin-bottom: 6px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 3px;
    }
    .field {
      margin-bottom: 6px;
      text-align: justify;
    }
    .evidence-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 10px 14px;
      font-family: monospace;
      font-size: 11pt;
      margin: 8px 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
    ul {
      margin: 6px 0;
      padding-left: 24px;
    }
    li {
      margin-bottom: 4px;
    }
    .signatures {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .sign-col {
      width: 45%;
      text-align: center;
    }
    .sign-space {
      height: 80px;
    }
    .badge-danger {
      color: #dc2626;
      font-weight: bold;
    }
    .legal-note {
      font-size: 11pt;
      font-style: italic;
      color: #475569;
      margin-top: 15px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <h2>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
    <p>Độc lập - Tự do - Hạnh phúc</p>
    <div class="divider"></div>
  </div>

  <div class="title-box">
    <h1>ĐƠN TRÌNH BÁO & TỐ GIÁC TỘI PHẠM</h1>
    <div class="subtitle">(V/v: Hành vi lừa đảo chiếm đoạt tài sản trên không gian mạng)</div>
  </div>

  <div class="recipient">
    <p><strong>Kính gửi:</strong> ${targetAuthority}</p>
    <p style="font-style: italic; font-size: 11.5pt;">
      Đồng kính gửi: Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05) - Bộ Công an.
    </p>
  </div>

  <div class="section-title">I. THÔNG TIN NGƯỜI LÀM ĐƠN / NGƯỜI BỊ HẠI</div>
  <div class="field">- Họ và tên: <strong>${fullName || '...........................................................................'}</strong></div>
  <div class="field">- Số CCCD / CMND: <strong>${citizenId || '.......................................'}</strong> | Số điện thoại liên hệ: <strong>${phoneNumber || '.......................................'}</strong></div>
  <div class="field">- Nơi đăng ký thường trú / Tạm trú: <strong>${address || '.....................................................................................................................................'}</strong></div>

  <div class="section-title">II. ĐỐI TƯỢNG BỊ TỐ GIÁC & HÀNH VI VI PHẠM</div>
  <div class="field">- Hình thức lừa đảo nhận diện: <span class="badge-danger">${analysisResult.scam_type}</span></div>
  <div class="field">- Mức độ rủi ro an ninh mạng: <span class="badge-danger">${analysisResult.risk_score}/100 - ${analysisResult.risk_level.toUpperCase()}</span></div>
  <div class="field">- Thông tin đối tượng (SĐT/STK/Tên miền): <strong>${scammerInfo || 'Đính kèm trong tài liệu chứng cứ'}</strong></div>
  <div class="field">- Số tiền ước tính thiệt hại: <strong>${estimatedLoss || 'Kịp thời phát hiện ngăn chặn / Đang xác minh'}</strong></div>

  <div class="section-title">III. NỘI DUNG VỤ VIỆC & BẰNG CHỨNG KỸ THUẬT</div>
  ${
    evidenceText
      ? `<div class="field"><strong>1. Dữ liệu tin nhắn / Cuộc gọi / Nội dung trao đổi:</strong></div>
         <div class="evidence-box">"${evidenceText.replace(/"/g, '&quot;')}"</div>`
      : ''
  }

  <div class="field"><strong>2. Các dấu hiệu bất thường và căn cứ nhận định (Red Flags):</strong></div>
  <ul>
    ${analysisResult.red_flags.map((rf) => `<li>${rf}</li>`).join('')}
  </ul>

  <div class="field"><strong>3. Thủ đoạn thao túng tâm lý được phát hiện:</strong></div>
  <ul>
    ${analysisResult.psychological_tricks.map((pt) => `<li>${pt}</li>`).join('')}
  </ul>

  ${
    analysisResult.urgency_cues && analysisResult.urgency_cues.length > 0
      ? `<div class="field"><strong>4. Dấu hiệu hối thúc, đe dọa hoặc ép buộc nạn nhân:</strong></div>
         <ul>${analysisResult.urgency_cues.map((c) => `<li>${c}</li>`).join('')}</ul>`
      : ''
  }

  <div class="section-title">IV. LỜI CAM ĐOAN VÀ ĐỀ NGHỊ CỦA NGƯỜI LÀM ĐƠN</div>
  <div class="field">
    Căn cứ <strong>Điều 174 & Điều 290 Bộ luật Hình sự</strong> và <strong>Luật An ninh mạng 2018</strong>, tôi làm đơn này kính đề nghị Quý Cơ quan tiến hành tiếp nhận, xác minh, điều tra làm rõ hành vi có dấu hiệu tội phạm của các đối tượng nêu trên, kịp thời phong tỏa tài khoản lừa đảo và xử lý theo đúng quy định của pháp luật nhằm bảo vệ tài sản của công dân.
  </div>
  <div class="field">
    Tôi xin cam đoan những lời khai và chứng cứ cung cấp trên là hoàn toàn trung thực và chịu mọi trách nhiệm trước pháp luật.
  </div>

  <div class="signatures">
    <div class="sign-col">
      <p style="font-style: italic;">Hệ thống Giám định An ninh</p>
      <p><strong>SHIELDAI VIETNAM</strong></p>
      <div class="sign-space"></div>
      <p style="font-size: 10pt; color: #64748b;">Mã hồ sơ: #${reportDocId}</p>
    </div>

    <div class="sign-col">
      <p style="font-style: italic;">Ngày ...... tháng ...... năm 202...</p>
      <p><strong>NGƯỜI LÀM ĐƠN</strong></p>
      <div class="sign-space"></div>
      <p><strong>${fullName || '(Ký và ghi rõ họ tên)'}</strong></p>
    </div>
  </div>

  <div class="legal-note">
    * Hồ sơ được trích xuất tự động qua nền tảng Giám định Bằng chứng Lừa đảo Trực tuyến ShieldAI Vietnam.
  </div>
</body>
</html>
    `.trim();
  };

  const handlePrint = () => {
    // Open a dedicated print window with full styling to guarantee 100% reliable A4 printing
    // across all browser engines, popup blockers, and nested iframes
    try {
      const printWindow = window.open('', '_blank', 'width=850,height=900');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(generateFullDocumentHtml());
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 400);
        onShowToast('Đang mở hộp thoại In / Lưu PDF...', 'success');
        return;
      }
    } catch (e) {
      console.warn('Popup blocked, falling back to window.print()', e);
    }

    // Fallback: invoke browser print directly
    window.print();
    onShowToast('Đang mở hộp thoại In / Lưu PDF...', 'success');
  };

  const handleDownloadDoc = () => {
    const htmlContent = generateFullDocumentHtml();
    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Don_Trinh_Bao_Lua_Dao_${reportDocId}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Đã tải xuống file Word (.doc) sẵn sàng in ấn và chỉnh sửa!', 'success');
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateFullDocumentHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Don_Trinh_Bao_A4_${reportDocId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Đã tải xuống file HTML chuẩn A4!', 'success');
  };

  const handleCopyText = () => {
    if (!analysisResult) return;
    const textContent = `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---
ĐƠN TRÌNH BÁO & TỐ GIÁC TỘI PHẠM LỪA ĐẢO TRỰC TUYẾN
(Mã hồ sơ: #${reportDocId})

Kính gửi: ${targetAuthority}
Đồng kính gửi: Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05) - Bộ Công an

1. THÔNG TIN NGƯỜI TRÌNH BÁO:
- Họ và tên: ${fullName || '...................................................'}
- Số CCCD: ${citizenId || '...................................................'}
- Số điện thoại liên hệ: ${phoneNumber || '...................................................'}
- Địa chỉ thường trú: ${address || '...................................................'}

2. ĐỐI TƯỢNG BỊ TỐ GIÁC & THỦ ĐOẠN:
- Hình thức lừa đảo: ${analysisResult.scam_type}
- Điểm rủi ro an ninh mạng: ${analysisResult.risk_score}/100 (${analysisResult.risk_level})
- Thông tin đối tượng (SĐT/STK/Link): ${scammerInfo || 'Đính kèm trong bằng chứng'}
- Ước tính số tiền bị chiếm đoạt: ${estimatedLoss || 'Chưa bị thiệt hại / Đang xác minh'}

3. NỘI DUNG VỤ VIỆC & BẰNG CHỨNG:
${evidenceText ? `Nội dung tin nhắn/cuộc gọi:\n"${evidenceText}"\n` : ''}
Các dấu hiệu bất thường (Red Flags):
${analysisResult.red_flags.map((rf, i) => `  ${i + 1}. ${rf}`).join('\n')}

Thủ đoạn thao túng tâm lý:
${analysisResult.psychological_tricks.map((pt, i) => `  ${i + 1}. ${pt}`).join('\n')}

4. YÊU CẦU KIẾN NGHỊ:
Kính đề nghị Quý Cơ quan tiến hành xác minh, điều tra làm rõ hành vi có dấu hiệu tội phạm lừa đảo chiếm đoạt tài sản theo Điều 174 & 290 Bộ luật Hình sự.

Ngày làm đơn: ${currentDate}
Người làm đơn (Ký và ghi rõ họ tên)
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    onShowToast('Đã sao chép toàn bộ nội dung Đơn trình báo!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen || !analysisResult) return null;

  return (
    <div
      id="printable-modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="printable-modal-inner"
        className="relative w-full max-w-5xl max-h-[95vh] bg-[#0f172a] border border-[#334155] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header - Hidden in Print */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#334155] bg-[#1e293b]/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Xuất Đơn Tố Giác & Bằng Chứng (PDF / In Ấn)
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                  Chuẩn Mẫu A05 / Công An
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tự động chuẩn hóa bằng chứng, phân tích kỹ thuật và điều khoản pháp lý gửi cơ quan chức năng
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
              title="Mở hộp thoại In hoặc Chọn 'Save as PDF' (Lưu dưới dạng PDF)"
            >
              <Printer className="w-4 h-4" />
              <span>In / Lưu PDF (A4)</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#475569] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              title="Tải về file Microsoft Word để chỉnh sửa thêm"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Tải file Word (.doc)</span>
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#475569] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Chép text'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#334155]/60 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher & Tooltips */}
        <div className="no-print flex items-center justify-between px-6 py-2.5 border-b border-[#334155]/60 bg-[#0f172a]/90 text-xs">
          <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-xl border border-[#334155]">
            <button
              onClick={() => setActiveView('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeView === 'preview'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem trước Bản In A4</span>
            </button>
            <button
              onClick={() => setActiveView('edit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeView === 'edit'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Điền & Chỉnh sửa thông tin</span>
            </button>
          </div>

          <span className="hidden sm:inline text-slate-400">
            💡 Mẹo: Chọn máy in <strong>"Save as PDF"</strong> trong hộp thoại in để lưu file PDF chất lượng cao.
          </span>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Editable Form Fields */}
          <div
            className={`no-print p-4 sm:p-5 rounded-2xl bg-[#1e293b]/60 border border-[#334155] space-y-4 ${
              activeView === 'edit' ? 'block ring-2 ring-cyan-500/40' : 'block'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> Thông tin cá nhân & Đối tượng bị tố giác
              </h3>
              <span className="text-[11px] text-slate-400">
                (Dữ liệu chỉ lưu trong phiên làm việc, không chia sẻ ra ngoài)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Họ và tên người làm đơn / Nạn nhân</label>
                <input
                  type="text"
                  placeholder="Vd: NGUYỄN VĂN A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Số CCCD / CMND</label>
                <input
                  type="text"
                  placeholder="Vd: 00120000xxxx"
                  value={citizenId}
                  onChange={(e) => setCitizenId(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  placeholder="Vd: 0912345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nơi cư trú (Thường trú/Tạm trú)</label>
                <input
                  type="text"
                  placeholder="Vd: Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Cơ quan tiếp nhận đơn</label>
                <input
                  type="text"
                  value={targetAuthority}
                  onChange={(e) => setTargetAuthority(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Số tiền bị chiếm đoạt (nếu có)</label>
                <input
                  type="text"
                  placeholder="Vd: 20.000.000 VNĐ"
                  value={estimatedLoss}
                  onChange={(e) => setEstimatedLoss(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-xs font-medium">
                Thông tin định danh kẻ lừa đảo (SĐT / STK Ngân hàng / Link Web / Nickname)
              </label>
              <input
                type="text"
                placeholder="Vd: STK 102839284729 - MB Bank (Tên: NGUYEN VAN B) | SĐT: 024999..."
                value={scammerInfo}
                onChange={(e) => setScammerInfo(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Printable A4 Paper Document */}
          <div className="flex justify-center">
            <div
              ref={printRef}
              id="printable-report-card"
              className="w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 font-serif leading-relaxed text-sm space-y-6"
            >
              {/* National Header */}
              <div className="text-center space-y-1.5 border-b border-slate-300 pb-4">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  Độc lập - Tự do - Hạnh phúc
                </p>
                <div className="w-28 h-0.5 bg-slate-800 mx-auto mt-1.5" />
              </div>

              {/* Document Title */}
              <div className="text-center py-2 space-y-1">
                <h1 className="text-base sm:text-lg font-bold text-red-700 uppercase tracking-wide">
                  ĐƠN TRÌNH BÁO & TỐ GIÁC TỘI PHẠM
                </h1>
                <p className="text-xs italic text-slate-600">
                  (V/v: Hành vi có dấu hiệu lừa đảo chiếm đoạt tài sản trên không gian mạng)
                </p>
              </div>

              {/* Recipient */}
              <div className="text-xs sm:text-sm space-y-1 text-slate-800">
                <p>
                  <strong>Kính gửi:</strong> {targetAuthority}
                </p>
                <p className="italic text-slate-600 text-xs">
                  Đồng kính gửi: Cục An ninh mạng và phòng, chống tội phạm sử dụng công nghệ cao (A05) - Bộ Công an.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-1.5 text-xs sm:text-sm border-t border-slate-200 pt-3">
                <h3 className="font-bold text-slate-900 uppercase">I. THÔNG TIN NGƯỜI LÀM ĐƠN / NGƯỜI BỊ HẠI</h3>
                <p>
                  - Họ và tên: <strong>{fullName || '.......................................................................................'}</strong>
                </p>
                <p>
                  - Số CCCD/CMND: <strong>{citizenId || '.......................................'}</strong> &nbsp;|&nbsp; Số điện thoại liên lạc: <strong>{phoneNumber || '.......................................'}</strong>
                </p>
                <p>
                  - Nơi cư trú: <strong>{address || '.....................................................................................................................................................'}</strong>
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-1.5 text-xs sm:text-sm border-t border-slate-200 pt-3">
                <h3 className="font-bold text-slate-900 uppercase">II. ĐỐI TƯỢNG BỊ TỐ GIÁC VÀ PHƯƠNG THỨC TIẾP CẬN</h3>
                <p>
                  - Dạng thủ đoạn: <strong className="text-red-700">{analysisResult.scam_type}</strong>
                </p>
                <p>
                  - Điểm đánh giá rủi ro an ninh mạng: <strong className="text-red-700">{analysisResult.risk_score}/100 - {analysisResult.risk_level.toUpperCase()}</strong>
                </p>
                <p>
                  - Thông tin đối tượng (Tài khoản nhận tiền/SĐT/Website): <strong>{scammerInfo || 'Đính kèm trong tệp bằng chứng'}</strong>
                </p>
                <p>
                  - Số tiền đã bị chuyển khoản / chiếm đoạt: <strong>{estimatedLoss || 'Kịp thời ngăn chặn / Đang xác minh thiệt hại'}</strong>
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-2 text-xs sm:text-sm border-t border-slate-200 pt-3">
                <h3 className="font-bold text-slate-900 uppercase">III. NỘI DUNG VỤ VIỆC & BẰNG CHỨNG KỸ THUẬT</h3>
                {evidenceText && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-300 font-mono text-[11px] text-slate-800 leading-normal">
                    <p className="font-bold mb-1">[Đoạn hội thoại / Nội dung tin nhắn lừa đảo]:</p>
                    "{evidenceText}"
                  </div>
                )}

                <div>
                  <p className="font-bold text-slate-800 mb-1">1. Các dấu hiệu bất thường (Red Flags):</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {analysisResult.red_flags.map((rf, idx) => (
                      <li key={idx} className="text-slate-700">{rf}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-slate-800 mb-1">2. Thủ đoạn thao túng tâm lý được sử dụng:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {analysisResult.psychological_tricks.map((pt, idx) => (
                      <li key={idx} className="text-slate-700">{pt}</li>
                    ))}
                  </ul>
                </div>

                {evidenceImage && (
                  <div className="pt-2">
                    <p className="font-bold text-slate-800 mb-1">3. [Bằng chứng hình ảnh / Ảnh chụp màn hình đính kèm]:</p>
                    <img
                      src={evidenceImage}
                      alt="Evidence Screenshot"
                      className="max-h-52 rounded border border-slate-300 object-contain mx-auto"
                    />
                  </div>
                )}
              </div>

              {/* Section 4 */}
              <div className="space-y-1.5 text-xs sm:text-sm border-t border-slate-200 pt-3">
                <h3 className="font-bold text-slate-900 uppercase">IV. LỜI CAM ĐOAN VÀ YÊU CẦU KIẾN NGHỊ</h3>
                <p className="text-slate-700 text-justify">
                  Căn cứ quy định tại <strong>Điều 174 & Điều 290 Bộ luật Hình sự</strong> và <strong>Luật An ninh mạng</strong>, tôi kính đề nghị Quý Cơ quan thụ lý hồ sơ, tiến hành xác minh và truy vết các đối tượng, tài khoản ngân hàng liên quan để xử lý nghiêm minh theo pháp luật, thu hồi tài sản bị lừa đảo cho người dân.
                </p>
                <p className="text-slate-700">
                  Tôi xin cam đoan toàn bộ thông tin và chứng cứ nêu trên là hoàn toàn đúng sự thật và chịu mọi trách nhiệm trước pháp luật.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-6 flex justify-between text-xs sm:text-sm text-slate-800 print-avoid-break">
                <div className="text-center w-52">
                  <p className="italic">Xác nhận bằng chứng</p>
                  <p className="font-bold mt-1 text-cyan-800">HỆ THỐNG SHIELDAI VIETNAM</p>
                  <div className="h-16 flex items-center justify-center">
                    <div className="border border-dashed border-cyan-600/40 rounded px-2 py-1 text-[10px] text-cyan-700 font-mono">
                      [ĐÃ GIÁM ĐỊNH KỸ THUẬT]
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">Mã hồ sơ: #{reportDocId}</p>
                </div>

                <div className="text-center w-52">
                  <p className="italic">Ngày ...... tháng ...... năm 202...</p>
                  <p className="font-bold mt-1">NGƯỜI LÀM ĐƠN</p>
                  <div className="h-16" />
                  <p className="font-bold">{fullName || '(Ký và ghi rõ họ tên)'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Hidden in Print */}
        <div className="no-print px-6 py-3.5 border-t border-[#334155] bg-[#1e293b]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>
              Hồ sơ pháp lý được định dạng tự động tương thích tiêu chuẩn báo cáo Cơ quan Công an & Tổng đài 156.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-lg bg-[#334155] hover:bg-[#475569] text-slate-200 font-medium transition-colors cursor-pointer text-xs"
            >
              Tải HTML A4
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
