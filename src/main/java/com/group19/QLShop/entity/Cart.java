package com.group19.QLShop.entity;

import java.util.ArrayList;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import jakarta.persistence.CascadeType;

@Entity 
@Data 
@Table (name = "cart")
@AllArgsConstructor 
@NoArgsConstructor 

public class Cart {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    // unique là không được trùng, 1 user (user_id) chỉ xuất hiện 1 lần trong cart
    @JoinColumn (name = "user_id", unique = true) 
    private User user;

    // orphanRemoval = true là ki xóa 1 sp trong cart nó xóa luôn record trong DB
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItems> cartItems = new ArrayList<>();
}