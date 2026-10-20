# 🧪 HƯỚNG DẪN CHI TIẾT CÁCH TEST TOÀN BỘ HỆ THỐNG QLSHOP

> Tài liệu này hướng dẫn bạn từng bước kiểm thử (test) từ **A đến Z** cho tất cả các tính năng quan trọng: **Đăng nhập (Auth)**, **Hình ảnh sản phẩm**, **Nhập kho & Giá vốn**, **Đặt hàng & Voucher**, **Thống kê Doanh thu & Lợi nhuận**, và **Chat trực tuyến**.

---

## 🛠️ PHẦN 1: CHUẨN BỊ MÔI TRƯỜNG CHẠY HỆ THỐNG

Trước khi bắt đầu gửi request test, bạn cần đảm bảo 2 dịch vụ sau đang chạy:

### 1. Bật MySQL Database (XAMPP)
* Mở **XAMPP Control Panel**.
* Nhấn nút **Start** tại mục **MySQL** (cổng mặc định `3306`).
* Đảm bảo cơ sở dữ liệu `shopao_19` đã tồn tại.

### 2. Khởi chạy Backend (Spring Boot)
* Mở terminal tại thư mục `d:\QLShop\backend` và chạy:
  ```bash
  mvn spring-boot:run
  ```
* Chờ terminal hiện thông báo: `Started QlShopApplication in ... seconds` (chạy trên cổng `8080`).

### 3. Công cụ dùng để test
* Bạn có thể sử dụng **Postman**, **Insomnia**, tiện ích **Thunder Client** (trên VS Code) hoặc trình duyệt web.

---

## 📋 PHẦN 2: QUY TRÌNH KIỂM THỬ 6 KỊCH BẢN THỰC TẾ

---

### KỊCH BẢN 1: TEST ĐĂNG NHẬP & BẢO MẬT (AUTHENTICATION)

#### Test 1.1: Đăng nhập tài khoản Admin (Quản trị viên)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Body (Raw JSON):**
  ```json
  {
    "usernameOrEmail": "admin",
    "password": "password123"
  }
  ```
* **Kỳ vọng kết quả (200 OK):**
  - Trả về token và thông tin user có `"role": "admin"`.
  - Trình duyệt/Postman tự động nhận được Cookie `access_token` (HttpOnly).

#### Test 1.2: Đăng nhập tài khoản Khách hàng (User)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/auth/login`
* **Body:**
  ```json
  {
    "usernameOrEmail": "phuongoanh",
    "password": "password123"
  }
  ```
* **Kỳ vọng:** Đăng nhập thành công, role là `"user"`.

#### Test 1.3: Kiểm tra thông tin phiên đăng nhập hiện tại
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/auth/me`
* **Headers:** Cookie tự đính kèm (hoặc Header `Authorization: Bearer <token>`)
* **Kỳ vọng:** Trả về thông tin chính xác của người vừa đăng nhập.

---

### KỊCH BẢN 2: TEST HÌNH ẢNH SẢN PHẨM (PRODUCT IMAGES)

#### Test 2.1: Xem danh sách sản phẩm ngoài trang chủ (Kèm ảnh chính `isPrimary`)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/products?page=0&size=10`
* **Kỳ vọng:** 
  - Mỗi sản phẩm trả về danh sách `images`.
  - Có ít nhất một ảnh mang cờ `"isPrimary": true` để làm ảnh đại diện bên ngoài.

#### Test 2.2: Xem chi tiết sản phẩm và toàn bộ Album ảnh (Gallery)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/products/1`
* **Kỳ vọng:**
  - Nhận được danh sách đầy đủ các ảnh: mặt trước, mặt sau, cận cảnh chất vải.

---

### KỊCH BẢN 3: TEST NHÀ CUNG CẤP & NHẬP HÀNG KHO (GIÁ VỐN HÀNG BÁN)

> **Mục tiêu:** Nhập hàng từ xưởng may vào kho, tự động tăng số lượng tồn kho và thiết lập **Giá vốn (`costPrice`)** chuẩn thực tế.

#### Test 3.1: Tạo Nhà Cung Cấp Mới
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/suppliers`
* **Headers:** `Content-Type: application/json`
* **Body:**
  ```json
  {
    "code": "NCC-HN-001",
    "name": "Xưởng May Thể Thao Dệt Kim Hà Nội",
    "contactPerson": "Nguyễn Văn Hùng",
    "phone": "0987654321",
    "email": "xuongmayhn@example.com",
    "address": "Cụm Công Nghiệp Nam Từ Liêm, Hà Nội"
  }
  ```
* **Kỳ vọng (201 Created):** Nhà cung cấp được tạo thành công với `id: 1`.

#### Test 3.2: Lập Phiếu Nhập Kho (Trạng thái DRAFT)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/goods-receipts`
* **Body:**
  ```json
  {
    "supplierId": 1,
    "importedById": 1,
    "note": "Nhập lô áo thun hè đợt 1 năm 2026",
    "items": [
      {
        "productId": 1,
        "variantId": 1,
        "quantity": 100,
        "importPrice": 120000.0
      },
      {
        "productId": 1,
        "variantId": 2,
        "quantity": 150,
        "importPrice": 120000.0
      }
    ]
  }
  ```
* **Kỳ vọng (201 Created):**
  - Sinh mã phiếu: `PNK-YYYYMMDD-XXXXXX`.
  - Trạng thái: `DRAFT`.
  - Tổng tiền nhập tự động tính: `(100*120k) + (150*120k) = 30,000,000đ`.

