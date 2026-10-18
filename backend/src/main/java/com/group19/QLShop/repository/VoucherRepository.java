package com.group19.QLShop.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.group19.QLShop.entity.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    // Tìm voucher theo mã viết hoa (bỏ qua khoảng trắng)
    Optional<Voucher> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    // Lấy danh sách các voucher còn hiệu lực để hiển thị cho khách hàng chọn
    @Query("SELECT v FROM Voucher v WHERE v.active = true " +
           "AND v.startDate <= :now AND v.endDate >= :now " +
           "AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit) " +
           "ORDER BY v.endDate ASC")
    List<Voucher> findAvailableVouchers(LocalDateTime now);
}