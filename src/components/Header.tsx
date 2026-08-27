import React from 'react';
import { Menu, X, Shield, Sparkles, Search, PhoneCall, ShieldAlert, Star } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenBlacklist: () => void;
  onOpenHotlines: () => void;
  onOpenFeedback: () => void;
  avgRating: string;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenBlacklist,
  onOpenHotlines,
  onOpenFeedback,
  avgRating
}) => {
  return (
    <header className="relative bg-gradient-to-br from-[#1e293b] via-[#172133] to-[#0f172a] border border-[#334155] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/40 overflow-hidden mb-6">
      {/* Subtle decorative glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            id="mobile-sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#334155]/60 text-slate-300 hover:text-white hover:bg-[#334155] transition-all"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 p-2 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <img
              src="/logo.png"
              alt="ShieldAI Logo"
              className="w-full h-full object-contain rounded-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">
              ShieldAI Vietnam — Cyber Fraud & Scam Defense
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5 leading-relaxed">
              Hệ thống AI Đa phương thức phân tích Bằng chứng & Trung tâm Cảnh báo Phòng chống Lừa đảo Quốc gia
            </p>
          </div>
        </div>

        {/* Prominent Quick Action Navigation Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="header-btn-blacklist"
            onClick={onOpenBlacklist}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 hover:border-rose-400 text-rose-300 text-xs font-bold transition-all shadow-md cursor-pointer group"
          >
            <Search className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>🔍 Tra Cứu STK & SĐT Đen</span>
          </button>

          <button
            type="button"
            id="header-btn-hotlines"
            onClick={onOpenHotlines}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition-all shadow-md cursor-pointer group"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>📞 Hotline 156 & Khóa Thẻ</span>
          </button>

          <button
            type="button"
            id="header-btn-feedback"
            onClick={onOpenFeedback}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-amber-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Đánh giá ({avgRating}★)</span>
          </button>
        </div>
      </div>
    </header>
  );
};

