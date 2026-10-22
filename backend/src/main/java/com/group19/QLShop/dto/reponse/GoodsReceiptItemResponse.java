package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long variantId;
    private String variantColor;
    private String variantSize;
    private Integer quantity;
    private Double importPrice;
    private Double totalPrice;
}

