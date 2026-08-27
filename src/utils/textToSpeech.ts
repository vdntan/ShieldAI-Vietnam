// Speech synthesis helper optimized for Vietnamese scam alert summaries

export function speakAlertVietnamese(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): { stop: () => void } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('Trình duyệt không hỗ trợ đọc giọng nói (SpeechSynthesis).');
    return { stop: () => {} };
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(
    (v) => v.lang === 'vi-VN' || v.lang.startsWith('vi') || v.name.toLowerCase().includes('vietnam')
  );
  if (viVoice) {
    utterance.voice = viVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
      onEnd?.();
    }
  };
}
