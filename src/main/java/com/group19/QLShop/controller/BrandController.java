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

import com.group19.QLShop.dto.reponse.BrandReponse;
import com.group19.QLShop.dto.request.BrandRequest;
import com.group19.QLShop.entity.Brand;
import com.group19.QLShop.service.BrandService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

     // Lấy tất cả thương hiệu (Có phân trang)
    @GetMapping
    public ResponseEntity<Page<BrandReponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Service đã tự map sang Page<BrandReponse> nên gọi trực tiếp
        Page<BrandReponse> brands = brandService.getAllBrands(page, size);
        return ResponseEntity.ok(brands);
    }

    // Thêm thương hiệu
    @PostMapping
    public ResponseEntity<BrandReponse> add(@Valid @RequestBody BrandRequest request) {
        // Truyền thẳng Request DTO vào Service và nhận về Response DTO
        BrandReponse newBrand = brandService.addBrand(request);
        return ResponseEntity.ok(newBrand);
    }

    // Sửa thương hiệu
    @PutMapping("/{id}")
    public ResponseEntity<BrandReponse> update(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        // Gọi đúng tên hàm updateBrand (1 chữ p) trong Service chuẩn của bạn
        BrandReponse updatedBrand = brandService.updateBrand(id, request);
        return ResponseEntity.ok(updatedBrand);
    }

    // Xóa thương hiệu
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content đúng chuẩn RESTful khi xóa thành công
    }

    


} 
