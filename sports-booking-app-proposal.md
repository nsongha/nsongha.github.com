# ĐỀ XUẤT ỨNG DỤNG ĐẶT SÂN THỂ THAO THÔNG MINH

## 1. PHÂN TÍCH HẠN CHẾ CỦA ALOBO VÀ CÁC APP HIỆN TẠI

### 1.1. Vấn đề về Thông tin Sân
- **Thiếu thông số kỹ thuật chi tiết**: Không có thông tin về kích thước biên sân, chất lượng mặt sân, độ sạch sẽ, hệ thống đèn
- **Thông tin mơ hồ**: Chỉ hiển thị thông tin cơ bản như địa chỉ, giá, ảnh tổng quát
- **Không có đánh giá chi tiết**: Đánh giá chung chung, không phân loại theo tiêu chí cụ thể

### 1.2. Vấn đề về Trải nghiệm Người dùng
- **Tìm kiếm khó khăn**: Phải xem từng sân một, không lọc theo ngày giờ trước
- **Không có gợi ý thông minh**: Không suggest sân phù hợp với trình độ, vị trí, sở thích người dùng
- **Thiếu cá nhân hóa**: Không thu thập thông tin người dùng để cải thiện trải nghiệm

### 1.3. Vấn đề về Đặt lịch
- **Quy trình phức tạp**: Nhiều bước không cần thiết
- **Giao diện lịch khó sử dụng**: Không trực quan, khó xem tình trạng sân
- **Không linh hoạt**: Khó thay đổi hoặc hủy lịch

### 1.4. Vấn đề về Thanh toán
- **Không tích hợp thanh toán**: Phải chuyển khoản qua app ngân hàng riêng
- **Phải gửi ảnh xác nhận**: Thủ công, mất thời gian, dễ nhầm lẫn
- **76% người dùng thích trả tiền mặt**: Do thanh toán online không tiện lợi
- **Thiếu minh bạch**: Khó đối soát, dễ sai sót

---

## 2. ĐỀ XUẤT GIẢI PHÁP: SPORTMATCH APP

### 2.1. HỆ THỐNG THÔNG TIN SÂN CHI TIẾT

#### A. Thông số kỹ thuật cơ bản
```
THÔNG SỐ CHUẨN CHO MỖI SÂN:

1. Kích thước & Mặt sân:
   - Kích thước biên: Hẹp (6m) / Tiêu chuẩn (8m) / Rộng (10m+)
   - Loại mặt sân: Bê tông / Nhựa / Gỗ / Cỏ nhân tạo
   - Số lớp mặt sân: 1 lớp / 2 lớp / 3+ lớp
   - Độ đàn hồi: Thấp / Trung bình / Cao
   - Tình trạng vệ sinh: Bụi nhiều / Trung bình / Sạch sẽ (cập nhật hàng ngày)

2. Hệ thống ánh sáng:
   - Loại đèn: Huỳnh quang / LED / Halogen
   - Độ sáng: Lux (đo cụ thể)
   - Phân loại: Yếu / Đủ / Tốt / Rất tốt
   - Có hệ thống chống chói: Có / Không
   - Độ phân bố ánh sáng: Đều / Không đều

3. Môi trường:
   - Mức độ ồn: dB (đo cụ thể) - Yên tĩnh / Trung bình / Ồn
   - Thông gió: Kín / Bán kín / Thoáng
   - Nhiệt độ trung bình: °C

4. Tiện ích:
   - Gửi xe: Miễn phí / Có phí (giá cụ thể)
   - Loại xe được gửi: Xe máy / Ô tô
   - Phòng thay đồ: Có / Không
   - Nhà vệ sinh: Có / Không - Chất lượng: 1-5 sao
   - Canteen: Có / Không
   - Wifi miễn phí: Có / Không
   - Điều hòa: Có / Không

5. Trang thiết bị:
   - Bóng chuẩn: Yonex / Victor / Lining / Khác (ghi rõ)
   - Cho thuê vợt: Có / Không (loại, giá)
   - Tủ đồ: Có / Không
   - Nước uống: Miễn phí / Có phí
```

#### B. Hệ thống đánh giá chi tiết
```
ĐÁNH GIÁ PHÂN LOẠI:

1. Chất lượng mặt sân: ⭐⭐⭐⭐⭐ (1-5 sao)
2. Ánh sáng: ⭐⭐⭐⭐⭐
3. Vệ sinh: ⭐⭐⭐⭐⭐
4. Tiện ích: ⭐⭐⭐⭐⭐
5. Giá cả hợp lý: ⭐⭐⭐⭐⭐
6. Phục vụ: ⭐⭐⭐⭐⭐

ĐÁNH GIÁ THEO TRÌNH ĐỘ:
- Người mới: "Phù hợp không?" + lý do
- Trung cấp: "Phù hợp không?" + lý do
- Nâng cao: "Phù hợp không?" + lý do

ĐÁNH GIÁ TỪ CỘNG ĐỒNG:
- Xác thực: Chỉ người đã đặt sân mới được đánh giá
- Có ảnh/video thực tế từ người dùng
- Thời gian cập nhật gần nhất
```

#### C. Hình ảnh & Video chi tiết
```
YÊU CẦU HÌNH ẢNH:

1. Ảnh 360° toàn cảnh sân
2. Ảnh chi tiết mặt sân (zoom 4-5 hình)
3. Ảnh hệ thống đèn ban ngày và ban đêm
4. Ảnh khu vực gửi xe
5. Ảnh phòng thay đồ, vệ sinh
6. Ảnh từ người dùng thực tế (user-generated)

VIDEO:
- Video quay toàn cảnh sân khi đang có người chơi
- Cập nhật định kỳ hàng tháng
```