#### Test 3.3: Duyệt Hoàn Tất Nhập Kho
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/goods-receipts/1/complete`
* **Kỳ vọng (200 OK):**
  - Trạng thái phiếu chuyển thành `COMPLETED`.
  - Tồn kho của variant 1 tăng thêm `100`, variant 2 tăng thêm `150`.
  - Giá vốn `costPrice` của sản phẩm được ghi nhận là `120,000đ`.

---

### KỊCH BẢN 4: TEST ÁP DỤNG VOUCHER & ĐẶT HÀNG

#### Test 4.1: Kiểm tra tính hợp lệ của Voucher
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/vouchers/apply`
* **Body:**
  ```json
  {
    "code": "CHAOHAY2026",
    "orderAmount": 500000.0
  }
  ```
* **Kỳ vọng (200 OK):** Hệ thống trả về số tiền được giảm (`discountAmount`) và tổng tiền còn lại sau giảm.

#### Test 4.2: Khách Đặt Hàng (Tạo Đơn Mới)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/orders`
* **Headers:** Đã đăng nhập tài khoản khách hàng
* **Body:**
  ```json
  {
    "userId": 10,
    "receiverName": "Đỗ Phương Oanh",
    "receiverPhone": "0990123456",
    "shippingAddress": "22 Võ Thị Sáu, Biên Hòa, Đồng Nai",
    "note": "Giao giờ hành chính",
    "voucherCode": "",
    "items": [
      {
        "productId": 1,
        "variantId": 1,
        "quantity": 2
      }
    ]
  }
  ```
* **Kỳ vọng (201 Created):**
  - Đơn hàng được tạo với trạng thái `PENDING`.
  - Tồn kho Variant 1 tự động bị trừ đi `2` cái.
  - Cột `cost_price` trong `order_items` tự động lưu vết giá vốn là `120,000đ`.

---

### KỊCH BẢN 5: DUYỆT ĐƠN & KIỂM TRA BÁO CÁO DOANH THU - LỢI NHUẬN

#### Test 5.1: Admin Duyệt Đơn Sang Hoàn Thành (`COMPLETED`)
* **Method:** `PUT`
* **URL:** `http://localhost:8080/api/orders/1/status`
* **Body:**
  ```json
  {
    "status": "COMPLETED"
  }
  ```

#### Test 5.2: Xem Báo Cáo Tài Chính Tổng Quan
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/dashboard/summary`
* **Kỳ vọng (200 OK):**
  ```json
  {
    "totalRevenue": 500000.0,
    "totalCost": 240000.0,
    "totalProfit": 260000.0,
    "profitMargin": 52.0,
    "totalImportExpense": 30000000.0,
    "totalOrders": 1,
    "completedOrders": 1
  }
  ```
  👉 **Phân tích:** 
  - Khách mua 2 áo giá 250k = Doanh thu `500,000đ`.
  - Giá vốn 2 áo là `120k * 2 = 240,000đ`.
  - Lợi nhuận thực tế thu về: `500k - 240k = 260,000đ` (Tỷ suất lợi nhuận đạt `52%`).

#### Test 5.3: Xem Biểu Đồ Doanh Thu & Lợi Nhuận 7 Ngày
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/dashboard/chart?days=7`
* **Kỳ vọng:** Mỗi ngày có đủ 3 cột: `revenue` (doanh thu), `cost` (giá vốn), `profit` (lợi nhuận).

---

### KỊCH BẢN 6: TEST TRÒ CHUYỆN TRỰC TUYẾN (LIVE CHAT)

#### Test 6.1: Khách hàng gửi tin nhắn hỏi tư vấn
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/chat/send`
* **Headers:** Đăng nhập tài khoản khách (`phuongoanh`)
* **Body:**
  ```json
  {
    "productId": 1,
    "content": "Shop ơi mẫu áo này mình cao 1m60 nặng 50kg mặc size S hay M thì vừa ạ?"
  }
  ```
* **Kỳ vọng (201 Created):** Tin nhắn được lưu thành công, tự động mở một `conversationId`.

#### Test 6.2: Nhân viên Shop trả lời tin nhắn
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/chat/conversations/1/reply`
* **Headers:** Đăng nhập tài khoản Staff hoặc Admin
* **Body:**
  ```json
  {
    "content": "Dạ chào bạn, với chiều cao và cân nặng đó bạn mặc size M sẽ rất thoải mái và đẹp nhé!"
  }
  ```
* **Kỳ vọng (200 OK):** Tin nhắn phản hồi được gửi và lưu vào cuộc hội thoại.

#### Test 6.3: Xem danh sách tin nhắn trong cuộc trò chuyện
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/chat/conversations/1/messages`
* **Kỳ vọng:** Trả về danh sách 2 tin nhắn theo đúng thứ tự thời gian.

---

## ⚠️ PHẦN 3: CÁC MÃ LỖI THƯỜNG GẶP VÀ CÁCH KHẮC PHỤC

| Mã lỗi | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **`400 Bad credentials`** | Gõ sai username hoặc mật khẩu, hoặc tên trường JSON không đúng. | Đảm bảo tên trường trong JSON là `"usernameOrEmail"` và mật khẩu là `"password123"`. |
| **`401 Unauthorized`** | Chưa đăng nhập hoặc chưa truyền Token/Cookie. | Gọi API `POST /api/auth/login` trước để lấy phiên đăng nhập. |
| **`403 Forbidden`** | Tài khoản không đủ quyền (VD: Khách hàng cố duyệt phiếu nhập kho hoặc sửa giá áo). | Đăng nhập bằng tài khoản có vai trò `admin` hoặc `staff`. |
| **`404 Not Found`** | ID sản phẩm, ID nhà cung cấp hoặc ID phiếu nhập không tồn tại. | Kiểm tra lại ID trong cơ sở dữ liệu trước khi gửi request. |
| **`Connection Refused`** | MySQL chưa bật hoặc cổng 3306 bị chặn. | Mở XAMPP và nhấn Start tại MySQL. |

