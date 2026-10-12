package com.group19.QLShop.controller;

import com.group19.QLShop.dto.reponse.ProductPriceResponse;
import com.group19.QLShop.dto.request.ProductPriceRequest;
import com.group19.QLShop.service.ProductPriceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-prices")
public class ProductPriceController {

    private final ProductPriceService productPriceService;

    public ProductPriceController(ProductPriceService productPriceService) {
        this.productPriceService = productPriceService;
    }

    // =========================================================================
    // 1. ĐẶT HOẶC CẬP NHẬT GIÁ SALE CHO SẢN PHẨM (ADMIN)
    // PUT: /api/product-prices/products/{productId}
    // =========================================================================
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductPriceResponse> setSalePrice(
            @PathVariable Long productId,
            @RequestBody ProductPriceRequest request) {
        ProductPriceResponse response = productPriceService.setSalePrice(productId, request);
        return ResponseEntity.ok(response);
    }

    // =========================================================================
    // 2. LẤY THÔNG TIN GIÁ KHUYẾN MÃI CỦA 1 SẢN PHẨM
    // GET: /api/product-prices/products/{productId}
    // =========================================================================
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductPriceResponse> getSalePrice(@PathVariable Long productId) {
        ProductPriceResponse response = productPriceService.getSalePriceByProductId(productId);
        return ResponseEntity.ok(response);
    }

    // =========================================================================
    // 3. HỦY CHƯƠNG TRÌNH KHUYẾN MÃI (XÓA SALE PRICE) (ADMIN)
    // DELETE: /api/product-prices/products/{productId}
    // =========================================================================
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Map<String, String>> removeSalePrice(@PathVariable Long productId) {
        productPriceService.removeSalePrice(productId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã hủy chương trình khuyến mãi cho sản phẩm ID: " + productId);
        return ResponseEntity.ok(response);
    }

    // =========================================================================
    // 4. LẤY TẤT CẢ SẢN PHẨM ĐANG GIẢM GIÁ (CHO TRANG FLASH SALE / KHUYẾN MÃI)
    // GET: /api/product-prices/on-sale
    // =========================================================================
    // @GetMapping("/on-sale")
    // public ResponseEntity<List<ProductPriceResponse>> getAllOnSaleProducts() {
    //     List<ProductPriceResponse> list = productPriceService.getAllOnSaleProducts();
    //     return ResponseEntity.ok(list);
    // }
}