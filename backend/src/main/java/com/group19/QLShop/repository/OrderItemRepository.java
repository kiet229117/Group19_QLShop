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
    // TÍNH TỔNG SỐ LƯỢNG ĐÃ BÁN CỦA 1 SẢN PHẨM (Không tính đơn bị HỦY)
    // ==========================================
    @Query("SELECT COALESCE(SUM(oi.quantity), 0L) " +
           "FROM OrderItem oi " +
           "WHERE oi.product.id = :productId " +
           "AND oi.order.status != com.group19.QLShop.entity.enums.OrderStatus.CANCELLED")
    Long sumSoldQuantityByProductId(@org.springframework.data.repository.query.Param("productId") Long productId);

    // ==========================================
    // TÍNH TỔNG SỐ LƯỢNG ĐÃ BÁN THEO DANH SÁCH PRODUCT IDS (Không tính đơn bị HỦY)
    // ==========================================
    @Query("SELECT oi.product.id, COALESCE(SUM(oi.quantity), 0L) " +
           "FROM OrderItem oi " +
           "WHERE oi.product.id IN :productIds " +
           "AND oi.order.status != com.group19.QLShop.entity.enums.OrderStatus.CANCELLED " +
           "GROUP BY oi.product.id")
    List<Object[]> sumSoldQuantityByProductIds(@org.springframework.data.repository.query.Param("productIds") List<Long> productIds);

    // ==========================================
    // TOP SẢN PHẨM BÁN CHẠY NHẤT (Không tính đơn bị HỦY)
    // ==========================================
    @Query("SELECT oi.product.id, oi.product.name, SUM(oi.quantity), SUM(oi.price * oi.quantity) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status != com.group19.QLShop.entity.enums.OrderStatus.CANCELLED " +
           "GROUP BY oi.product.id, oi.product.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProductsRaw(Pageable pageable);

    // ==========================================
    // TÍNH GIÁ VỐN HÀNG BÁN (COGS - COST OF GOODS SOLD)
    // ==========================================
    // Tổng giá vốn của các đơn hàng có trạng thái cụ thể (thường là COMPLETED)
    @Query("SELECT COALESCE(SUM(COALESCE(oi.costPrice, 0.0) * oi.quantity), 0.0) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status = :status")
    Double sumTotalCostByStatus(@org.springframework.data.repository.query.Param("status") com.group19.QLShop.entity.enums.OrderStatus status);

    // Giá vốn hàng bán theo trạng thái trong khoảng thời gian cụ thể (theo thời điểm cập nhật hoặc tạo)
    @Query("SELECT COALESCE(SUM(COALESCE(oi.costPrice, 0.0) * oi.quantity), 0.0) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status = :status AND (COALESCE(oi.order.updatedAt, oi.order.createdAt) >= :startDate AND COALESCE(oi.order.updatedAt, oi.order.createdAt) <= :endDate)")
    Double sumCostByStatusAndDateRange(
            @org.springframework.data.repository.query.Param("status") com.group19.QLShop.entity.enums.OrderStatus status,
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate);

}
