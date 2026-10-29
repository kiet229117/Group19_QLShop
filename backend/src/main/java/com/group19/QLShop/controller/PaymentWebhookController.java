package com.group19.QLShop.controller;

import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.group19.QLShop.dto.reponse.OrderResponse;
import com.group19.QLShop.entity.Order;
import com.group19.QLShop.repository.OrderRepository;
import com.group19.QLShop.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
@Slf4j
public class PaymentWebhookController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    /**
     * Webhook tự động nhận thông báo biến động số dư từ MB Bank (qua SePay, Casso hoặc app ngân hàng).
     * Khi khách chuyển khoản tới tài khoản MB Bank 0375003464:
     * Webhook sẽ tự động đối soát chính xác theo mã phiên độc nhất (orderCode) hoặc ID đơn hàng,
     * sau đó tự động cập nhật Database thành "PAID" ("ĐÃ THANH TOÁN") ngay lập tức!
     */
    @PostMapping({"/payment", "/mb-bank", "/sepay"})
    public ResponseEntity<?> handleBankWebhook(@RequestBody(required = false) Map<String, Object> payload) {
        log.info("[MB Bank Webhook] Nhận dữ liệu thanh toán: {}", payload);

        if (payload == null || payload.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Payload rỗng"));
        }

        // 1. Trích xuất nội dung chuyển khoản từ các định dạng thông dụng (SePay, Casso, MB...)
        String content = "";
        if (payload.containsKey("content")) {
            content = String.valueOf(payload.get("content"));
        } else if (payload.containsKey("description")) {
            content = String.valueOf(payload.get("description"));
        } else if (payload.containsKey("orderCode")) {
            content = String.valueOf(payload.get("orderCode"));
        }

        log.info("[MB Bank Webhook] Nội dung chuyển khoản: {}", content);

        Long orderId = null;

        // 2. Tìm theo mã phiên độc nhất orderCode trước (Ví dụ: QL481920)
        if (!content.isBlank()) {
            Pattern codePattern = Pattern.compile("QL[0-9a-zA-Z\\-_]+", Pattern.CASE_INSENSITIVE);
            Matcher codeMatcher = codePattern.matcher(content);
            if (codeMatcher.find()) {
                String matchedCode = codeMatcher.group(0).trim().toUpperCase();
                Optional<Order> orderOpt = orderRepository.findByOrderCode(matchedCode);
                if (orderOpt.isPresent()) {
                    orderId = orderOpt.get().getId();
                    log.info("[MB Bank Webhook] Khớp chính xác phiên giao dịch qua orderCode: {}", matchedCode);
                }
            }
        }

        // 3. Nếu chưa tìm thấy qua orderCode, trích xuất ID dạng QL-XX hoặc QLXX
        if (orderId == null) {
            orderId = extractOrderIdFromContent(content);
        }

        // 4. Nếu payload có trực tiếp trường orderId
        if (orderId == null && payload.containsKey("orderId")) {
            try {
                orderId = Long.parseLong(String.valueOf(payload.get("orderId")));
            } catch (Exception ignored) {}
        }

        if (orderId == null) {
            log.warn("[MB Bank Webhook] Không tìm thấy mã đơn hàng trong nội dung: {}", content);
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Không tìm thấy mã đơn hàng trong nội dung chuyển khoản: " + content
            ));
        }

        // 5. Tự động cập nhật Database thành "PAID" và xác nhận đơn
        try {
            OrderResponse updatedOrder = orderService.updatePaymentStatus(orderId, "PAID");
            log.info("[MB Bank Webhook] Đã tự động cập nhật Database đơn hàng ID {} thành ĐÃ THANH TOÁN (PAID) thành công!", orderId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã tự động cập nhật đơn hàng " + orderId + " thành ĐÃ THANH TOÁN trong cơ sở dữ liệu",
                "order", updatedOrder
            ));
        } catch (Exception e) {
            log.error("[MB Bank Webhook] Lỗi khi cập nhật đơn hàng {}: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Lỗi cập nhật đơn hàng: " + e.getMessage()
            ));
        }
    }

    /**
     * API mô phỏng biến động số dư MB Bank để kiểm thử tự động:
     * GET/POST /api/webhook/simulate?orderId=1
     */
    @RequestMapping(value = "/simulate", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> simulateTransfer(@RequestParam Long orderId) {
        OrderResponse updated = orderService.updatePaymentStatus(orderId, "PAID");
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Đã mô phỏng MB Bank nhận tiền: Database đơn ID " + orderId + " đã tự động cập nhật sang 'PAID' (ĐÃ THANH TOÁN)",
            "order", updated
        ));
    }

    private Long extractOrderIdFromContent(String text) {
        if (text == null || text.isBlank()) return null;
        // Khớp QL-123, QL123, DH-123, DH123
        Pattern pattern = Pattern.compile("(?:QL|DH)[\\-_\\s]*(\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            try {
                return Long.parseLong(matcher.group(1));
            } catch (Exception ignored) {}
        }
        // Thử tìm số độc lập nếu chỉ có số
        Pattern numPattern = Pattern.compile("\\b(\\d+)\\b");
        Matcher numMatcher = numPattern.matcher(text);
        if (numMatcher.find()) {
            try {
                return Long.parseLong(numMatcher.group(1));
            } catch (Exception ignored) {}
        }
        return null;
    }
}
