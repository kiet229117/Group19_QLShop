# Hệ thống quản lý cửa hàng Áo Thun Backend

Backend REST API cho hệ thống bán áo QLShop, xây dựng bằng Spring Boot. Ứng dụng cung cấp các chức năng quản lý sản phẩm và danh mục, tài khoản, giỏ hàng, đơn hàng, voucher, đánh giá, danh sách yêu thích, chat và thống kê quản trị.

## Công nghệ

- Java 21
- Spring Boot 4.1.1, Spring MVC
- Spring Data JPA / Hibernate
- Spring Security và JWT (JJWT)
- MySQL 8.x hoặc MariaDB tương thích
- Maven Wrapper
- Jakarta Bean Validation, Lombok, Spring Mail

## Cấu trúc mã nguồn

```text
src/main/java/com/group19/QLShop/
├── config/          # Cấu hình web và CORS
├── controller/      # Các REST endpoint
├── dto/
│   ├── request/     # Dữ liệu nhận từ client
│   └── reponse/     # Dữ liệu trả về (tên package hiện tại trong mã nguồn)
├── entity/          # JPA entities và enum
├── exception/       # Exception nghiệp vụ và xử lý lỗi tập trung
├── repository/      # Truy vấn Spring Data JPA
├── security/        # Spring Security, JWT và xác thực người dùng
├── service/         # Nghiệp vụ, email và lưu file
└── specification/   # Bộ lọc sản phẩm động
src/main/resources/
└── application.properties
```

Luồng xử lý thông thường: `Controller -> Service -> Repository -> MySQL`. DTO được dùng để nhận request và định dạng response; entities ánh xạ các bảng dữ liệu.

## Chức năng

- Đăng ký, đăng nhập, đăng xuất, xem thông tin tài khoản, đổi và đặt lại mật khẩu.
- Xác thực stateless bằng JWT; mật khẩu được mã hóa BCrypt.
- Quản lý sản phẩm, biến thể, hình ảnh, giá khuyến mãi; tìm kiếm, lọc, gợi ý và phân trang.
- Quản lý thương hiệu, danh mục, banner và voucher.
- Quản lý hồ sơ người dùng, avatar, giỏ hàng, đơn hàng và trạng thái đơn.
- Đánh giá sản phẩm, danh sách yêu thích và hội thoại/tin nhắn với shop.
- Dashboard: tổng quan, biểu đồ doanh thu, sản phẩm bán chạy và phân bố trạng thái đơn hàng.
- Tải ảnh avatar/sản phẩm lên thư mục `uploads/`, được phục vụ dưới đường dẫn `/uploads/**`.

## Yêu cầu trước khi chạy

- JDK 21.
- MySQL 8.x hoặc MariaDB đang chạy.
- Có thể dùng Maven cài sẵn hoặc Maven Wrapper đi kèm dự án.
- SMTP Gmail nếu cần sử dụng chức năng gửi email đặt lại mật khẩu.

## Cấu hình và khởi chạy

### 1. Cấu hình MySQL

Mặc định, ứng dụng kết nối tới database `shopao_19` tại `localhost:3306` với user `root` và mật khẩu rỗng. URL có `createDatabaseIfNotExist=true`, vì vậy MySQL có thể tự tạo database nếu tài khoản có quyền.

Có thể ghi đè cấu hình bằng biến môi trường Spring Boot:

| Biến môi trường | Ý nghĩa |
|---|---|
| `SPRING_DATASOURCE_URL` | URL kết nối MySQL |
| `SPRING_DATASOURCE_USERNAME` | Tên người dùng MySQL |
| `SPRING_DATASOURCE_PASSWORD` | Mật khẩu MySQL |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Chính sách cập nhật schema |
| `SPRING_MAIL_USERNAME` | Tài khoản SMTP gửi email |
| `SPRING_MAIL_PASSWORD` | Mật khẩu ứng dụng SMTP |
| `APP_JWT_SECRET` | Khóa ký JWT |
| `APP_JWT_EXPIRATION_MS` | Thời hạn JWT, đơn vị mili giây |
| `APP_JWT_COOKIE_NAME` | Tên cookie JWT |

Không đưa mật khẩu SMTP, JWT secret hoặc thông tin đăng nhập thật vào Git. Hãy dùng biến môi trường riêng cho máy/môi trường triển khai.

> **Cảnh báo dữ liệu:** `application.properties` hiện đặt `spring.jpa.hibernate.ddl-auto=create`. Hibernate sẽ tạo lại schema khi khởi động và dữ liệu hiện có có thể bị mất. Không dùng cấu hình này với dữ liệu cần giữ. Để phát triển trên schema đã import, ghi đè thành `update` (hoặc chọn migration phù hợp) trước khi chạy; production nên dùng migration có kiểm soát thay vì `create`/`update`.

