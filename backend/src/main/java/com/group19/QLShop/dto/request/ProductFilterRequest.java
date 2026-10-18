package com.group19.QLShop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterRequest {

    // 1. Tìm kiếm theo từ khóa (tìm trong tên hoặc mô tả áo)
    private String keyword;

    // 2. Lọc theo Thương hiệu (Coolmate, Routine, Uniqlo...)
    private Long brandId;

    // 3. Lọc theo Danh mục (Áo Thun, Polo, Sơ Mi, Hoodie...)
    private Long categoryId;

    // 4. Lọc theo Khoảng giá bán (VD: từ 100k đến 300k)
    private Double minPrice;
    private Double maxPrice;

    // 5. Lọc theo Cỡ áo (S, M, L, XL, XXL)
    private String shirtSize;

    // 6. Lọc theo Màu sắc áo (Trắng, Đen, Xám, Be, Xanh...)
    private String color;

    // 7. Lọc theo Tình trạng
    private Boolean inStock;   // true: Chỉ lấy áo còn hàng trong kho
    private Boolean hasSale;   // true: Chỉ lấy áo đang có Flash Sale / giảm giá
    private Boolean isHot;     // true: Chỉ lấy các mẫu áo Hot

    // 8. Sắp xếp:
    // "price_asc" (giá tăng dần), "price_desc" (giá giảm dần), 
    // "newest" (mới nhất), "popular" / "views" (xem nhiều nhất), "rating" (đánh giá cao nhất)
    private String sortBy;

    // 9. Phân trang
    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int pageSize = 10;

    // Thông minh: Nếu query param là ?size=XL thì gán shirtSize, nếu ?size=10 thì gán pageSize
    public void setSize(String val) {
        if (val != null && !val.trim().isEmpty()) {
            try {
                this.pageSize = Integer.parseInt(val.trim());
            } catch (NumberFormatException e) {
                this.shirtSize = val.trim();
            }
        }
    }

    public void setShirtSize(String shirtSize) {
        this.shirtSize = shirtSize;
    }

    public void setLimit(int limit) {
        this.pageSize = limit;
    }
}

