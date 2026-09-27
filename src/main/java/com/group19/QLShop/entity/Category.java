package com.group19.QLShop.entity;

import lombok.Data;

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

    @OneToMany (mappedBy = "category", cascade = CascadeType.ALL)
    List<Product> products;
    
}
