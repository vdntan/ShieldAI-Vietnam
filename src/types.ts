export interface ScamAnalysisResult {
  risk_score: number;
  risk_level: string;
  scam_type: string;
  red_flags: string[];
  psychological_tricks: string[];
  advice: string;
  suggested_actions: string[];
}

export interface CommunityReport {
  id: number;
  timestamp: string;
  scam_type: string;
  risk_score: number;
  risk_level: string;
  sample_text: string;
  has_image: boolean;
}

export interface UserFeedback {
  timestamp: string;
  rating: number;
  comment: string;
  scam_type: string;
}

export interface AnalyzeRequest {
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  userApiKey?: string;
}