---

### 2.2. HỆ THỐNG HỒ SƠ NGƯỜI DÙNG & GỢI Ý THÔNG MINH

#### A. Thông tin người dùng thu thập
```
HỒ SƠ NGƯỜI CHƠI:

1. Thông tin cơ bản:
   - Họ tên, tuổi, giới tính
   - Số điện thoại, email
   - Vị trí nhà/nơi làm việc (để suggest sân gần)

2. Thông tin chơi thể thao:
   - Môn thể thao: Cầu lông / Bóng đá / Tennis / Pickleball
   - Trình độ:
     * Mới chơi (< 6 tháng)
     * Trung bình (6 tháng - 2 năm)
     * Khá (2-5 năm)
     * Giỏi (> 5 năm)
     * Chuyên nghiệp
   - Đã học với huấn luyện viên: Có / Không
   - Tần suất chơi:
     * Thỉnh thoảng (1-2 lần/tháng)
     * Thường xuyên (1-2 lần/tuần)
     * Rất thường xuyên (3-5 lần/tuần)
     * Hàng ngày

3. Thói quen chơi:
   - Thời gian thích chơi: Sáng / Trưa / Chiều / Tối / Đêm khuya
   - Ngày thích chơi: Thứ 2-6 / Cuối tuần
   - Thời lượng mỗi trận: 1h / 1.5h / 2h / Linh hoạt
   - Chơi với: Bạn bè / Đồng nghiệp / Tìm đối / Linh hoạt

4. Yêu cầu về sân:
   - Ưu tiên: Giá rẻ / Gần nhà / Chất lượng / Tiện ích
   - Ngân sách: < 100k/h / 100-200k/h / 200-300k/h / > 300k/h
   - Khoảng cách chấp nhận: < 2km / < 5km / < 10km / > 10km
   - Yêu cầu đặc biệt: Gửi xe free / Có điều hòa / Sân kín / Sân mở
```

#### B. Thuật toán gợi ý thông minh
```
SPORTMATCH ALGORITHM:

Input:
- Thông tin hồ sơ người dùng
- Lịch sử đặt sân
- Đánh giá của người dùng
- Vị trí hiện tại
- Thời gian muốn chơi

Xử lý:
1. Lọc sân theo:
   - Khoảng cách từ nhà/vị trí hiện tại
   - Tình trạng còn trống trong khung giờ mong muốn
   - Ngân sách người dùng

2. Tính điểm phù hợp (Match Score 0-100):
   - Trình độ phù hợp: 25 điểm
     * Sân phù hợp với người mới: biên rộng, ánh sáng tốt
     * Sân phù hợp người chuyên: mặt sân chuẩn, không gian tốt

   - Khoảng cách: 20 điểm
     * Càng gần điểm xuất phát càng cao điểm

   - Chất lượng sân: 20 điểm
     * Dựa vào đánh giá trung bình các tiêu chí

   - Lịch sử & sở thích: 15 điểm
     * Người dùng đã từng đặt và đánh giá tốt
     * Phù hợp với khung giờ thường chơi

   - Giá cả hợp lý: 10 điểm
     * So với ngân sách đã đặt

   - Tiện ích: 10 điểm
     * Có các tiện ích người dùng yêu cầu

3. Sắp xếp theo Match Score giảm dần

Output:
- Top 10 sân phù hợp nhất
- Hiển thị % phù hợp và lý do cụ thể
- Gợi ý khung giờ tối ưu (giá tốt + ít đông)
```

#### C. Tính năng gợi ý nâng cao
```
SMART SUGGESTIONS:

1. "Sân phù hợp với bạn nhất" (95% match)
   - Lý do: Gần nhà 2km, trình độ phù hợp, giá trong ngân sách,
     đã đặt 5 lần và đánh giá 5 sao

2. "Sân tốt nhất trong khu vực" (88% match)
   - Lý do: Đánh giá cao nhất (4.8/5), mặt sân 3 lớp, ánh sáng xuất sắc
   - Gần hơn: 3.5km
   - Giá: +20% so với ngân sách

3. "Tiết kiệm nhất" (82% match)
   - Lý do: Giá rẻ nhất khu vực, chất lượng vẫn tốt (4.2/5)
   - Khuyến mãi: Giảm 30% khung giờ 6-8h sáng

4. Gợi ý theo ngữ cảnh:
   - "Hôm nay trời mưa - Gợi ý 5 sân trong nhà gần bạn"
   - "Cuối tuần này đông - Đặt sớm để có giá tốt"
   - "Bạn chưa chơi 2 tuần - Các sân bạn thích đang có slot"
```

---

### 2.3. HỆ THỐNG ĐẶT LỊCH THÔNG MINH

