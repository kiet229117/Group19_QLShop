package com.group19.QLShop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.group19.QLShop.entity.Brand;
@Repository 
public interface BrandRepository extends JpaRepository<Brand, Long> {
    boolean existsByCategoryId(Long categoryId);
    boolean existsByBrandId(Long brandId);
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
} 
