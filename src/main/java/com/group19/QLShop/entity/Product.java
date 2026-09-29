package com.group19.QLShop.entity;

import lombok.Data;


import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity 
@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Table(name = "products")

public class Product {
      @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double  price;
    private String description;
    private double rating;
    private String slug;


    @ManyToOne(fetch = FetchType.LAZY) // LAZY giúp tối ưu hiệu năng, chỉ tải category khi cần
    @JoinColumn(name = "brand_id", nullable = false) // Tên cột khóa ngoại (Foreign Key) trong DB
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "category_id", nullable = false) 
    private Category category;

    
}
