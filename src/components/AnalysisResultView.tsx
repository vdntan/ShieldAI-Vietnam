import React from 'react';
import { Shield, AlertOctagon, Brain, ShieldAlert, CheckCircle2, Flag, Star, Send } from 'lucide-react';
import { ScamAnalysisResult } from '../types';

interface AnalysisResultViewProps {
  result: ScamAnalysisResult | null;
  onReportCommunity: () => void;
  onOpenFeedback: () => void;
  isReporting: boolean;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  onReportCommunity,
  onOpenFeedback,
  isReporting
}) => {
  if (!result) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-lg min-h-[500px]">
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-3 flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="ShieldAI"
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <h3 className="text-xl font-bold text-cyan-400 mb-2">Sẵn sàng Phân tích Rủi ro</h3>
        <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Tải lên ảnh chụp màn hình tin nhắn, hóa đơn chuyển tiền nghi làm giả, hoặc dán đoạn văn bản/link website ở cột bên trái để Gemini AI quét toàn diện.
        </p>

        <div className="text-left w-full bg-[#0f172a] p-4 rounded-xl border border-dashed border-[#334155] space-y-2.5">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            <span>Các kịch bản lừa đảo phổ biến ShieldAI có thể nhận diện:</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
            <li>Fake Bill ngân hàng (Hóa đơn chuyển khoản giả mạo).</li>
            <li>Mã QR thanh toán độc hại hoặc điều hướng trang web lừa đảo.</li>
            <li>Giả danh Công an, Thuế, Ngân hàng, Bưu điện gọi điện/nhắn tin đe dọa.</li>
            <li>Bẫy tuyển Cộng tác viên online xem video, chốt đơn nhận hoa hồng.</li>
            <li>Link nhận quà tri ân, trúng thưởng giả mạo thương hiệu lớn.</li>
          </ul>
        </div>
      </div>
    );
  }

  const score = result.risk_score;
  const level = (result.risk_level || 'KHÔNG XÁC ĐỊNH').toUpperCase();
  const isCritical = level.includes('CỰC KỲ') || level.includes('RẤT CAO') || score >= 80;
  const isHigh = level.includes('CAO') || score >= 60;
  const isMedium = level.includes('TRUNG BÌNH') || score >= 30;

  let badgeColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
  let scoreTextColor = 'text-emerald-400';
  if (isCritical) {
    badgeColor = 'bg-rose-950/80 text-rose-400 border-rose-500/80 animate-pulse-slow';
    scoreTextColor = 'text-rose-400';
  } else if (isHigh) {
    badgeColor = 'bg-orange-950/80 text-orange-400 border-orange-500/80';
    scoreTextColor = 'text-orange-400';
  } else if (isMedium) {
    badgeColor = 'bg-amber-950/80 text-amber-400 border-amber-500/80';
    scoreTextColor = 'text-amber-400';
  }

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      {/* Top Score Display Card */}
      <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 shadow-inner">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">CẤP ĐỘ RỦI RO</span>
            <div className="mt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-black border ${badgeColor}`}>
                {level}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">ĐIỂM RỦI RO</span>
            <div className={`text-2xl md:text-3xl font-black font-mono ${scoreTextColor}`}>
              {score} <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="w-full bg-[#1e293b] rounded-full h-2.5 overflow-hidden border border-[#334155]/60 mb-3">
          <div
            className="h-full transition-all duration-500 ease-out bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
            style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1 border-t border-[#334155]/60">
          <span className="text-slate-400">LOẠI HÌNH NHẬN DIỆN:</span>
          <strong className="text-cyan-400 font-bold">{result.scam_type}</strong>
        </div>
      </div>

      {/* Red Flags Section */}
      {result.red_flags && result.red_flags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wide text-rose-400 flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5" />
            <span>Dấu hiệu Vi phạm & Bất thường (Red Flags)</span>
          </h4>
          <div className="space-y-1.5">
            {result.red_flags.map((flag, idx) => (
              <div
                key={idx}
                className="bg-rose-950/20 border-l-4 border-rose-500 p-2.5 rounded-r-lg text-xs text-rose-200 leading-relaxed"
              >
                ⚠️ {flag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Psychological Tricks Section */}
      {result.psychological_tricks && result.psychological_tricks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wide text-purple-400 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            <span>Thủ thuật Thao túng Tâm lý Phát hiện được</span>
          </h4>
          <div className="space-y-1.5">
            {result.psychological_tricks.map((trick, idx) => (
              <div
                key={idx}
                className="bg-purple-950/20 border-l-4 border-purple-500 p-2.5 rounded-r-lg text-xs text-purple-200 leading-relaxed"
              >
                🎯 {trick}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Advice Section */}
      {result.advice && (
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wide text-indigo-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Phân tích Chi tiết từ Chuyên gia ShieldAI</span>
          </h4>
          <div className="bg-indigo-950/20 border border-indigo-900/60 p-3.5 rounded-xl text-xs text-indigo-200 leading-relaxed">
            {result.advice}
          </div>
        </div>
      )}

      {/* Suggested Actions Section */}
      {result.suggested_actions && result.suggested_actions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wide text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Hành động Khẩn cấp Cần thực hiện Ngay</span>
          </h4>
          <div className="space-y-1.5">
            {result.suggested_actions.map((act, idx) => (
              <div
                key={idx}
                className="bg-cyan-950/20 border-l-4 border-cyan-400 p-2.5 rounded-r-lg text-xs text-cyan-200 leading-relaxed"
              >
                ✅ {act}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-[#334155]" />

      {/* Community Engagement Buttons */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <span>🌐 Cùng Cộng đồng Phòng chống Lừa đảo</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            id="btn-report-community"
            onClick={onReportCommunity}
            disabled={isReporting}
            className="flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-slate-800 border border-[#334155] hover:border-cyan-500/60 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isReporting ? 'Đang lưu...' : '📢 Báo cáo vào CSDL Cộng đồng'}</span>
          </button>

          <button
            type="button"
            id="btn-open-feedback"
            onClick={onOpenFeedback}
            className="flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-slate-800 border border-[#334155] hover:border-amber-500/60 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>⭐ Gửi phản hồi / Đánh giá</span>
          </button>
        </div>
      </div>
    </div>
  );
};
