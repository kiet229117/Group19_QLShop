package com.group19.QLShop.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.group19.QLShop.dto.reponse.AuthResponse;
import com.group19.QLShop.dto.reponse.UserResponse;
import com.group19.QLShop.dto.request.ChangePasswordRequest;
import com.group19.QLShop.dto.request.ForgotPasswordRequest;
import com.group19.QLShop.dto.request.LoginRequest;
import com.group19.QLShop.dto.request.RegisterRequest;
import com.group19.QLShop.dto.request.ResetPasswordRequest;
import com.group19.QLShop.security.JwtUtils;
import com.group19.QLShop.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    // ==========================================
    // 1. ĐĂNG KÝ TÀI KHOẢN (Gắn Cookie HttpOnly)
    // ==========================================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthService.AuthResult result = authService.register(request);

        // Tạo Cookie HttpOnly chứa JWT
        ResponseCookie cookie = jwtUtils.generateJwtCookie(result.token());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse("Đăng ký thành công", result.userResponse()));
    }

    // ==========================================
    // 2. ĐĂNG NHẬP (Gắn Cookie HttpOnly)
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthService.AuthResult result = authService.login(request);

        // Tạo Cookie HttpOnly chứa JWT
        ResponseCookie cookie = jwtUtils.generateJwtCookie(result.token());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse("Đăng nhập thành công", result.userResponse()));
    }

    // ==========================================
    // 3. ĐĂNG XUẤT (Xóa sạch Cookie HttpOnly)
    // ==========================================
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Tạo Cookie rỗng có maxAge = 0 để trình duyệt tự hủy cookie
        ResponseCookie cleanCookie = jwtUtils.getCleanJwtCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .body("Đăng xuất thành công, Cookie đã được xóa");
    }

    // ==========================================
    // 4. LẤY THÔNG TIN NGƯỜI DÙNG HIỆN TẠI TỪ COOKIE
    // ==========================================
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String username = authentication.getName();
        return ResponseEntity.ok(authService.getCurrentUser(username));
    }

    // ==========================================
    // 5. ĐỔI MẬT KHẨU
    // ==========================================
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        String username = authentication.getName();
        authService.changePassword(username, request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    // ==========================================
    // 6. QUÊN MẬT KHẨU (Gửi token qua email)
    // ==========================================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Mã xác nhận đã được gửi đến email của bạn");
    }

    // ==========================================
    // 7. ĐẶT LẠI MẬT KHẨU (Dùng token xác nhận)
    // ==========================================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công");
    }
}