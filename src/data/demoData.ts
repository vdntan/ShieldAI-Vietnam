import { ScamAnalysisResult } from '../types';

export const DEMO_SCENARIOS: Record<string, { label: string; text: string; result: ScamAnalysisResult }> = {
  fake_sms: {
    label: "📱 Fake SMS Ngân hàng (SMS Brandname)",
    text: "THONG BAO: Tai khoan Vietcombank cua Quy khach bi khoa do vi pham bao mat. Vui long truy cap http://giamao-vcb-xacthuc.com de xac thuc lai trong 24 gio, neu khong tai khoan se bi dong vinh vien.",
    result: {
      risk_score: 95,
      risk_level: "CỰC KỲ NGUY HIỂM",
      scam_type: "Giả danh Ngân hàng / SMS Brandname Giả mạo",
      red_flags: [
        "Đường link chứa tên miền lạ không phải trang chính thức (giamao-vcb-xacthuc.com thay vì vietcombank.com.vn).",
        "Nội dung hù dọa khóa tài khoản khẩn cấp trong vòng 24 giờ để ép người dùng bấm link vội vã.",
        "Yêu cầu nhập thông tin mật Tên đăng nhập, Mật khẩu và mã OTP ngân hàng."
      ],
      psychological_tricks: [
        "Gây hoảng sợ (Fear Appeals): Tác động vào tâm lý sợ bị mất tiền hoặc khóa tài khoản.",
        "Thúc giục thời gian (Urgency Trick): Đặt hạn chót gấp gáp để nạn nhân không kịp suy nghĩ hay kiểm tra lại."
      ],
      advice: "Đây là tin nhắn lừa đảo mạo danh ngân hàng điển hình nhằm đánh cắp thông tin đăng nhập và mã OTP để chiếm đoạt toàn bộ tiền trong tài khoản của bạn. Ngân hàng KHÔNG BAO GIỜ gửi tin nhắn kèm link yêu cầu nhập mật khẩu/OTP.",
      suggested_actions: [
        "TUYỆT ĐỐI KHÔNG ấn vào đường link trong tin nhắn.",
        "Không cung cấp mã OTP, Mật khẩu VCB Digibank cho bất kỳ ai.",
        "Báo cáo tin nhắn rác/lừa đảo tới tổng đài 156 hoặc 5656.",
        "Nếu đã lỡ bấm link và nhập thông tin, lập tức gọi hotline ngân hàng để khóa tài khoản khẩn cấp."
      ]
    }
  },
  fake_bill: {
    label: "💳 Fake Bill Chuyển khoản Ngân hàng",
    text: "Hóa đơn chuyển khoản Techcombank số tiền 15.500.000 VNĐ cho tài khoản nhận NGUYEN VAN A. Trạng thái: Thành công. Người mua yêu cầu giao hàng ngay lập tức vì đã thanh toán xong.",
    result: {
      risk_score: 88,
      risk_level: "CỰC KỲ NGUY HIỂM",
      scam_type: "Fake Bill Chuyển tiền Ngân hàng (Hóa đơn giả)",
      red_flags: [
        "Phông chữ số tiền và thời gian không đồng nhất, xuất hiện dấu hiệu chỉnh sửa Photoshop/Canva.",
        "Tài khoản nhận chưa hề có thông báo biến động số dư thực tế từ ứng dụng ngân hàng chính thức.",
        "Mã giao dịch có cấu trúc bất thường, không khớp định dạng chuẩn của ngân hàng phát hành."
      ],
      psychological_tricks: [
        "Tạo niềm tin giả: Gửi hình ảnh giao dịch thành công để thúc ép đối phương giao hàng hoặc chuyển khoản lại.",
        "Tạo áp lực thời gian: Giả vờ đang vội để chủ gian hàng không kịp kiểm tra số dư thực tế."
      ],
      advice: "Hình ảnh hóa đơn chuyển tiền này có nhiều dấu hiệu bị làm giả bằng công cụ Photoshop hoặc trang web tạo bill rác. Đối tượng đang cố tình lừa bạn giao hàng hoặc chuyển tiền lại trước khi bạn nhận được tiền thật.",
      suggested_actions: [
        "CHỈ GIAO HÀNG/ĐẢM BẢO khi ứng dụng Ngân hàng của bạn báo ĐÃ NHẬN TIỀN (Biến động số dư).",
        "Không tin vào bất kỳ hình ảnh chụp màn hình bill chuyển khoản nào từ phía người mua.",
        "Kiểm tra lịch sử giao dịch trực tiếp trên App Ngân hàng chính thức."
      ]
    }
  },
  ctv: {
    label: "💼 Bẫy Tuyển CTV Việc nhẹ lương cao",
    text: "Tuyển CTV xử lý đơn hàng Shopee/TikTok làm việc tại nhà, thu nhập 500k - 2 triệu/ngày, thanh toán theo ngày. Không cần kinh nghiệm, chỉ cần điện thoại có kết nối internet. Nhắn tin Zalo để nhận việc ngay!",
    result: {
      risk_score: 90,
      risk_level: "CỰC KỲ NGUY HIỂM",
      scam_type: "Bẫy Tuyển Cộng tác viên Online / Việc nhẹ lương cao",
      red_flags: [
        "Hứa hẹn thu nhập 500k - 2 triệu/ngày chỉ bằng cách thả tim video TikTok hoặc chốt đơn Canva.",
        "Yêu cầu nạp tiền cọc hoặc nạp vốn trước để nhận hoa hồng cao.",
        "Giao dịch qua tài khoản cá nhân, không có hợp đồng lao động hay thông tin công ty rõ ràng."
      ],
      psychological_tricks: [
        "Đánh vào lòng tham: Cho ăn mồi nhỏ (cho rút vài chục nghìn đầu tiên) để tạo niềm tin rồi dụ nạp số tiền lớn.",
        "Thủ thuật đắm chìm tài sản (Sunk Cost Fallacy): Ép nạn nhân nạp thêm tiền để 'giải khống' số tiền đã nạp trước đó."
      ],
      advice: "Đây là mô hình lừa đảo tuyển CTV đa cấp qua mạng. Ban đầu đối tượng sẽ trả thưởng vài chục nghìn để tạo uy tín, sau đó yêu cầu nạp nhiệm vụ hàng chục triệu rồi khóa tài khoản chiếm đoạt.",
      suggested_actions: [
        "Ngừng ngay việc chuyển thêm tiền cho đối tượng với bất kỳ lý do gì (phí giải ngân, phí xác minh).",
        "Chụp lại toàn bộ tin nhắn, tài khoản ngân hàng của kẻ lừa đảo và trình báo Công an.",
        "Cảnh báo người thân không tham gia các công việc nhẹ lương cao nạp tiền nhận hoa hồng."
      ]
    }
  }
};
