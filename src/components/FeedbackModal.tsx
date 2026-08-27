import React, { useState } from 'react';
import { X, Star, Sparkles, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  scamType: string;
  isSubmitting: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  scamType,
  isSubmitting
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Gửi phản hồi / Đánh giá AI</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Đánh giá độ chính xác của phân tích này:
            </label>
            <div className="flex items-center justify-center gap-2 py-2 bg-[#0f172a] rounded-xl border border-[#334155]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center text-xs text-slate-400">
              {rating === 5 && '🌟 Cực kỳ chính xác & hữu ích'}
              {rating === 4 && '👍 Tương đối chính xác'}
              {rating === 3 && '👌 Bình thường'}
              {rating === 2 && '👎 Chưa thật sự chính xác'}
              {rating === 1 && '⚠️ Sai sót nhiều'}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Góp ý bổ sung (nếu có):
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ thêm về trải nghiệm hoặc chi tiết dấu hiệu lừa đảo..."
              rows={3}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#334155] text-slate-300 hover:bg-[#334155] text-xs font-semibold transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