#### A. Giao diện đặt lịch trực quan
```
THIẾT KẾ LỊCH:

1. View dạng lưới (Calendar Grid):
   ┌─────────────────────────────────────────┐
   │  Thứ 2  │  Thứ 3  │  Thứ 4  │  Thứ 5   │
   ├─────────────────────────────────────────┤
   │ 6h  □ □ │ 6h  ■ □ │ 6h  □ ■ │ 6h  □ □  │
   │ 7h  ■ □ │ 7h  ■ ■ │ 7h  □ □ │ 7h  ■ □  │
   │ 8h  ■ □ │ 8h  □ □ │ 8h  ■ □ │ 8h  □ □  │
   └─────────────────────────────────────────┘

   ■ = Đã đặt
   □ = Còn trống

   Màu sắc:
   - Xanh lá: Còn trống, giá tốt
   - Vàng: Còn trống, giá cao (giờ vàng)
   - Đỏ: Đã đặt
   - Xám: Không khả dụng

2. Lọc nhanh:
   [Sáng 6-12h] [Chiều 12-18h] [Tối 18-22h] [Khuya 22-24h]
   [Hôm nay] [Ngày mai] [Tuần này] [Tùy chọn]

3. Thông tin slot:
   - Giờ: 19:00 - 20:00
   - Sân số: 3
   - Giá: 150,000đ (-10% so với giờ thường)
   - Còn: 2/4 sân trống
```

#### B. Quy trình đặt sân tối ưu
```
FLOW ĐẶT SÂN (3 BƯỚC):

Bước 1: Tìm & Chọn sân
├─ Nhập: Thời gian + Môn thể thao
├─ Xem: Danh sách gợi ý (đã sắp xếp phù hợp)
└─ Chọn: Sân yêu thích

Bước 2: Chọn slot
├─ Xem lịch sân (màu sắc trực quan)
├─ Chọn slot trống
├─ Xác nhận thông tin:
│  * Sân: Sân ABC
│  * Ngày: 17/11/2025
│  * Giờ: 19:00 - 20:00
│  * Giá: 150,000đ
└─ Bấm "Tiếp tục"

Bước 3: Thanh toán
├─ Chọn phương thức (trong app)
├─ Xác nhận thanh toán
└─ Nhận xác nhận ngay lập tức

THỜI GIAN: < 60 giây
```

#### C. Tính năng đặt lịch nâng cao
```
TÍNH NĂNG BỔ SUNG:

1. Đặt lịch lặp lại:
   - "Đặt cố định mỗi thứ 3, 5 lúc 19h"
   - Tự động gia hạn hàng tuần
   - Thông báo khi sân không khả dụng

2. Đặt nhóm:
   - Mời bạn bè cùng đặt
   - Chia tiền tự động trong app
   - Nhắc nhở các thành viên

3. Tìm đối thủ:
   - Đăng slot cần tìm người
   - Lọc theo trình độ tương đương
   - Chat trước khi xác nhận

4. Hủy & Thay đổi linh hoạt:
   - Hủy miễn phí trước 2h
   - Hủy trước 30 phút: Phí 30%
   - Chuyển nhượng slot cho người khác
   - Đổi giờ trong cùng ngày (nếu có slot)

5. Thông báo thông minh:
   - Nhắc trước 2h: "Sân lúc 19h hôm nay"
   - Nhắc thời tiết: "Chiều nay mưa, bạn vẫn giữ lịch?"
   - Gợi ý: "Hủy sớm để nhận hoàn tiền 100%"
```

---

### 2.4. HỆ THỐNG THANH TOÁN TÍCH HỢP

#### A. Các phương thức thanh toán trong app
```
PAYMENT METHODS:

1. Ví điện tử:
   ✓ Momo
   ✓ ZaloPay
   ✓ VNPay
   ✓ ShopeePay

2. Thẻ ngân hàng:
   ✓ Thẻ ATM nội địa
   ✓ Visa / Mastercard
   ✓ Liên kết thẻ (lưu để dùng nhanh)

3. Chuyển khoản ngân hàng:
   ✓ QR Code tự động (số tiền đã điền sẵn)
   ✓ Tự động xác nhận sau 30 giây

4. Ví trong app (SportMatch Wallet):
   ✓ Nạp tiền trước
   ✓ Thanh toán 1 chạm
   ✓ Tích lũy điểm thưởng

5. Trả sau (cho người dùng uy tín):
   ✓ Trả tiền sau khi chơi
   ✓ Giới hạn tín dụng dựa vào lịch sử
   ✓ Thanh toán trong 24h

6. Thanh toán tại sân:
   ✓ Tiền mặt
   ✓ Chuyển khoản trực tiếp cho chủ sân
   ✓ Phải check-in trong app để xác nhận
```

#### B. Quy trình thanh toán tối ưu
```
PAYMENT FLOW (< 10 GIÂY):

1. Chọn phương thức đã lưu:
   [Momo - **** 9234] ← Mặc định
   [Thay đổi]

2. Xác nhận:
   ┌──────────────────────────┐
   │ Sân ABC                  │
   │ 17/11 19:00-20:00        │
   │ Giá sân:    150,000đ     │
   │ Ưu đãi:     -15,000đ     │
   │ ─────────────────────    │
   │ Tổng:       135,000đ     │
   │                          │
   │ [XÁC NHẬN THANH TOÁN]    │
   └──────────────────────────┘

3. Xác thực:
   - Momo: Mở app Momo tự động
   - Vân tay / Face ID
   - Hoặc mã PIN

4. Hoàn tất:
   ✓ Đặt sân thành công!
   ✓ Mã booking: #ABC123456
   ✓ QR Code check-in đã lưu

KHÔNG CẦN:
✗ Chụp ảnh chuyển khoản
✗ Gửi ảnh xác nhận
✗ Đợi admin duyệt
```

