import React, { useState, useRef } from 'react';
import { Image as ImageIcon, FileText, UploadCloud, X, Search, Loader2 } from 'lucide-react';

interface EvidenceInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  uploadedImage: string | null;
  setUploadedImage: (img: string | null) => void;
  imageMimeType: string;
  setImageMimeType: (mime: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const EvidenceInput: React.FC<EvidenceInputProps> = ({
  inputText,
  setInputText,
  uploadedImage,
  setUploadedImage,
  imageMimeType,
  setImageMimeType,
  onAnalyze,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP)');
      return;
    }
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>📥 1. Tải lên Bằng chứng Nghi vấn</span>
          </h2>
        </div>

        {/* Custom Tabs */}
        <div className="flex bg-[#0f172a] p-1 rounded-xl border border-[#334155] mb-4 gap-1">
          <button
            type="button"
            id="tab-upload-image"
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>📷 Upload Ảnh (Tin nhắn / Bill / QR)</span>
          </button>
          <button
            type="button"
            id="tab-input-text"
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📝 Nhập Văn bản / Link Website</span>
          </button>
        </div>

        {/* Tab 1: Image Upload */}
        {activeTab === 'image' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Tải lên ảnh chụp màn hình tin nhắn Zalo/SMS/Telegram, hóa đơn chuyển tiền ngân hàng nghi làm giả, hoặc mã QR nghi vấn:
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {!uploadedImage ? (
              <div
                id="dropzone-area"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragOver
                    ? 'border-cyan-400 bg-cyan-950/20'
                    : 'border-[#334155] bg-[#0f172a]/60 hover:border-slate-500 hover:bg-[#0f172a]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    Kéo & thả ảnh vào đây, hoặc <span className="text-cyan-400 hover:underline">chọn file</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Hỗ trợ PNG, JPG, JPEG, WEBP (Tối đa 15MB)</div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-[#334155] bg-[#0f172a] p-2">
                <img
                  src={uploadedImage}
                  alt="Ảnh bằng chứng đã tải lên"
                  className="w-full max-h-72 object-contain rounded-lg mx-auto"
                />
                <button
                  type="button"
                  id="remove-image-btn"
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all"
                  title="Xóa ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-center text-xs text-slate-400 mt-2">
                  ✅ Ảnh bằng chứng đã tải lên thành công
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Text / Link Input */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Dán nội dung tin nhắn, Email, hoặc Đường link (URL) nghi ngờ vào đây:
            </p>
            <textarea
              id="scam-text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ví dụ: 'THONG BAO: Tai khoan Vietcombank cua quy khach bi khoa. Vui long truy cap http://giamao-vcb.com de xac thuc ngay...'"
              rows={8}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none font-mono"
            />
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-[#334155]">
        <button
          type="button"
          id="btn-analyze-submit"
          onClick={onAnalyze}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>GEMINI AI ĐANG PHÂN TÍCH ĐA PHƯƠNG THỨC...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>🔍 PHÂN TÍCH RỦI RO NGAY VỚI GEMINI AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
