-- ==============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU CHUẨN DỰ ÁN QLSHOP (DATABASE: shopao_19)
-- Hệ Quản Trị: MySQL 8.x / MariaDB
-- Bộ mã: UTF-8 Unicode (utf8mb4_unicode_ci)
-- Bao gồm đầy đủ 13 Bảng:
--  1. users (Người dùng, Phân quyền Admin, Staff, User, Mật khẩu BCrypt: password123)
--  2. brands (Thương hiệu thời trang nổi tiếng)
--  3. categories (Danh mục sản phẩm đa dạng)
--  4. products (Sản phẩm thời trang cao cấp)
--  5. product_images (Thư viện hình ảnh sắc nét, có đánh dấu ảnh chính)
--  6. cart (Giỏ hàng người dùng)
--  7. cart_items (Chi tiết mặt hàng trong giỏ)
--  8. comment (Đánh giá, nhận xét khách quan)
--  9. `order` (Đơn đặt hàng với nhiều trạng thái: PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED)
-- 10. order_items (Chi tiết món hàng trong đơn)
-- 11. wishlists (Danh sách yêu thích có ràng buộc UNIQUE chống trùng lặp)
-- 12. conversations (Hộp thoại chat giữa Khách hàng và Chủ shop / Nhân viên)
-- 13. messages (Nội dung tin nhắn trò chuyện, trạng thái đã đọc)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `shopao_19` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `shopao_19`;

-- Tắt kiểm tra khóa ngoại tạm thời để khởi tạo/xóa bảng an toàn
SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================================================
-- 1. BẢNG users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `gender` VARCHAR(20) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `active` TINYINT(1) DEFAULT 1,
  `reset_password_token` VARCHAR(255) DEFAULT NULL,
  `reset_password_token_expiry` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `users`;
ALTER TABLE `users` AUTO_INCREMENT = 1;

