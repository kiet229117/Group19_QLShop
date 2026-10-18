package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingProductResponse {

    private Long productId;
    private String productName;
    private String imageUrl;
    private String categoryName;
    private String brandName;
    private Long totalSold;          // Tổng số lượng áo đã bán ra
    private Double totalRevenue;     // Doanh thu mang lại từ mẫu áo này
}

