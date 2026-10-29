package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    public record AuthResult(String token, UserResponse userResponse) {}

    @Transactional
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
        user.setUnlockedVouchers("WELCOME50K");
        user.setUsedVouchers("");

        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateToken(savedUser);
        return new AuthResult(token, toUserResponse(savedUser));
    }

    /**
     * Kiểm tra nhanh phân quyền và trạng thái tài khoản ngay khi người dùng nhấp chọn ô Phân hệ trên trang Login
     */
    public Map<String, Object> checkAccountRole(String identifier) {
        Map<String, Object> result = new HashMap<>();
        if (identifier == null || identifier.trim().isEmpty()) {
            result.put("exists", false);
            return result;
        }
        String clean = identifier.trim();
        User user = userRepository.findByUsername(clean)
                .orElseGet(() -> userRepository.findByEmail(clean).orElse(null));

        if (user == null) {
            result.put("exists", false);
            return result;
        }

        Role role = user.getRole() != null ? user.getRole() : Role.user;
        boolean isAdminOrStaff = (role == Role.admin || role == Role.staff);
        boolean isActive = !Boolean.FALSE.equals(user.getActive());

        result.put("exists", true);
        result.put("username", user.getUsername());
        result.put("name", user.getName() != null ? user.getName() : user.getUsername());
        result.put("role", role.name().toUpperCase());
        result.put("isAdminOrStaff", isAdminOrStaff);
        result.put("active", isActive);
        result.put("lockReason", user.getLockReason() != null ? user.getLockReason() : "");
        return result;
    }

    public AuthResult login(LoginRequest request) {
        String identifier = request.getUsernameOrEmail() != null ? request.getUsernameOrEmail().trim() : "";
        User user = userRepository.findByUsername(identifier)
                .orElseGet(() -> userRepository.findByEmail(identifier).orElse(null));

        // 1. Kiểm tra trạng thái khóa tài khoản trước tiên để báo đúng lý do bị khóa cho Client
        if (user != null && Boolean.FALSE.equals(user.getActive())) {
            String reason = (user.getLockReason() != null && !user.getLockReason().isBlank())
                    ? user.getLockReason()
                    : "Vi phạm quy định hoạt động của hệ thống QLShop.";
            throw new AppException("Tài khoản của bạn đã bị khóa do: " + reason);
        }

        // 2. Nếu người dùng chọn ô "Quản trị & Vận hành" (ADMIN) nhưng tài khoản là USER -> Báo lỗi phân quyền ngay
        if (user != null && "ADMIN".equalsIgnoreCase(request.getRoleMode())) {
            Role role = user.getRole() != null ? user.getRole() : Role.user;
            if (role != Role.admin && role != Role.staff) {
                throw new AppException("Tài khoản của bạn là Khách hàng (USER), không có quyền truy cập vào phân hệ Quản trị & Vận hành (ADMIN/STAFF)!");
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
        );

        if (user == null) {
            user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new AppException("Không tìm thấy User"));
        }

        // Kiểm tra lại một lần nữa sau khi xác thực mật khẩu
        if ("ADMIN".equalsIgnoreCase(request.getRoleMode())) {
            Role role = user.getRole() != null ? user.getRole() : Role.user;
            if (role != Role.admin && role != Role.staff) {
                throw new AppException("Tài khoản của bạn là Khách hàng (USER), không có quyền truy cập vào phân hệ Quản trị & Vận hành (ADMIN/STAFF)!");
            }
        }

        String token = jwtUtils.generateToken(user);

        return new AuthResult(token, toUserResponse(user));
    }

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng hiện tại"));

        if (Boolean.FALSE.equals(user.getActive())) {
            String reason = (user.getLockReason() != null && !user.getLockReason().isBlank())
                    ? user.getLockReason()
                    : "Vi phạm quy định hoạt động của hệ thống QLShop.";
            throw new AppException("Tài khoản của bạn đã bị khóa do: " + reason);
        }

        return toUserResponse(user);
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Không tìm thấy User"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException("Mật khẩu cũ không chính xác");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Không tìm thấy tài khoản với email này"));

        String token = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        emailService.sendResetPasswordEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new AppException("Mã xác nhận không hợp lệ hoặc đã hết hạn"));

        if (user.getResetPasswordTokenExpiry() != null && user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AppException("Mã xác nhận đã hết hạn");
        }

        if (user.getPassword() != null && passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException("Mật khẩu mới không được trùng với mật khẩu cũ");
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
                .lockReason(user.getLockReason())
                .unlockedVouchers(user.getUnlockedVouchers() != null ? user.getUnlockedVouchers() : "WELCOME50K")
                .usedVouchers(user.getUsedVouchers() != null ? user.getUsedVouchers() : "")
                .cartId(user.getCart() != null ? user.getCart().getId() : null)
                .build();
    }
}
