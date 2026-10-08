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
import com.group19.QLShop.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

     // Lấy tất cả danh mục (Có phân trang)
    @GetMapping
    public ResponseEntity<Page<CategoryReponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Service đã tự map sang Page<CategoryReponse> nên gọi thẳng an toàn
        Page<CategoryReponse> categories = categoryService.getAllCategories(page, size);
        return ResponseEntity.ok(categories);
    }

    // Thêm danh mục
    @PostMapping
    public ResponseEntity<CategoryReponse> add(@Valid @RequestBody CategoryRequest request) {
        // Truyền thẳng Request DTO vào Service và nhận về Response DTO
        CategoryReponse newCategory = categoryService.addCategory(request);
        return ResponseEntity.ok(newCategory);
    }

    // Sửa danh mục
    @PutMapping("/{id}")
    public ResponseEntity<CategoryReponse> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        // Lưu ý gọi đúng tên hàm updateCategory trong Service của bạn
        CategoryReponse updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(updatedCategory);
    }

    // Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content đúng chuẩn RESTful khi xóa thành công
    }

}