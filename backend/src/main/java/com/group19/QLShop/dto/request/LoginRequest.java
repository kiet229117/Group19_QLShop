package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "Username/Email không được để trống")
    private String usernameOrEmail;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    // Phân hệ đăng nhập: "ADMIN" (Quản trị & Vận hành) hoặc "CLIENT" (Khách hàng / Thành viên)
    private String roleMode;
}
