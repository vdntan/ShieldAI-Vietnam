import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, AlertTriangle, CheckCircle, Plus, X, Globe, Phone, CreditCard, Building2, User, Flag } from 'lucide-react';
import { INITIAL_BLACKLIST, BlacklistItem } from '../data/blacklistData';

interface BlacklistLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

export const BlacklistLookupModal: React.FC<BlacklistLookupModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>(() => {
    const saved = localStorage.getItem('shieldai_blacklist_custom');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_BLACKLIST];
      } catch (e) {
        return INITIAL_BLACKLIST;
      }
    }
    return INITIAL_BLACKLIST;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bank' | 'phone' | 'domain'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding new blacklist entry
  const [newType, setNewType] = useState<'bank' | 'phone' | 'domain'>('bank');
  const [newValue, setNewValue] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newBank, setNewBank] = useState('Vietcombank');
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blacklist.filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (!q) return true;
      return (
        item.value.toLowerCase().includes(q) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(q)) ||
        (item.bankName && item.bankName.toLowerCase().includes(q)) ||
        item.scamCategory.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [blacklist, searchQuery, filterType]);

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim() || !newCategory.trim()) {
      onShowToast('Vui lòng nhập đầy đủ thông tin định danh và hình thức lừa đảo.', 'error');
      return;
    }

    const newItem: BlacklistItem = {
      id: `custom-${Date.now()}`,
      type: newType,
      value: newValue.trim(),
      ownerName: newType === 'bank' ? newOwner.trim().toUpperCase() || undefined : undefined,
      bankName: newType === 'bank' ? newBank : undefined,
      reportCount: 1,
      scamCategory: newCategory.trim(),
      description: newDesc.trim() || 'Người dùng cảnh báo nghi vấn lừa đảo chiếm đoạt tài sản.',
      dateReported: new Date().toISOString().split('T')[0],
      severity: 'critical'
    };

    const updated = [newItem, ...blacklist];
    setBlacklist(updated);

    // Save custom items to local storage
    const customItems = updated.filter((item) => item.id.startsWith('custom-'));
    localStorage.setItem('shieldai_blacklist_custom', JSON.stringify(customItems));

    onShowToast(`Đã thêm cảnh báo cho ${newItem.value} vào Danh bạ Đen thành công!`, 'success');
    setShowAddForm(false);
    setNewValue('');
    setNewOwner('');
    setNewCategory('');
    setNewDesc('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0f172a] border border-[#334155] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#1e293b]/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Tra cứu Danh bạ Lừa đảo & Số Tài khoản Đen
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800/60">
                  Cập nhật liên tục
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Kiểm tra nhanh số tài khoản ngân hàng, số điện thoại hoặc tên miền trước khi chuyển tiền
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

        {/* Search & Filter Bar */}
        <div className="p-6 pb-3 space-y-4 border-b border-[#334155]/60 bg-[#0f172a]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập số tài khoản, số điện thoại (vd: 024...), tên chủ tài khoản hoặc tên miền..."
                className="w-full bg-[#1e293b] border border-[#334155] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Xóa
                </button>
              )}
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-950/40 transition-all shrink-0 cursor-pointer"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddForm ? 'Đóng form báo cáo' : 'Gắn cờ cảnh báo mới'}</span>
            </button>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium mr-1">Bộ lọc:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-[#334155]'
              }`}
            >
              Tất cả ({blacklist.length})
            </button>
            <button
              onClick={() => setFilterType('bank')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterType === 'bank'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-[#334155]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Tài khoản Ngân hàng ({blacklist.filter((i) => i.type === 'bank').length})
            </button>
            <button
              onClick={() => setFilterType('phone')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterType === 'phone'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-[#334155]'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Số điện thoại ({blacklist.filter((i) => i.type === 'phone').length})
            </button>
            <button
              onClick={() => setFilterType('domain')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filterType === 'domain'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-[#334155]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Tên miền độc hại ({blacklist.filter((i) => i.type === 'domain').length})
            </button>
          </div>
        </div>

        {/* Add New Report Form Collapsible */}
        {showAddForm && (
          <form onSubmit={handleAddReport} className="p-6 border-b border-[#334155] bg-[#1e293b]/40 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-400">
              <Flag className="w-4 h-4" />
              <span>Gửi báo cáo & đưa vào Danh bạ Cảnh báo Cộng đồng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Loại đối tượng *</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="bank">Số Tài Khoản Ngân Hàng</option>
                  <option value="phone">Số Điện Thoại</option>
                  <option value="domain">Đường Link / Tên Miền</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {newType === 'bank' ? 'Số tài khoản *' : newType === 'phone' ? 'Số điện thoại *' : 'Đường link / Tên miền *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'bank' ? '10283928...' : newType === 'phone' ? '024999...' : 'tenmien-nhai.xyz'}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200"
                />
              </div>

              {newType === 'bank' ? (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Ngân hàng</label>
                  <select
                    value={newBank}
                    onChange={(e) => setNewBank(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="Vietcombank">Vietcombank</option>
                    <option value="MB Bank">MB Bank</option>
                    <option value="Techcombank">Techcombank</option>
                    <option value="BIDV">BIDV</option>
                    <option value="VietinBank">VietinBank</option>
                    <option value="Agribank">Agribank</option>
                    <option value="ACB">ACB</option>
                    <option value="VPBank">VPBank</option>
                    <option value="TPBank">TPBank</option>
                    <option value="Khác">Ngân hàng khác</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thủ đoạn chính *</label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: Giả danh Công an, Phishing..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
              )}
            </div>

            {newType === 'bank' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tên chủ tài khoản (nếu có)</label>
                  <input
                    type="text"
                    placeholder="Vd: NGUYEN VAN A"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thủ đoạn chính *</label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: Bẫy CTV Shopee, Giả nhân viên thuế..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1">Mô tả hành vi lừa đảo</label>
              <textarea
                rows={2}
                placeholder="Mô tả cụ thể đối tượng nhắn tin, gọi điện hoặc dụ dỗ như thế nào..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-slate-200 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg border border-[#334155] text-xs text-slate-300 hover:bg-[#334155]/60 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow cursor-pointer"
              >
                Lưu vào Danh bạ Đen
              </button>
            </div>
          </form>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {searchQuery && (
            <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
              <span>
                Tìm thấy <strong className="text-slate-100">{filteredItems.length}</strong> kết quả phù hợp với từ khóa "
                {searchQuery}"
              </span>
              {filteredItems.length === 0 && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Chưa có trong danh sách đen (vẫn cần cẩn trọng!)
                </span>
              )}
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-[#334155] rounded-xl">
              <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">Không tìm thấy dữ liệu cảnh báo trong danh sách</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Nếu bạn vừa phát hiện hành vi lừa đảo với số tài khoản/số điện thoại này, hãy bấm <strong>"Gắn cờ cảnh báo mới"</strong> để lưu lại và cảnh báo cho người khác!
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#1e293b]/60 border border-[#334155] hover:border-rose-500/50 transition-all space-y-2 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {item.type === 'bank' && (
                      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'phone' && (
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Phone className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'domain' && (
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Globe className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-rose-300 tracking-wide">
                          {item.value}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800">
                          {item.reportCount} lượt báo cáo
                        </span>
                      </div>
                      {item.type === 'bank' && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          {item.bankName && (
                            <span className="flex items-center gap-1 text-slate-300">
                              <Building2 className="w-3 h-3 text-cyan-400" /> {item.bankName}
                            </span>
                          )}
                          {item.ownerName && (
                            <span className="flex items-center gap-1 text-amber-300 font-medium">
                              <User className="w-3 h-3" /> {item.ownerName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#0f172a] text-slate-300 border border-[#334155] self-start sm:self-auto">
                    {item.scamCategory}
                  </span>
                </div>

                <p className="text-xs text-slate-400 pl-1">{item.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-[#334155]/40">
                  <span>Ngày ghi nhận: {item.dateReported}</span>
                  <span className="text-rose-400 font-medium">Mức độ nguy hiểm: RẤT CAO</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#334155] bg-[#1e293b]/40 flex items-center justify-between text-xs text-slate-400">
          <span>Dữ liệu tổng hợp từ cộng đồng & đối chiếu quy chuẩn an toàn số.</span>
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
