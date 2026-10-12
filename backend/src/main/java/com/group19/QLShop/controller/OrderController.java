package com.group19.QLShop.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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

import com.group19.QLShop.dto.reponse.OrderResponse;
import com.group19.QLShop.dto.request.OrderRequest;
import com.group19.QLShop.dto.request.OrderStatusUpdateRequest;
import com.group19.QLShop.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ==========================================
    // TẠO ĐƠN HÀNG (CHECKOUT)
    // POST /api/orders
    // ==========================================
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==========================================
    // LẤY CHI TIẾT ĐƠN HÀNG THEO ID
    // GET /api/orders/{id}
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // [ADMIN] LẤY TẤT CẢ ĐƠN HÀNG (PHÂN TRANG)
    // GET /api/orders?page=0&size=10
    // ==========================================
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderResponse> orders = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(orders);
    }

    // ==========================================
    // LẤY DANH SÁCH ĐƠN HÀNG CỦA USER (PHÂN TRANG)
    // GET /api/orders/user/{userId}?page=0&size=10
    // ==========================================
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderResponse>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderResponse> orders = orderService.getOrdersByUserId(userId, page, size);
        return ResponseEntity.ok(orders);
    }

    // ==========================================
    // [ADMIN] CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
    // PUT /api/orders/{id}/status
    // ==========================================
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // HỦY ĐƠN HÀNG
    // PUT /api/orders/{id}/cancel
    // ==========================================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        OrderResponse response = orderService.cancelOrder(id);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // [ADMIN] XÓA ĐƠN HÀNG
    // DELETE /api/orders/{id}
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}

