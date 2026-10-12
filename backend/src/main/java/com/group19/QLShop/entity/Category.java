package com.group19.QLShop.entity;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity 
@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Table(name = "categories")
public class Category {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String image;
    @Column(name = "active")
    private boolean isActive;

    // mappedBy dùng ánh xạ qua biến category ở file Product.java
    // ascade = CascadeType.ALL là khi code trên Category thực thể cha, thì tự nó lan sang thực thể con là Product
    @OneToMany (mappedBy = "category", cascade = CascadeType.ALL) 
    private List<Product> products = new ArrayList<>();
    
}
