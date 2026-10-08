package com.group19.QLShop.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.group19.QLShop.dto.reponse.ProductReponse;
import com.group19.QLShop.dto.request.ProductRequest;
import com.group19.QLShop.service.ProductService;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController 
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Lấy bằng slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductReponse> getBySlug(@PathVariable String slug) {
        ProductReponse product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(product);
    }

    // Lấy tất cả sản phẩm (Có phân trang)
    @GetMapping 
    public ResponseEntity<Page<ProductReponse>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Page<ProductReponse> products = productService.getAllProducts(page, size);
        return ResponseEntity.ok(products);
    }

    // Thêm sản phẩm (Đã sửa đổi hỗ trợ Đa ảnh qua RequestPart)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductReponse> add(
        @Valid @RequestPart("product") ProductRequest request,
        @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        ProductReponse newProduct = productService.addProduct(request, images);
        return ResponseEntity.ok(newProduct);
    }

    // Sửa sản phẩm
       @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductReponse> update(
        @PathVariable Long id, 
        @Valid @RequestPart("product") ProductRequest request, // Thay @RequestBody thành @RequestPart
        @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        
        ProductReponse updatedProduct = productService.updateProduct(id, request, images);
        return ResponseEntity.ok(updatedProduct);
    }


    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); 
    }

    // Tìm kiếm sản phẩm theo tên (Có phân trang)
    @GetMapping("/search")
    public ResponseEntity<Page<ProductReponse>> searchByName(
        @RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Page<ProductReponse> products = productService.searchProducts(keyword, page, size);
        return ResponseEntity.ok(products);
    }

    // Lọc sản phẩm theo thương hiệu (Có phân trang)
    @GetMapping("/filter/brand")
    public ResponseEntity<Page<ProductReponse>> filterByBrand(
        @RequestParam Long brandId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Page<ProductReponse> products = productService.findProductsByBrand(brandId, page, size);
        return ResponseEntity.ok(products);
    }

    // Lọc sản phẩm theo danh mục (Có phân trang)
    @GetMapping("/filter/category")
    public ResponseEntity<Page<ProductReponse>> filterByCategory(
        @RequestParam Long categoryId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Page<ProductReponse> products = productService.findProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok(products);
    }

    // Lọc sản phẩm theo khoảng giá (Có phân trang)
    @GetMapping("/filter/price")
    public ResponseEntity<Page<ProductReponse>> filterByPriceRange(
        @RequestParam Double minPrice,
        @RequestParam Double maxPrice,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Page<ProductReponse> products = productService.findProductsByPriceRange(minPrice, maxPrice, page, size);
        return ResponseEntity.ok(products);
    }
}
