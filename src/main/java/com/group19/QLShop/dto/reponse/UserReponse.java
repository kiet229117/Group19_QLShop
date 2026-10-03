package com.group19.QLShop.dto.reponse;
import com.group19.QLShop.entity.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data 
@Builder                  
@NoArgsConstructor       
@AllArgsConstructor      
public class UserReponse {
    private Long id;
    private String name;
    private String username;
    private String phone;
    private String email;
    private String gender;
    private String address;
    private String avatar;
    private Role role;
    private Long cartId;
}

