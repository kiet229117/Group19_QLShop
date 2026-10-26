package com.group19.QLShop.dto.reponse;

import java.util.List;
import com.group19.QLShop.entity.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder                  
@NoArgsConstructor       
@AllArgsConstructor      
public class ProductReponse {
    private Long id;
    private String name;
    private Double price; // Giá gốc
    private Double costPrice; // Giá vốn
    private String description;
    private Double rating;
    private String slug;
    private int views;
    private Long brandId;
    private Long categoryId;
    private boolean isHot;
    private List<ProductVariant> variants;

    // ---> THAY THẾ: Không để salePrice lẻ nữa, mà dùng field riêng ở đây <---
    private ProductPriceResponse productPrice; 

    private String image;             
    private String primaryImage;      
    private List<String> images;      
}