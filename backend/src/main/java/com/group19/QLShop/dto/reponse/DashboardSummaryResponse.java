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

    // ==========================================
    // 1. DOANH THU THUẦN (NET REVENUE)
    // ==========================================
    private Double totalRevenue;       // Tổng doanh thu thực tế từ tất cả đơn COMPLETED (sau voucher)
    private Double todayRevenue;       // Doanh thu hôm nay
    private Double thisMonthRevenue;   // Doanh thu tháng hiện tại

    // ==========================================
    // 2. GIÁ VỐN HÀNG BÁN (COST OF GOODS SOLD - COGS)
    // ==========================================
    private Double totalCost;          // Tổng giá vốn của các sản phẩm đã bán thành công
    private Double todayCost;          // Giá vốn hàng bán hôm nay
    private Double thisMonthCost;      // Giá vốn hàng bán tháng này

    // ==========================================
    // 3. LỢI NHUẬN GỘP THỰC TẾ (GROSS PROFIT = REVENUE - COGS)
    // ==========================================
    private Double totalProfit;        // Tổng lợi nhuận gộp tích lũy
    private Double todayProfit;        // Lợi nhuận gộp hôm nay
    private Double thisMonthProfit;    // Lợi nhuận gộp tháng này

    // ==========================================
    // 4. HIỆU QUẢ KINH DOANH (PROFIT MARGIN & CHI PHÍ KHO)
    // ==========================================
    private Double profitMargin;       // % Tỷ suất lợi nhuận gộp: (Lợi nhuận / Doanh thu) * 100
    private Double totalImportExpense; // Tổng tiền đã chi ra để nhập hàng vào kho (phiếu nhập COMPLETED)

    // ==========================================
    // 5. SỐ LƯỢNG ĐƠN HÀNG
    // ==========================================
    private Long totalOrders;          // Tổng số đơn
    private Long pendingOrders;        // Chờ duyệt
    private Long confirmedOrders;      // Đã duyệt
    private Long shippingOrders;       // Đang giao
    private Long completedOrders;      // Đã hoàn thành
    private Long cancelledOrders;      // Đã hủy

    // ==========================================
    // 6. TÀI NGUYÊN KHÁC (LIVE DATABASE STATS)
    // ==========================================
    private Long totalProducts;        // Tổng số sản phẩm đang bán
    private Long totalUsers;           // Tổng số khách hàng đã đăng ký
    private Long totalConversations;   // Tổng số cuộc hội thoại CSKH
    private Long totalComments;        // Tổng số bình luận & đánh giá
    private Long totalBanners;         // Tổng số banner & chiến dịch
}
