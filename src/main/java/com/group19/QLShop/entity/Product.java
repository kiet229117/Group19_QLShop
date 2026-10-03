package com.group19.QLShop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Table(name = "products")

public class Product {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <-- Thiếu dòng này hoặc strategy khác sẽ khiến id không tự tăng

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
