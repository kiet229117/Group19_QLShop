package com.group19.QLShop.repository;

import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.Product;

import java.util.Optional;



import org.springframework.data.jpa.repository.JpaRepository; 
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    
}
