package com.group19.QLShop.repository;


import com.group19.QLShop.entity.Product;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
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

    // Hot: nhiều lượt xem nhất (views null tính là 0)
    @Query("SELECT p FROM Product p ORDER BY COALESCE(p.views, 0) DESC, p.id DESC")
    Page<Product> findHotProducts(Pageable pageable);

    // Sale: có giá khuyến mãi hợp lệ, giảm sâu nhất lên đầu
    @Query(value = "SELECT p FROM Product p JOIN p.productPrice pp " +
                   "WHERE pp.salePrice IS NOT NULL AND pp.salePrice > 0 " +
                   "AND p.price > 0 AND pp.salePrice < p.price " +
                   "ORDER BY (p.price - pp.salePrice) / p.price DESC, p.id DESC",
           countQuery = "SELECT COUNT(p) FROM Product p JOIN p.productPrice pp " +
                   "WHERE pp.salePrice IS NOT NULL AND pp.salePrice > 0 " +
                   "AND p.price > 0 AND pp.salePrice < p.price")
    Page<Product> findSaleProducts(Pageable pageable);

    // Mới nhất
    @Query("SELECT p FROM Product p ORDER BY p.id DESC")
    Page<Product> findNewestProducts(Pageable pageable);

    // ==========================================
    // GỢI Ý TÌM KIẾM NHANH (SEARCH AUTOCOMPLETE)
    // ==========================================
    @Query("SELECT p FROM Product p " +
           "LEFT JOIN p.category c " +
           "LEFT JOIN p.brand b " +
           "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY COALESCE(p.views, 0) DESC, p.id DESC")
    List<Product> findSearchSuggestions(@Param("keyword") String keyword, Pageable pageable);
}
