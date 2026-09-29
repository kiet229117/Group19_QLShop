package com.group19.QLShop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.group19.QLShop.entity.Brand;
@Repository 
public interface BrandRepository extends JpaRepository<Brand, Long> {} 
