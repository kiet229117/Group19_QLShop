package com.group19.QLShop.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.group19.QLShop.entity.Order;
import com.group19.QLShop.entity.OrderItem;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        System.out.println("==================================================");
        System.out.println("[RESET PASSWORD] Gửi mã xác nhận tới: " + toEmail);
        System.out.println("[TOKEN]: " + resetToken);
        System.out.println("==================================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("Mã xác nhận đặt lại mật khẩu - QLShop");
                message.setText("Xin chào,\n\n" +
                        "Mã xác nhận đặt lại mật khẩu của bạn là: " + resetToken + "\n\n" +
                        "Mã này có hiệu lực trong vòng 15 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\n" +
                        "Trân trọng,\nĐội ngũ QLShop");

                mailSender.send(message);
                System.out.println("Đã gửi email khôi phục thành công tới: " + toEmail);
            } catch (Exception e) {
                System.err.println("Lỗi gửi email thực tế (nhưng mã vẫn được in ra console ở trên): " + e.getMessage());
            }
        } else {
            System.out.println("Chưa cấu hình mail server thực tế, bạn có thể dùng trực tiếp mã token in ở trên để test.");
        }
    }

    public void sendOrderConfirmationEmail(Order order) {
        if (order == null || order.getUser() == null || order.getUser().getEmail() == null) {
            return;
        }
        if (mailSender == null) {
            return;
        }

        String toEmail = order.getUser().getEmail();
        String subject = "Xác nhận đơn hàng #" + order.getId() + " - QLShop Thời Trang";

        // Tạo nội dung email ngay trong luồng chính (tránh lỗi LazyInitializationException của Hibernate)
        StringBuilder body = new StringBuilder();
        body.append("Xin chào ").append(order.getReceiverName()).append(",\n\n");
        body.append("Cảm ơn bạn đã đặt hàng tại QLShop! Đơn hàng của bạn đã được tiếp nhận.\n\n");
        body.append("=== THÔNG TIN ĐƠN HÀNG #").append(order.getId()).append(" ===\n");
        body.append("- Người nhận: ").append(order.getReceiverName()).append("\n");
        body.append("- Số điện thoại: ").append(order.getReceiverPhone()).append("\n");
        body.append("- Địa chỉ giao hàng: ").append(order.getShippingAddress()).append("\n");
        String pmLabel = "BANK_TRANSFER".equalsIgnoreCase(order.getPaymentMethod())
                ? "Chuyển khoản VietQR"
                : "Thanh toán khi nhận hàng (COD)";
        body.append("- Hình thức thanh toán: ").append(pmLabel).append("\n\n");

        body.append("=== CHI TIẾT SẢN PHẨM ===\n");
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                String variantInfo = item.getProductVariant() != null
                        ? " (" + item.getProductVariant().getColor() + " - Size " + item.getProductVariant().getSize() + ")"
                        : "";
                String productName = item.getProduct() != null ? item.getProduct().getName() : "Sản phẩm";
                body.append("- ").append(productName).append(variantInfo)
                        .append(" x").append(item.getQuantity())
                        .append(" : ").append(String.format("%,.0f đ", item.getPrice() * item.getQuantity())).append("\n");
            }
        }

        if (order.getDiscountAmount() != null && order.getDiscountAmount() > 0) {
            body.append("\nGiảm giá Voucher (").append(order.getVoucherCode()).append("): -")
                    .append(String.format("%,.0f đ", order.getDiscountAmount()));
        }
        if (order.getShippingFee() != null && order.getShippingFee() > 0) {
            body.append("\nPhí vận chuyển: +").append(String.format("%,.0f đ", order.getShippingFee()));
        } else {
            body.append("\nPhí vận chuyển: Miễn phí (0 đ)");
        }
        body.append("\n=> TỔNG THANH TOÁN: ").append(String.format("%,.0f đ", order.getTotalAmount())).append("\n\n");
        body.append("Trân trọng,\nĐội ngũ QLShop");

        String emailText = body.toString();

        // Gửi mail bất đồng bộ để không làm chậm tốc độ đặt hàng của khách
        CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(emailText);
                mailSender.send(message);
                System.out.println("Đã gửi email xác nhận đơn hàng #" + order.getId() + " tới: " + toEmail);
            } catch (Exception e) {
                System.err.println("Lỗi gửi email xác nhận đơn hàng: " + e.getMessage());
            }
        });
    }
}