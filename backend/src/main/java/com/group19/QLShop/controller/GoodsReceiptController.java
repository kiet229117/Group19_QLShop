package com.group19.QLShop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.dto.reponse.GoodsReceiptResponse;
import com.group19.QLShop.dto.request.GoodsReceiptRequest;
import com.group19.QLShop.service.GoodsReceiptService;

@RestController
@RequestMapping("/api/goods-receipts")
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;

    public GoodsReceiptController(GoodsReceiptService goodsReceiptService) {
        this.goodsReceiptService = goodsReceiptService;
    }

    // 1. Tạo phiếu nhập mới (DRAFT)
    @PostMapping
    public ResponseEntity<GoodsReceiptResponse> createReceipt(@RequestBody GoodsReceiptRequest request) {
        GoodsReceiptResponse response = goodsReceiptService.createReceipt(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. Hoàn tất nhập kho (cộng tồn kho & cập nhật giá vốn thực tế)
    @PostMapping("/{id}/complete")
    public ResponseEntity<GoodsReceiptResponse> completeReceipt(@PathVariable Long id) {
        GoodsReceiptResponse response = goodsReceiptService.completeReceipt(id);
        return ResponseEntity.ok(response);
    }

    // 3. Hủy phiếu nhập
    @PostMapping("/{id}/cancel")
    public ResponseEntity<GoodsReceiptResponse> cancelReceipt(@PathVariable Long id) {
        GoodsReceiptResponse response = goodsReceiptService.cancelReceipt(id);
        return ResponseEntity.ok(response);
    }

    // 4. Lấy chi tiết phiếu nhập
    @GetMapping("/{id}")
    public ResponseEntity<GoodsReceiptResponse> getReceiptById(@PathVariable Long id) {
        GoodsReceiptResponse response = goodsReceiptService.getReceiptById(id);
        return ResponseEntity.ok(response);
    }

    // 5. Lấy toàn bộ danh sách phiếu nhập
    @GetMapping
    public ResponseEntity<List<GoodsReceiptResponse>> getAllReceipts() {
        List<GoodsReceiptResponse> list = goodsReceiptService.getAllReceipts();
        return ResponseEntity.ok(list);
    }
}

