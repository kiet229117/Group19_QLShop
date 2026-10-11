package com.group19.QLShop.repository;

import com.group19.QLShop.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    // Có thể tự viết thêm hàm lấy danh sách biến thể theo ID sản phẩm:
    List<ProductVariant> findByProductId(Long productId);
}