Ví dụ PowerShell từ thư mục `backend` để chạy với schema hiện có:

```powershell
$env:SPRING_JPA_HIBERNATE_DDL_AUTO = "update"
.\mvnw.cmd spring-boot:run
```

Trên macOS/Linux:

```bash
SPRING_JPA_HIBERNATE_DDL_AUTO=update ./mvnw spring-boot:run
```

### 2. Import dữ liệu mẫu (tùy chọn)

Tệp [`shopao_database.sql`](../shopao_database.sql) ở thư mục gốc repository tạo database `shopao_19`, tạo bảng và nạp dữ liệu mẫu. Có thể import bằng MySQL Workbench hoặc phpMyAdmin. Script tắt tạm kiểm tra khóa ngoại và xóa các bảng hiện có trước khi tạo lại, nên chỉ chạy trên database phát triển/test sau khi đã sao lưu dữ liệu cần giữ.

Sau khi import, phải đổi `ddl-auto` khỏi `create` trước khi khởi động backend; nếu không, Hibernate có thể xóa dữ liệu mẫu vừa import. Tài khoản mẫu trong script dùng chung mật khẩu `password123`; chỉ dùng cho môi trường thử nghiệm và đổi ngay khi cần.

### 3. Chạy ứng dụng

Từ thư mục `backend`:

```powershell
.\mvnw.cmd spring-boot:run
```

hoặc:

```bash
./mvnw spring-boot:run
```

Mặc định API chạy tại `http://localhost:8080`. Kiểm tra kết nối database và cấu hình SMTP trong log nếu ứng dụng không khởi động được. Có thể build/test bằng:

```powershell
.\mvnw.cmd clean package
.\mvnw.cmd test
```

## API

Base URL mặc định: `http://localhost:8080`. Request/response sử dụng JSON, trừ các endpoint tải ảnh dùng `multipart/form-data`. Các danh sách phân trang thường nhận `page` (bắt đầu từ `0`) và `size`.

### Xác thực

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất và xóa cookie |
| GET | `/api/auth/me` | Thông tin người dùng hiện tại |
| POST | `/api/auth/change-password` | Đổi mật khẩu |
| POST | `/api/auth/forgot-password` | Gửi yêu cầu đặt lại mật khẩu qua email |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu bằng token |

Đăng nhập/đăng ký trả JWT trong response và thiết lập cookie HttpOnly (mặc định tên `access_token`). Các request được bảo vệ gửi cookie này; backend cũng hỗ trợ xác thực JWT theo cấu hình filter. Gọi `/api/auth/logout` để xóa cookie.

