# Shop Áo (Quản lý bán hàng) - Spring Boot REST API

Dự án backend quản lý shop bán áo, xây dựng bằng **Spring Boot** và **MySQL**. Mục tiêu là luyện viết các hàm nghiệp vụ ở tầng Service (CRUD, tìm kiếm, lọc, sắp xếp, phân trang).

## Công nghệ sử dụng

- Java, Spring Boot 4.x
- Spring Web (REST API)
- Spring Data JPA (Hibernate)
- MySQL (MariaDB khi chạy qua XAMPP)
- Maven
- Công cụ test: Postman

## Cấu trúc thư mục

```
src/main/java/com/example/demo
├── controller     # Nhận request, trả response
├── service        # Xử lý nghiệp vụ
├── repository     # Truy vấn DB (Spring Data JPA)
└── entity          # Entity ánh xạ với bảng
```

## Các bảng dữ liệu

| Bảng | Mô tả |
|---|---|
| `brands` | Thương hiệu |
| `categories` | Danh mục sản phẩm |
| `products` | Sản phẩm |
| `users` | Người dùng |
| `comment` | Bình luận về sản phẩm |
| `cart` | Giỏ hàng |
| `cart_items` |Chi tiết giỏ hàng|
| `order` | Đơn hàng |
| `order_items` |Chi tiết đơn hàng|

Quan hệ chính:
- 1 `brand` có nhiều `products`
- 1 `category` có nhiều `products`
- 1 `user` viết nhiều `comment` và có 1 'cart', 1 `product` có nhiều `comment`


## Chức năng đã có

- **CRUD** cho Product, Brand, Category, User, Comment
- **Tìm kiếm** sản phẩm theo tên (không phân biệt hoa thường)
- **Lọc** sản phẩm theo danh mục, thương hiệu, khoảng giá
- **Sắp xếp** sản phẩm theo tên (A-Z / Z-A)
- **Phân trang** cho danh sách, tìm kiếm và lọc
- Trả mã lỗi HTTP phù hợp (404 khi không tìm thấy, 400 khi thiếu tham số)

## Hướng phát triển

- Mã hóa mật khẩu bằng BCrypt, đăng nhập
- Giỏ hàng, đơn hàng
- Sản phẩm yêu thích
- Chat giữa khách và shop
- Dùng DTO thay vì trả trực tiếp entity

## Cài đặt và chạy

### 1. Yêu cầu

- JDK 17 trở lên
- Maven
- MySQL đang chạy (XAMPP hoặc MySQL Server)

### 2. Tạo database

```sql
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

Có thể import file `shop.sql` để có sẵn cấu trúc bảng.

### 3. Cấu hình `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shop
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Chỉnh `username`, `password` theo máy của bạn. Với `ddl-auto=update`, Hibernate tự tạo các bảng còn thiếu.

### 4. Chạy ứng dụng

```bash
mvn spring-boot:run
```

Ứng dụng chạy tại `http://localhost:8080`.

## API Product

Đường dẫn gốc: `/api/products`

| Method | URL | Mô tả |
|---|---|---|
| GET | `/api/products?page=0&size=10` | Lấy danh sách (có phân trang) |
| POST | `/api/products?brandId=1&categoryId=1` | Thêm sản phẩm (body JSON) |
| PUT | `/api/products/{id}?brandId=1&categoryId=1` | Sửa sản phẩm (body JSON) |
| DELETE | `/api/products/{id}` | Xóa sản phẩm |
| GET | `/api/products/search?keyword=áo&page=0&size=10` | Tìm kiếm theo tên |
| GET | `/api/products/filter/category?categoryId=1&page=0&size=10` | Lọc theo danh mục |
| GET | `/api/products/filter/brand?brandId=1&page=0&size=10` | Lọc theo thương hiệu |
| GET | `/api/products/filter/price?min=100000&max=500000&page=0&size=10` | Lọc theo khoảng giá |
| GET | `/api/products/sort?ascending=true` | Sắp xếp theo tên |

### Body JSON mẫu (POST / PUT)

```json
{
  "name": "Áo thun Nike Basic",
  "description": "Áo thun cotton thoáng mát",
  "price": 350000,
  "stock": 50
}
```

### Kết quả phân trang mẫu

```json
{
  "content": [ { "id": 1, "name": "Áo thun Nike Basic", "price": 350000 } ],
  "totalElements": 5,
  "totalPages": 3,
  "first": true,
  "last": false
}
```

## Dữ liệu mẫu

Có thể chèn nhanh dữ liệu để test (brands, categories, products, users, comment) bằng các câu `INSERT` trong phpMyAdmin. Thứ tự chèn: `brands`, `categories`, `products`, `users`, `comment`.

## Ghi chú

- Mã lỗi: `404` khi không tìm thấy dữ liệu, `409` khi trùng dữ liệu, `400` khi tham số không hợp lệ.
- Khi xóa brand hoặc category, cần kiểm tra không còn sản phẩm thuộc về nó để tránh lỗi khóa ngoại.
