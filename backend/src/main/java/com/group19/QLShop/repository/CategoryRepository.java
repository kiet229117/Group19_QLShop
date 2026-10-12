package com.group19.QLShop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.group19.QLShop.entity.Category;

@Repository 
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Sửa existsByCategoryId thành existsById để kiểm tra tồn tại của Danh mục theo ID
    boolean existsById(Long id);
    
    // Xóa bỏ hàm existsByBrandId (vì Category không quản lý thương hiệu)

    boolean existsByName(String name);
    boolean existsBySlug(String slug);
}
