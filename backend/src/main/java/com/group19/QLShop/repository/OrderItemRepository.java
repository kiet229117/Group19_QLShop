package com.group19.QLShop.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    void deleteByOrderId(Long orderId);

    // ==========================================
    // TOP SẢN PHẨM BÁN CHẠY NHẤT (Không tính đơn bị HỦY)
    // ==========================================
    @Query("SELECT oi.product.id, oi.product.name, SUM(oi.quantity), SUM(oi.price * oi.quantity) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status != com.group19.QLShop.entity.enums.OrderStatus.CANCELLED " +
           "GROUP BY oi.product.id, oi.product.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProductsRaw(Pageable pageable);
}
