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

    private double price;

    private int quantity;

    private double total;
}
