package com.group19.QLShop.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.group19.QLShop.entity.Category;
import com.group19.QLShop.repository.CategoryRepository;

@Service 
public class CategoryService {
     private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    
    // Xem tất cả
    public Page<Category> getAllCategories(int page, int size) {
        Pageable data = PageRequest.of(page,size);
        return categoryRepository.findAll(data);
    }

    // Thêm
    public Category addCategory(Category category) {


        Category newCategory = new Category();
        newCategory.setName(category.getName());
        newCategory.setSlug(category.getSlug());
        newCategory.setDescription(category.getDescription());
        newCategory.setImage(category.getImage());
        newCategory.setActive(category.isActive());
        return categoryRepository.save(newCategory);

    }

    // sửa
    public Category uppdateCategory(Long id, Category category) {
        Category exists = categoryRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"));
        exists.setName(category.getName());
        exists.setDescription(category.getDescription());
        exists.setSlug(category.getSlug());
        exists.setImage(category.getImage());
        exists.setActive(category.isActive());
        return categoryRepository.save(exists);
        
    }

    // Xóa
    public void deleteCategory(Long id) {
        Category exists = categoryRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"));

        categoryRepository.delete(exists);
    }
}
