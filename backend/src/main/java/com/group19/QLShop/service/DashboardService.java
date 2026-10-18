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

    public DashboardService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
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

        // Doanh thu
        Double totalRevenue = orderRepository.sumTotalAmountByStatus(OrderStatus.COMPLETED);
        Double todayRevenue = orderRepository.sumRevenueByStatusAndDateRange(OrderStatus.COMPLETED, startOfToday, endOfToday);
        Double thisMonthRevenue = orderRepository.sumRevenueByStatusAndDateRange(OrderStatus.COMPLETED, startOfMonth, endOfMonth);

        // Số lượng đơn theo trạng thái
        Long totalOrders = orderRepository.count();
        Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        Long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        Long shippingOrders = orderRepository.countByStatus(OrderStatus.SHIPPING);
        Long completedOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);
        Long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        // Tổng số lượng sản phẩm & khách hàng
        Long totalProducts = productRepository.count();
        Long totalUsers = userRepository.count();

        return DashboardSummaryResponse.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .todayRevenue(todayRevenue != null ? todayRevenue : 0.0)
                .thisMonthRevenue(thisMonthRevenue != null ? thisMonthRevenue : 0.0)
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
    // 2. BIỂU ĐỒ DOANH THU THEO NGÀY (REVENUE CHART)
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

            Double revenue = orderRepository.sumRevenueByStatusAndDateRange(OrderStatus.COMPLETED, startOfDay, endOfDay);
            Long count = orderRepository.countOrdersByStatusAndDateRange(OrderStatus.COMPLETED, startOfDay, endOfDay);

            chartList.add(RevenueChartResponse.builder()
                    .date(targetDate.toString())
                    .revenue(revenue != null ? revenue : 0.0)
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