-- Tất cả tài khoản mẫu có mật khẩu mặc định là: password123 (Đã mã hóa chuẩn BCrypt)
-- Hash: $2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2
INSERT INTO `users` (`id`, `name`, `username`, `phone`, `email`, `gender`, `address`, `password`, `avatar`, `role`, `active`) VALUES
(1, 'Nguyễn Văn An (Chủ Shop)', 'admin', '0901234567', 'admin@shopao.com', 'Nam', '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', 'admin', 1),
(2, 'Trần Thị Bích (Nhân Viên)', 'staff1', '0912345678', 'bich.staff@shopao.com', 'Nữ', '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'staff', 1),
(3, 'Lê Hoàng Cường (Khách Hàng)', 'hoangcuong', '0923456789', 'cuong.le@gmail.com', 'Nam', '78 Hai Bà Trưng, Phường 6, Quận 3, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 'user', 1),
(4, 'Phạm Thị Dung', 'dungpham', '0934567890', 'dung.pham@gmail.com', 'Nữ', '12 Quang Trung, Phường 10, Gò Vấp, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'user', 1),
(5, 'Hoàng Minh Đức', 'minhduc', '0945678901', 'duc.hoang@gmail.com', 'Nam', '56 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'user', 1),
(6, 'Vũ Thị Hoa', 'hoavu', '0956789012', 'hoa.vu@gmail.com', 'Nữ', '89 Kim Mã, Giảng Võ, Ba Đình, Hà Nội', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'user', 1),
(7, 'Đặng Hữu Hùng', 'huuhung', '0967890123', 'hung.dang@gmail.com', 'Nam', '15 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'user', 1),
(8, 'Ngô Mỹ Linh', 'mylinh', '0978901234', 'linh.ngo@gmail.com', 'Nữ', '34 Hùng Vương, Lộc Thọ, Nha Trang, Khánh Hòa', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'user', 1),
(9, 'Bùi Quốc Nam', 'quocnam', '0989012345', 'nam.bui@gmail.com', 'Nam', '102 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', 'user', 1),
(10, 'Đỗ Phương Oanh', 'phuongoanh', '0990123456', 'oanh.do@gmail.com', 'Nữ', '22 Võ Thị Sáu, Thống Nhất, Biên Hòa, Đồng Nai', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1517841905240-472988babdf9', 'user', 1);

-- ==============================================================================
-- 2. BẢNG brands (Thương hiệu)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `brands` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `logo` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `brands`;
ALTER TABLE `brands` AUTO_INCREMENT = 1;

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`) VALUES
(1, 'Nike', 'nike', 'Thương hiệu thể thao hàng đầu thế giới với slogan Just Do It', 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'),
(2, 'Adidas', 'adidas', 'Thương hiệu đồ thể thao và thời trang đường phố từ Đức', 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg'),
(3, 'Uniqlo', 'uniqlo', 'Thương hiệu thời trang LifeWear tối giản cao cấp từ Nhật Bản', 'https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg'),
(4, 'Routine', 'routine', 'Thương hiệu thời trang nam phong cách thanh lịch hiện đại', 'https://routine.vn/media/logo/default/logo_routine_1.png'),
(5, 'Coolmate', 'coolmate', 'Giải pháp mua sắm thời trang tiện lợi chất lượng cho phái mạnh', 'https://mcdn.coolmate.me/image/March2023/mceclip0_76.png'),
(6, 'Levents', 'levents', 'Thương hiệu thời trang đường phố Streetwear dẫn đầu giới trẻ', 'https://levents.asia/cdn/shop/files/Logo_Levents_Header.png'),
(7, 'DirtyCoins', 'dirtycoins', 'Thương hiệu thời trang đường phố đậm chất văn hóa Y2K', 'https://dirtycoins.vn/images/logo.png'),
(8, 'Teelab', 'teelab', 'Local brand thời trang trẻ trung năng động phong cách mới', 'https://teelab.vn/wp-content/uploads/2021/08/logo-teelab.png'),
(9, 'Zara', 'zara', 'Thương hiệu thời trang nhanh quốc tế đến từ Tây Ban Nha', 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg'),
(10, 'H&M', 'hm', 'Thương hiệu thời trang quốc tế phong cách phong phú và bền vững', 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg');

-- ==============================================================================
-- 3. BẢNG categories (Danh mục sản phẩm)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `active` INT DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `categories`;
ALTER TABLE `categories` AUTO_INCREMENT = 1;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `active`) VALUES
(1, 'Áo Thun', 'ao-thun', 'Các loại áo thun cổ tròn, áo thun oversize thoáng mát', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518', 1),
(2, 'Áo Polo', 'ao-polo', 'Áo thun có cổ thanh lịch cho công sở và dạo phố', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820', 1),
(3, 'Áo Sơ Mi', 'ao-so-mi', 'Áo sơ mi tay dài, tay ngắn phong cách lịch lãm', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 1),
(4, 'Áo Khoác', 'ao-khoac', 'Áo khoác gió, bomber, áo khoác chống nắng, chống nước', 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 1),
(5, 'Áo Hoodie & Sweater', 'ao-hoodie-sweater', 'Áo nỉ có mũ và không mũ phong cách streetwear mùa thu đông', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2', 1),
(6, 'Quần Jeans', 'quan-jeans', 'Quần bò denim ống suông, skinny, rách gối cá tính', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246', 1),
(7, 'Quần Tây & Khaki', 'quan-tay-khaki', 'Quần âu, quần chinos phối cùng sơ mi và polo', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a', 1),
(8, 'Quần Short', 'quan-short', 'Quần short thể thao, short thun, short kaki năng động', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b', 1),
(9, 'Đồ Thể Thao', 'do-the-thao', 'Trang phục tập gym, chạy bộ, đá bóng co giãn tốt', 'https://images.unsplash.com/photo-1518611012118-696072aa579a', 1),
(10, 'Phụ Kiện Thời Trang', 'phu-kien-thoi-trang', 'Nón, thắt lưng, tất, túi tote và balo thời trang', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b', 1);

-- ==============================================================================
-- 4. BẢNG products (Sản phẩm)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `price` DOUBLE NOT NULL,
  `description` TEXT DEFAULT NULL,
  `rating` DOUBLE DEFAULT 0,
  `slug` VARCHAR(255) DEFAULT NULL,
  `views` INT DEFAULT 0,
  `brand_id` BIGINT NOT NULL,
  `category_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prod_brand` (`brand_id`),
  KEY `fk_prod_cat` (`category_id`),
  CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `products`;
ALTER TABLE `products` AUTO_INCREMENT = 1;

INSERT INTO `products` (`id`, `name`, `price`, `description`, `rating`, `slug`, `views`, `brand_id`, `category_id`) VALUES
(1, 'Áo Thun Cotton Compact Coolmate', 199000, 'Chất liệu cotton compact 100% mềm mịn, thoáng khí, chống co rút', 4.9, 'ao-thun-cotton-compact-coolmate', 1250, 5, 1),
(2, 'Áo Polo Dri-FIT Nike Club', 850000, 'Công nghệ Dri-FIT độc quyền giúp luôn khô thoáng khi vận động thể thao', 4.8, 'ao-polo-dri-fit-nike-club', 2300, 1, 2),
(3, 'Áo Sơ Mi Oxford Dài Tay Routine', 450000, 'Vải dệt Oxford cao cấp, chống nhăn tự nhiên, form dáng slim-fit chuẩn công sở', 4.7, 'ao-so-mi-oxford-dai-tay-routine', 980, 4, 3),
(4, 'Áo Khoác Gió Thể Thao Adidas Tiro', 1200000, 'Chống nước nhẹ, cản gió cực tốt với họa tiết 3 sọc kinh điển dọc tay áo', 4.9, 'ao-khoac-gio-the-thao-adidas-tiro', 3100, 2, 4),
(5, 'Áo Hoodie Nỉ Bông Levents Raglan', 520000, 'Form dáng oversize cá tính, lót bông ấm áp, in họa tiết nổi bật phía sau', 4.6, 'ao-hoodie-ni-bong-levents-raglan', 1840, 6, 5),
(6, 'Quần Jeans Regular Fit Uniqlo', 890000, 'Vải denim co giãn Kaihara Nhật Bản siêu bền và thoải mái suốt ngày dài', 4.9, 'quan-jeans-regular-fit-uniqlo', 2150, 3, 6),
(7, 'Quần Khaki Slim Crop Routine', 420000, 'Chất vải khaki co giãn nhẹ, chiều dài chạm mắt cá chân hiện đại', 4.5, 'quan-khaki-slim-crop-routine', 760, 4, 7),
(8, 'Quần Short Thể Thao Nike Challenger', 650000, 'Quần chạy bộ có túi đựng điện thoại tiện lợi và lớp lót lưới bên trong', 4.8, 'quan-short-the-thao-nike-challenger', 1420, 1, 8),
(9, 'Áo Thun Streetwear DirtyCoins Logo Tee', 380000, 'In hình logo biểu tượng DirtyCoins nổi bật, chất vải thun 250gsm dày dặn', 4.6, 'ao-thun-streetwear-dirtycoins-logo-tee', 2890, 7, 1),
(10, 'Áo Polo Dệt Kim Teelab Premium', 290000, 'Chất liệu len dệt kim mỏng nhẹ thoáng mát, họa tiết sọc retro thời thượng', 4.7, 'ao-polo-det-kim-teelab-premium', 1110, 8, 2);

-- ==============================================================================
-- 5. BẢNG product_images (Ảnh sản phẩm)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_img_prod` (`product_id`),
  CONSTRAINT `fk_img_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `product_images`;
ALTER TABLE `product_images` AUTO_INCREMENT = 1;

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `created_at`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518', 1, NOW()),
(2, 1, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', 0, NOW()),
(3, 2, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820', 1, NOW()),
(4, 2, 'https://images.unsplash.com/photo-1625910513413-5b871c57fa4e', 0, NOW()),
(5, 3, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 1, NOW()),
(6, 4, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 1, NOW()),
(7, 5, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2', 1, NOW()),
(8, 6, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246', 1, NOW()),
(9, 7, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a', 1, NOW()),
(10, 8, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b', 1, NOW()),
(11, 9, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c', 1, NOW()),
(12, 10, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990', 1, NOW());

-- ==============================================================================
-- 6. BẢNG cart (Giỏ hàng)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `cart` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `cart`;
ALTER TABLE `cart` AUTO_INCREMENT = 1;

INSERT INTO `cart` (`id`, `user_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- ==============================================================================
-- 7. BẢNG cart_items (Chi tiết giỏ hàng)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cart_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_item_cart` (`cart_id`),
  KEY `fk_item_prod` (`product_id`),
  CONSTRAINT `fk_item_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `cart_items`;
ALTER TABLE `cart_items` AUTO_INCREMENT = 1;

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 3, 1, 2),
(2, 3, 2, 1),
(3, 4, 3, 1),
(4, 5, 4, 1),
(5, 5, 6, 2),
(6, 6, 5, 1),
(7, 7, 7, 2),
(8, 8, 8, 1),
(9, 9, 9, 3),
(10, 10, 10, 2);

-- ==============================================================================
-- 8. BẢNG comment (Đánh giá / Bình luận)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `comment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cm_user` (`user_id`),
  KEY `fk_cm_prod` (`product_id`),
  CONSTRAINT `fk_cm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cm_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `comment`;
ALTER TABLE `comment` AUTO_INCREMENT = 1;

INSERT INTO `comment` (`id`, `user_id`, `product_id`, `content`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 1, 'Áo mặc cực kỳ êm và mát, form rất vừa vặn, sẽ tiếp tục ủng hộ shop!', NOW(), NOW(), NULL),
(2, 4, 2, 'Chất vải thể thao xịn xò, thấm mồ hôi rất tốt khi chơi thể thao, màu sắc đẹp.', NOW(), NOW(), NULL),
(3, 5, 3, 'Sơ mi lên form chuẩn công sở, màu sắc trang nhã dễ phối đồ với quần tây.', NOW(), NOW(), NULL),
(4, 6, 4, 'Áo khoác gió rất nhẹ nhưng cản gió cực ấm, đường may tỉ mỉ và sắc nét.', NOW(), NOW(), NULL),
(5, 7, 5, 'Hoodie dày dặn, nón to trùm đầu thoải mái, phong cách trẻ trung chuẩn streetwear.', NOW(), NOW(), NULL),
(6, 8, 6, 'Quần jeans co giãn thoải mái, không bị gò bó khi ngồi xe hay vận động mạnh.', NOW(), NOW(), NULL),
(7, 9, 7, 'Chất khaki dày dặn, giặt máy không bị xù lông hay phai màu, đóng gói cẩn thận.', NOW(), NOW(), NULL),
(8, 10, 8, 'Quần short thể thao mặc chạy bộ rất nhẹ, có túi khóa zip cực kỳ tiện lợi.', NOW(), NOW(), NULL),
(9, 3, 9, 'Họa tiết in sắc nét, giặt không bị nứt vỡ hình in, vải cotton dày dặn.', NOW(), NOW(), NULL),
(10, 4, 10, 'Áo polo len dệt kim mặc rất sang, màu sắc đúng y hệt như hình mẫu chụp.', NOW(), NOW(), NULL);

-- ==============================================================================
-- 9. BẢNG `order` (Đơn hàng)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `receiver_name` VARCHAR(255) NOT NULL,
  `receiver_phone` VARCHAR(20) NOT NULL,
  `shipping_address` VARCHAR(500) NOT NULL,
  `note` VARCHAR(500) DEFAULT NULL,
  `total_amount` DOUBLE NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `order`;
ALTER TABLE `order` AUTO_INCREMENT = 1;

INSERT INTO `order` (`id`, `user_id`, `receiver_name`, `receiver_phone`, `shipping_address`, `note`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'Lê Hoàng Cường', '0923456789', '78 Hai Bà Trưng, Phường 6, Quận 3, TP.HCM', 'Giao trong giờ hành chính từ thứ 2 đến thứ 6', 1248000, 'COMPLETED', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 8 DAY),
(2, 4, 'Phạm Thị Dung', '0934567890', '12 Quang Trung, Phường 10, Gò Vấp, TP.HCM', 'Gọi trước 15 phút khi chuẩn bị giao hàng', 450000, 'COMPLETED', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 5 DAY),
(3, 5, 'Hoàng Minh Đức', '0945678901', '56 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', 'Giao hàng tận tay người nhận', 2980000, 'SHIPPING', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY),
(4, 6, 'Vũ Thị Hoa', '0956789012', '89 Kim Mã, Giảng Võ, Ba Đình, Hà Nội', 'Giao buổi sáng', 520000, 'CONFIRMED', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY),
(5, 7, 'Đặng Hữu Hùng', '0967890123', '15 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng', 'Để ở quầy lễ tân nếu vắng nhà', 840000, 'PENDING', NOW() - INTERVAL 1 DAY, NOW()),
(6, 8, 'Ngô Mỹ Linh', '0978901234', '34 Hùng Vương, Lộc Thọ, Nha Trang, Khánh Hòa', 'Hàng thời trang xin cẩn thận bọc túi bóng', 650000, 'CANCELLED', NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 11 DAY),
(7, 9, 'Bùi Quốc Nam', '0989012345', '102 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ', 'Giao buổi chiều sau 14h', 1140000, 'COMPLETED', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 4 DAY),
(8, 10, 'Đỗ Phương Oanh', '0990123456', '22 Võ Thị Sáu, Thống Nhất, Biên Hòa, Đồng Nai', 'Không có ghi chú gì thêm', 580000, 'CONFIRMED', NOW() - INTERVAL 2 DAY, NOW()),
(9, 3, 'Lê Hoàng Cường', '0923456789', '78 Hai Bà Trưng, Phường 6, Quận 3, TP.HCM', 'Đơn hàng mua tặng bạn', 850000, 'PENDING', NOW(), NOW()),
(10, 5, 'Hoàng Minh Đức', '0945678901', '56 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', 'Ship nhanh hỏa tốc giúp mình', 199000, 'SHIPPING', NOW() - INTERVAL 1 DAY, NOW());

-- ==============================================================================
-- 10. BẢNG order_items (Chi tiết đơn hàng)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DOUBLE NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_oi_order` (`order_id`),
  KEY `fk_oi_prod` (`product_id`),
  CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oi_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `order_items`;
ALTER TABLE `order_items` AUTO_INCREMENT = 1;

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 199000),
(2, 1, 2, 1, 850000),
(3, 2, 3, 1, 450000),
(4, 3, 4, 1, 1200000),
(5, 3, 6, 2, 890000),
(6, 4, 5, 1, 520000),
(7, 5, 7, 2, 420000),
(8, 6, 8, 1, 650000),
(9, 7, 9, 3, 380000),
(10, 8, 10, 2, 290000);

-- ==============================================================================
-- 11. BẢNG wishlists (Danh sách sản phẩm yêu thích)
-- Có ràng buộc UNIQUE (user_id, product_id) để chống trùng lặp dữ liệu
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  KEY `fk_wl_user` (`user_id`),
  KEY `fk_wl_prod` (`product_id`),
  CONSTRAINT `fk_wl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wl_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `wishlists`;
ALTER TABLE `wishlists` AUTO_INCREMENT = 1;

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 3, 1, NOW() - INTERVAL 5 DAY),
(2, 3, 2, NOW() - INTERVAL 4 DAY),
(3, 3, 4, NOW() - INTERVAL 2 DAY),
(4, 4, 3, NOW() - INTERVAL 3 DAY),
(5, 4, 5, NOW() - INTERVAL 1 DAY),
(6, 5, 2, NOW() - INTERVAL 6 DAY),
(7, 5, 6, NOW() - INTERVAL 3 DAY),
(8, 6, 4, NOW() - INTERVAL 2 DAY),
(9, 7, 1, NOW() - INTERVAL 4 DAY),
(10, 8, 9, NOW() - INTERVAL 1 DAY);

-- ==============================================================================
-- 12. BẢNG conversations (Hộp thoại trò chuyện giữa Khách và Shop)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `buyer_id` BIGINT NOT NULL,
  `seller_id` BIGINT DEFAULT NULL,
  `product_id` BIGINT DEFAULT NULL,
  `last_message_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conv_buyer` (`buyer_id`),
  KEY `idx_conv_seller` (`seller_id`),
  KEY `idx_conv_product` (`product_id`),
  KEY `idx_conv_last_msg` (`last_message_at`),
  CONSTRAINT `fk_conv_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_conv_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_conv_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `conversations`;
ALTER TABLE `conversations` AUTO_INCREMENT = 1;

INSERT INTO `conversations` (`id`, `buyer_id`, `seller_id`, `product_id`, `last_message_at`, `created_at`) VALUES
(1, 3, 1, 1, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 2 DAY),
(2, 4, 1, 2, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 1 DAY),
(3, 5, 2, 4, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 3 DAY),
(4, 6, 1, NULL, NOW() - INTERVAL 10 HOUR, NOW() - INTERVAL 4 DAY);

-- ==============================================================================
-- 13. BẢNG messages (Tin nhắn chi tiết trong cuộc hội thoại)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `messages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `conversation_id` BIGINT NOT NULL,
  `sender_id` BIGINT NOT NULL,
  `content` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `sent_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_msg_conv` (`conversation_id`),
  KEY `idx_msg_sender` (`sender_id`),
  KEY `idx_msg_sent_at` (`sent_at`),
  CONSTRAINT `fk_msg_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `messages`;
ALTER TABLE `messages` AUTO_INCREMENT = 1;

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `is_read`, `sent_at`) VALUES
-- Cuộc hội thoại 1 (Khách hoangcuong hỏi về Áo Thun Coolmate)
(1, 1, 3, 'Shop ơi, áo thun Coolmate này chiều cao 1m75 nặng 68kg thì mặc size gì vừa ạ?', 1, NOW() - INTERVAL 2 DAY),
(2, 1, 1, 'Chào bạn Cường! Với chiều cao và cân nặng đó thì bạn mặc size L là chuẩn form thoải mái nhất nhé ạ.', 1, NOW() - INTERVAL 2 DAY + INTERVAL 15 MINUTE),
(3, 1, 3, 'Vải này giặt máy có bị xù lông hay phai màu không shop?', 1, NOW() - INTERVAL 1 DAY),
(4, 1, 1, 'Dạ vải Cotton Compact 100% được xử lý chống co rút và chống xù lông rất tốt nên bạn hoàn toàn yên tâm giặt máy thoải mái ạ!', 0, NOW() - INTERVAL 1 HOUR),

-- Cuộc hội thoại 2 (Khách dungpham hỏi về Polo Nike)
(5, 2, 4, 'Shop cho mình hỏi áo Polo Nike Club này còn sẵn màu đen size M không?', 1, NOW() - INTERVAL 1 DAY),
(6, 2, 1, 'Dạ shop hiện còn sẵn 3 chiếc size M tại kho bạn nhé, bạn đặt sớm để shop đóng gói giao trong ngày ạ!', 0, NOW() - INTERVAL 3 HOUR),

-- Cuộc hội thoại 3 (Khách minhduc hỏi về Áo khoác Adidas)
(7, 3, 5, 'Áo khoác gió Adidas Tiro này có chống nước đi mưa nhỏ được không shop?', 1, NOW() - INTERVAL 3 DAY),
(8, 3, 2, 'Dạ áo có lớp phủ trượt nước bên ngoài, đi mưa phùn hoặc sương sớm thoải mái bạn nha!', 1, NOW() - INTERVAL 3 DAY + INTERVAL 30 MINUTE),

-- Cuộc hội thoại 4 (Khách hoavu chat chung hỏi chính sách giao hàng)
(9, 4, 6, 'Shop có hỗ trợ giao hỏa tốc 2 giờ nội thành TP.HCM không ạ?', 1, NOW() - INTERVAL 4 DAY),
(10, 4, 1, 'Dạ shop có hỗ trợ giao Grab/Ahamove hỏa tốc nhận trong 2 giờ ạ. Bạn chọn phương thức giao nhanh lúc đặt đơn giúp shop nhé!', 0, NOW() - INTERVAL 10 HOUR);

-- Bật lại kiểm tra khóa ngoại sau khi hoàn tất
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- HOÀN TẤT NẠP DỮ LIỆU: 13/13 BẢNG ĐÃ ĐƯỢC KHỞI TẠO VÀ NẠP DỮ LIỆU CHUẨN XÁC!
-- ==============================================================================
