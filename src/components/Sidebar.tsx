import React, { useState } from 'react';
import { Sparkles, Database, Star, Info, Search, PhoneCall, ShieldAlert } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoData';

interface SidebarProps {
  onLoadDemo: (scenarioKey: string) => void;
  reportCount: number;
  avgRating: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenBlacklist: () => void;
  onOpenHotlines: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onLoadDemo,
  reportCount,
  avgRating,
  isOpen,
  setIsOpen,
  onOpenBlacklist,
  onOpenHotlines
}) => {
  const [selectedDemo, setSelectedDemo] = useState<string>('fake_sms');


  return (
    <aside
      id="app-sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-80 bg-[#0f172a] border-r border-[#334155] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-5 overflow-y-auto flex-1 space-y-6">
        {/* Brand & Logo */}
        <div className="flex flex-col items-center text-center space-y-2 pb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 p-2 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <img
              src="/logo.png"
              alt="ShieldAI Vietnam Logo"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                // Fallback to vector icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">
              ShieldAI Vietnam
            </h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AIRiserVietnam #BuildwithGoogleAI</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#334155]" />

        {/* Quick Tools Access */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Công cụ Hỗ trợ Khẩn cấp</span>
          </div>

          <button
            type="button"
            onClick={onOpenBlacklist}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/50 hover:border-rose-400 text-xs font-bold text-rose-300 transition-all cursor-pointer shadow-sm"
          >
            <Search className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-left">🔍 Tra Cứu STK / SĐT Đen</span>
          </button>

          <button
            type="button"
            onClick={onOpenHotlines}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/50 hover:border-emerald-400 text-xs font-bold text-emerald-300 transition-all cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <span className="text-left">📞 Hotline Khẩn Cấp (156)</span>
          </button>
        </div>

        <div className="h-px bg-[#334155]" />

        {/* Demo Experience Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Chế độ Trải nghiệm Mẫu</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 block">Chọn kịch bản lừa đảo mẫu:</label>
            <select
              id="demo-scenario-select"
              value={selectedDemo}
              onChange={(e) => setSelectedDemo(e.target.value)}
              className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="fake_sms">📱 Fake SMS Ngân hàng (SMS Brandname)</option>
              <option value="fake_bill">💳 Fake Bill Chuyển khoản Ngân hàng</option>
              <option value="ctv">💼 Bẫy Tuyển CTV Việc nhẹ lương cao</option>
            </select>
          </div>

          <button
            type="button"
            id="load-demo-btn"
            onClick={() => onLoadDemo(selectedDemo)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span>🚀 Nạp Dữ liệu Mẫu Phân tích Ngay</span>
          </button>
        </div>

        <div className="h-px bg-[#334155]" />

        {/* Community Database & Traction */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>CSDL & Traction Cộng đồng</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                {reportCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Mẫu báo cáo</div>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-amber-400 flex items-center justify-center gap-1 font-mono">
                {avgRating} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Đánh giá AI</div>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#334155]" />

        {/* About Info */}
        <div className="p-3 bg-[#1e293b]/60 rounded-xl border border-[#334155]/60 text-xs text-slate-400 space-y-2">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Về dự án ShieldAI Vietnam:</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-400">
            <li>⚡ <strong className="text-slate-300">AI Core:</strong> Google Gemini Multimodal</li>
            <li>🔒 <strong className="text-slate-300">Công nghệ:</strong> Structured JSON & TypeScript</li>
            <li>🎯 <strong className="text-slate-300">Mục tiêu:</strong> Bảo vệ người dân Việt Nam trước các thủ đoạn lừa đảo công nghệ cao.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
