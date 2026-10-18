package com.group19.QLShop.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    // Lấy danh sách banner đang kích hoạt theo vị trí hiển thị, sắp xếp theo thứ tự
    List<Banner> findByActiveTrueAndPositionOrderByDisplayOrderAsc(String position);

    // Lấy tất cả banner đang kích hoạt, sắp xếp theo thứ tự hiển thị
    List<Banner> findByActiveTrueOrderByDisplayOrderAsc();

    // Lấy danh sách banner theo vị trí (cả active lẫn inactive cho quản trị)
    List<Banner> findByPositionOrderByDisplayOrderAsc(String position);
}