#### C. Tính năng thanh toán nâng cao
```
ADVANCED PAYMENT FEATURES:

1. Thanh toán nhóm:
   - Chia đều cho 4 người: Mỗi người 37,500đ
   - A đã trả: 37,500đ ✓
   - B đã trả: 37,500đ ✓
   - C chưa trả: 37,500đ → Gửi nhắc nhở
   - D chưa trả: 37,500đ → Gửi nhắc nhở

   - Người tạo có thể trả hộ
   - Tự động thu tiền sau khi chơi xong

2. Ưu đãi & Khuyến mãi:
   - Điểm tích lũy: 1% mỗi giao dịch
   - Voucher tự động áp dụng
   - Flash sale theo giờ
   - Giảm giá đặt sớm (book trước 7 ngày: -15%)
   - Giảm giá đặt nhiều (đặt 4 slot/tuần: -10%)

3. Bảo hiểm đặt sân:
   - Phí: 5,000đ
   - Hủy bất kỳ lúc nào → Hoàn 100%
   - Dành cho người hay thay đổi lịch

4. Lịch sử & Báo cáo:
   - Tổng chi tiêu theo tháng
   - Thống kê số lần chơi
   - Xuất hóa đơn VAT (cho công ty)
   - Biểu đồ thời gian chơi

5. Hoàn tiền nhanh:
   - Hủy đủ điều kiện → Hoàn về ví trong 1 phút
   - Rút về ngân hàng trong 1 giờ
   - Không phí giao dịch
```

---

## 3. KIẾN TRÚC KỸ THUẬT ĐỀ XUẤT

### 3.1. Technology Stack
```
FRONTEND:
- Mobile: React Native / Flutter (iOS + Android)
- Web: React.js / Next.js
- State Management: Redux Toolkit / Zustand
- UI: Custom Design System + Tailwind CSS

BACKEND:
- API: Node.js + Express / NestJS
- Database:
  * PostgreSQL (dữ liệu chính)
  * Redis (cache, session)
  * MongoDB (logs, analytics)
- Search Engine: Elasticsearch (tìm kiếm sân)
- Real-time: Socket.io (cập nhật lịch realtime)

PAYMENT:
- Gateway: OnePay / VNPay / Momo API
- Wallet: Custom wallet system
- Security: PCI DSS compliance

AI/ML:
- Recommendation Engine: TensorFlow / Python
- Thuật toán matching: Custom algorithm
- Analytics: Google Analytics + Mixpanel

INFRASTRUCTURE:
- Cloud: AWS / Google Cloud
- CDN: CloudFlare (ảnh, video)
- Monitoring: Sentry, DataDog
- CI/CD: GitHub Actions
```

### 3.2. Database Schema (Core Tables)
```sql
-- Bảng Sân
CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  location POINT, -- Tọa độ GPS
  sport_type VARCHAR(50), -- badminton, football, tennis

  -- Thông số kỹ thuật
  court_width_type VARCHAR(20), -- narrow, standard, wide
  surface_type VARCHAR(50),
  surface_layers INT,
  lighting_type VARCHAR(50),
  lighting_lux INT,
  has_anti_glare BOOLEAN,
  noise_level INT, -- dB

  -- Tiện ích
  free_parking BOOLEAN,
  has_locker_room BOOLEAN,
  has_ac BOOLEAN,
  standard_ball_brand VARCHAR(50),

  -- Đánh giá
  rating_surface DECIMAL(2,1),
  rating_lighting DECIMAL(2,1),
  rating_cleanliness DECIMAL(2,1),
  rating_amenities DECIMAL(2,1),
  rating_price DECIMAL(2,1),
  rating_service DECIMAL(2,1),
  rating_overall DECIMAL(2,1),

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bảng Người dùng
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,

  -- Vị trí
  home_location POINT,
  work_location POINT,

  -- Thông tin chơi
  sport_type VARCHAR(50),
  skill_level VARCHAR(20), -- beginner, intermediate, advanced, pro
  has_coach BOOLEAN,
  play_frequency VARCHAR(20), -- occasional, regular, frequent, daily

  -- Thói quen
  preferred_time VARCHAR(20), -- morning, afternoon, evening, night
  preferred_days VARCHAR(50), -- weekday, weekend, any
  session_duration INT, -- phút

  -- Ngân sách
  budget_min INT,
  budget_max INT,
  max_distance INT, -- km

  -- Yêu cầu
  priority VARCHAR(20), -- price, distance, quality, amenities

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bảng Đặt sân
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  venue_id INT REFERENCES venues(id),
  court_number INT,

  booking_date DATE,
  start_time TIME,
  end_time TIME,

  price INT,
  discount INT,
  final_price INT,

  status VARCHAR(20), -- pending, confirmed, cancelled, completed
  payment_status VARCHAR(20), -- pending, paid, refunded
  payment_method VARCHAR(50),

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bảng Thanh toán
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id),
  user_id INT REFERENCES users(id),

  amount INT,
  method VARCHAR(50), -- momo, zalopay, card, cash, wallet
  status VARCHAR(20), -- pending, success, failed, refunded

  transaction_id VARCHAR(255), -- ID từ payment gateway

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bảng Đánh giá
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  venue_id INT REFERENCES venues(id),
  booking_id INT REFERENCES bookings(id),

  rating_surface INT,
  rating_lighting INT,
  rating_cleanliness INT,
  rating_amenities INT,
  rating_price INT,
  rating_service INT,
  rating_overall INT,

  comment TEXT,
  has_photos BOOLEAN,

  verified BOOLEAN, -- Chỉ người đã đặt mới đánh giá được

  created_at TIMESTAMP
);
```

---

## 4. ROADMAP PHÁT TRIỂN

