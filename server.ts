import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

const COMMUNITY_DB = path.join(process.cwd(), 'community_reports.json');
const FEEDBACK_DB = path.join(process.cwd(), 'user_feedback.json');

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

function writeJsonFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Config status
app.get('/api/config', (req, res) => {
  const envKey = process.env.GEMINI_API_KEY || '';
  const hasServerKey = envKey.trim().length >= 15 && !envKey.startsWith('your_');
  res.json({ hasServerKey });
});

// Reports endpoints
app.get('/api/reports', (req, res) => {
  const reports = readJsonFile(COMMUNITY_DB, []);
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  try {
    const reports = readJsonFile<any[]>(COMMUNITY_DB, []);
    const { scam_type, risk_score, risk_level, sample_text, has_image } = req.body;
    
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newReport = {
      id: reports.length + 1,
      timestamp: formattedTime,
      scam_type: scam_type || 'Chưa phân loại',
      risk_score: Number(risk_score) || 0,
      risk_level: risk_level || 'KHÔNG XÁC ĐỊNH',
      sample_text: (sample_text || '').slice(0, 150),
      has_image: Boolean(has_image)
    };

    reports.push(newReport);
    writeJsonFile(COMMUNITY_DB, reports);
    res.json({ success: true, report: newReport, total: reports.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi lưu báo cáo' });
  }
});

// Feedback endpoints
app.get('/api/feedback', (req, res) => {
  const feedbacks = readJsonFile(FEEDBACK_DB, []);
  res.json(feedbacks);
});

app.post('/api/feedback', (req, res) => {
  try {
    const feedbacks = readJsonFile<any[]>(FEEDBACK_DB, []);
    const { rating, comment, scam_type } = req.body;
    
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newFeedback = {
      timestamp: formattedTime,
      rating: Number(rating) || 5,
      comment: comment || '',
      scam_type: scam_type || 'Chưa phân loại'
    };

    feedbacks.push(newFeedback);
    writeJsonFile(FEEDBACK_DB, feedbacks);
    res.json({ success: true, feedback: newFeedback, total: feedbacks.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi gửi đánh giá' });
  }
});

// AI Analyze Endpoint with Gemini
app.post('/api/analyze', async (req, res) => {
  try {
    const { text, imageBase64, imageMimeType, userApiKey } = req.body;

    const apiKey = (userApiKey && userApiKey.trim().length >= 15 && !userApiKey.startsWith('your_'))
      ? userApiKey.trim()
      : (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey || apiKey.startsWith('your_') || apiKey.length < 15) {
      return res.status(400).json({
        error: 'Gemini API Key chưa được cung cấp hoặc không hợp lệ. Vui lòng lấy API Key miễn phí tại https://aistudio.google.com/app/apikey'
      });
    }

    if (!text && !imageBase64) {
      return res.status(400).json({
        error: 'Vui lòng cung cấp ít nhất 1 hình ảnh hoặc đoạn văn bản/đường link để phân tích.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = 
      "Bạn là chuyên gia hàng đầu về An ninh mạng và Phòng chống Lừa đảo Trực tuyến tại Việt Nam " +
      "(thuộc dự án ShieldAI Vietnam cho cuộc thi AIRiserVietnam #BuildwithGoogleAI). " +
      "Nhiệm vụ của bạn là phân tích kỹ lưỡng các bằng chứng lừa đảo đa phương thức (hình ảnh tin nhắn SMS/Zalo/Telegram, " +
      "hóa đơn chuyển tiền ngân hàng nghi giả mạo, mã QR nghi vấn, nội dung văn bản chat, hoặc đường link website). " +
      "Hãy nhận diện các dấu hiệu bất thường, địa chỉ URL giả mạo, văn phong đe dọa/thúc giục, giả danh ngân hàng/công an/thuế, " +
      "và các thủ thuật tâm lý nguy hiểm. " +
      "Bạn PHẢI trả về dữ liệu tuân thủ chính xác định dạng JSON theo đúng schema được yêu cầu.";

    const contents: any[] = [];

    if (imageBase64) {
      // Remove data URL prefix if present
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const mime = imageMimeType || 'image/png';
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: mime
        }
      });
    }

    if (text && text.trim()) {
      contents.push(text.trim());
    }

    const scamAnalysisSchema = {
      type: Type.OBJECT,
      properties: {
        risk_score: {
          type: Type.INTEGER,
          description: "Điểm rủi ro từ 0 (Hoàn toàn an toàn) đến 100 (Cực kỳ nguy hiểm)"
        },
        risk_level: {
          type: Type.STRING,
          description: "Cấp độ rủi ro: AN TOÀN, TRUNG BÌNH, CAO, hoặc CỰC KỲ NGUY HIỂM"
        },
        scam_type: {
          type: Type.STRING,
          description: "Loại hình lừa đảo nhận diện được (Ví dụ: Giả danh Ngân hàng, Fake Bill chuyển tiền, Mã QR độc hại, Bẫy tuyển cộng tác viên, Giả danh Công an/Thuế, Khác)"
        },
        red_flags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Các dấu hiệu vi phạm hoặc bất thường đáng ngờ cụ thể"
        },
        psychological_tricks: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Các thủ thuật thao túng tâm lý được sử dụng (ví dụ: tạo áp lực thời gian, giả danh quyền lực, đánh vào lòng tham)"
        },
        advice: {
          type: Type.STRING,
          description: "Lời khuyên phân tích chi tiết cho người dùng"
        },
        suggested_actions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Danh sách các hành động khẩn cấp người dùng cần làm ngay lập tức"
        }
      },
      required: [
        "risk_score",
        "risk_level",
        "scam_type",
        "red_flags",
        "psychological_tricks",
        "advice",
        "suggested_actions"
      ]
    };

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    let lastError = '';

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: scamAnalysisSchema,
            temperature: 0.2,
          }
        });

        const responseText = response.text || '';
        const parsedResult = JSON.parse(responseText);
        return res.json({ result: parsedResult });
      } catch (err: any) {
        console.error(`Failed with model ${model}:`, err.message);
        lastError = err.message || String(err);
      }
    }

    throw new Error(lastError || 'Không thể tạo phản hồi từ Gemini API');
  } catch (error: any) {
    console.error('API /analyze error:', error);
    res.status(500).json({
      error: error.message || 'Lỗi khi xử lý yêu cầu phân tích với Gemini AI'
    });
  }
});

// Start Server and mount Vite
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ ShieldAI Vietnam Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
