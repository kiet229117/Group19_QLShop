package com.group19.QLShop.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.dto.reponse.CartItemReponse;
import com.group19.QLShop.dto.reponse.CartReponse;
import com.group19.QLShop.dto.request.CartItemRequest;
import com.group19.QLShop.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // =========================
    // [ADMIN] XEM TẤT CẢ GIỎ HÀNG
    // GET /api/carts
    // =========================

    @GetMapping
    public ResponseEntity<List<CartReponse>> getAllCarts() {
        return ResponseEntity.ok(cartService.getAllCarts());
    }


    // =========================
    // XEM GIỎ HÀNG CỦA USER
    // GET /api/carts/user/{userId}
    // =========================

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartReponse> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }


    // =========================
    // THÊM SẢN PHẨM VÀO GIỎ
    // POST /api/carts/user/{userId}/items
    // =========================

    @PostMapping("/user/{userId}/items")
    public ResponseEntity<CartItemReponse> addProduct(
            @PathVariable Long userId,
            @Valid @RequestBody CartItemRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cartService.addProduct(userId, request));
    }


    // =========================
    // TĂNG SỐ LƯỢNG +1
    // PUT /api/carts/user/{userId}/items/{cartItemId}/increase
    // =========================

    @PutMapping("/user/{userId}/items/{cartItemId}/increase")
    public ResponseEntity<CartItemReponse> increaseQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId
    ) {
        return ResponseEntity.ok(
                cartService.increaseQuantity(userId, cartItemId)
        );
    }


    // =========================
    // GIẢM SỐ LƯỢNG -1
    // PUT /api/carts/user/{userId}/items/{cartItemId}/decrease
    // =========================

    @PutMapping("/user/{userId}/items/{cartItemId}/decrease")
    public ResponseEntity<CartItemReponse> decreaseQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId
    ) {
        CartItemReponse Reponse =
                cartService.decreaseQuantity(userId, cartItemId);

        // Số lượng về 0 → sản phẩm đã bị xóa khỏi giỏ
        if (Reponse == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(Reponse);
    }


    // =========================
    // XÓA 1 SẢN PHẨM KHỎI GIỎ
    // DELETE /api/carts/user/{userId}/items/{cartItemId}
    // =========================

    @DeleteMapping("/user/{userId}/items/{cartItemId}")
    public ResponseEntity<String> removeProduct(
            @PathVariable Long userId,
            @PathVariable Long cartItemId
    ) {
        cartService.removeProduct(userId, cartItemId);
        return ResponseEntity.ok("Đã xóa sản phẩm khỏi giỏ hàng");
    }


    // =========================
    // XÓA TOÀN BỘ GIỎ HÀNG
    // DELETE /api/carts/user/{userId}
    // =========================

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Đã xóa toàn bộ giỏ hàng");
    }
}