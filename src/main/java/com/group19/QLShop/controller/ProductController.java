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

import com.group19.QLShop.entity.Product;
import com.group19.QLShop.service.ProductService;

@RestController 
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Lấy bằng slug
    @GetMapping ("/slug/{slug}")
    public ResponseEntity<Product> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }
    // Lấy tất cả sản phẩm
    @GetMapping 
    public ResponseEntity<Page<Product>> getAll(
        @RequestParam (defaultValue = "0") int page,
        @RequestParam (defaultValue = "10") int size){
        Page<Product> products = productService.getAllProducts(page, size);
        return ResponseEntity.ok(products);
    }

    // Thêm sản phẩm
    @PostMapping
    public ResponseEntity<Product> add(@RequestBody Product product) {
        return ResponseEntity.ok(productService.addProduct(product));
    }

     // Sửa sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id,@RequestBody Product product) {
        return ResponseEntity.ok(productService.uppdateProduct(id,product));
    }

     // Xóa sản phẩm
    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
