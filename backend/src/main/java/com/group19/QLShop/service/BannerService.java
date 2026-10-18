package com.group19.QLShop.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.dto.reponse.BannerResponse;
import com.group19.QLShop.dto.request.BannerRequest;
import com.group19.QLShop.entity.Banner;
import com.group19.QLShop.repository.BannerRepository;

@Service
@Transactional(readOnly = true)
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    // 1. Dành cho Khách hàng: Lấy danh sách banner đang bật để hiển thị trang chủ/vị trí cụ thể
    public List<BannerResponse> getActiveBanners(String position) {
        List<Banner> banners;
        if (position != null && !position.trim().isEmpty()) {
            banners = bannerRepository.findByActiveTrueAndPositionOrderByDisplayOrderAsc(position.trim());
        } else {
            banners = bannerRepository.findByActiveTrueOrderByDisplayOrderAsc();
        }
        return banners.stream().map(this::toResponse).toList();
    }

    // 2. Dành cho Admin: Lấy danh sách tất cả banner (hỗ trợ phân trang)
    public Page<BannerResponse> getAllBanners(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bannerRepository.findAll(pageable).map(this::toResponse);
    }

    // 3. Lấy chi tiết một banner theo ID
    public BannerResponse getBannerById(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy banner với ID: " + id));
        return toResponse(banner);
    }

    // 4. Dành cho Admin: Thêm mới banner
    @Transactional
    public BannerResponse createBanner(BannerRequest request) {
        Banner banner = Banner.builder()
                .title(request.getTitle())
                .image(request.getImage())
                .linkUrl(request.getLinkUrl())
                .position(request.getPosition() != null && !request.getPosition().isBlank() ? request.getPosition() : "HOME_SLIDER")
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 1)
                .active(request.getActive() != null ? request.getActive() : true)
                .description(request.getDescription())
                .build();

        Banner saved = bannerRepository.save(banner);
        return toResponse(saved);
    }

    // 5. Dành cho Admin: Cập nhật thông tin banner
    @Transactional
    public BannerResponse updateBanner(Long id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy banner với ID: " + id));

        banner.setTitle(request.getTitle());
        banner.setImage(request.getImage());
        banner.setLinkUrl(request.getLinkUrl());
        if (request.getPosition() != null && !request.getPosition().isBlank()) {
            banner.setPosition(request.getPosition());
        }
        if (request.getDisplayOrder() != null) {
            banner.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getActive() != null) {
            banner.setActive(request.getActive());
        }
        banner.setDescription(request.getDescription());

        Banner updated = bannerRepository.save(banner);
        return toResponse(updated);
    }

    // 6. Dành cho Admin: Bật/Tắt nhanh trạng thái hiển thị của banner
    @Transactional
    public BannerResponse toggleActive(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy banner với ID: " + id));
        
        banner.setActive(!Boolean.TRUE.equals(banner.getActive()));
        Banner updated = bannerRepository.save(banner);
        return toResponse(updated);
    }

    // 7. Dành cho Admin: Xóa banner
    @Transactional
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy banner với ID: " + id));
        bannerRepository.delete(banner);
    }

    // Hàm chuyển đổi Entity -> DTO Response
    private BannerResponse toResponse(Banner banner) {
        return BannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .image(banner.getImage())
                .linkUrl(banner.getLinkUrl())
                .position(banner.getPosition())
                .displayOrder(banner.getDisplayOrder())
                .active(banner.getActive())
                .description(banner.getDescription())
                .build();
    }
}

