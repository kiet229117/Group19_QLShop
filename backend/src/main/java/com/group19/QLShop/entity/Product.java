package com.group19.QLShop.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    // GIỮ NGUYÊN GIÁ BÁN GỐC TẠI ĐÂY
    private double price;

    // GIÁ VỐN NHẬP HÀNG (Cost Price / Giá nhập mặc định)
    @Column(name = "cost_price")
    private Double costPrice;

    private String description;
    private double rating;
    private String slug;
    private int views;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();

    // ---> BẢNG GIÁ KHUYẾN MÃI (CHỈ CHỨA SALE_PRICE) <---
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ProductPrice productPrice;

    @Column(name = "is_hot")
    private boolean isHot;

    @jakarta.persistence.Transient
    private Long soldQuantity;

    // Helper method gán quan hệ 2 chiều
    public void setProductPrice(ProductPrice productPrice) {
        this.productPrice = productPrice;
        if (productPrice != null) {
            productPrice.setProduct(this);
        }
    }
}