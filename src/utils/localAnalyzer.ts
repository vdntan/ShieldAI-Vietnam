import { ScamAnalysisResult } from '../types';

export function analyzeLocally(text?: string, hasImage?: boolean): ScamAnalysisResult {
  const content = (text || '').toLowerCase();
  const redFlags: string[] = [];
  const psychologicalTricks: string[] = [];
  const suggestedActions: string[] = [
    "TUYỆT ĐỐI KHÔNG ấn vào bất kỳ đường link nào gửi kèm.",
    "Không cung cấp Mật khẩu ngân hàng, Mã xác thực OTP hay số thẻ tín dụng cho bất kỳ ai.",
    "Báo cáo tin nhắn/cuộc gọi rác tới đầu số 156 hoặc 5656 của Cục An toàn Thông tin."
  ];

  let scamType = "Cảnh báo Lừa đảo Trực tuyến Nghi vấn";
  let riskScore = 75;
  let riskLevel = "CAO";

  // Check SMS / Bank Phishing
  if (
    content.includes('khoa') ||
    content.includes('vi pham') ||
    content.includes('xac thuc') ||
    content.includes('otp') ||
    content.includes('vietcombank') ||
    content.includes('techcombank') ||
    content.includes('mbbank') ||
    content.includes('bidv') ||
    content.includes('vcb') ||
    content.includes('dong vinh vien') ||
    content.includes('http') ||
    content.includes('.com') ||
    content.includes('.xyz') ||
    content.includes('.top')
  ) {
    scamType = "Giả danh Ngân hàng / SMS Brandname Phishing";
    riskScore = 95;
    riskLevel = "CỰC KỲ NGUY HIỂM";
    redFlags.push("Đường dẫn lạ không thuộc cổng thông tin chính thức của ngân hàng.");
    redFlags.push("Cảnh báo khóa tài khoản gấp gáp ép người dùng hành động tức thì.");
    redFlags.push("Yêu cầu nhập thông tin đăng nhập hoặc mã OTP bí mật.");
    psychologicalTricks.push("Gây hoảng sợ (Fear Appeal): Đe dọa khóa tài khoản vĩnh viễn.");
    psychologicalTricks.push("Tạo áp lực thời gian (Urgency): Giới hạn thời gian xác thực ngắn.");
    suggestedActions.push("Nếu đã lỡ nhập OTP/Mật khẩu, lập tức liên hệ hotline tổng đài ngân hàng để khóa thẻ/khóa dịch vụ ngay lập tức.");
  }
  // Check Fake Bill / Hóa đơn giả
  else if (
    content.includes('bill') ||
    content.includes('chuyen khoan') ||
    content.includes('thanh toan') ||
    content.includes('giao hang ngay') ||
    content.includes('da chuyen') ||
    hasImage
  ) {
    scamType = "Fake Bill Chuyển tiền / Hóa đơn Giả mạo";
    riskScore = 88;
    riskLevel = "CỰC KỲ NGUY HIỂM";
    redFlags.push("Hóa đơn hình ảnh có dấu hiệu chỉnh sửa số dư, mã giao dịch bất thường.");
    redFlags.push("Tài khoản người nhận chưa có biến động số dư thực tế trên ứng dụng ngân hàng.");
    psychologicalTricks.push("Tạo sự tin tưởng giả mạo bằng hình ảnh ủy nhiệm chi/bill chuyển tiền.");
    psychologicalTricks.push("Thúc ép giao hàng nhanh chóng khi tiền chưa vào tài khoản.");
    suggestedActions.push("CHỈ GIAO HÀNG khi tài khoản ngân hàng của bạn đã nhận được tiền thật (kiểm tra trên App chính thức).");
  }
  // Check CTV / Việc nhẹ lương cao
  else if (
    content.includes('ctv') ||
    content.includes('tuyen') ||
    content.includes('hoa hong') ||
    content.includes('shopee') ||
    content.includes('tiktok') ||
    content.includes('viec nhe') ||
    content.includes('kiem tien') ||
    content.includes('nap tien') ||
    content.includes('telegram')
  ) {
    scamType = "Bẫy Tuyển Cộng tác viên Online / Việc nhẹ lương cao";
    riskScore = 92;
    riskLevel = "CỰC KỲ NGUY HIỂM";
    redFlags.push("Mức thu nhập hứa hẹn quá cao so với công việc đơn giản.");
    redFlags.push("Yêu cầu nạp tiền, nạp cọc hoặc thực hiện nhiệm vụ thanh toán trước.");
    psychologicalTricks.push("Đánh vào lòng tham: Thả mồi nhỏ nhận hoa hồng ban đầu để lấy lòng tin.");
    psychologicalTricks.push("Hiệu ứng chi phí chìm (Sunk Cost): Ép nạp thêm tiền để giải ngân.");
    suggestedActions.push("Ngừng nạp thêm bất kỳ khoản tiền nào cho đối tượng với bất kỳ lý do gì.");
  }
  // Check Giả danh Công an / Cơ quan chức năng
  else if (
    content.includes('cong an') ||
    content.includes('toa an') ||
    content.includes('vien kiem sat') ||
    content.includes('dieu tra') ||
    content.includes('thue') ||
    content.includes('vneid') ||
    content.includes('dinh danh')
  ) {
    scamType = "Giả danh Cơ quan Công an / Cơ quan Nhà nước";
    riskScore = 96;
    riskLevel = "CỰC KỲ NGUY HIỂM";
    redFlags.push("Cơ quan Công an, Tòa án KHÔNG làm việc hoặc yêu cầu chuyển tiền qua điện thoại/Zalo.");
    redFlags.push("Yêu cầu cài đặt ứng dụng file .apk lạ từ đường link ngoài Google Play.");
    psychologicalTricks.push("Thao túng tâm lý bằng quyền lực (Authority Bias) và đe dọa khởi tố/bắt giữ.");
    suggestedActions.push("Chủ động đến trực tiếp trụ sở Công an phường/xã gần nhất để xác minh thông tin.");
  } else {
    redFlags.push("Nội dung có cấu trúc bất thường hoặc thiếu thông tin định danh rõ ràng.");
    redFlags.push("Có yếu tố kêu gọi bấm vào liên kết hoặc tương tác riêng tư.");
    psychologicalTricks.push("Tạo sự tò mò hoặc thúc giục phản hồi.");
  }

  const advice = `Dựa trên dữ liệu nhận diện mẫu lừa đảo trực tuyến tại Việt Nam, nội dung này có điểm rủi ro ${riskScore}/100. Đây là thủ đoạn thuộc nhóm "${scamType}". Hãy cẩn trọng tối đa và tuân thủ các bước khuyến nghị của ShieldAI.`;

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    scam_type: scamType,
    red_flags: redFlags,
    psychological_tricks: psychologicalTricks,
    advice,
    suggested_actions: suggestedActions
  };
}
