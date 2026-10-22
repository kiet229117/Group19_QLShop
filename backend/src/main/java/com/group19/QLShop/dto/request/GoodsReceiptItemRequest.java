package com.group19.QLShop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptItemRequest {
    private Long productId;
    private Long variantId;
    private Integer quantity;
    private Double importPrice;
}

