package com.group19.QLShop.dto.reponse;


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
    private Double price;
    private String description;
    private Double rating;
    private String slug;
    private Long brandId;
    private Long categoryId;

	
}
