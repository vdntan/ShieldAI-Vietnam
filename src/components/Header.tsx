import React from 'react';
import { Menu, X, Shield, Sparkles } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="relative bg-gradient-to-br from-[#1e293b] via-[#172133] to-[#0f172a] border border-[#334155] rounded-2xl p-5 md:p-6 shadow-xl shadow-black/40 overflow-hidden mb-6">
      {/* Subtle decorative glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-4">
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
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">
              ShieldAI Vietnam — Phân tích & Phòng chống Lừa đảo
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">
              Hệ thống Trí tuệ Nhân tạo Đa phương thức (Multimodal) phân tích Tin nhắn, Ảnh chụp màn hình, Fake Bill & Đường link độc hại với Google Gemini AI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
