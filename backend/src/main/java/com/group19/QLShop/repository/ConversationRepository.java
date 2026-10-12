package com.group19.QLShop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.Conversation;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.User;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    /**
     * Tìm cuộc hội thoại giữa người mua và sản phẩm cụ thể
     */
    Optional<Conversation> findByBuyerAndProduct(User buyer, Product product);

    /**
     * Tìm cuộc hội thoại chung (không gắn với sản phẩm nào) của người mua
     */
    Optional<Conversation> findByBuyerAndProductIsNull(User buyer);

    /**
     * Lấy tất cả hội thoại mà người dùng tham gia (cả buyer hoặc seller) kèm chi tiết Product và User (chống N+1 query)
     */
    @Query("SELECT DISTINCT c FROM Conversation c " +
           "JOIN FETCH c.buyer b " +
           "LEFT JOIN FETCH c.seller s " +
           "LEFT JOIN FETCH c.product p " +
           "LEFT JOIN FETCH p.images " +
           "WHERE c.buyer = :user OR c.seller = :user " +
           "ORDER BY c.lastMessageAt DESC")
    List<Conversation> findAllByUserWithDetails(@Param("user") User user);

    /**
     * Lấy danh sách hội thoại của người mua (Buyer)
     */
    @Query("SELECT DISTINCT c FROM Conversation c " +
           "JOIN FETCH c.buyer b " +
           "LEFT JOIN FETCH c.seller s " +
           "LEFT JOIN FETCH c.product p " +
           "LEFT JOIN FETCH p.images " +
           "WHERE c.buyer = :buyer " +
           "ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByBuyerWithDetails(@Param("buyer") User buyer);

    /**
     * Dành cho Chủ shop / Admin / Staff: Lấy tất cả các cuộc hội thoại khách hàng gửi tới shop
     */
    @Query("SELECT DISTINCT c FROM Conversation c " +
           "JOIN FETCH c.buyer b " +
           "LEFT JOIN FETCH c.seller s " +
           "LEFT JOIN FETCH c.product p " +
           "LEFT JOIN FETCH p.images " +
           "ORDER BY c.lastMessageAt DESC")
    List<Conversation> findAllForShopOwnerWithDetails();

    /**
     * Lấy thông tin 1 cuộc hội thoại theo ID kèm Buyer, Seller, Product
     */
    @Query("SELECT c FROM Conversation c " +
           "JOIN FETCH c.buyer b " +
           "LEFT JOIN FETCH c.seller s " +
           "LEFT JOIN FETCH c.product p " +
           "WHERE c.id = :id")
    Optional<Conversation> findByIdWithDetails(@Param("id") Long id);
}

