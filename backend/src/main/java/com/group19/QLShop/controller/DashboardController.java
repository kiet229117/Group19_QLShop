package com.group19.QLShop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.dto.reponse.DashboardSummaryResponse;
import com.group19.QLShop.dto.reponse.OrderStatusDistributionResponse;
import com.group19.QLShop.dto.reponse.RevenueChartResponse;
import com.group19.QLShop.dto.reponse.TopSellingProductResponse;
import com.group19.QLShop.service.DashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ==========================================
    // 1. TỔNG HỢP SỐ LIỆU TỔNG QUAN (DOANH THU, ĐƠN HÀNG, SẢN PHẨM)
    // GET /api/admin/dashboard/summary
    // ==========================================
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummaryStats());
    }

    // ==========================================
    // 2. BIỂU ĐỒ DOANH THU THEO NGÀY (VẼ CHART)
    // GET /api/admin/dashboard/revenue-chart?days=7
    // ==========================================
    @GetMapping("/revenue-chart")
    public ResponseEntity<List<RevenueChartResponse>> getRevenueChart(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(dashboardService.getRevenueChart(days));
    }

    // ==========================================
    // 3. TOP MẪU ÁO BÁN CHẠY NHẤT (BEST SELLERS)
    // GET /api/admin/dashboard/top-products?limit=5
    // ==========================================
    @GetMapping("/top-products")
    public ResponseEntity<List<TopSellingProductResponse>> getTopSellingProducts(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getTopSellingProducts(limit));
    }

    // ==========================================
    // 4. PHÂN BỔ TRẠNG THÁI ĐƠN HÀNG (BIỂU ĐỒ TRÒN)
    // GET /api/admin/dashboard/order-status
    // ==========================================
    @GetMapping("/order-status")
    public ResponseEntity<List<OrderStatusDistributionResponse>> getOrderStatusDistribution() {
        return ResponseEntity.ok(dashboardService.getOrderStatusDistribution());
    }
}

