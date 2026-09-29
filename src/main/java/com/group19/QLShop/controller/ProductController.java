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

import com.group19.QLShop.dto.reponse.ProductReponse;
import com.group19.QLShop.dto.request.ProductRequest;

import com.group19.QLShop.service.ProductService;

import jakarta.validation.Valid;

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
        // Service đã trả về Page<ProductReponse> sẵn rồi
        Page<ProductReponse> products = productService.getAllProducts(page, size);
        return ResponseEntity.ok(products);
    }

    // Thêm sản phẩm
    @PostMapping
    public ResponseEntity<ProductReponse> add(@Valid @RequestBody ProductRequest request) {
        ProductReponse newProduct = productService.addProduct(request);
        return ResponseEntity.ok(newProduct);
    }
    

    // Sửa sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ProductReponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        ProductReponse updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(updatedProduct);
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); 
    }

    

  
}