### Phase 1: MVP (2-3 tháng)
```
Tháng 1:
✓ Thiết kế UI/UX hoàn chỉnh
✓ Setup infrastructure
✓ Database schema
✓ Authentication system

Tháng 2:
✓ Tính năng tìm kiếm sân (cơ bản)
✓ Hệ thống đặt lịch
✓ Tích hợp thanh toán Momo + VNPay
✓ Hệ thống đánh giá cơ bản

Tháng 3:
✓ Testing toàn diện
✓ Beta testing với 50 người dùng
✓ Onboard 10 sân thử nghiệm
✓ Launch MVP
```

### Phase 2: Growth (3-6 tháng)
```
Tháng 4-5:
✓ Hệ thống gợi ý thông minh (AI)
✓ Thêm các phương thức thanh toán
✓ Tính năng đặt nhóm
✓ Ví trong app

Tháng 6:
✓ Tìm đối thủ
✓ Đặt lịch lặp lại
✓ Hệ thống điểm thưởng
✓ Mở rộng thêm 100 sân
```

### Phase 3: Scale (6-12 tháng)
```
Tháng 7-12:
✓ Mở rộng toàn quốc
✓ Tính năng live tracking (check-in realtime)
✓ Social features (kết bạn, chat)
✓ Tournament management
✓ Coach booking
✓ Equipment marketplace
```

---

## 5. BUSINESS MODEL

### ⚠️ LƯU Ý QUAN TRỌNG VỀ CÁC CON SỐ TRONG ĐỀ XUẤT

**Các con số dưới đây là DỰ ĐOÁN/GIẢ ĐỊNH, chưa được validate bằng data thực tế:**

**Dữ liệu thị trường thực tế đã tìm được:**
- Alobo (competitor lớn nhất): 1,500+ sân đăng ký
- Giá sân cầu lông thực tế (⚠️ CẬP NHẬT TỪ USER FEEDBACK):
  * Web research: 25-65k/giờ (có thể là off-peak hoặc sân bóng đá)
  * **User actual data**: 150-200k/h (giờ vàng), gần 300k/h (cao cấp), < 100k/h (off-peak)
  * **→ Trung bình hợp lý: 120-150k/giờ cho prime time bookings**
- MyLeague (startup tương tự): Seed funding ~$75K USD
- Case study: Sân dùng Alobo tăng doanh thu 35% sau 3 tháng
- **KHÔNG TÌM ĐƯỢC**: Số bookings/ngày thực tế, % commission thị trường, số người dùng active

**⚠️ Các con số bên dưới cần PHẢI validate lại bằng:**
1. Survey 500+ người dùng thực tế
2. Phỏng vấn 50+ chủ sân
3. Phân tích data từ competitors (nếu có thể)
4. Pilot test với 10-20 sân thử nghiệm

---

### 5.1. MÔ HÌNH DOANH THU (PHIÊN BẢN THỰC TẾ HỢP LÝ HƠN)

#### Kịch bản 1: Conservative (Thận trọng - Khả thi cao)
```
GIẢ ĐỊNH (CẦN VALIDATE):
- Onboard: 200 sân trong 6 tháng đầu
- Mỗi sân: 4 bookings/ngày qua app (20% lấp đầy)
- Giá trung bình: 120,000đ/giờ (mix: 70% prime time 150k + 30% off-peak 50k)
- Commission: 8% (phổ biến với platform model)

1. Hoa hồng từ đặt sân:
   - 200 sân × 4 bookings/ngày = 800 bookings/ngày
   - 800 × 120,000đ × 8% = 7,680,000đ/ngày
   - Tháng: ~230,000,000đ

2. Phí premium cho chủ sân:
   - Giả định: 10% sân upgrade Pro (20 sân)
   - Gói Pro: 1,500,000đ/tháng
   - 20 sân × 1,500,000đ = 30,000,000đ/tháng

3. Quảng cáo:
   - Giai đoạn đầu: Ít hoặc không có
   - Target: ~10,000,000đ/tháng (nếu có)

4. Dịch vụ bổ sung:
   - Chưa tính (focus vào core business trước)

TỔNG DỰ KIẾN (Conservative): ~270,000,000đ/tháng (sau 6 tháng)
```

#### Kịch bản 2: Optimistic (Lạc quan - Cần nỗ lực lớn)
```
GIẢ ĐỊNH (CẦN VALIDATE):
- Onboard: 500 sân trong 6 tháng
- Mỗi sân: 6 bookings/ngày qua app (30% lấp đầy)
- Giá trung bình: 140,000đ/giờ (80% prime time 160k + 20% off-peak 60k)
- Commission: 8%

1. Hoa hồng từ đặt sân:
   - 500 sân × 6 bookings/ngày = 3,000 bookings/ngày
   - 3,000 × 140,000đ × 8% = 33,600,000đ/ngày
   - Tháng: ~1,008,000,000đ

2. Phí premium cho chủ sân:
   - 15% sân upgrade Pro (75 sân)
   - 75 sân × 1,500,000đ = 112,500,000đ/tháng

3. Quảng cáo:
   - Target: ~50,000,000đ/tháng

TỔNG DỰ KIẾN (Optimistic): ~1,170,000,000đ/tháng (sau 6 tháng)
```

