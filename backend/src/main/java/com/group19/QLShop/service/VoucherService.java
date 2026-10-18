package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.dto.reponse.VoucherApplyResponse;
import com.group19.QLShop.dto.reponse.VoucherResponse;
import com.group19.QLShop.dto.request.VoucherApplyRequest;
import com.group19.QLShop.dto.request.VoucherRequest;
import com.group19.QLShop.entity.Voucher;
import com.group19.QLShop.repository.VoucherRepository;

@Service
@Transactional(readOnly = true)
public class VoucherService {

    private final VoucherRepository voucherRepository;

    public VoucherService(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    // 1. Cho Khách hàng: Lấy danh sách voucher còn hạn để chọn
    public List<VoucherResponse> getAvailableVouchers() {
        return voucherRepository.findAvailableVouchers(LocalDateTime.now())
                .stream().map(this::toResponse).toList();
    }

    // 2. Cho Khách hàng: Kiểm tra & tính toán tiền giảm khi nhập mã ở giỏ hàng/thanh toán
    public VoucherApplyResponse applyVoucher(VoucherApplyRequest request) {
        Voucher voucher = voucherRepository.findByCodeIgnoreCase(request.getCode().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không tồn tại trên hệ thống"));

        // Kiểm tra trạng thái bật/tắt
        if (!Boolean.TRUE.equals(voucher.getActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá hiện đang tạm khóa");
        }

        LocalDateTime now = LocalDateTime.now();
        // Kiểm tra ngày bắt đầu
        if (now.isBefore(voucher.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá chưa đến ngày áp dụng");
        }
        // Kiểm tra ngày hết hạn
        if (now.isAfter(voucher.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết hạn sử dụng");
        }
        // Kiểm tra lượt dùng
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết lượt sử dụng");
        }
        // Kiểm tra giá trị đơn hàng tối thiểu
        if (voucher.getMinOrderValue() != null && request.getOrderAmount() < voucher.getMinOrderValue()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                String.format("Đơn hàng phải từ %,.0f VNĐ trở lên mới đủ điều kiện dùng mã này", voucher.getMinOrderValue()));
        }

        // TÍNH TOÁN TIỀN ĐƯỢC GIẢM
        double discountAmount = 0.0;
        if ("PERCENTAGE".equalsIgnoreCase(voucher.getDiscountType())) {
            discountAmount = request.getOrderAmount() * (voucher.getDiscountValue() / 100.0);
            if (voucher.getMaxDiscountAmount() != null && discountAmount > voucher.getMaxDiscountAmount()) {
                discountAmount = voucher.getMaxDiscountAmount(); // Cắt tối đa nếu vượt mức
            }
        } else if ("FIXED_AMOUNT".equalsIgnoreCase(voucher.getDiscountType())) {
            discountAmount = voucher.getDiscountValue();
        }

        // Không bao giờ giảm quá tổng tiền đơn
        if (discountAmount > request.getOrderAmount()) {
            discountAmount = request.getOrderAmount();
        }

        double finalAmount = request.getOrderAmount() - discountAmount;

        return VoucherApplyResponse.builder()
                .valid(true)
                .code(voucher.getCode())
                .originalAmount(request.getOrderAmount())
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .message(String.format("Áp dụng mã thành công! Bạn được giảm %,.0f VNĐ", discountAmount))
                .build();
    }

    // 3. Cho Đơn hàng: Tăng số lượt dùng voucher khi khách đặt hàng thành công
    @Transactional
    public void recordVoucherUsage(String code) {
        voucherRepository.findByCodeIgnoreCase(code).ifPresent(voucher -> {
            voucher.setUsedCount(voucher.getUsedCount() + 1);
            voucherRepository.save(voucher);
        });
    }

    // 4. Cho Admin: Thêm voucher mới
    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        String cleanCode = request.getCode().trim().toUpperCase();
        if (voucherRepository.existsByCodeIgnoreCase(cleanCode)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã voucher '" + cleanCode + "' đã tồn tại");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày kết thúc phải sau ngày bắt đầu");
        }

        Voucher voucher = Voucher.builder()
                .code(cleanCode)
                .name(request.getName())
                .description(request.getDescription())
                .discountType(request.getDiscountType().toUpperCase())
                .discountValue(request.getDiscountValue())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .minOrderValue(request.getMinOrderValue() != null ? request.getMinOrderValue() : 0.0)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return toResponse(voucherRepository.save(voucher));
    }

    // 5. Cho Admin: Lấy tất cả voucher (phân trang)
    public Page<VoucherResponse> getAllVouchers(int page, int size) {
        return voucherRepository.findAll(PageRequest.of(page, size)).map(this::toResponse);
    }

    // 6. Cho Admin: Xóa voucher
    @Transactional
    public void deleteVoucher(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy voucher ID: " + id));
        voucherRepository.delete(voucher);
    }

    private VoucherResponse toResponse(Voucher voucher) {
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .name(voucher.getName())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .minOrderValue(voucher.getMinOrderValue())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .usageLimit(voucher.getUsageLimit())
                .usedCount(voucher.getUsedCount())
                .active(voucher.getActive())
                .build();
    }
}