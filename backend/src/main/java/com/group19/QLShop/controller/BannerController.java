package com.group19.QLShop.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.dto.reponse.BannerResponse;
import com.group19.QLShop.dto.request.BannerRequest;
import com.group19.QLShop.service.BannerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    // ==========================================
    // 1. PUBLIC: Lấy danh sách banner đang kích hoạt (Hiển thị trang chủ slider)
    // GET /api/banners/active
    // GET /api/banners/active?position=HOME_SLIDER
    // ==========================================
    @GetMapping("/active")
    public ResponseEntity<List<BannerResponse>> getActiveBanners(
            @RequestParam(required = false, defaultValue = "HOME_SLIDER") String position) {
        return ResponseEntity.ok(bannerService.getActiveBanners(position));
    }

    // ==========================================
    // 2. ADMIN/STAFF: Lấy tất cả banner (phân trang)
    // GET /api/banners?page=0&size=10
    // ==========================================
    @GetMapping
    public ResponseEntity<Page<BannerResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bannerService.getAllBanners(page, size));
    }

    // ==========================================
    // 3. ADMIN/STAFF: Xem chi tiết 1 banner
    // GET /api/banners/{id}
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<BannerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bannerService.getBannerById(id));
    }

    // ==========================================
    // 4. ADMIN/STAFF: Thêm mới banner
    // POST /api/banners
    // ==========================================
    @PostMapping
    public ResponseEntity<BannerResponse> create(@Valid @RequestBody BannerRequest request) {
        BannerResponse created = bannerService.createBanner(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ==========================================
    // 5. ADMIN/STAFF: Cập nhật thông tin banner
    // PUT /api/banners/{id}
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<BannerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody BannerRequest request) {
        return ResponseEntity.ok(bannerService.updateBanner(id, request));
    }

    // ==========================================
    // 6. ADMIN/STAFF: Bật / tắt nhanh hiển thị banner
    // PATCH /api/banners/{id}/toggle
    // ==========================================
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<BannerResponse> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(bannerService.toggleActive(id));
    }

    // ==========================================
    // 7. ADMIN: Xóa banner
    // DELETE /api/banners/{id}
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
}

