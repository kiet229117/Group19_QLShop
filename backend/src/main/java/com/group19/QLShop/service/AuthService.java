package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.group19.QLShop.dto.reponse.UserResponse;
import com.group19.QLShop.dto.request.ChangePasswordRequest;
import com.group19.QLShop.dto.request.ForgotPasswordRequest;
import com.group19.QLShop.dto.request.LoginRequest;
import com.group19.QLShop.dto.request.RegisterRequest;
import com.group19.QLShop.dto.request.ResetPasswordRequest;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.enums.Role;
import com.group19.QLShop.exception.AppException;
import com.group19.QLShop.repository.UserRepository;
import com.group19.QLShop.security.JwtUtils;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    // Lớp nội bộ để trả về cả Token (dùng set Cookie) và UserResponse
    public record AuthResult(String token, UserResponse userResponse) {}

    public AuthResult register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getFullname() != null ? request.getFullname() : request.getUsername());
        user.setPhone(request.getPhone());
        user.setRole(Role.user);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateTokenFromUsername(savedUser.getUsername());
        return new AuthResult(token, toUserResponse(savedUser));
    }

    public AuthResult login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new AppException("Không tìm thấy User")));

        String token = jwtUtils.generateTokenFromUsername(user.getUsername());

        return new AuthResult(token, toUserResponse(user));
    }

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng hiện tại"));
        return toUserResponse(user);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Không tìm thấy User"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Không tìm thấy tài khoản với email này"));

        String token = UUID.randomUUID().toString().substring(0, 6).toUpperCase(); // Sinh mã 6 ký tự
        
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
        
        userRepository.save(user);

        emailService.sendResetPasswordEmail(user.getEmail(), token);
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new AppException("Mã xác nhận không hợp lệ hoặc đã hết hạn"));

        if (user.getResetPasswordTokenExpiry() != null && user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AppException("Mã xác nhận đã hết hạn");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        
        userRepository.save(user);
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .fullname(user.getName())
                .avatar(user.getAvatar())
                .phone(user.getPhone())
                .role(user.getRole())
                .gender(user.getGender())
                .address(user.getAddress())
                .active(user.getActive())
                .cartId(user.getCart() != null ? user.getCart().getId() : null)
                .build();
    }
}
