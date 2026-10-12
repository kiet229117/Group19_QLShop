package com.group19.QLShop.repository;

import com.group19.QLShop.entity.ProductPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {
    
    // Tìm giá khuyến mãi theo ID sản phẩm
    Optional<ProductPrice> findByProductId(Long productId);

    // Xóa giá khuyến mãi theo ID sản phẩm
    void deleteByProductId(Long productId);

    // Lấy danh sách tất cả sản phẩm đang có giá khuyến mãi hợp lệ
    List<ProductPrice> findBySalePriceIsNotNullAndSalePriceGreaterThan(Double minPrice);
}