package com.group19.QLShop.dto.reponse;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data 
@Builder                  
@NoArgsConstructor       
@AllArgsConstructor
public class CartReponse {
    private Long id;
    private Long userId;
    private List<CartItemReponse> items;
}


