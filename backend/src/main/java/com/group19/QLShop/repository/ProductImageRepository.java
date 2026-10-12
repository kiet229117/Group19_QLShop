package com.group19.QLShop.repository;

import com.group19.QLShop.entity.ProductImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
      List<ProductImage> findByProductId(Long productId);

    List<ProductImage> findByProductIdOrderByIsPrimaryDesc(Long productId);
}