### Sản phẩm và giá

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/products?page=0&size=10` | Danh sách sản phẩm |
| GET | `/api/products/slug/{slug}` | Chi tiết theo slug |
| GET | `/api/products/hot` | Sản phẩm nổi bật |
| GET | `/api/products/sale` | Sản phẩm khuyến mãi |
| GET | `/api/products/newest` | Sản phẩm mới |
| GET | `/api/products/search?keyword=ao` | Tìm theo từ khóa |
| GET | `/api/products/filter/brand?brandId=1` | Lọc theo thương hiệu |
| GET | `/api/products/filter/category?categoryId=1` | Lọc theo danh mục |
| GET | `/api/products/filter/price?minPrice=100000&maxPrice=500000` | Lọc theo khoảng giá |
| GET/POST | `/api/products/filter` | Lọc nâng cao bằng query parameters hoặc JSON body |
| GET | `/api/products/suggestions?keyword=ao&limit=6` | Gợi ý tìm kiếm |
| POST | `/api/products` | Tạo sản phẩm; JSON hoặc multipart |
| PUT | `/api/products/{id}` | Cập nhật sản phẩm bằng multipart |
| DELETE | `/api/products/{id}` | Xóa sản phẩm |
| GET/PUT/DELETE | `/api/product-prices/products/{productId}` | Đọc, cập nhật hoặc xóa giá khuyến mãi |

Endpoint POST tạo sản phẩm dạng multipart nhận part `product` (JSON) và tùy chọn nhiều part `images`. PUT cập nhật sản phẩm cũng nhận multipart với các part tương tự.

### Danh mục, nội dung và voucher

| Nhóm | Endpoint |
|---|---|
| Thương hiệu | `/api/brands` — GET, POST; `/api/brands/{id}` — PUT, DELETE |
| Danh mục | `/api/categories` — GET, POST; `/api/categories/{id}` — PUT, DELETE |
| Banner | `/api/banners` — GET, POST; `/api/banners/{id}` — GET, PUT, DELETE; `/api/banners/{id}/toggle` — PATCH; `/api/banners/active` — GET |
| Bình luận | `/api/comments` — POST; `/api/comments/product/{productId}` — GET; `/api/comments/{id}` — PUT, DELETE |
| Voucher | `/api/vouchers/available` — GET; `/api/vouchers/apply` — POST; `/api/vouchers` — GET, POST; `/api/vouchers/{id}` — DELETE |

### Tài khoản, giỏ hàng và đơn hàng

| Nhóm | Endpoint |
|---|---|
| Người dùng | `/api/users` — GET, POST; `/api/users/{id}` — GET, PUT, DELETE; `/api/users/username/{username}` — GET; `/api/users/email/{email}` — GET; `/api/users/{id}/avatar` — POST multipart |
| Giỏ hàng | `/api/carts` — GET; `/api/carts/user/{userId}` — GET, DELETE; `/api/carts/user/{userId}/items` — POST; `/api/carts/user/{userId}/items/{cartItemId}/increase` — PUT; `/api/carts/user/{userId}/items/{cartItemId}/decrease` — PUT; `/api/carts/user/{userId}/items/{cartItemId}` — DELETE |
| Đơn hàng | `/api/orders` — POST, GET; `/api/orders/{id}` — GET, DELETE; `/api/orders/user/{userId}` — GET; `/api/orders/{id}/status` — PUT; `/api/orders/{id}/cancel` — PUT |
| Yêu thích | `/api/wishlists` — GET, POST, DELETE; `/api/wishlists/user/{userId}` — GET; `/api/wishlists/toggle` — POST; `/api/wishlists/check/{productId}` — GET; `/api/wishlists/product/{productId}` — DELETE |

### Chat và dashboard

| Nhóm | Endpoint |
|---|---|
| Chat | `/api/chat/send` — POST; `/api/chat/conversations` — GET; `/api/chat/conversations/{conversationId}/reply` — POST; `/api/chat/conversations/{conversationId}/messages` — GET; `/api/chat/unread-count` — GET |
| Dashboard | `/api/admin/dashboard/summary` — GET; `/api/admin/dashboard/revenue-chart` — GET; `/api/admin/dashboard/top-products` — GET; `/api/admin/dashboard/order-status` — GET |

Đây là danh mục endpoint theo controller hiện tại; xem DTO request/response tương ứng trong `dto/request` và `dto/reponse` để biết đầy đủ trường bắt buộc, kiểu dữ liệu và validation.

## Phân quyền và CORS

- Không cần đăng nhập: đăng ký/đăng nhập, quên/đặt lại mật khẩu, các GET đọc sản phẩm/thương hiệu/danh mục/bình luận/banner, danh sách và áp dụng voucher, ảnh dưới `/uploads/**`.
- Yêu cầu đăng nhập: thông tin cá nhân, giỏ hàng, đơn hàng cá nhân, chat, wishlist và các thao tác bình luận.
- `ADMIN` và `STAFF`: các thao tác quản trị được cấu hình như quản lý sản phẩm/thương hiệu/danh mục/banner, xem danh sách đơn hàng, cập nhật trạng thái đơn và dashboard.
- Chỉ `ADMIN`: xóa sản phẩm/thương hiệu/danh mục/banner/voucher/đơn hàng và các thao tác quản trị người dùng tương ứng.

Quyền chi tiết được khai báo trong `security/SecurityConfig.java`; một số quyền sở hữu tài nguyên còn được kiểm tra trong service. CORS hiện chỉ cho phép origin phát triển dạng `http://localhost:*` và `http://127.0.0.1:*`, kèm credentials. Cần cấu hình lại origin phù hợp trước khi đưa lên môi trường khác.

## Database

Script SQL mẫu gồm các nhóm bảng người dùng, thương hiệu, danh mục, sản phẩm, biến thể/ảnh/giá sản phẩm, giỏ hàng, bình luận, đơn hàng, wishlist, hội thoại/tin nhắn, banner và voucher. Các entity JPA tương ứng nằm trong `src/main/java/com/group19/QLShop/entity`.

## Ghi chú

- Các đường dẫn ảnh upload được lưu tương đối và phục vụ từ thư mục `uploads/`; giữ lại thư mục này khi triển khai hoặc sao lưu ảnh cùng database.
- Phần lớn lỗi nghiệp vụ được chuẩn hóa qua `GlobalExceptionHandler`; xác thực thất bại thường trả `401`, không đủ quyền trả `403`.
- Tệp `README_AUTH.md` ở thư mục gốc repository có thêm tài liệu liên quan đến xác thực.
