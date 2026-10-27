package com.group19.QLShop.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.group19.QLShop.service.OrderService;

import lombok.RequiredArgsConstructor;

/**
 * Tự động duyệt đơn hàng sau khoảng thời gian đệm (tính bằng Giây).
 * Mặc định: 900 giây (15 phút). Để test nhanh có thể đặt thành 10 giây trong application.properties:
 * app.order.auto-confirm-seconds=10
 */
@Component
@RequiredArgsConstructor
public class OrderAutoConfirmScheduler {

    private static final Logger log = LoggerFactory.getLogger(OrderAutoConfirmScheduler.class);

    private final OrderService orderService;

    // Thời gian đệm tính bằng GIÂY (Mặc định: 900s = 15 phút, khi test đặt là 10)
    // Cú pháp Spring: dùng dấu 2 chấm ":" cho default value, KHÔNG dùng dấu "="
    @Value("${app.order.auto-confirm-seconds:900}")
    private int autoConfirmSeconds;

    /**
     * Chạy định kỳ mỗi 5 giây (5000ms) để quét và duyệt các đơn PENDING đã quá thời gian đệm
     */
    @Scheduled(fixedDelay = 5000)
    public void scheduleAutoConfirmOrders() {
        try {
            int count = orderService.autoConfirmPendingOrdersBySeconds(autoConfirmSeconds);
            if (count > 0) {
                log.info("[AUTO-CONFIRM] Đã tự động xác nhận {} đơn hàng PENDING quá hạn {} giây sang trạng thái ĐÃ XÁC NHẬN (CONFIRMED)", count, autoConfirmSeconds);
            }
        } catch (Exception e) {
            log.error("[AUTO-CONFIRM] Lỗi khi thực hiện tự động duyệt đơn hàng: {}", e.getMessage(), e);
        }
    }
}
