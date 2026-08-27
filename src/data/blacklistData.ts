export interface BlacklistItem {
  id: string;
  type: 'bank' | 'phone' | 'domain';
  value: string;
  ownerName?: string;
  bankName?: string;
  reportCount: number;
  scamCategory: string;
  description: string;
  dateReported: string;
  severity: 'high' | 'critical';
}

export const INITIAL_BLACKLIST: BlacklistItem[] = [
  {
    id: 'bl-1',
    type: 'bank',
    value: '102839284729',
    ownerName: 'NGUYEN VAN TIEN',
    bankName: 'MB Bank',
    reportCount: 42,
    scamCategory: 'Tuyển CTV Online làm nhiệm vụ nạp tiền',
    description: 'Dụ dỗ nhận hoa hồng Shopee/TikTok, yêu cầu chuyển khoản cọc.',
    dateReported: '2025-02-20',
    severity: 'critical'
  },
  {
    id: 'bl-2',
    type: 'bank',
    value: '098877665544',
    ownerName: 'LE THI MAI',
    bankName: 'Vietcombank',
    reportCount: 28,
    scamCategory: 'Giả mạo nhân viên hoàn tiền vé máy bay/tour du lịch',
    description: 'Yêu cầu mở đường link và chuyển phí giải ngân tài khoản treo.',
    dateReported: '2025-02-18',
    severity: 'critical'
  },
  {
    id: 'bl-3',
    type: 'bank',
    value: '9704220011223344',
    ownerName: 'TRAN QUOC HUNG',
    bankName: 'Techcombank',
    reportCount: 35,
    scamCategory: 'Bẫy đầu tư sàn tiền ảo / Chứng khoán quốc tế',
    description: 'Dụ nạp tiền vào sàn giả mạo rồi khóa rút tiền.',
    dateReported: '2025-02-15',
    severity: 'critical'
  },
  {
    id: 'bl-4',
    type: 'phone',
    value: '02499988776',
    reportCount: 56,
    scamCategory: 'Giả danh Cơ quan Công an / Viện kiểm sát',
    description: 'Gọi điện thông báo dính líu đến đường dây rửa tiền, đe dọa bắt giữ.',
    dateReported: '2025-02-22',
    severity: 'critical'
  },
  {
    id: 'bl-5',
    type: 'phone',
    value: '02888899123',
    reportCount: 39,
    scamCategory: 'Giả danh Cán bộ Thuế / Hướng dẫn cài VNeID',
    description: 'Gửi link tải file .apk độc hại chiếm quyền điều khiển điện thoại.',
    dateReported: '2025-02-24',
    severity: 'critical'
  },
  {
    id: 'bl-6',
    type: 'phone',
    value: '0598823145',
    reportCount: 21,
    scamCategory: 'Thông báo trúng thưởng quà tặng tri ân tri ân khách hàng',
    description: 'Yêu cầu thanh toán trước phí vận chuyển hàng hiệu giả.',
    dateReported: '2025-02-19',
    severity: 'high'
  },
  {
    id: 'bl-7',
    type: 'domain',
    value: 'vietcombank-smart-verify.xyz',
    reportCount: 78,
    scamCategory: 'Website Giả mạo Ngân hàng (Phishing)',
    description: 'Trang web nhái giao diện Vietcombank đánh cắp Tên đăng nhập và OTP.',
    dateReported: '2025-02-25',
    severity: 'critical'
  },
  {
    id: 'bl-8',
    type: 'domain',
    value: 'dichvucong-vneid-gov.top',
    reportCount: 64,
    scamCategory: 'Website Giả mạo Cổng Dịch Vụ Công',
    description: 'Chứa mã độc Trojan cài đặt file APK nhằm chiếm đoạt tài khoản ngân hàng.',
    dateReported: '2025-02-21',
    severity: 'critical'
  },
  {
    id: 'bl-9',
    type: 'domain',
    value: 'tra-cuu-phat-nguoi-online.com',
    reportCount: 19,
    scamCategory: 'Lừa nộp phạt giao thông online',
    description: 'Thu thập thông tin số tài khoản và ép chuyển tiền nộp phạt nguội.',
    dateReported: '2025-02-17',
    severity: 'high'
  }
];
