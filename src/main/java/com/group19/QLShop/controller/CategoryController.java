package com.group19.QLShop.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.dto.reponse.CategoryReponse;
import com.group19.QLShop.dto.request.CategoryRequest;
import com.group19.QLShop.entity.Category;
import com.group19.QLShop.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Lấy tất cả danh mục
    @GetMapping
    public ResponseEntity<Page<CategoryReponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CategoryReponse> categories = categoryService.getAllCategories(page, size).map(this::toResponse);
        return ResponseEntity.ok(categories);
    }

    // Thêm danh mục
    @PostMapping
    public ResponseEntity<CategoryReponse> add(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(toResponse(categoryService.addCategory(toCategory(request))));
    }

    // Sửa danh mục
    @PutMapping("/{id}")
    public ResponseEntity<CategoryReponse> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(toResponse(categoryService.uppdateCategory(id, toCategory(request))));
    }

    // Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    private Category toCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setImage(request.getImage());
        category.setActive(request.isActive());
        return category;
    }

    private CategoryReponse toResponse(Category category) {
        return new CategoryReponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImage(),
                category.isActive());
    }
}