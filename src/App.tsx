import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EvidenceInput } from './components/EvidenceInput';
import { AnalysisResultView } from './components/AnalysisResultView';
import { FeedbackModal } from './components/FeedbackModal';
import { BlacklistLookupModal } from './components/BlacklistLookupModal';
import { EmergencyHotlinesModal } from './components/EmergencyHotlinesModal';
import { ReportExportModal } from './components/ReportExportModal';
import { ScamAnalysisResult, CommunityReport, UserFeedback } from './types';
import { DEMO_SCENARIOS } from './data/demoData';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState<boolean>(false);
  const [isHotlinesModalOpen, setIsHotlinesModalOpen] = useState<boolean>(false);
  const [isExportReportModalOpen, setIsExportReportModalOpen] = useState<boolean>(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [isReportingCommunity, setIsReportingCommunity] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load initial reports and feedback
  useEffect(() => {
    loadReports();
    loadFeedback();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const loadFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  // Calculate average rating
  const avgRating = feedbacks.length === 0
    ? '5.0'
    : (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / feedbacks.length).toFixed(1);

  // Load Demo Scenario
  const handleLoadDemo = (scenarioKey: string) => {
    const demo = DEMO_SCENARIOS[scenarioKey];
    if (demo) {
      setInputText(demo.text);
      setUploadedImage(null);
      setAnalysisResult(demo.result);
      setErrorMsg(null);
      showToast(`Đã nạp thành công kịch bản: ${demo.label}`, 'success');
      // On mobile close sidebar to view results
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    }
  };

  // Perform AI analysis
  const handleAnalyze = async () => {
    setErrorMsg(null);

    if (!uploadedImage && !inputText.trim()) {
      setErrorMsg('⚠️ Vui lòng tải lên 1 hình ảnh hoặc nhập nội dung văn bản / đường link nghi vấn để phân tích!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          imageBase64: uploadedImage,
          imageMimeType
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Lỗi xử lý phân tích từ Gemini AI');
      }

      setAnalysisResult(data.result);
      if (data.warning) {
        showToast('Đã phân tích nhanh với ShieldAI Intelligence Core.', 'success');
      } else {
        showToast('Phân tích đa phương thức hoàn tất thành công!', 'success');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gọi API phân tích');
      showToast(err.message || 'Lỗi phân tích', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Report to community database
  const handleReportCommunity = async () => {
    if (!analysisResult) return;
    setIsReportingCommunity(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scam_type: analysisResult.scam_type,
          risk_score: analysisResult.risk_score,
          risk_level: analysisResult.risk_level,
          sample_text: inputText.slice(0, 150),
          has_image: Boolean(uploadedImage)
        })
      });

      if (res.ok) {
        showToast('✅ Đã lưu mẫu vào CSDL cảnh báo cộng đồng!', 'success');
        loadReports();
      } else {
        throw new Error('Lỗi khi lưu vào CSDL cộng đồng');
      }
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu báo cáo', 'error');
    } finally {
      setIsReportingCommunity(false);
    }
  };

  // Submit feedback
  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          scam_type: analysisResult?.scam_type || 'Chưa phân loại'
        })
      });

      if (res.ok) {
        setIsFeedbackModalOpen(false);
        showToast('🎉 Cảm ơn bạn đã gửi phản hồi giúp hoàn thiện AI!', 'success');
        loadFeedback();
      } else {
        throw new Error('Không thể gửi đánh giá');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi gửi đánh giá', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/60'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sidebar Overlay on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        onLoadDemo={handleLoadDemo}
        reportCount={reports.length}
        avgRating={avgRating}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenBlacklist={() => setIsBlacklistModalOpen(true)}
        onOpenHotlines={() => setIsHotlinesModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-80 flex-1 flex flex-col transition-all duration-300">
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onOpenBlacklist={() => setIsBlacklistModalOpen(true)}
            onOpenHotlines={() => setIsHotlinesModalOpen(true)}
            onOpenFeedback={() => setIsFeedbackModalOpen(true)}
            avgRating={avgRating}
          />

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-rose-950/40 border border-rose-500/60 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-200 shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed whitespace-pre-line">{errorMsg}</div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-rose-400 hover:text-rose-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 2-Column Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: Multimodal Input */}
            <EvidenceInput
              inputText={inputText}
              setInputText={setInputText}
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              imageMimeType={imageMimeType}
              setImageMimeType={setImageMimeType}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />

            {/* Right Column: Risk Analytics & Recommendation */}
            <AnalysisResultView
              result={analysisResult}
              onReportCommunity={handleReportCommunity}
              onOpenFeedback={() => setIsFeedbackModalOpen(true)}
              isReporting={isReportingCommunity}
              onOpenExportReport={() => setIsExportReportModalOpen(true)}
              onOpenHotlines={() => setIsHotlinesModalOpen(true)}
              onOpenBlacklist={() => setIsBlacklistModalOpen(true)}
              showToast={showToast}
            />
          </div>
        </main>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        scamType={analysisResult?.scam_type || 'Chưa phân loại'}
        isSubmitting={isSubmittingFeedback}
      />

      {/* Blacklist Lookup Modal */}
      <BlacklistLookupModal
        isOpen={isBlacklistModalOpen}
        onClose={() => setIsBlacklistModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Emergency Hotlines Modal */}
      <EmergencyHotlinesModal
        isOpen={isHotlinesModalOpen}
        onClose={() => setIsHotlinesModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Report & Evidence Export Modal */}
      <ReportExportModal
        isOpen={isExportReportModalOpen}
        onClose={() => setIsExportReportModalOpen(false)}
        analysisResult={analysisResult}
        evidenceText={inputText}
        evidenceImage={uploadedImage}
        onShowToast={showToast}
      />
    </div>
  );
}
