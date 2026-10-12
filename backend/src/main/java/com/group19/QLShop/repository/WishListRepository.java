package com.group19.QLShop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.group19.QLShop.entity.WishList;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Long> {

    /**
     * Truy vấn danh sách yêu thích của người dùng kèm đầy đủ thông tin Product,
     * hình ảnh, thương hiệu, danh mục chỉ trong 1 lần query (chống N+1 query problem).
     */
    @Query("SELECT DISTINCT w FROM WishList w " +
           "JOIN FETCH w.product p " +
           "LEFT JOIN FETCH p.images " +
           "LEFT JOIN FETCH p.brand " +
           "LEFT JOIN FETCH p.category " +
           "WHERE w.user.id = :userId " +
           "ORDER BY w.createdAt DESC")
    List<WishList> findByUserIdWithProductDetails(@Param("userId") Long userId);

    @Query("SELECT w FROM WishList w WHERE w.user.id = :userId")
    List<WishList> findAllByUser_Id(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END FROM WishList w WHERE w.user.id = :userId AND w.product.id = :productId")
    boolean existsByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    @Query("SELECT w FROM WishList w WHERE w.user.id = :userId AND w.product.id = :productId")
    Optional<WishList> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    @Modifying
    @Transactional
    @Query("DELETE FROM WishList w WHERE w.user.id = :userId AND w.product.id = :productId")
    void deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    @Modifying
    @Transactional
    @Query("DELETE FROM WishList w WHERE w.id = :id AND w.user.id = :userId")
    int deleteByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
