package com.group19.QLShop.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.Order;
import com.group19.QLShop.entity.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByUserId(Long userId);

    Page<Order> findByUserId(Long userId, Pageable pageable);

    boolean existsByUserId(Long userId);

    List<Order> findByStatus(OrderStatus status);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // Tìm các đơn hàng ở trạng thái PENDING được tạo trước thời điểm cutOff (dùng cho tự động duyệt)
    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime cutOff);

    // ==========================================
    // CÁC HÀM PHỤC VỤ THỐNG KÊ DASHBOARD
    // ==========================================

    long countByStatus(OrderStatus status);

    // Tổng doanh thu của các đơn hàng có trạng thái cụ thể (thường là COMPLETED)
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status = :status")
    Double sumTotalAmountByStatus(@Param("status") OrderStatus status);

    // Doanh thu theo trạng thái trong khoảng thời gian cụ thể (theo thời điểm cập nhật hoặc tạo)
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status = :status AND (COALESCE(o.updatedAt, o.createdAt) >= :startDate AND COALESCE(o.updatedAt, o.createdAt) <= :endDate)")
    Double sumRevenueByStatusAndDateRange(
            @Param("status") OrderStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Số lượng đơn hàng theo trạng thái trong khoảng thời gian cụ thể
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND (COALESCE(o.updatedAt, o.createdAt) >= :startDate AND COALESCE(o.updatedAt, o.createdAt) <= :endDate)")
    Long countOrdersByStatusAndDateRange(
            @Param("status") OrderStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Thống kê phân bổ số lượng đơn hàng theo từng trạng thái
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersGroupedByStatus();
}
