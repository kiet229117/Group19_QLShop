package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishListResponse {
    private Long id;
    private Long productId;
    private Long userId;

    // Chi tiết sản phẩm đi kèm để Client hiển thị ngay lập tức (không cần gọi thêm API)
    private String productName;
    private String productSlug;
    private Double productPrice;
    private Double productRating;
    private String productImage;
    private String brandName;
    private String categoryName;
    private LocalDateTime createdAt;
}

