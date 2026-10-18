package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSuggestionItem {

    private Long id;
    private String name;
    private String slug;
    private Double price;
    private Double salePrice;
    private String image;
    private String categoryName;
    private String brandName;
}

