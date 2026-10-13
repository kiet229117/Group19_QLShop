-- ==============================================================================
-- CƠ SỞ DỮ LIỆU HOÀN CHỈNH - SHOP CHUYÊN THỜI TRANG ÁO (DATABASE: shopao_19)
-- Hệ Quản Trị: MySQL 8.x / MariaDB
-- Bộ mã: UTF-8 Unicode (utf8mb4_unicode_ci)
-- 
-- ĐẶC ĐIỂM DỮ LIỆU:
-- 100% SẢN PHẨM & DANH MỤC LÀ CÁC LOẠI ÁO (Áo Thun, Polo, Sơ Mi, Áo Khoác, Hoodie, Sweater, Cardigan, v.v.)
-- Đầy đủ 15 bảng theo chuẩn cấu trúc Entity Hibernate của dự án:
--  1. users (Admin, Staff, Customer - Password BCrypt: password123)
--  2. brands (Thương hiệu áo nổi tiếng: Coolmate, Routine, Uniqlo, Levents, DirtyCoins, Teelab, Lacoste, Ralph Lauren, Nike, Adidas)
--  3. categories (10 danh mục chuyên áo: Áo Thun, Polo, Sơ Mi Dài/Ngắn Tay, Áo Khoác, Hoodie, Sweater, Len/Dệt Kim, Cardigan, Áo Chống Nắng)
--  4. products (16 sản phẩm áo cao cấp với mô tả, giá, slug, rating, views, is_hot)
--  5. product_variants (Biến thể Size S/M/L/XL/XXL và Màu sắc Đen/Trắng/Xanh/Be/Xám kèm tồn kho)
--  6. product_prices (Bảng giá khuyến mãi Flash Sale cho các mẫu áo hot)
--  7. product_images (Thư viện ảnh áo thời trang Unsplash sắc nét)
--  8. cart (Giỏ hàng 1-1 với user)
--  9. cart_items (Các sản phẩm áo trong giỏ hàng)
-- 10. comment (Đánh giá thực tế về chất vải, độ thoáng mát, giữ form áo)
-- 11. `order` (Đơn hàng mua áo với các trạng thái PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED)
-- 12. order_items (Chi tiết từng mẫu áo trong đơn hàng)
-- 13. wishlists (Danh sách áo yêu thích - có Unique Constraint chống trùng)
-- 14. conversations (Cuộc trò chuyện giữa khách mua áo và chủ shop)
-- 15. messages (Tin nhắn tư vấn size áo theo chiều cao/cân nặng, chất vải, ship hàng)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `shopao_19` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `shopao_19`;

-- Tạm tắt kiểm tra khóa ngoại để nạp dữ liệu sạch
SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================================================
-- 1. BẢNG users (10 Người dùng)
-- ==============================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
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

