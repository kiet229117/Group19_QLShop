package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    // Doanh thu
    private Double totalRevenue;       // Tổng doanh thu từ tất cả đơn COMPLETED
    private Double todayRevenue;       // Doanh thu hôm nay
    private Double thisMonthRevenue;   // Doanh thu tháng hiện tại

    // Số lượng đơn hàng
    private Long totalOrders;          // Tổng số đơn
    private Long pendingOrders;        // Chờ duyệt
    private Long confirmedOrders;      // Đã duyệt
    private Long shippingOrders;       // Đang giao
    private Long completedOrders;      // Đã hoàn thành
    private Long cancelledOrders;      // Đã hủy

    // Tổng số tài nguyên khác
    private Long totalProducts;        // Tổng số mẫu áo đang bán
    private Long totalUsers;           // Tổng số khách hàng đã đăng ký
}

