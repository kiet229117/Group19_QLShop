package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishListToggleResponse {
    private boolean isWishlisted;
    private String message;
    private Long productId;
    private WishListResponse wishlistItem;
}