#### Kịch bản 3: PHIÊN BẢN CŨ - KHÔNG THỰC TẾ (Để tham khảo)
```
❌ GIẢ ĐỊNH SAI:
- 1000 bookings/ngày (QUÁ CAO cho startup mới)
- Giá TB 150,000đ (GẤP 3 LẦN thực tế: 50k)
- 100 sân Pro × 2M (QUÁ LẠC QUAN)

1. Hoa hồng: 360M/tháng ❌
2. Premium: 200M/tháng ❌
3. Ads: 50M/tháng ❌
4. Khác: 75M/tháng ❌

TỔNG: ~685M/tháng ❌ KHÔNG KHẢ THI
```

### 5.2. Chi phí dự kiến (PHIÊN BẢN THỰC TẾ)

#### Giai đoạn 1: MVP (Tháng 1-3) - Team nhỏ
```
1. Team (5 người):
   - 2 Developers (Full-stack): 35M + 30M = 65M
   - 1 Designer/PM (Kiêm nhiệm): 30M
   - 1 Marketing/Sales (Kiêm nhiệm): 25M
   - 1 Founder (Ít lương/Equity): 10M
   Total: 130M/tháng

2. Infrastructure:
   - Server AWS (nhỏ): ~5M/tháng
   - Tools, SaaS: ~3M/tháng
   - Payment gateway fee: ~2M/tháng
   Total: 10M/tháng

3. Marketing:
   - Facebook Ads: 20M/tháng
   - Partnerships: 10M/tháng
   Total: 30M/tháng

4. Khác:
   - Coworking space: 5M/tháng
   - Legal, accounting: 3M/tháng
   Total: 8M/tháng

TỔNG CHI PHÍ (MVP): ~178M/tháng
```

#### Giai đoạn 2: Growth (Tháng 4-6) - Scale up
```
1. Team (8 người):
   - 3 Developers: 35M + 30M + 28M = 93M
   - 1 Designer: 25M
   - 1 Product Manager: 30M
   - 1 Marketing: 25M
   - 1 Sales/BD: 20M
   - 1 Customer Support: 15M
   Total: 208M/tháng

2. Infrastructure:
   - Server AWS: ~10M/tháng
   - CDN, Monitoring: ~3M/tháng
   - Payment gateway fee: ~3M/tháng
   Total: 16M/tháng

3. Marketing:
   - Facebook Ads: 40M/tháng
   - Influencer: 20M/tháng
   - Events: 10M/tháng
   Total: 70M/tháng

4. Khác:
   - Office: 10M/tháng
   - Legal, accounting: 5M/tháng
   Total: 15M/tháng

TỔNG CHI PHÍ (Growth): ~309M/tháng
```

### 5.3. Phân tích Lợi nhuận

#### Kịch bản Conservative:
```
Doanh thu (tháng 6): 270M
Chi phí (tháng 6): 309M
Lỗ: -39M/tháng

⚠️ CẦN FUNDING: ~500M - 1 tỷ VNĐ cho 6-12 tháng runway
✓ Gần breakeven, có thể profitable tháng 7-8
```

#### Kịch bản Optimistic:
```
Doanh thu (tháng 6): 1,170M
Chi phí (tháng 6): 309M
Lợi nhuận: +861M/tháng ✓

✓ Breakeven từ tháng thứ 3-4
✓ High growth trajectory
```

#### ❌ Kịch bản với giá 50k/giờ (SAI - web research thiếu context):
```
Doanh thu: 136M
Chi phí: 309M
Lỗ: -173M ❌ GIẢ ĐỊNH GIÁ SÂN QUẦY THẤP

⚠️ Lỗi: Web research cho giá 25-65k là OFF-PEAK hoặc sân bóng đá,
không phản ánh giá thực tế người dùng đặt sân cầu lông (150-200k)
```

### 5.4. Funding cần thiết

```
KHUYẾN NGHỊ (CẬP NHẬT VỚI GIÁ THỰC):

Kịch bản 1: Bootstrap/Angel (Conservative)
- Vốn cần: 500M - 1 tỷ VNĐ ($20K - $40K USD)
- 3 tháng MVP: 178M × 3 = 534M
- 3 tháng growth với gần breakeven: 309M × 3 - 270M × 3 = 117M
- Buffer 20%: 130M
- Total: ~780M ≈ $32K USD
- Phù hợp: Angel investors, bootstrapping

Kịch bản 2: Seed Round (Optimistic)
- Vốn cần: 2-3 tỷ VNĐ ($80K - $120K USD)
- 3 tháng MVP: 534M
- 6 tháng growth aggressive: 1,000M (marketing, team scale)
- Buffer 20%: 307M
- Total: ~1,841M ≈ $75K USD
- Target: Breakeven tháng 3-4, profitable tháng 6
- Phù hợp: VC seed round

So sánh benchmark:
- MyLeague: $75K seed → tương đương kịch bản 2
- Alobo: Unknown (có thể > $200K để đạt 1,500 sân)

⚠️ LƯU Ý: Với giá sân thực 120-150k (không phải 50k),
startup này khả thi hơn nhiều và có thể breakeven nhanh hơn!
```

---

## 6. COMPETITIVE ADVANTAGES (LỢI THẾ CẠNH TRANH)

### So với Alobo:
```
✓ Thông tin sân chi tiết hơn 10 lần
✓ Gợi ý thông minh dựa trên AI
✓ Thanh toán hoàn toàn trong app (< 10 giây)
✓ UX/UI hiện đại, đặt sân < 60 giây
✓ Không cần gửi ảnh chuyển khoản
✓ Hoàn tiền tự động trong 1 phút
✓ Đặt nhóm & chia tiền tự động
✓ Tìm đối thủ cùng trình độ
```

