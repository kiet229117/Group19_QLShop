package com.group19.QLShop.dto.reponse;

import java.util.List;

import com.group19.QLShop.entity.ProductVariant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data 
@Builder                  
@NoArgsConstructor       
@AllArgsConstructor      
public class ProductReponse {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private Double rating;
    private String slug;
    private int views;
    private Long brandId;
    private Long categoryId;
    private Double salePrice;
    private boolean isHot;
    private List<ProductVariant> variants;

    private String image;             // Đường dẫn ảnh đại diện chính (thuận tiện cho frontend)
    private String primaryImage;      // Ảnh chính
    private List<String> images;      // Danh sách tất cả đường dẫn ảnh của sản phẩm
}
