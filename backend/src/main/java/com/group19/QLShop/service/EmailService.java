package com.group19.QLShop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
}
