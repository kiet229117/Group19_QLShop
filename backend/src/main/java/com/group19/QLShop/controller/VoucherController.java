package com.group19.QLShop.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.group19.QLShop.dto.reponse.VoucherApplyResponse;
import com.group19.QLShop.dto.reponse.VoucherResponse;
import com.group19.QLShop.dto.request.VoucherApplyRequest;
import com.group19.QLShop.dto.request.VoucherRequest;
import com.group19.QLShop.service.VoucherService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {

    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    // 1. CLIENT: Lấy danh sách voucher HIỆN CÓ trong Ví Voucher của tài khoản đang đăng nhập
    // GET /api/vouchers/available?userId=...
    @GetMapping("/available")
    public ResponseEntity<List<VoucherResponse>> getAvailableVouchers(
            @RequestParam(value = "userId", required = false) Long userId,
            Authentication authentication) {
        String username = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : null;
        return ResponseEntity.ok(voucherService.getAvailableVouchersForUser(userId, username));
    }

    // 1b. CLIENT: Lấy toàn bộ danh mục voucher đang chạy trên hệ thống từ API (để hiển thị điều kiện nhận mã)
    // GET /api/vouchers/catalog
    @GetMapping("/catalog")
    public ResponseEntity<List<VoucherResponse>> getCatalogVouchers() {
        return ResponseEntity.ok(voucherService.getAvailableVouchers());
    }

    // 2. USER: Nhập mã để kiểm tra quyền sở hữu trong Ví và tính số tiền được giảm
    // POST /api/vouchers/apply
    @PostMapping("/apply")
    public ResponseEntity<VoucherApplyResponse> applyVoucher(
            @Valid @RequestBody VoucherApplyRequest request,
            Authentication authentication) {
        String username = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : null;
        return ResponseEntity.ok(voucherService.applyVoucher(request, username));
    }

    // 3. ADMIN: Xem toàn bộ voucher hệ thống (phân trang)
    // GET /api/vouchers?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<VoucherResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(voucherService.getAllVouchers(page, size));
    }

    // 4. ADMIN: Tạo voucher mới
    // POST /api/vouchers
    @PostMapping
    public ResponseEntity<VoucherResponse> create(@Valid @RequestBody VoucherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(voucherService.createVoucher(request));
    }

    // 5. ADMIN: Xóa voucher
    // DELETE /api/vouchers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.noContent().build();
    }
}
