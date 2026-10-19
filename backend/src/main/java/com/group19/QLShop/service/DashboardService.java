package com.group19.QLShop.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.group19.QLShop.dto.reponse.DashboardSummaryResponse;
import com.group19.QLShop.dto.reponse.OrderStatusDistributionResponse;
import com.group19.QLShop.dto.reponse.RevenueChartResponse;
import com.group19.QLShop.dto.reponse.TopSellingProductResponse;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductImage;
import com.group19.QLShop.entity.enums.OrderStatus;
import com.group19.QLShop.repository.OrderItemRepository;
import com.group19.QLShop.repository.OrderRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.group19.QLShop.repository.GoodsReceiptRepository goodsReceiptRepository;

    public DashboardService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            com.group19.QLShop.repository.GoodsReceiptRepository goodsReceiptRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.goodsReceiptRepository = goodsReceiptRepository;
    }

    // ==========================================
    // 1. TỔNG HỢP SỐ LIỆU TỔNG QUAN (SUMMARY)
    // ==========================================
    public DashboardSummaryResponse getSummaryStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        LocalDateTime startOfMonth = today.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
        LocalDateTime endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);

        // 1. Doanh thu thuần (Net Revenue từ đơn COMPLETED)
        Double totalRevRaw = orderRepository.sumTotalAmountByStatus(OrderStatus.COMPLETED);
        Double todayRevRaw = orderRepository.sumRevenueByStatusAndDateRange(OrderStatus.COMPLETED, startOfToday, endOfToday);
        Double thisMonthRevRaw = orderRepository.sumRevenueByStatusAndDateRange(OrderStatus.COMPLETED, startOfMonth, endOfMonth);

        double totalRevenue = totalRevRaw != null ? totalRevRaw : 0.0;
        double todayRevenue = todayRevRaw != null ? todayRevRaw : 0.0;
        double thisMonthRevenue = thisMonthRevRaw != null ? thisMonthRevRaw : 0.0;

        // 2. Giá vốn hàng bán (COGS - Cost of Goods Sold từ OrderItem)
        Double totalCostRaw = orderItemRepository.sumTotalCostByStatus(OrderStatus.COMPLETED);
        Double todayCostRaw = orderItemRepository.sumCostByStatusAndDateRange(OrderStatus.COMPLETED, startOfToday, endOfToday);
        Double thisMonthCostRaw = orderItemRepository.sumCostByStatusAndDateRange(OrderStatus.COMPLETED, startOfMonth, endOfMonth);

        double totalCost = totalCostRaw != null ? totalCostRaw : 0.0;
        double todayCost = todayCostRaw != null ? todayCostRaw : 0.0;
        double thisMonthCost = thisMonthCostRaw != null ? thisMonthCostRaw : 0.0;

        // 3. Lợi nhuận gộp thực tế (Gross Profit = Revenue - COGS)
        double totalProfit = Math.round((totalRevenue - totalCost) * 100.0) / 100.0;
        double todayProfit = Math.round((todayRevenue - todayCost) * 100.0) / 100.0;
        double thisMonthProfit = Math.round((thisMonthRevenue - thisMonthCost) * 100.0) / 100.0;

        // 4. Tỷ suất lợi nhuận gộp (% Profit Margin)
        double profitMargin = totalRevenue > 0
                ? Math.round((totalProfit / totalRevenue) * 1000.0) / 10.0
                : 0.0;

        // 5. Tổng chi phí đã nhập hàng vào kho (từ các phiếu nhập COMPLETED)
        Double totalImportExpRaw = goodsReceiptRepository.sumTotalImportExpenseByStatus(
                com.group19.QLShop.entity.enums.GoodsReceiptStatus.COMPLETED);
        double totalImportExpense = totalImportExpRaw != null ? totalImportExpRaw : 0.0;

        // 6. Số lượng đơn theo trạng thái
        Long totalOrders = orderRepository.count();
        Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        Long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        Long shippingOrders = orderRepository.countByStatus(OrderStatus.SHIPPING);
        Long completedOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);
        Long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        // 7. Tổng số lượng sản phẩm & khách hàng
        Long totalProducts = productRepository.count();
        Long totalUsers = userRepository.count();

        return DashboardSummaryResponse.builder()
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .thisMonthRevenue(thisMonthRevenue)
                .totalCost(totalCost)
                .todayCost(todayCost)
                .thisMonthCost(thisMonthCost)
                .totalProfit(totalProfit)
                .todayProfit(todayProfit)
                .thisMonthProfit(thisMonthProfit)
                .profitMargin(profitMargin)
                .totalImportExpense(totalImportExpense)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .confirmedOrders(confirmedOrders)
                .shippingOrders(shippingOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .build();
    }

    // ==========================================
    // 2. BIỂU ĐỒ DOANH THU & LỢI NHUẬN THEO NGÀY
    // ==========================================
    public List<RevenueChartResponse> getRevenueChart(int days) {
        if (days <= 0 || days > 90) {
            days = 7; // Mặc định 7 ngày gần nhất
        }

        List<RevenueChartResponse> chartList = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate targetDate = today.minusDays(i);
            LocalDateTime startOfDay = targetDate.atStartOfDay();
            LocalDateTime endOfDay = targetDate.atTime(LocalTime.MAX);

            Double revRaw = orderRepository.sumRevenueByStatusAndDateRange(OrderStatus.COMPLETED, startOfDay, endOfDay);
            Double costRaw = orderItemRepository.sumCostByStatusAndDateRange(OrderStatus.COMPLETED, startOfDay, endOfDay);
            Long count = orderRepository.countOrdersByStatusAndDateRange(OrderStatus.COMPLETED, startOfDay, endOfDay);

            double dayRevenue = revRaw != null ? revRaw : 0.0;
            double dayCost = costRaw != null ? costRaw : 0.0;
            double dayProfit = Math.round((dayRevenue - dayCost) * 100.0) / 100.0;

            chartList.add(RevenueChartResponse.builder()
                    .date(targetDate.toString())
                    .revenue(dayRevenue)
                    .cost(dayCost)
                    .profit(dayProfit)
                    .orderCount(count != null ? count : 0L)
                    .build());
        }

        return chartList;
    }

    // ==========================================
    // 3. TOP MẪU ÁO BÁN CHẠY NHẤT (TOP SELLING)
    // ==========================================
    public List<TopSellingProductResponse> getTopSellingProducts(int limit) {
        if (limit <= 0 || limit > 50) {
            limit = 5;
        }

        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> rawList = orderItemRepository.findTopSellingProductsRaw(pageable);
        List<TopSellingProductResponse> responseList = new ArrayList<>();

        for (Object[] row : rawList) {
            Long productId = ((Number) row[0]).longValue();
            String productName = (String) row[1];
            Long totalSold = ((Number) row[2]).longValue();
            Double totalRevenue = ((Number) row[3]).doubleValue();

            String imageUrl = null;
            String categoryName = null;
            String brandName = null;

            Product product = productRepository.findById(productId).orElse(null);
            if (product != null) {
                if (product.getCategory() != null) {
                    categoryName = product.getCategory().getName();
                }
                if (product.getBrand() != null) {
                    brandName = product.getBrand().getName();
                }
                if (product.getImages() != null && !product.getImages().isEmpty()) {
                    imageUrl = product.getImages().stream()
                            .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                            .map(ProductImage::getImageUrl)
                            .findFirst()
                            .orElse(product.getImages().get(0).getImageUrl());
                }
            }

            responseList.add(TopSellingProductResponse.builder()
                    .productId(productId)
                    .productName(productName)
                    .imageUrl(imageUrl)
                    .categoryName(categoryName)
                    .brandName(brandName)
                    .totalSold(totalSold)
                    .totalRevenue(totalRevenue)
                    .build());
        }

        return responseList;
    }

    // ==========================================
    // 4. PHÂN BỔ TRẠNG THÁI ĐƠN HÀNG (DISTRIBUTION)
    // ==========================================
    public List<OrderStatusDistributionResponse> getOrderStatusDistribution() {
        List<Object[]> grouped = orderRepository.countOrdersGroupedByStatus();
        long totalOrders = orderRepository.count();
        List<OrderStatusDistributionResponse> list = new ArrayList<>();

        for (Object[] row : grouped) {
            OrderStatus status = (OrderStatus) row[0];
            Long count = ((Number) row[1]).longValue();
            double percentage = totalOrders > 0 ? (count * 100.0 / totalOrders) : 0.0;
            // Làm tròn 1 chữ số thập phân
            percentage = Math.round(percentage * 10.0) / 10.0;

            String displayName = switch (status) {
                case PENDING -> "Chờ xác nhận";
                case CONFIRMED -> "Đã xác nhận";
                case SHIPPING -> "Đang giao hàng";
                case COMPLETED -> "Đã hoàn thành";
                case CANCELLED -> "Đã hủy";
            };

            list.add(OrderStatusDistributionResponse.builder()
                    .status(status.name())
                    .displayName(displayName)
                    .count(count)
                    .percentage(percentage)
                    .build());
        }

        return list;
    }
}

