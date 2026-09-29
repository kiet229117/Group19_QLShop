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

    // Lấy tất cả thương hiệu
    @GetMapping
    public ResponseEntity<Page<BrandReponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BrandReponse> brands = brandService.getAllBrands(page, size).map(this::toResponse);
        return ResponseEntity.ok(brands);
    }

    // Thêm thương hiệu
    @PostMapping
    public ResponseEntity<BrandReponse> add(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(toResponse(brandService.addBrand(toBrand(request))));
    }

    // Sửa thương hiệu
    @PutMapping("/{id}")
    public ResponseEntity<BrandReponse> update(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(toResponse(brandService.uppdateBrand(id, toBrand(request))));
    }

    // Xóa thương hiệu
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    private Brand toBrand(BrandRequest request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setSlug(request.getSlug());
        brand.setDescription(request.getDescription());
        brand.setLogo(request.getLogo());
        return brand;
    }

    private BrandReponse toResponse(Brand brand) {
        return new BrandReponse(
                brand.getId(),
                brand.getName(),
                brand.getSlug(),
                brand.getDescription(),
                brand.getLogo());
    }
} 