### So với đặt sân truyền thống (gọi điện):
```
✓ Xem được lịch realtime, không cần gọi hỏi
✓ So sánh nhiều sân cùng lúc
✓ Đọc review từ người dùng thực
✓ Thanh toán ngay, không lo bị mất slot
✓ Nhận ưu đãi tự động
✓ Lưu lịch sử, dễ đặt lại
```

---

## 7. KẾT LUẬN & KHUYẾN NGHỊ

### Tại sao SportMatch sẽ thành công:

1. **Giải quyết đúng pain points:**
   - Thiếu thông tin → Thông số kỹ thuật chi tiết
   - Khó tìm sân phù hợp → Gợi ý thông minh AI
   - Đặt lịch phức tạp → UX đơn giản < 60 giây
   - Thanh toán rườm rà → Tích hợp hoàn toàn trong app

2. **Technology advantage:**
   - AI/ML cho recommendation
   - Real-time booking
   - Multiple payment methods
   - Scalable infrastructure

3. **Network effect:**
   - Càng nhiều người dùng → Data càng tốt → Gợi ý càng chính xác
   - Càng nhiều sân → Càng nhiều lựa chọn → Càng hấp dẫn người dùng

4. **Market timing:**
   - Thị trường thể thao nghiệp dư đang phát triển mạnh
   - Người dùng Việt Nam ngày càng quen với thanh toán online
   - Các app hiện tại chưa đáp ứng tốt nhu cầu

### Next Steps:

1. **Validate idea:**
   - Survey 500 người chơi thể thao nghiệp dư
   - Interview 50 chủ sân
   - Phân tích competitive landscape sâu hơn

2. **Build MVP:**
   - Hire core team (3 devs, 1 designer, 1 PM)
   - 3 tháng development
   - Beta test với 10 sân tại TP.HCM

3. **Fund raising:**
   - Seed round: $200K-$500K
   - Focus on product-market fit
   - Prepare for Series A sau 12 tháng

---

## PHỤ LỤC

### A. User Personas

**Persona 1: Minh - Dân công sở chơi cầu lông**
- Tuổi: 28
- Nghề: Nhân viên văn phòng
- Trình độ: Trung bình, chơi 2 năm
- Tần suất: 2-3 lần/tuần, tối sau 18h
- Pain points:
  * Khó tìm sân gần công ty
  * Không biết sân nào chất lượng tốt
  * Đặt qua điện thoại mất thời gian
  * Thanh toán phức tạp
- Needs:
  * Tìm sân nhanh, gần nơi làm
  * Đặt lịch đơn giản
  * Thanh toán trong app
  * Đọc review người khác

**Persona 2: Hùng - Chủ sân cầu lông**
- Tuổi: 42
- Sân: 8 sân cầu lông tại Quận 7
- Pain points:
  * Khó quản lý lịch đặt
  * Nhiều người hẹn mà không đến
  * Đối soát tiền mất thời gian
  * Marketing tốn kém
- Needs:
  * Hệ thống quản lý tự động
  * Khách đặt phải cọc/thanh toán trước
  * Tăng tỷ lệ lấp đầy sân
  * Tiếp cận khách hàng mới

**Persona 3: Lan - Người mới chơi pickleball**
- Tuổi: 35
- Nghề: Giáo viên
- Trình độ: Mới bắt đầu, chưa có 3 tháng
- Tần suất: 1-2 lần/tuần, sáng hoặc chiều
- Pain points:
  * Không biết sân nào phù hợp người mới
  * Sợ chọn sân quá khó/cao cấp
  * Muốn tìm người cùng trình độ
  * Ngân sách hạn chế
- Needs:
  * Gợi ý sân cho người mới
  * Thông tin rõ ràng về sân
  * Giá cả phải chăng
  * Tìm đối chơi cùng trình độ

### B. Wireframes mẫu (Mô tả)

**1. Màn hình chính (Home):**
```
┌─────────────────────────────┐
│  🔍 Tìm sân...              │
├─────────────────────────────┤
│  📍 Gần tôi  | 🏸 Cầu lông  │
├─────────────────────────────┤
│  Gợi ý cho bạn              │
│  ┌───────────────────────┐  │
│  │ 📸 Sân ABC   95% ⭐    │  │
│  │ 2km • 150k/h          │  │
│  │ Phù hợp: Trình độ... │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 📸 Sân XYZ   88% ⭐    │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  ⚡ Flash Sale             │
│  Sân DEF: -30% (6-8h sáng)  │
└─────────────────────────────┘
```

**2. Chi tiết sân:**
```
┌─────────────────────────────┐
│ [< Back]      Sân ABC       │
├─────────────────────────────┤
│  📸📸📸 [Ảnh 360°]          │
├─────────────────────────────┤
│  ⭐ 4.8  (234 đánh giá)     │
│  📍 123 Nguyễn Văn A, Q7    │
│  💰 120k-180k/giờ           │
├─────────────────────────────┤
│  🏸 Thông số kỹ thuật       │
│  Biên sân: Rộng (10m)       │
│  Mặt sân: 3 lớp ⭐⭐⭐⭐⭐     │
│  Ánh sáng: LED ⭐⭐⭐⭐⭐      │
│  Vệ sinh: Sạch ⭐⭐⭐⭐⭐      │
│                             │
│  ✅ Gửi xe miễn phí         │
│  ✅ Điều hòa                │
│  ✅ Bóng Yonex              │
├─────────────────────────────┤
│  95% PHÙ HỢP VỚI BẠN        │
│  ✓ Gần nhà 2km              │
│  ✓ Phù hợp trình độ         │
│  ✓ Trong ngân sách          │
├─────────────────────────────┤
│  [XEM LỊCH ĐẶT SÂN]         │
└─────────────────────────────┘
```

