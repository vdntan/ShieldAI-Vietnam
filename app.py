import os
import json
import datetime
from PIL import Image
import io
import streamlit as st
from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# Set Streamlit Page Config with custom logo if exists
LOGO_PATH = "logo.png"
page_icon_val = "🛡️"
if os.path.exists(LOGO_PATH):
    try:
        page_icon_val = Image.open(LOGO_PATH)
    except Exception:
        page_icon_val = "🛡️"

st.set_page_config(
    page_title="ShieldAI Vietnam - Cyber Fraud & Scam Defense",
    page_icon=page_icon_val,
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Professional Cybersecurity Dashboard Theme
CUSTOM_CSS = """
<style>
    /* Main Background & Typography */
    .stApp {
        background-color: #0b0f19;
        color: #e2e8f0;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    /* Header Styling */
    .main-header {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .header-title {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #38bdf8 0%, #818cf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }
    .header-subtitle {
        color: #94a3b8;
        font-size: 1.05rem;
        margin-top: 6px;
    }
    
    /* Card Container Styles */
    .sec-card {
        background-color: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
    }
    
    /* Risk Badges */
    .risk-badge {
        display: inline-block;
        padding: 8px 18px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 1.1rem;
        text-align: center;
        letter-spacing: 0.5px;
    }
    .risk-safe {
        background-color: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid #10b981;
    }
    .risk-medium {
        background-color: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
        border: 1px solid #f59e0b;
    }
    .risk-high {
        background-color: rgba(249, 115, 22, 0.2);
        color: #fb923c;
        border: 1px solid #f97316;
    }
    .risk-critical {
        background-color: rgba(239, 68, 68, 0.25);
        color: #f87171;
        border: 1px solid #ef4444;
        animation: pulse 2s infinite;
    }

    /* List item boxes */
    .red-flag-item {
        background-color: rgba(239, 68, 68, 0.1);
        border-left: 4px solid #ef4444;
        padding: 10px 14px;
        border-radius: 4px;
        margin-bottom: 8px;
        color: #fca5a5;
    }
    .trick-item {
        background-color: rgba(168, 85, 247, 0.1);
        border-left: 4px solid #a855f7;
        padding: 10px 14px;
        border-radius: 4px;
        margin-bottom: 8px;
        color: #e9d5ff;
    }
    .action-item {
        background-color: rgba(56, 189, 248, 0.1);
        border-left: 4px solid #38bdf8;
        padding: 10px 14px;
        border-radius: 4px;
        margin-bottom: 8px;
        color: #bae6fd;
    }
    
    /* Stat Counter Box */
    .stat-box {
        background-color: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 12px;
        text-align: center;
    }
    .stat-number {
        font-size: 1.6rem;
        font-weight: 700;
        color: #38bdf8;
    }
    .stat-label {
        font-size: 0.85rem;
        color: #94a3b8;
    }

    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        background-color: #1e293b;
        border-radius: 8px 8px 0 0;
        color: #94a3b8;
        border: 1px solid #334155;
    }
    .stTabs [aria-selected="true"] {
        background-color: #38bdf8 !important;
        color: #0f172a !important;
        font-weight: bold;
    }
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# ----------------------------------------------------
# Pydantic Schema for Gemini Structured Output
# ----------------------------------------------------
class ScamAnalysisResult(BaseModel):
    risk_score: int = Field(description="Điểm rủi ro từ 0 (Hoàn toàn an toàn) đến 100 (Cực kỳ nguy hiểm)")
    risk_level: str = Field(description="Cấp độ rủi ro: AN TOÀN, TRUNG BÌNH, CAO, hoặc CỰC KỲ NGUY HIỂM")
    scam_type: str = Field(description="Loại hình lừa đảo nhận diện được (Ví dụ: Giả danh Ngân hàng, Fake Bill chuyển tiền, Mã QR độc hại, Bẫy tuyển cộng tác viên, Giả danh Công an/Thuế, Khác)")
    red_flags: list[str] = Field(description="Các dấu hiệu vi phạm hoặc bất thường đáng ngờ cụ thể")
    psychological_tricks: list[str] = Field(description="Các thủ thuật thao túng tâm lý được sử dụng (ví dụ: tạo áp lực thời gian, giả danh quyền lực, đánh vào lòng tham)")
    advice: str = Field(description="Lời khuyên phân tích chi tiết cho người dùng")
    suggested_actions: list[str] = Field(description="Danh sách các hành động khẩn cấp người dùng cần làm ngay lập tức")

# Database File Paths for Community Traction
COMMUNITY_DB = "community_reports.json"
FEEDBACK_DB = "user_feedback.json"

def load_json_db(file_path):
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_json_db(file_path, data):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def is_valid_gemini_api_key(key: str) -> bool:
    if not key or key.strip().startswith("your_") or len(key.strip()) < 15:
        return False
    return True

# ----------------------------------------------------
# Demo Data Generator for Testing without API Key
# ----------------------------------------------------
def get_demo_analysis_result(sample_type="fake_sms"):
    if sample_type == "fake_sms":
        return {
            "risk_score": 95,
            "risk_level": "CỰC KỲ NGUY HIỂM",
            "scam_type": "Giả danh Ngân hàng / SMS Brandname Giả mạo",
            "red_flags": [
                "Đường link chứa tên miền lạ không phải trang chính thức (giamao-vcb-xacthuc.com thay vì vietcombank.com.vn).",
                "Nội dung hù dọa khóa tài khoản khẩn cấp trong vòng 24 giờ để ép người dùng bấm link vội vã.",
                "Yêu cầu nhập thông tin mật Tên đăng nhập, Mật khẩu và mã OTP ngân hàng."
            ],
            "psychological_tricks": [
                "Gây hoảng sợ (Fear Appeals): Tác động vào tâm lý sợ bị mất tiền hoặc khóa tài khoản.",
                "Thúc giục thời gian (Urgency Trick): Đặt hạn chót gấp gáp để nạn nhân không kịp suy nghĩ hay kiểm tra lại."
            ],
            "advice": "Đây là tin nhắn lừa đảo mạo danh ngân hàng điển hình nhằm đánh cắp thông tin đăng nhập và mã OTP để chiếm đoạt toàn bộ tiền trong tài khoản của bạn. Ngân hàng KHÔNG BAO GIỜ gửi tin nhắn kèm link yêu cầu nhập mật khẩu/OTP.",
            "suggested_actions": [
                "TUYỆT ĐỐI KHÔNG ấn vào đường link trong tin nhắn.",
                "Không cung cấp mã OTP, Mật khẩu VCB Digibank cho bất kỳ ai.",
                "Báo cáo tin nhắn rác/lừa đảo tới tổng đài 156 hoặc 5656.",
                "Nếu đã lỡ bấm link và nhập thông tin, lập tức gọi hotline ngân hàng để khóa tài khoản khẩn cấp."
            ]
        }
    elif sample_type == "fake_bill":
        return {
            "risk_score": 88,
            "risk_level": "CỰC KỲ NGUY HIỂM",
            "scam_type": "Fake Bill Chuyển tiền Ngân hàng (Hóa đơn giả)",
            "red_flags": [
                "Phông chữ số tiền và thời gian không đồng nhất, xuất hiện dấu hiệu chỉnh sửa Photoshop/Canva.",
                "Tài khoản nhận chưa hề có thông báo biến động số dư thực tế từ ứng dụng ngân hàng chính thức.",
                "Mã giao dịch có cấu trúc bất thường, không khớp định dạng chuẩn của ngân hàng phát hành."
            ],
            "psychological_tricks": [
                "Tạo niềm tin giả: Gửi hình ảnh giao dịch thành công để thúc ép đối phương giao hàng hoặc chuyển khoản lại.",
                "Tạo áp lực thời gian: Giả vờ đang vội để chủ gian hàng không kịp kiểm tra số dư thực tế."
            ],
            "advice": "Hình ảnh hóa đơn chuyển tiền này có nhiều dấu hiệu bị làm giả bằng công cụ Photoshop hoặc trang web tạo bill rác. Đối tượng đang cố tình lừa bạn giao hàng hoặc chuyển tiền lại trước khi bạn nhận được tiền thật.",
            "suggested_actions": [
                "CHỈ GIAO HÀNG/ĐẢM BẢO khi ứng dụng Ngân hàng của bạn báo ĐÃ NHẬN TIỀN (Biến động số dư).",
                "Không tin vào bất kỳ hình ảnh chụp màn hình bill chuyển khoản nào từ phía người mua.",
                "Kiểm tra lịch sử giao dịch trực tiếp trên App Ngân hàng chính thức."
            ]
        }
    else:
        return {
            "risk_score": 90,
            "risk_level": "CỰC KỲ NGUY HIỂM",
            "scam_type": "Bẫy Tuyển Cộng tác viên Online / Việc nhẹ lương cao",
            "red_flags": [
                "Hứa hẹn thu nhập 500k - 2 triệu/ngày chỉ bằng cách thả tim video TikTok hoặc chốt đơn Canva.",
                "Yêu cầu nạp tiền cọc hoặc nạp vốn trước để nhận hoa hồng cao.",
                "Giao dịch qua tài khoản cá nhân, không có hợp đồng lao động hay thông tin công ty rõ ràng."
            ],
            "psychological_tricks": [
                "Đánh vào lòng tham: Cho ăn mồi nhỏ (cho rút vài chục nghìn đầu tiên) để tạo niềm tin rồi dụ nạp số tiền lớn.",
                "Thủ thuật đắm chìm tài sản (Sunk Cost Fallacy): Ép nạn nhân nạp thêm tiền để 'giải khống' số tiền đã nạp trước đó."
            ],
            "advice": "Đây là mô hình lừa đảo tuyển CTV đa cấp qua mạng. Ban đầu đối tượng sẽ trả thưởng vài chục nghìn để tạo uy tín, sau đó yêu cầu nạp nhiệm vụ hàng chục triệu rồi khóa tài khoản chiếm đoạt.",
            "suggested_actions": [
                "Ngừng ngay việc chuyển thêm tiền cho đối tượng với bất kỳ lý do gì (phí giải ngân, phí xác minh).",
                "Chụp lại toàn bộ tin nhắn, tài khoản ngân hàng của kẻ lừa đảo và trình báo Công an.",
                "Cảnh báo người thân không tham gia các công việc nhẹ lương cao nạp tiền nhận hoa hồng."
            ]
        }

# ----------------------------------------------------
# Gemini AI Multimodal Analysis Core Engine
# ----------------------------------------------------
def analyze_content_with_gemini(api_key: str, text_prompt: str = None, image_file = None):
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        return None, "Chưa cài đặt thư viện google-genai. Vui lòng kiểm tra requirements.txt"

    if not api_key or not is_valid_gemini_api_key(api_key):
        return None, (
            "⚠️ **Gemini API Key chưa hợp lệ!**\n\n"
            "📌 **Cách khắc phục nhanh:**\n"
            "1. Lấy API Key miễn phí từ Google tại: [Google AI Studio](https://aistudio.google.com/app/apikey)\n"
            "2. Nhập API Key vào ô **Gemini API Key** tại thanh bên (Sidebar).\n"
            "3. Hoặc bấm nút **🧪 Chạy thử Dữ liệu Mẫu (Demo)** ở thanh bên để xem demo tức thì!"
        )

    try:
        client = genai.Client(api_key=api_key.strip())
    except Exception as e:
        return None, f"Lỗi khởi tạo Gemini Client: {str(e)}"

    contents = []

    if image_file is not None:
        try:
            image_bytes = image_file.getvalue()
            mime_type = image_file.type if hasattr(image_file, 'type') and image_file.type else "image/png"
            contents.append(
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type
                )
            )
        except Exception as img_err:
            return None, f"Lỗi xử lý hình ảnh: {str(img_err)}"

    if text_prompt and text_prompt.strip():
        contents.append(text_prompt.strip())

    if not contents:
        return None, "Vui lòng cung cấp ít nhất 1 hình ảnh hoặc đoạn văn bản/đường link để phân tích."

    system_instruction = (
        "Bạn là chuyên gia hàng đầu về An ninh mạng và Phòng chống Lừa đảo Trực tuyến tại Việt Nam "
        "(thuộc dự án ShieldAI Vietnam cho cuộc thi AIRiserVietnam #BuildwithGoogleAI). "
        "Nhiệm vụ của bạn là phân tích kỹ lưỡng các bằng chứng lừa đảo đa phương thức (hình ảnh tin nhắn SMS/Zalo/Telegram, "
        "hóa đơn chuyển tiền ngân hàng nghi giả mạo, mã QR nghi vấn, nội dung văn bản chat, hoặc đường link website). "
        "Hãy nhận diện các dấu hiệu bất thường, địa chỉ URL giả mạo, văn phong đe dọa/thúc giục, giả danh ngân hàng/công an/thuế, "
        "và các thủ thuật tâm lý nguy hiểm. "
        "Bạn PHẢI trả về dữ liệu tuân thủ chính xác định dạng JSON theo đúng schema được yêu cầu."
    )

    models_to_try = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash"]
    last_error = ""

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=ScamAnalysisResult,
                    temperature=0.2,
                )
            )
            
            # Extract JSON
            response_text = response.text
            data_dict = json.loads(response_text)
            return data_dict, None
        except Exception as err:
            err_str = str(err)
            if "API_KEY_INVALID" in err_str or "API key not valid" in err_str:
                return None, (
                    "❌ **API Key không hợp lệ!** (Google API phản hồi lỗi 400 INVALID_ARGUMENT).\n\n"
                    "👉 **Hướng dẫn sửa lỗi:**\n"
                    "1. Truy cập [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) để tạo khóa mới.\n"
                    "2. Nhập API Key chính xác vào ô Sidebar bên trái.\n"
                    "3. Bạn cũng có thể dùng nút **🧪 Dùng Dữ liệu Mẫu (Demo)** để test ngay tính năng!"
                )
            last_error = err_str
            continue

    return None, f"Không thể phân tích qua Gemini API (Đã thử {', '.join(models_to_try)}): {last_error}"


# ----------------------------------------------------
# UI Layout Definition
# ----------------------------------------------------

# Sidebar Configuration & Traction Display
with st.sidebar:
    if os.path.exists(LOGO_PATH):
        st.image(LOGO_PATH, use_container_width=True)
    else:
        st.image("https://img.icons8.com/color/96/shield-with-cinch.png", width=70)
        
    st.caption("🚀 AIRiserVietnam #BuildwithGoogleAI")
    
    st.markdown("---")
    st.subheader("🔑 Cấu hình API Key")
    
    env_api_key = os.getenv("GEMINI_API_KEY", "")
    if env_api_key.startswith("your_") or len(env_api_key) < 15:
        env_api_key = ""
        
    api_key_input = st.text_input(
        "Gemini API Key",
        value=env_api_key,
        type="password",
        help="Lấy API Key miễn phí tại https://aistudio.google.com/app/apikey"
    )
    
    active_api_key = api_key_input if api_key_input else env_api_key
    
    if is_valid_gemini_api_key(active_api_key):
        st.success("✅ Đã kết nối Gemini API Key")
    else:
        st.warning("⚠️ Chưa nhập Gemini API Key")
        st.markdown("🔗 [Lấy API Key miễn phí](https://aistudio.google.com/app/apikey)")
        
    st.markdown("---")
    st.subheader("🧪 Chế độ Trải nghiệm Mẫu")
    demo_choice = st.selectbox(
        "Chọn kịch bản lừa đảo mẫu:",
        [
            "📱 Fake SMS Ngân hàng (SMS Brandname)",
            "💳 Fake Bill Chuyển khoản Ngân hàng",
            "💼 Bẫy Tuyển CTV Việc nhẹ lương cao"
        ]
    )
    if st.button("🚀 Nạp Dữ liệu Mẫu Phân tích Ngay", use_container_width=True):
        sample_key = "fake_sms"
        if "Bill" in demo_choice:
            sample_key = "fake_bill"
        elif "CTV" in demo_choice:
            sample_key = "ctv"
        st.session_state['analysis_result'] = get_demo_analysis_result(sample_key)
        st.session_state['analyzed_text'] = f"Mẫu demo: {demo_choice}"
        st.session_state['has_image'] = False
        st.rerun()

    st.markdown("---")
    st.subheader("📈 CSDL & Traction Cộng đồng")
    
    reports = load_json_db(COMMUNITY_DB)
    feedbacks = load_json_db(FEEDBACK_DB)
    
    col_s1, col_s2 = st.columns(2)
    with col_s1:
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-number">{len(reports)}</div>
            <div class="stat-label">Mẫu báo cáo</div>
        </div>
        """, unsafe_allow_html=True)
    with col_s2:
        avg_rating = "5.0⭐" if not feedbacks else f"{sum([f.get('rating', 5) for f in feedbacks])/len(feedbacks):.1f}⭐"
        st.markdown(f"""
        <div class="stat-box">
            <div class="stat-number">{avg_rating}</div>
            <div class="stat-label">Đánh giá AI</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("---")
    st.markdown("""
    **Về dự án ShieldAI Vietnam:**
    - ⚡ **AI Core**: Google Gemini Multimodal
    - 🔒 **Công nghệ**: Structured JSON Outputs & Pydantic
    - 🎯 **Mục tiêu**: Bảo vệ người dân Việt Nam trước các thủ đoạn lừa đảo công nghệ cao.
    """)

# Main Header Banner with Custom Logo Branding
if os.path.exists(LOGO_PATH):
    col_logo, col_head = st.columns([1, 4], gap="medium")
    with col_logo:
        st.image(LOGO_PATH, use_container_width=True)
    with col_head:
        st.markdown("""
        <div class="main-header" style="margin-bottom: 0;">
            <h1 class="header-title">ShieldAI Vietnam — Phân tích & Phòng chống Lừa đảo</h1>
            <div class="header-subtitle">Hệ thống Trí tuệ Nhân tạo Đa phương thức (Multimodal) phân tích Tin nhắn, Ảnh chụp màn hình, Fake Bill & Link độc hại với Google Gemini AI</div>
        </div>
        """, unsafe_allow_html=True)
else:
    st.markdown("""
    <div class="main-header">
        <h1 class="header-title">🛡️ ShieldAI Vietnam — Hệ thống Trí tuệ Nhân tạo Phòng chống Lừa đảo</h1>
        <div class="header-subtitle">Đa phương thức (Multimodal) phân tích Tin nhắn, Ảnh chụp màn hình, Fake Bill & Đường link độc hại với Google Gemini AI</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# 2-Column Dashboard Layout
col_left, col_right = st.columns([1, 1], gap="large")

# ----------------------------------------------------
# LEFT COLUMN: Data Input & Multimodal Upload
# ----------------------------------------------------
with col_left:
    st.subheader("📥 1. Tải lên Bằng chứng Nghi vấn")
    
    tab_img, tab_txt = st.tabs(["📷 Upload Ảnh (Tin nhắn / Bill / QR)", "📝 Nhập Văn bản / Link Website"])
    
    uploaded_image = None
    input_text = ""
    
    with tab_img:
        st.write("Tải lên ảnh chụp màn hình tin nhắn Zalo/SMS/Telegram, hóa đơn chuyển tiền ngân hàng nghi làm giả, hoặc mã QR nghi vấn:")
        uploaded_image = st.file_uploader(
            "Chọn file ảnh (PNG, JPG, JPEG, WEBP)",
            type=["png", "jpg", "jpeg", "webp"],
            key="img_uploader"
        )
        if uploaded_image:
            st.image(uploaded_image, caption="Ảnh bằng chứng đã tải lên", use_container_width=True)
            
    with tab_txt:
        input_text = st.text_area(
            "Dán nội dung tin nhắn, Email, hoặc Đường link (URL) nghi ngờ vào đây:",
            placeholder="Ví dụ: 'THONG BAO: Tai khoan Vietcombank cua quy khach bi khoa. Vui long truy cap http://giamao-vcb.com de xac thuc ngay...'",
            height=180,
            key="text_input"
        )
        
    st.markdown("<br>", unsafe_allow_html=True)
    btn_analyze = st.button(
        "🔍 PHÂN TÍCH RỦI RO NGAY VỚI GEMINI AI",
        type="primary",
        use_container_width=True
    )

# ----------------------------------------------------
# RIGHT COLUMN: Risk Analytics Dashboard
# ----------------------------------------------------
with col_right:
    st.subheader("📊 2. Kết quả Phân tích Rủi ro & Khuyến nghị")
    
    if btn_analyze:
        if not is_valid_gemini_api_key(active_api_key):
            st.error(
                "❌ **Gemini API Key chưa hợp lệ!**\n\n"
                " Vui lòng nhập Gemini API Key từ [Google AI Studio](https://aistudio.google.com/app/apikey) "
                "ở thanh bên (Sidebar) phía bên trái, "
                "hoặc dùng tính năng **🧪 Nạp Dữ liệu Mẫu Phân tích Ngay** ở thanh bên để trải nghiệm!"
            )
        elif uploaded_image is None and not input_text.strip():
            st.warning("⚠️ Vui lòng tải lên 1 hình ảnh hoặc nhập nội dung văn bản/link nghi vấn!")
        else:
            with st.spinner("🤖 Gemini AI đang phân tích đa phương thức các dấu hiệu lừa đảo..."):
                result, error_msg = analyze_content_with_gemini(
                    api_key=active_api_key,
                    text_prompt=input_text,
                    image_file=uploaded_image
                )
                
                if error_msg:
                    st.markdown(error_msg)
                elif result:
                    st.session_state['analysis_result'] = result
                    st.session_state['analyzed_text'] = input_text
                    st.session_state['has_image'] = uploaded_image is not None

    # Render Results if available in Session State
    if 'analysis_result' in st.session_state:
        res = st.session_state['analysis_result']
        
        score = res.get("risk_score", 0)
        level = res.get("risk_level", "KHÔNG XÁC ĐỊNH").upper()
        scam_type = res.get("scam_type", "Chưa phân loại")
        red_flags = res.get("red_flags", [])
        tricks = res.get("psychological_tricks", [])
        advice = res.get("advice", "")
        actions = res.get("suggested_actions", [])
        
        # Risk Badge Class Selection
        badge_class = "risk-safe"
        if level == "CỰC KỲ NGUY HIỂM" or level == "RẤT CAO" or score >= 80:
            badge_class = "risk-critical"
        elif level == "CAO" or score >= 60:
            badge_class = "risk-high"
        elif level == "TRUNG BÌNH" or score >= 30:
            badge_class = "risk-medium"
            
        # Top Score Display Card
        st.markdown(f"""
        <div class="sec-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                    <span style="color: #94a3b8; font-size: 0.9rem;">CẤP ĐỘ RỦI RO</span><br>
                    <span class="risk-badge {badge_class}">{level}</span>
                </div>
                <div style="text-align: right;">
                    <span style="color: #94a3b8; font-size: 0.9rem;">ĐIỂM RỦI RO</span><br>
                    <span style="font-size: 2rem; font-weight: 800; color: #f87171;">{score} / 100</span>
                </div>
            </div>
            <div style="background-color: #334155; border-radius: 10px; height: 10px; width: 100%; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%); width: {score}%; height: 100%;"></div>
            </div>
            <div style="margin-top: 14px;">
                <span style="color: #94a3b8; font-size: 0.85rem;">LOẠI HÌNH NHẬN DIỆN:</span> 
                <strong style="color: #38bdf8;">{scam_type}</strong>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Red Flags Section
        if red_flags:
            st.markdown("#### 🚩 Dấu hiệu Vi phạm & Bất thường (Red Flags)")
            for item in red_flags:
                st.markdown(f'<div class="red-flag-item">⚠️ {item}</div>', unsafe_allow_html=True)
                
        # Psychological Tricks Section
        if tricks:
            st.markdown("#### 🧠 Thủ thuật Thao túng Tâm lý Phát hiện được")
            for trick in tricks:
                st.markdown(f'<div class="trick-item">🎯 {trick}</div>', unsafe_allow_html=True)
                
        # Detailed Advice Section
        if advice:
            st.markdown("#### 🛡️ Phân tích Chi tiết từ Chuyên gia ShieldAI")
            st.info(advice)
            
        # Suggested Actions Section
        if actions:
            st.markdown("#### ⚡ Hành động Khẩn cấp Cần thực hiện Ngay")
            for act in actions:
                st.markdown(f'<div class="action-item">✅ {act}</div>', unsafe_allow_html=True)
                
        st.markdown("---")
        
        # ----------------------------------------------------
        # Traction & Community Engagement Features
        # ----------------------------------------------------
        st.subheader("🌐 Cùng Cộng đồng Phòng chống Lừa đảo")
        
        col_btn1, col_btn2 = st.columns(2)
        
        with col_btn1:
            if st.button("📢 Báo cáo vào CSDL Cộng đồng", use_container_width=True):
                new_report = {
                    "id": len(reports) + 1,
                    "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "scam_type": scam_type,
                    "risk_score": score,
                    "risk_level": level,
                    "sample_text": st.session_state.get('analyzed_text', '')[:100],
                    "has_image": st.session_state.get('has_image', False)
                }
                reports.append(new_report)
                save_json_db(COMMUNITY_DB, reports)
                st.success("✅ Đã lưu bằng chứng vào CSDL cảnh báo cộng đồng!")
                st.rerun()

        with col_btn2:
            with st.popover("⭐ Gửi phản hồi / Đánh giá"):
                st.write("Đánh giá độ chính xác của phân tích này:")
                rating = st.slider("Số sao", 1, 5, 5)
                comment = st.text_input("Góp ý bổ sung (nếu có)")
                if st.button("Gửi đánh giá"):
                    feedbacks.append({
                        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "rating": rating,
                        "comment": comment,
                        "scam_type": scam_type
                    })
                    save_json_db(FEEDBACK_DB, feedbacks)
                    st.toast("Cảm ơn bạn đã gửi phản hồi giúp cải thiện AI!", icon="🎉")
                    st.rerun()

    else:
        # Welcome & Instructions Placeholder Banner with Custom Logo
        placeholder_img = LOGO_PATH if os.path.exists(LOGO_PATH) else "https://img.icons8.com/color/96/shield-with-cinch.png"
        st.markdown(f"""
        <div class="sec-card" style="text-align: center; padding: 30px 20px;">
            <img src="file://{os.path.abspath(LOGO_PATH)}" style="max-width: 140px; margin-bottom: 16px; border-radius: 8px;">
            <h3 style="color: #38bdf8; margin-bottom: 8px;">Sẵn sàng Phân tích Rủi ro</h3>
            <p style="color: #94a3b8; font-size: 0.95rem; max-width: 450px; margin: 0 auto 20px auto;">
                Tải lên ảnh chụp màn hình tin nhắn, hóa đơn chuyển tiền nghi làm giả, hoặc dán đoạn văn bản/link website ở cột bên trái để Gemini AI quét toàn diện.
            </p>
            <div style="text-align: left; background-color: #0f172a; padding: 16px; border-radius: 8px; border: 1px dashed #334155;">
                <strong style="color: #fbbf24;">Các kịch bản lừa đảo phổ biến ShieldAI có thể nhận diện:</strong>
                <ul style="color: #cbd5e1; font-size: 0.88rem; margin-top: 8px; padding-left: 20px;">
                    <li>Fake Bill ngân hàng (Hóa đơn chuyển khoản giả mạo).</li>
                    <li>Mã QR thanh toán độc hại hoặc điều hướng trang web lừa đảo.</li>
                    <li>Giả danh Công an, Thuế, Ngân hàng, Bưu điện gọi điện/nhắn tin đe dọa.</li>
                    <li>Bẫy tuyển Cộng tác viên online xem video, chốt đơn nhận hoa hoa hồng.</li>
                    <li>Link nhận quà tri ân, trúng thưởng giả mạo thương hiệu lớn.</li>
                </ul>
            </div>
        </div>
        """, unsafe_allow_html=True)
