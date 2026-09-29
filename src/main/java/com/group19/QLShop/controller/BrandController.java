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

import com.group19.QLShop.entity.Brand;
import com.group19.QLShop.service.BrandService;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    // Lấy tất cả thương hiệu
    @GetMapping
    public ResponseEntity<Page<Brand>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Brand> brands = brandService.getAllBrands(page, size);
        return ResponseEntity.ok(brands);
    }

    // Thêm thương hiệu
    @PostMapping
    public ResponseEntity<Brand> add(@RequestBody Brand brand) {
        return ResponseEntity.ok(brandService.addBrand(brand));
    }

    // Sửa thương hiệu
    @PutMapping("/{id}")
    public ResponseEntity<Brand> update(@PathVariable Long id, @RequestBody Brand brand) {
        return ResponseEntity.ok(brandService.uppdateBrand(id, brand));
    }

    // Xóa thương hiệu
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
} 
