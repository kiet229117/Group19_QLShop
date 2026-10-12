package com.group19.QLShop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.group19.QLShop.entity.Brand;

@Repository 
public interface BrandRepository extends JpaRepository<Brand, Long> {
    // Sửa thành existsById (Spring JPA sẽ map với trường id của Brand)
    boolean existsById(Long id); 
    
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
}