**3. Đặt lịch:**
```
┌─────────────────────────────┐
│  Chọn ngày & giờ            │
├─────────────────────────────┤
│  📅 17/11  18/11  19/11     │
│      [○]    [○]    [●]      │
├─────────────────────────────┤
│  Sáng | Chiều | [Tối] | Khuya│
├─────────────────────────────┤
│  18:00-19:00  □ 150k        │
│  19:00-20:00  ■ Đã đặt      │
│  20:00-21:00  □ 180k ⚡-10% │
│  21:00-22:00  □ 180k        │
├─────────────────────────────┤
│  Đã chọn:                   │
│  📅 19/11/2025              │
│  🕐 18:00 - 19:00           │
│  💰 150,000đ                │
│                             │
│  [TIẾP TỤC]                 │
└─────────────────────────────┘
```

**4. Thanh toán:**
```
┌─────────────────────────────┐
│  Xác nhận & Thanh toán      │
├─────────────────────────────┤
│  Sân ABC - Sân số 3         │
│  19/11/2025 18:00-19:00     │
├─────────────────────────────┤
│  Giá sân:       150,000đ    │
│  Ưu đãi (VIP): -15,000đ     │
│  ────────────────────────   │
│  Tổng:          135,000đ    │
├─────────────────────────────┤
│  Phương thức thanh toán:    │
│  ● Momo - **** 9234         │
│  ○ ZaloPay                  │
│  ○ Thẻ ATM                  │
│  ○ Ví SportMatch            │
├─────────────────────────────┤
│  [XÁC NHẬN THANH TOÁN]      │
│                             │
│  🔒 Bảo mật bởi VNPay       │
└─────────────────────────────┘
```

### C. Metrics to Track (KPIs)

**User Metrics:**
- DAU (Daily Active Users)
- MAU (Monthly Active Users)
- Retention rate (D1, D7, D30)
- Session duration
- User acquisition cost

**Business Metrics:**
- GMV (Gross Merchandise Value)
- Number of bookings/day
- Average booking value
- Commission revenue
- Conversion rate (visit → booking)

**Product Metrics:**
- Time to book (target: < 60s)
- Payment success rate (target: > 95%)
- Cancellation rate (target: < 10%)
- Search → booking conversion (target: > 15%)

**Venue Metrics:**
- Number of active venues
- Average occupancy rate
- Venue churn rate
- Premium subscription rate

---

## ⚠️ DISCLAIMER QUAN TRỌNG

**Về các con số doanh thu và lợi nhuận trong tài liệu này:**

Tài liệu này được tạo ra như một **đề xuất concept/vision** cho ứng dụng đặt sân thể thao. Các con số về doanh thu, lợi nhuận, và tài chính là **ƯỚC TÍNH DỰA TRÊN GIẢ ĐỊNH**, không phải từ dữ liệu thực tế đã được validate.

### Nguồn gốc các con số:

1. **Giá sân thực tế**: Dựa trên nghiên cứu web (25-65k/giờ)
2. **Số lượng sân, bookings/ngày**: Giả định logic dựa trên competitor (Alobo: 1,500 sân)
3. **Commission rate**: Giả định phổ biến (8%)
4. **Chi phí team**: Ước tính dựa trên mức lương thị trường

### ⚠️ TRƯỚC KHI SỬ DỤNG ĐỀ XUẤT NÀY:

**BẮT BUỘC PHẢI VALIDATE:**

1. **Market Research:**
   - Survey ít nhất 500 người dùng thực tế
   - Phỏng vấn 50+ chủ sân về willingness to pay
   - Phân tích competitor data (nếu có thể)

2. **Pilot Test:**
   - Test với 10-20 sân thực tế trong 1-2 tháng
   - Đo lường metrics thực tế: conversion rate, booking frequency, churn rate
   - Validate giá trị commission và subscription

3. **Financial Model:**
   - Tính toán lại dựa trên data thực từ pilot
   - Build 3 kịch bản: worst-case, base-case, best-case
   - Validate với advisor/investor có kinh nghiệm

4. **Competitor Analysis:**
   - Tìm hiểu funding history của Alobo, MyLeague, Sporta
   - Benchmark metrics từ các platform tương tự
   - Hiểu rõ tại sao họ thành công/thất bại

### Mục đích tài liệu:

✓ Brainstorming ideas và features
✓ Alignment team về vision
✓ Base để bắt đầu customer discovery
✓ Framework để validate assumptions

❌ KHÔNG dùng trực tiếp để:
- Pitch nhà đầu tư (cần data thực)
- Lập kế hoạch tài chính chính thức
- Ra quyết định hire/spend lớn

---

**Cập nhật:**
- **Version 1.0**: 17/11/2025 - Đề xuất ban đầu (con số chưa validate)
- **Version 1.1**: 17/11/2025 - Thêm disclaimer, cập nhật financial model với con số thực tế hơn dựa trên research

**Người tạo: SportMatch Product Team (Concept/Vision Document)**

**Next Steps:**
1. Validate assumptions qua customer interviews
2. Build landing page để test demand
3. Pilot với 5-10 sân để có data thực
4. Revise financial model dựa trên data
