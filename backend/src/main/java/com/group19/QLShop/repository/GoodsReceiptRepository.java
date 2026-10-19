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

import com.group19.QLShop.entity.GoodsReceipt;
import com.group19.QLShop.entity.enums.GoodsReceiptStatus;

@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, Long> {

    Optional<GoodsReceipt> findByReceiptCode(String receiptCode);

    List<GoodsReceipt> findByStatus(GoodsReceiptStatus status);

    Page<GoodsReceipt> findByStatus(GoodsReceiptStatus status, Pageable pageable);

    // ==========================================
    // THỐNG KÊ CHI PHÍ NHẬP HÀNG KHO
    // ==========================================
    // Tổng số tiền đã chi ra nhập hàng (các phiếu COMPLETED)
    @Query("SELECT COALESCE(SUM(gr.totalAmount), 0.0) FROM GoodsReceipt gr WHERE gr.status = :status")
    Double sumTotalImportExpenseByStatus(@Param("status") GoodsReceiptStatus status);

    // Chi phí nhập hàng trong khoảng thời gian cụ thể
    @Query("SELECT COALESCE(SUM(gr.totalAmount), 0.0) FROM GoodsReceipt gr WHERE gr.status = :status AND gr.createdAt >= :startDate AND gr.createdAt <= :endDate")
    Double sumImportExpenseByStatusAndDateRange(
            @Param("status") GoodsReceiptStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}

