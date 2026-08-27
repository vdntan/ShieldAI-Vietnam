export interface EmergencyContact {
  id: string;
  name: string;
  organization: string;
  hotline: string;
  description: string;
  badge: string;
  type: 'national' | 'bank';
  website?: string;
}

export const NATIONAL_HOTLINES: EmergencyContact[] = [
  {
    id: 'nat-1',
    name: 'Tổng đài Tiếp nhận Phản ánh Tin nhắn rác & Cuộc gọi lừa đảo',
    organization: 'Cục An toàn Thông tin - Bộ TT&TT',
    hotline: '156',
    description: 'Gọi miễn phí hoặc soạn tin nhắn [Nội dung lừa đảo] gửi 156 (hoặc 5656)',
    badge: 'Miễn phí 24/7',
    type: 'national',
    website: 'https://chongthurac.vn'
  },
  {
    id: 'nat-2',
    name: 'Cục An ninh mạng & Phòng chống tội phạm công nghệ cao (A05)',
    organization: 'Bộ Công an',
    hotline: '0692348560',
    description: 'Tiếp nhận tố giác tội phạm lừa đảo công nghệ cao, chiếm đoạt tài sản online',
    badge: 'Bộ Công an',
    type: 'national'
  },
  {
    id: 'nat-3',
    name: 'Cổng Thông tin Tín nhiệm Mạng Quốc gia (NCSC)',
    organization: 'Trung tâm Giám sát an toàn không gian mạng quốc gia',
    hotline: '02432096789',
    description: 'Báo cáo website lừa đảo, mã độc, lừa đảo trực tuyến tại cancanhbao.ncsc.gov.vn',
    badge: 'NCSC',
    type: 'national',
    website: 'https://canhbao.ncsc.gov.vn'
  },
  {
    id: 'nat-4',
    name: 'Đường dây nóng Cảnh sát phản ứng nhanh',
    organization: 'Bộ Công an',
    hotline: '113',
    description: 'Gọi trong trường hợp khẩn cấp, đối tượng đe dọa trực tiếp hoặc cần can thiệp gấp',
    badge: 'Khẩn cấp 113',
    type: 'national'
  }
];

export const BANK_HOTLINES: EmergencyContact[] = [
  {
    id: 'bank-vcb',
    name: 'Vietcombank',
    organization: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    hotline: '1900545413',
    description: 'Nhấn phím 1 để yêu cầu KHÓA THẺ & DỊCH VỤ VCB Digibank khẩn cấp',
    badge: 'Khóa thẻ 24/7',
    type: 'bank'
  },
  {
    id: 'bank-tcb',
    name: 'Techcombank',
    organization: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    hotline: '1800588822',
    description: 'Tổng đài miễn cước, hỗ trợ khóa tài khoản và thẻ tức thì',
    badge: 'Miễn cước',
    type: 'bank'
  },
  {
    id: 'bank-mbb',
    name: 'MBBank',
    organization: 'Ngân hàng TMCP Quân đội',
    hotline: '1900545426',
    description: 'Khóa tài khoản và tính năng thanh toán thẻ MB tức thì',
    badge: '24/7',
    type: 'bank'
  },
  {
    id: 'bank-bidv',
    name: 'BIDV',
    organization: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    hotline: '19009247',
    description: 'Tổng đài CSKH và tiếp nhận xử lý rủi ro giao dịch gian lận',
    badge: '24/7',
    type: 'bank'
  },
  {
    id: 'bank-ctg',
    name: 'VietinBank',
    organization: 'Ngân hàng TMCP Công thương Việt Nam',
    hotline: '1900558868',
    description: 'Khóa thẻ và dịch vụ ngân hàng điện tử VietinBank iPay',
    badge: '24/7',
    type: 'bank'
  },
  {
    id: 'bank-agr',
    name: 'Agribank',
    organization: 'Ngân hàng Nông nghiệp & Phát triển Nông thôn',
    hotline: '1900558818',
    description: 'Tiếp nhận hỗ trợ khẩn cấp khách hàng Agribank trên toàn quốc',
    badge: '24/7',
    type: 'bank'
  },
  {
    id: 'bank-acb',
    name: 'ACB',
    organization: 'Ngân hàng TMCP Á Châu',
    hotline: '1900545486',
    description: 'Khóa thẻ và tài khoản ACB ONE khẩn cấp',
    badge: '24/7',
    type: 'bank'
  },
  {
    id: 'bank-vpb',
    name: 'VPBank',
    organization: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    hotline: '1900545415',
    description: 'Khóa thẻ VPBank NEO và hỗ trợ tra soát giao dịch nghi vấn',
    badge: '24/7',
    type: 'bank'
  }
];