-- Mật khẩu mặc định cho toàn bộ tài khoản: password123 (Mã hóa chuẩn BCrypt)
-- Hash: $2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2
INSERT INTO `users` (`id`, `name`, `username`, `phone`, `email`, `gender`, `address`, `password`, `avatar`, `role`, `active`) VALUES
(1, 'Nguyễn Văn An (Chủ Shop Áo)', 'admin', '0901234567', 'admin@shopao.com', 'Nam', '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', 'admin', 1),
(2, 'Trần Thị Bích (Tư Vấn Viên)', 'staff1', '0912345678', 'bich.staff@shopao.com', 'Nữ', '45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'staff', 1),
(3, 'Lê Hoàng Cường', 'hoangcuong', '0923456789', 'cuong.le@gmail.com', 'Nam', '78 Hai Bà Trưng, Phường 6, Quận 3, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 'user', 1),
(4, 'Phạm Thị Dung', 'dungpham', '0934567890', 'dung.pham@gmail.com', 'Nữ', '12 Quang Trung, Phường 10, Gò Vấp, TP.HCM', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'user', 1),
(5, 'Hoàng Minh Đức', 'minhduc', '0945678901', 'duc.hoang@gmail.com', 'Nam', '56 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'user', 1),
(6, 'Vũ Thị Hoa', 'hoavu', '0956789012', 'hoa.vu@gmail.com', 'Nữ', '89 Kim Mã, Giảng Võ, Ba Đình, Hà Nội', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'user', 1),
(7, 'Đặng Hữu Hùng', 'huuhung', '0967890123', 'hung.dang@gmail.com', 'Nam', '15 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'user', 1),
(8, 'Ngô Mỹ Linh', 'mylinh', '0978901234', 'linh.ngo@gmail.com', 'Nữ', '34 Hùng Vương, Lộc Thọ, Nha Trang, Khánh Hòa', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'user', 1),
(9, 'Bùi Quốc Nam', 'quocnam', '0989012345', 'nam.bui@gmail.com', 'Nam', '102 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', 'user', 1),
(10, 'Đỗ Phương Oanh', 'phuongoanh', '0990123456', 'oanh.do@gmail.com', 'Nữ', '22 Võ Thị Sáu, Thống Nhất, Biên Hòa, Đồng Nai', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', 'https://images.unsplash.com/photo-1517841905240-472988babdf9', 'user', 1);

-- ==============================================================================
-- 2. BẢNG brands (10 Thương hiệu chuyên áo hàng đầu)
-- ==============================================================================
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `logo` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`) VALUES
(1, 'Coolmate', 'coolmate', 'Thương hiệu tiên phong áo thun, áo polo công nghệ sợi vải thoáng khí cho nam giới', 'https://mcdn.coolmate.me/image/March2023/mceclip0_76.png'),
(2, 'Routine', 'routine', 'Thương hiệu áo sơ mi, áo polo nam phong cách thanh lịch hiện đại', 'https://routine.vn/media/logo/default/logo_routine_1.png'),
(3, 'Uniqlo', 'uniqlo', 'Dẫn đầu thế giới về dòng áo thun UT, áo sơ mi chống nhăn và áo khoác chống nắng UV Cut', 'https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg'),
(4, 'Levents', 'levents', 'Local brand hàng đầu về áo thun streetwear, áo hoodie nỉ bông form oversize cho giới trẻ', 'https://levents.asia/cdn/shop/files/Logo_Levents_Header.png'),
(5, 'DirtyCoins', 'dirtycoins', 'Thương hiệu áo thun in graphic nổi loạn, áo jacket văn hóa đường phố Y2K', 'https://dirtycoins.vn/images/logo.png'),
(6, 'Teelab', 'teelab', 'Thương hiệu áo polo len dệt kim, áo phông basic trẻ trung phong cách Hàn Quốc', 'https://teelab.vn/wp-content/uploads/2021/08/logo-teelab.png'),
(7, 'Lacoste', 'lacoste', 'Biểu tượng huyền thoại thế giới về dòng áo polo cá sấu lịch lãm thượng lưu', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Lacoste_logo.svg'),
(8, 'Ralph Lauren', 'ralph-lauren', 'Đẳng cấp nước Mỹ với những mẫu áo sơ mi Oxford dệt sợi kinh điển và polo thêu ngựa', 'https://upload.wikimedia.org/wikipedia/commons/7/75/Ralph_Lauren_Logo.svg'),
(9, 'Nike', 'nike', 'Dẫn đầu dòng áo thun thể thao Dri-FIT, áo khoác chạy bộ gió nhẹ thoáng khí', 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'),
(10, 'Adidas', 'adidas', 'Nổi tiếng toàn cầu với áo khoác thể thao 3 sọc kinh điển và áo tập gym co giãn', 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg');

-- ==============================================================================
-- 3. BẢNG categories (10 Danh mục 100% là các loại áo)
-- ==============================================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `active` INT DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `active`) VALUES
(1, 'Áo Thun Cổ Tròn', 'ao-thun-co-tron', 'Áo thun cotton compact, áo thun oversize thoáng mát mềm mịn', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518', 1),
(2, 'Áo Polo', 'ao-polo', 'Áo thun có cổ lịch lãm, phối viền sang trọng cho công sở và dạo phố', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820', 1),
(3, 'Áo Sơ Mi Tay Dài', 'ao-so-mi-tay-dai', 'Sơ mi Oxford, poplin chống nhăn tự nhiên, form dáng slim-fit chuẩn mực', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 1),
(4, 'Áo Sơ Mi Tay Ngắn', 'ao-so-mi-tay-ngan', 'Sơ mi cổ cuban, họa tiết dạo phố mát mẻ cho mùa hè', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 1),
(5, 'Áo Khoác & Bomber', 'ao-khoac-bomber', 'Áo khoác gió 2 lớp, bomber trượt nước, giữ ấm và cản gió tốt', 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 1),
(6, 'Áo Hoodie Có Mũ', 'ao-hoodie-co-mu', 'Áo nỉ chui đầu có mũ, nón dày dặn phong cách streetwear thu đông', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2', 1),
(7, 'Áo Sweater & Nỉ', 'ao-sweater-ni', 'Áo nỉ cổ tròn bo gấu phong cách tối giản thanh lịch', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633', 1),
(8, 'Áo Len & Dệt Kim', 'ao-len-det-kim', 'Áo polo len dệt kim, áo len mỏng retro thời thượng', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990', 1),
(9, 'Áo Cardigan', 'ao-cardigan', 'Áo khoác len cài cúc phong cách vintage lãng mạn Hàn Quốc', 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4', 1),
(10, 'Áo Chống Nắng & UV', 'ao-chong-nang-uv', 'Áo khoác sợi công nghệ cản 98% tia tử ngoại, bảo vệ da khi đi ngoài trời', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2', 1);

-- ==============================================================================
-- 4. BẢNG products (16 Sản phẩm 100% là các mẫu áo cao cấp)
-- ==============================================================================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `price` DOUBLE NOT NULL,
  `description` TEXT DEFAULT NULL,
  `rating` DOUBLE DEFAULT 0,
  `slug` VARCHAR(255) DEFAULT NULL,
  `views` INT DEFAULT 0,
  `is_hot` TINYINT(1) DEFAULT 0,
  `brand_id` BIGINT NOT NULL,
  `category_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prod_brand` (`brand_id`),
  KEY `fk_prod_cat` (`category_id`),
  CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `name`, `price`, `description`, `rating`, `slug`, `views`, `is_hot`, `brand_id`, `category_id`) VALUES
(1, 'Áo Thun Cotton Compact Coolmate Basic', 199000, 'Sử dụng 100% sợi Cotton Compact dài xơ, bề mặt mịn màng, co giãn 4 chiều và không bị xù lông khi giặt máy.', 4.9, 'ao-thun-cotton-compact-coolmate-basic', 2450, 1, 1, 1),
(2, 'Áo Polo Dri-FIT Nike Club Tennis', 850000, 'Công nghệ Dri-FIT độc quyền giúp thấm hút mồ hôi siêu tốc. Bo cổ dệt kim đứng form, logo thêu sắc nét trước ngực.', 4.8, 'ao-polo-dri-fit-nike-club-tennis', 3200, 1, 9, 2),
(3, 'Áo Sơ Mi Oxford Dài Tay Routine Slim-fit', 450000, 'Chất liệu vải Oxford dày dặn dệt vân hạt, form dáng tôn vinh đường nét cơ thể, phù hợp môi trường công sở lịch sự.', 4.7, 'ao-so-mi-oxford-dai-tay-routine-slim-fit', 1890, 0, 2, 3),
(4, 'Áo Khoác Gió Thể Thao Adidas Tiro 3-Stripes', 1200000, 'Chất liệu trượt nước kháng bụi, khóa zip 2 chiều mượt mà, dải 3 sọc kinh điển chạy dọc tay áo đầy năng động.', 4.9, 'ao-khoac-gio-the-thao-adidas-tiro-3-stripes', 4120, 1, 10, 5),
(5, 'Áo Hoodie Nỉ Bông Levents Raglan Oversize', 520000, 'Lót nỉ bông cừu mềm mại, nón 2 lớp dày dặn trùm kín đầu, in ấn đồ họa phản quang sắc sảo phía sau lưng.', 4.6, 'ao-hoodie-ni-bong-levents-raglan-oversize', 2980, 1, 4, 6),
(6, 'Áo Polo Dệt Kim Teelab Retro Stripes', 290000, 'Chất liệu dệt kim phối sợi cotton mát mịn, họa tiết sọc vintage cá tính tôn vẻ thanh lịch lãng tử.', 4.7, 'ao-polo-det-kim-teelab-retro-stripes', 1450, 0, 6, 8),
(7, 'Áo Thun Streetwear DirtyCoins Logo Graphic Tee', 380000, 'Định lượng vải thun nặng 250gsm, cổ áo may bo gân dày dặn chống dão, in lụa logo biểu tượng DirtyCoins nổi bật.', 4.6, 'ao-thun-streetwear-dirtycoins-logo-graphic-tee', 3600, 1, 5, 1),
(8, 'Áo Sơ Mi Cổ Cuban Tay Ngắn Routine Họa Tiết', 390000, 'Cổ chữ V kiểu dáng Cuban mát mẻ, họa tiết nhiệt đới phóng khoáng, chất vải rayon rũ tự nhiên siêu thoáng khí.', 4.8, 'ao-so-mi-co-cuban-tay-ngan-routine-hoa-tiet', 1780, 0, 2, 4),
(9, 'Áo Sweater Nỉ Trơn Uniqlo Crewneck', 590000, 'Công nghệ dệt xơ nỉ bông mịn màng, cổ tròn bo thun tinh tế, dễ dàng phối cùng sơ mi bên trong.', 4.8, 'ao-sweater-ni-tron-uniqlo-crewneck', 2150, 0, 3, 7),
(10, 'Áo Cardigan Len Mỏng Dáng Rộng Teelab', 360000, 'Chất len dệt mỏng nhẹ thoáng khí thích hợp thời tiết se lạnh, hàng cúc sừng cao cấp phong cách Hàn Quốc.', 4.5, 'ao-cardigan-len-mong-dang-rong-teelab', 1230, 0, 6, 9),
(11, 'Áo Khoác Chống Nắng UV Cut Uniqlo AIRism', 490000, 'Công nghệ AIRism sợi làm mát tức thì, chống 98% tia UVA/UVB, có lỗ xỏ ngón tay bảo vệ toàn diện mu bàn tay.', 4.9, 'ao-khoac-chong-nang-uv-cut-uniqlo-airism', 5300, 1, 3, 10),
(12, 'Áo Polo Lacoste Classic Fit L1212', 2800000, 'Huyền thoại áo polo làm từ vải Petit Piqué dệt tổ ong trứ danh, logo cá sấu xanh thêu thủ công tại ngực.', 4.9, 'ao-polo-lacoste-classic-fit-l1212', 4890, 1, 7, 2),
(13, 'Áo Sơ Mi Denim Dài Tay Ralph Lauren', 1850000, 'Chất liệu vải denim dệt bông nguyên chất, được xử lý mài wash cổ điển, thêu biểu tượng kỵ sĩ polo tỉ mỉ.', 4.7, 'ao-so-mi-denim-dai-tay-ralph-lauren', 1670, 0, 8, 3),
(14, 'Áo Khoác Bomber Kaki 2 Lớp Routine', 750000, 'Lớp ngoài vải kaki chéo cản gió, lớp trong lót lụa mềm mại, cổ và tay bo chun dệt gân cá tính.', 4.6, 'ao-khoac-bomber-kaki-2-lop-routine', 2110, 0, 2, 5),
(15, 'Áo Thun Dài Tay Cotton Waffle Coolmate', 250000, 'Chất liệu dệt vân tổ ong Waffle giữ ấm nhẹ mà vẫn thoáng, co giãn tốt thích hợp mặc đơn hoặc mặc lót.', 4.8, 'ao-thun-dai-tay-cotton-waffle-coolmate', 1980, 0, 1, 1),
(16, 'Áo Thun Thể Thao Chạy Bộ Nike Miler', 690000, 'Sợi polyester tái chế siêu nhẹ, mặt lưng dệt lưới tản nhiệt thông minh, phản quang khi chạy ban đêm.', 4.8, 'ao-thun-the-thao-chay-bo-nike-miler', 2340, 0, 9, 1);

-- ==============================================================================
-- 5. BẢNG product_variants (Biến thể Size & Màu sắc cho từng chiếc áo)
-- ==============================================================================
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `color` VARCHAR(100) DEFAULT NULL,
  `size` VARCHAR(50) DEFAULT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_var_prod` (`product_id`),
  CONSTRAINT `fk_var_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `product_variants` (`id`, `product_id`, `color`, `size`, `stock_quantity`) VALUES
-- Áo Thun Coolmate Basic (ID: 1)
(1, 1, 'Trắng', 'M', 50),
(2, 1, 'Trắng', 'L', 75),
(3, 1, 'Trắng', 'XL', 40),
(4, 1, 'Đen', 'M', 60),
(5, 1, 'Đen', 'L', 80),
(6, 1, 'Xanh Navy', 'L', 35),

-- Áo Polo Nike Club (ID: 2)
(7, 2, 'Trắng', 'M', 25),
(8, 2, 'Trắng', 'L', 30),
(9, 2, 'Đen', 'M', 20),
(10, 2, 'Đen', 'L', 35),
(11, 2, 'Xanh Navy', 'XL', 15),

-- Áo Sơ Mi Oxford Routine (ID: 3)
(12, 3, 'Trắng Tinh', 'M', 40),
(13, 3, 'Trắng Tinh', 'L', 45),
(14, 3, 'Xanh Nhạt', 'M', 30),
(15, 3, 'Xanh Nhạt', 'L', 35),
(16, 3, 'Xám Tro', 'XL', 20),

-- Áo Khoác Gió Adidas (ID: 4)
(17, 4, 'Đen Sọc Trắng', 'M', 25),
(18, 4, 'Đen Sọc Trắng', 'L', 30),
(19, 4, 'Đen Sọc Trắng', 'XL', 15),
(20, 4, 'Xanh Bích', 'L', 18),

-- Áo Hoodie Levents (ID: 5)
(21, 5, 'Xám Tiêu', 'M', 35),
(22, 5, 'Xám Tiêu', 'L', 50),
(23, 5, 'Xám Tiêu', 'XL', 25),
(24, 5, 'Đen', 'L', 45),

-- Áo Polo Dệt Kim Teelab (ID: 6)
(25, 6, 'Be Sọc Nâu', 'M', 30),
(26, 6, 'Be Sọc Nâu', 'L', 40),
(27, 6, 'Xanh Rêu Sọc Trắng', 'L', 25),

-- Áo Thun DirtyCoins (ID: 7)
(28, 7, 'Đen', 'M', 45),
(29, 7, 'Đen', 'L', 60),
(30, 7, 'Trắng', 'L', 50),

-- Áo Khoác Chống Nắng UV Uniqlo (ID: 11)
(31, 11, 'Xám Nhạt', 'M', 55),
(32, 11, 'Xám Nhạt', 'L', 70),
(33, 11, 'Xanh Đen', 'L', 65),
(34, 11, 'Xanh Đen', 'XL', 40),

-- Áo Polo Lacoste L1212 (ID: 12)
(35, 12, 'Trắng', '3 (S)', 10),
(36, 12, 'Trắng', '4 (M)', 15),
(37, 12, 'Xanh Navy', '4 (M)', 12),
(38, 12, 'Đen', '5 (L)', 8);

-- ==============================================================================
-- 6. BẢNG product_prices (Bảng giá khuyến mãi Flash Sale cho các mẫu áo hot)
-- ==============================================================================
DROP TABLE IF EXISTS `product_prices`;
CREATE TABLE `product_prices` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL UNIQUE,
  `sale_price` DOUBLE DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_price_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `product_prices` (`id`, `product_id`, `sale_price`) VALUES
(1, 1, 159000),  -- Áo thun Coolmate gốc 199k -> giảm còn 159k (giảm 20%)
(2, 2, 699000),  -- Áo polo Nike gốc 850k -> giảm còn 699k (giảm 18%)
(3, 4, 990000),  -- Áo khoác gió Adidas gốc 1.2tr -> giảm còn 990k (giảm 18%)
(4, 5, 439000),  -- Áo hoodie Levents gốc 520k -> giảm còn 439k (giảm 16%)
(5, 7, 299000),  -- Áo thun DirtyCoins gốc 380k -> giảm còn 299k (giảm 21%)
(6, 11, 399000), -- Áo khoác chống nắng Uniqlo gốc 490k -> giảm còn 399k (giảm 19%)
(7, 12, 2390000);-- Áo polo Lacoste gốc 2.8tr -> giảm còn 2.39tr (giảm 15%)

-- ==============================================================================
-- 7. BẢNG product_images (Hình ảnh sắc nét các mẫu áo thời trang)
-- ==============================================================================
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_img_prod` (`product_id`),
  CONSTRAINT `fk_img_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `created_at`) VALUES
-- 1. Áo thun Coolmate Basic
(1, 1, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518', 1, NOW()),
(2, 1, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', 0, NOW()),

-- 2. Áo polo Nike Dri-FIT
(3, 2, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820', 1, NOW()),
(4, 2, 'https://images.unsplash.com/photo-1625910513413-5b871c57fa4e', 0, NOW()),

-- 3. Áo sơ mi Oxford Routine
(5, 3, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 1, NOW()),
(6, 3, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10', 0, NOW()),

-- 4. Áo khoác gió Adidas
(7, 4, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 1, NOW()),
(8, 4, 'https://images.unsplash.com/photo-1544441893-675973e31985', 0, NOW()),

-- 5. Áo hoodie Levents
(9, 5, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2', 1, NOW()),
(10, 5, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6', 0, NOW()),

-- 6. Áo polo dệt kim Teelab
(11, 6, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990', 1, NOW()),

-- 7. Áo thun DirtyCoins
(12, 7, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c', 1, NOW()),

-- 8. Áo sơ mi Cuban Routine
(13, 8, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 1, NOW()),

-- 9. Áo sweater Uniqlo
(14, 9, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633', 1, NOW()),

-- 10. Áo cardigan Teelab
(15, 10, 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4', 1, NOW()),

-- 11. Áo khoác chống nắng Uniqlo
(16, 11, 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2', 1, NOW()),

-- 12. Áo polo Lacoste L1212
(17, 12, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99', 1, NOW()),

-- 13. Áo sơ mi Denim Ralph Lauren
(18, 13, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0', 1, NOW()),

-- 14. Áo khoác bomber Routine
(19, 14, 'https://images.unsplash.com/photo-1548883354-7622d03aca27', 1, NOW()),

-- 15. Áo thun dài tay Coolmate
(20, 15, 'https://images.unsplash.com/photo-1618354691438-25bc04584c03', 1, NOW()),

-- 16. Áo thun thể thao Nike Miler
(21, 16, 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb', 1, NOW());

-- ==============================================================================
-- 8. BẢNG cart (Giỏ hàng 1-1 với user)
-- ==============================================================================
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- 9. BẢNG cart_items (Chi tiết mặt hàng áo trong giỏ)
-- ==============================================================================
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
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

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 3, 1, 2),  -- Khách Cường có 2 Áo thun Coolmate
(2, 3, 2, 1),  -- Khách Cường có 1 Áo polo Nike
(3, 4, 3, 1),  -- Khách Dung có 1 Áo sơ mi Oxford
(4, 5, 4, 1),  -- Khách Đức có 1 Áo khoác gió Adidas
(5, 5, 5, 1),  -- Khách Đức có 1 Áo hoodie Levents
(6, 6, 11, 2), -- Khách Hoa có 2 Áo khoác chống nắng Uniqlo
(7, 7, 6, 1),  -- Khách Hùng có 1 Áo polo dệt kim Teelab
(8, 8, 7, 2),  -- Khách Linh có 2 Áo thun DirtyCoins
(9, 9, 12, 1), -- Khách Nam có 1 Áo polo Lacoste
(10, 10, 8, 1);-- Khách Oanh có 1 Áo sơ mi cuban Routine

-- ==============================================================================
-- 10. BẢNG comment (Bình luận & Đánh giá chuyên sâu về áo)
-- ==============================================================================
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
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

INSERT INTO `comment` (`id`, `user_id`, `product_id`, `content`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 1, 'Chất vải Cotton Compact của áo Coolmate mặc cực mát, giặt máy 3 lần rồi cổ áo vẫn không hề bị giãn!', NOW(), NOW(), NULL),
(2, 4, 2, 'Áo polo Nike chất vải thể thao Dri-FIT xịn xò, thấm hút mồ hôi cực đỉnh, form dáng mặc lên nhìn rất khỏe khoắn.', NOW(), NOW(), NULL),
(3, 5, 3, 'Sơ mi Oxford của Routine lên form slimfit rất chuẩn, vải dệt vân hạt dày dặn và chống nhăn rất tốt khi ngồi văn phòng.', NOW(), NOW(), NULL),
(4, 6, 4, 'Áo khoác gió Adidas nhẹ tênh nhưng cản gió cực tốt, đi mưa phùn hạt nhỏ trượt nước hoàn toàn, rất đáng tiền!', NOW(), NOW(), NULL),
(5, 7, 5, 'Hoodie Levents nón to trùm đầu thoải mái, form oversize rộng rãi chuẩn phong cách streetwear, lớp nỉ bông rất êm.', NOW(), NOW(), NULL),
(6, 8, 6, 'Áo polo dệt kim Teelab mặc lên nhìn sang và lãng tử, chất len mỏng mặc mùa hè thu rất thoáng không bị bí.', NOW(), NOW(), NULL),
(7, 9, 7, 'Áo thun DirtyCoins hình in sắc nét, chất thun 250gsm dày dặn đứng form, giặt không bị nứt hình in.', NOW(), NOW(), NULL),
(8, 10, 11, 'Áo khoác chống nắng AIRism của Uniqlo cản nắng rất tốt, chất mát lạnh xỏ tay vào là thấy dễ chịu ngay khi ra nắng gắt.', NOW(), NOW(), NULL),
(9, 3, 12, 'Áo polo cá sấu Lacoste đúng chuẩn huyền thoại, vải dệt Petit Pique mặc vào form ôm vừa vặn, rất lịch thiệp.', NOW(), NOW(), NULL),
(10, 4, 8, 'Sơ mi tay ngắn cổ cuban mặc đi biển hoặc cafe dạo phố chụp ảnh cực kỳ ăn ảnh, vải mềm rũ tự nhiên.', NOW(), NOW(), NULL);

-- ==============================================================================
-- 11. BẢNG `order` (Đơn hàng mua áo)
-- ==============================================================================
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
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

INSERT INTO `order` (`id`, `user_id`, `receiver_name`, `receiver_phone`, `shipping_address`, `note`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'Lê Hoàng Cường', '0923456789', '78 Hai Bà Trưng, Phường 6, Quận 3, TP.HCM', 'Giao áo trong giờ hành chính từ thứ 2 đến thứ 6', 1017000, 'COMPLETED', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 8 DAY),
(2, 4, 'Phạm Thị Dung', '0934567890', '12 Quang Trung, Phường 10, Gò Vấp, TP.HCM', 'Gọi trước 15 phút khi chuẩn bị giao hàng', 450000, 'COMPLETED', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 5 DAY),
(3, 5, 'Hoàng Minh Đức', '0945678901', '56 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', 'Gói quà giúp mình để tặng sinh nhật bạn', 1429000, 'SHIPPING', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY),
(4, 6, 'Vũ Thị Hoa', '0956789012', '89 Kim Mã, Giảng Võ, Ba Đình, Hà Nội', 'Giao áo buổi sáng trước 11h', 798000, 'CONFIRMED', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY),
(5, 7, 'Đặng Hữu Hùng', '0967890123', '15 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng', 'Để ở quầy lễ tân chung cư nếu vắng nhà', 290000, 'PENDING', NOW() - INTERVAL 1 DAY, NOW()),
(6, 8, 'Ngô Mỹ Linh', '0978901234', '34 Hùng Vương, Lộc Thọ, Nha Trang, Khánh Hòa', 'Áo trắng xin cẩn thận bọc túi bóng chống bẩn', 598000, 'CANCELLED', NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 11 DAY),
(7, 9, 'Bùi Quốc Nam', '0989012345', '102 Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ', 'Giao buổi chiều sau 14h', 2390000, 'COMPLETED', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 4 DAY),
(8, 10, 'Đỗ Phương Oanh', '0990123456', '22 Võ Thị Sáu, Thống Nhất, Biên Hòa, Đồng Nai', 'Đơn hàng mua áo sơ mi tặng người yêu', 390000, 'CONFIRMED', NOW() - INTERVAL 2 DAY, NOW()),
(9, 3, 'Lê Hoàng Cường', '0923456789', '78 Hai Bà Trưng, Phường 6, Quận 3, TP.HCM', 'Đặt thêm 1 áo polo đi chơi cuối tuần', 699000, 'PENDING', NOW(), NOW()),
(10, 5, 'Hoàng Minh Đức', '0945678901', '56 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', 'Ship hỏa tốc áo khoác giúp mình nhé', 990000, 'SHIPPING', NOW() - INTERVAL 1 DAY, NOW());

-- ==============================================================================
-- 12. BẢNG order_items (Chi tiết từng mẫu áo trong đơn)
-- ==============================================================================
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
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

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 159000),  -- 2 Áo thun Coolmate giá sale
(2, 1, 2, 1, 699000),  -- 1 Áo polo Nike giá sale
(3, 2, 3, 1, 450000),  -- 1 Áo sơ mi Oxford Routine
(4, 3, 4, 1, 990000),  -- 1 Áo khoác gió Adidas giá sale
(5, 3, 5, 1, 439000),  -- 1 Áo hoodie Levents giá sale
(6, 4, 11, 2, 399000), -- 2 Áo chống nắng Uniqlo giá sale
(7, 5, 6, 1, 290000),  -- 1 Áo polo dệt kim Teelab
(8, 6, 7, 2, 299000),  -- 2 Áo thun DirtyCoins giá sale
(9, 7, 12, 1, 2390000),-- 1 Áo polo Lacoste L1212 giá sale
(10, 8, 8, 1, 390000); -- 1 Áo sơ mi cuban Routine

-- ==============================================================================
-- 13. BẢNG wishlists (Danh sách áo yêu thích)
-- Có ràng buộc UNIQUE (user_id, product_id) để chống trùng lặp
-- ==============================================================================
DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE `wishlists` (
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

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 3, 1, NOW() - INTERVAL 5 DAY),  -- Cường thích Áo thun Coolmate
(2, 3, 2, NOW() - INTERVAL 4 DAY),  -- Cường thích Áo polo Nike
(3, 3, 4, NOW() - INTERVAL 2 DAY),  -- Cường thích Áo khoác gió Adidas
(4, 4, 3, NOW() - INTERVAL 3 DAY),  -- Dung thích Áo sơ mi Routine
(5, 4, 11, NOW() - INTERVAL 1 DAY), -- Dung thích Áo chống nắng Uniqlo
(6, 5, 5, NOW() - INTERVAL 6 DAY),  -- Đức thích Áo hoodie Levents
(7, 5, 12, NOW() - INTERVAL 3 DAY), -- Đức thích Áo polo Lacoste
(8, 6, 10, NOW() - INTERVAL 2 DAY), -- Hoa thích Áo cardigan Teelab
(9, 7, 6, NOW() - INTERVAL 4 DAY),  -- Hùng thích Áo polo dệt kim
(10, 8, 7, NOW() - INTERVAL 1 DAY); -- Linh thích Áo thun DirtyCoins

-- ==============================================================================
-- 14. BẢNG conversations (Hộp thoại trò chuyện hỏi về áo giữa Khách và Shop)
-- ==============================================================================
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations` (
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

INSERT INTO `conversations` (`id`, `buyer_id`, `seller_id`, `product_id`, `last_message_at`, `created_at`) VALUES
(1, 3, 1, 1, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 2 DAY), -- Cường hỏi về Áo Thun Coolmate
(2, 4, 1, 2, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 1 DAY), -- Dung hỏi về Áo Polo Nike
(3, 5, 2, 4, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 3 DAY), -- Đức hỏi về Áo khoác gió Adidas
(4, 6, 1, NULL, NOW() - INTERVAL 10 HOUR, NOW() - INTERVAL 4 DAY);-- Hoa hỏi tư vấn chung bảng size áo của shop

-- ==============================================================================
-- 15. BẢNG messages (Nội dung tin nhắn tư vấn size áo, chất vải, chính sách đổi trả)
-- ==============================================================================
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
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

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `is_read`, `sent_at`) VALUES
-- Cuộc hội thoại 1 (Khách Cường hỏi tư vấn size Áo Thun Coolmate)
(1, 1, 3, 'Shop ơi, áo thun Coolmate này mình cao 1m75 nặng 68kg thì mặc size L hay XL vừa thoải mái ạ?', 1, NOW() - INTERVAL 2 DAY),
(2, 1, 1, 'Chào bạn Cường! Dòng áo Cotton Compact của Coolmate có độ co giãn tốt, bạn mặc size L là chuẩn form tôn dáng và thoải mái nhất nhé ạ.', 1, NOW() - INTERVAL 2 DAY + INTERVAL 15 MINUTE),
(3, 1, 3, 'Áo này giặt máy giặt có bị co rút chiều dài hay bai cổ áo không shop?', 1, NOW() - INTERVAL 1 DAY),
(4, 1, 1, 'Dạ áo đã được xử lý chống co rút nhiệt và bo cổ dệt gân 2 kim nên bạn giặt máy thoải mái không lo dão cổ nha!', 0, NOW() - INTERVAL 1 HOUR),

-- Cuộc hội thoại 2 (Khách Dung hỏi về Áo Polo Nike)
(5, 2, 4, 'Shop cho mình hỏi áo Polo Nike Club Tennis màu đen size M còn sẵn hàng không?', 1, NOW() - INTERVAL 1 DAY),
(6, 2, 1, 'Dạ shop hiện còn sẵn 20 chiếc size M màu đen tại kho. Bạn đặt hàng hôm nay shop gửi đi luôn trong chiều nay nhé!', 0, NOW() - INTERVAL 3 HOUR),

-- Cuộc hội thoại 3 (Khách Đức hỏi về Áo khoác gió Adidas)
(7, 3, 5, 'Áo khoác gió Adidas Tiro này lớp lót bên trong là lưới hay vải dù vậy shop? Đi mưa phùn nhẹ có ướt không?', 1, NOW() - INTERVAL 3 DAY),
(8, 3, 2, 'Dạ lớp trong lót lưới thoáng khí không bị dính vào da khi đổ mồ hôi, lớp ngoài trượt nước cản mưa phùn cực tốt bạn nhé!', 1, NOW() - INTERVAL 3 DAY + INTERVAL 30 MINUTE),

-- Cuộc hội thoại 4 (Khách Hoa hỏi chính sách đổi size áo)
(9, 4, 6, 'Shop ơi nếu mình mua áo về thử không vừa size thì có được hỗ trợ đổi size khác không ạ?', 1, NOW() - INTERVAL 4 DAY),
(10, 4, 1, 'Dạ shop hỗ trợ đổi size miễn phí tận nhà trong vòng 7 ngày kể từ khi nhận hàng. Shiper sẽ mang áo size mới đến đổi và thu lại áo cũ luôn cho bạn cực kỳ tiện lợi ạ!', 0, NOW() - INTERVAL 10 HOUR);

-- Bật lại kiểm tra khóa ngoại sau khi hoàn tất
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- HOÀN TẤT: CƠ SỞ DỮ LIỆU ĐÃ ĐƯỢC THIẾT KẾ ĐẶC BIỆT CHUYÊN BIỆT CHO SHOP BÁN ÁO!
-- TỔNG CỘNG: 15/15 BẢNG ĐÃ ĐƯỢC TẠO LẬP VỚI ĐẦY ĐỦ CÁC QUAN HỆ KHÓA NGOẠI & INDEX!
-- ==============================================================================
