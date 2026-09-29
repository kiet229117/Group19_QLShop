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
import com.group19.QLShop.entity.Brand;
import com.group19.QLShop.entity.Category;
import com.group19.QLShop.entity.Product;
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
    @GetMapping ("/slug/{slug}")
    public ResponseEntity<ProductReponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(toResponse(productService.getProductBySlug(slug)));
    }
    // Lấy tất cả sản phẩm
    @GetMapping 
    public ResponseEntity<Page<ProductReponse>> getAll(
        @RequestParam (defaultValue = "0") int page,
        @RequestParam (defaultValue = "10") int size){
        Page<ProductReponse> products = productService.getAllProducts(page, size).map(this::toResponse);
        return ResponseEntity.ok(products);
    }

    // Thêm sản phẩm
    @PostMapping
    public ResponseEntity<ProductReponse> add(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(toResponse(productService.addProduct(toProduct(request))));
    }

     // Sửa sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ProductReponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(toResponse(productService.uppdateProduct(id, toProduct(request))));
    }

     // Xóa sản phẩm
    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    private Product toProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setRating(request.getRating());
        product.setSlug(request.getSlug());

        Brand brand = new Brand();
        brand.setId(request.getBrandId());
        product.setBrand(brand);

        Category category = new Category();
        category.setId(request.getCategoryId());
        product.setCategory(category);
        return product;
    }

    private ProductReponse toResponse(Product product) {
        return new ProductReponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getDescription(),
                product.getRating(),
                product.getSlug(),
                product.getBrand().getId(),
                product.getCategory().getId());
    }
}
