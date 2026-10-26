package com.group19.QLShop.dto.reponse;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data 
@Builder                  
@NoArgsConstructor       
@AllArgsConstructor      
public class CartItemReponse {

    private Long id;

    private Long productId;

    private String productName;

    private String productSlug;

    private String productImage;

    private String brandName;

    private double price;

    private double originalPrice;

    private int quantity;

    private double total;
}
