package com.group19.QLShop.repository;

import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.Product;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import org.springframework.data.jpa.repository.JpaRepository; 
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);

    Page<Product> searchByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Product> findByBrandId(Long brandId, Pageable pageable);

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
    long countByNameContainingIgnoreCase(String name);
    long countByPriceBetween(Double minPrice, Double maxPrice);
    long countByBrandId(Long brandId);
    long countByCategoryId(Long categoryId);
    
    boolean existsByCategoryId(Long categoryId);
    boolean existsByBrandId(Long brandId);
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
    
}
