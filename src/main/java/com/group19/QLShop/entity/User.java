package com.group19.QLShop.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import com.group19.QLShop.entity.enums.Role;


@Entity 
@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Table(name="users")

public class User {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String username;
    private String phone;
    private String email;
    private String gender;
    private String address;
    private String password;
    private String avatar;

    // Xem trong folder enums Role.java
    @Enumerated (EnumType.STRING)
    private Role role;

    // Một người dùng thì chỉ có 1 giỏ thôi
    @OneToOne (mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;


}
