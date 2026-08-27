import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, Building2, Phone, X, ExternalLink, AlertCircle, Copy, Check } from 'lucide-react';
import { NATIONAL_HOTLINES, BANK_HOTLINES, EmergencyContact } from '../data/emergencyHotlines';

interface EmergencyHotlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

export const EmergencyHotlinesModal: React.FC<EmergencyHotlinesModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'national' | 'bank'>('all');

  const copyHotline = (contact: EmergencyContact) => {
    navigator.clipboard.writeText(contact.hotline);
    setCopiedId(contact.id);
    onShowToast(`Đã sao chép số hotline ${contact.hotline} (${contact.name})`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0f172a] border border-[#334155] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Hotline Khẩn Cấp 1-Chạm & Đường Dây Nóng
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                  24/7
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gọi ngay để khóa tài khoản ngân hàng hoặc trình báo tội phạm lừa đảo công nghệ cao
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#334155]/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-[#334155]/60 bg-[#0f172a]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white'
                : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-[#334155]'
            }`}
          >
            Tất cả đường dây nóng
          </button>
          <button
            onClick={() => setActiveTab('national')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'national'
                ? 'bg-rose-600 text-white'
                : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-[#334155]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Cơ quan Nhà nước & Bộ Công an
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-rose-600 text-white'
                : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-[#334155]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Tổng đài Khóa Thẻ Ngân hàng
          </button>
        </div>

        {/* Important Alert Notice */}
        <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>HƯỚNG DẪN KHI BỊ LỪA ĐẢO / LỘ OTP:</strong>
            <p className="mt-0.5 text-amber-300/90">
              1. Gọi ngay Tổng đài ngân hàng để <strong>KHÓA THẺ & TÀI KHOẢN DIGIBANK</strong> ngay lập tức.<br />
              2. Soạn tin hoặc gọi <strong>156</strong> (miễn phí) để phản ánh tin nhắn/cuộc gọi rác.<br />
              3. Lưu lại toàn bộ tin nhắn, sao kê và trình báo Cơ quan Công an gần nhất.
            </p>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {(activeTab === 'all' || activeTab === 'national') && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Cơ quan Tiếp nhận Trình báo & Tố giác
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {NATIONAL_HOTLINES.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3.5 rounded-xl bg-[#1e293b]/60 border border-[#334155] hover:border-rose-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-100">{contact.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {contact.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-cyan-400 font-medium">{contact.organization}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{contact.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#334155]/60">
                      <a
                        href={`tel:${contact.hotline}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shadow transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi {contact.hotline}</span>
                      </a>

                      <button
                        onClick={() => copyHotline(contact)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-[#0f172a] border border-[#334155] cursor-pointer"
                      >
                        {copiedId === contact.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'bank') && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" /> Hotline Khóa Thẻ & Khóa Dịch vụ Ngân hàng Khẩn Cấp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BANK_HOTLINES.map((bank) => (
                  <div
                    key={bank.id}
                    className="p-3.5 rounded-xl bg-[#1e293b]/60 border border-[#334155] hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-100">{bank.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                          {bank.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{bank.organization}</p>
                      <p className="text-[11px] text-amber-300/90 mt-1 font-medium">{bank.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#334155]/60">
                      <a
                        href={`tel:${bank.hotline}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs shadow transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi {bank.hotline}</span>
                      </a>

                      <button
                        onClick={() => copyHotline(bank)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-[#0f172a] border border-[#334155] cursor-pointer"
                      >
                        {copiedId === bank.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#334155] bg-[#1e293b]/40 flex items-center justify-between text-xs text-slate-400">
          <span>Hỗ trợ bấm để gọi trực tiếp trên điện thoại di động</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#334155] hover:bg-[#475569] text-slate-100 font-medium cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
