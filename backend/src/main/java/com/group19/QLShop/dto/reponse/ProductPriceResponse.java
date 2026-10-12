package com.group19.QLShop.dto.reponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductPriceResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Double originalPrice;  // Giá gốc
    private Double salePrice;      // Giá sale
    private Integer discountPercent; // Phần trăm giảm giá (VD: 20%)
}