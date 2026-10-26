package com.group19.QLShop.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.group19.QLShop.dto.reponse.UserReponse;
import com.group19.QLShop.dto.request.UserRequest;
import com.group19.QLShop.entity.Cart;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.enums.Role;
import com.group19.QLShop.exception.AppException;
import com.group19.QLShop.repository.CartRepository;
import com.group19.QLShop.repository.OrderRepository;
import com.group19.QLShop.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final FileStorageService fileStorageService;

    public UserService(
            UserRepository userRepository,
            CartRepository cartRepository,
            OrderRepository orderRepository,
            FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.fileStorageService = fileStorageService;
    }

    // =========================
    // LẤY TẤT CẢ USER
    // =========================
    public List<UserReponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================
    // LẤY USER THEO ID
    // =========================
    public UserReponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID: " + id));
        return toResponse(user);
    }

    // =========================
    // TÌM USER THEO USERNAME
    // =========================
    public UserReponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng có tên đăng nhập: " + username));
        return toResponse(user);
    }

    // =========================
    // TÌM USER THEO EMAIL
    // =========================
    public UserReponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng có email: " + email));
        return toResponse(user);
    }

    // =========================
    // ĐĂNG KÝ USER
    // =========================
    @Transactional
    public UserReponse createUser(UserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AppException("Tên đăng nhập (username) đã được sử dụng. Vui lòng chọn tên khác!");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException("Địa chỉ Email đã được đăng ký. Vui lòng sử dụng email khác!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setAvatar(request.getAvatar());

        if (request.getRole() != null) {
            try {
                user.setRole(Role.valueOf(request.getRole().toLowerCase()));
            } catch (Exception e) {
                user.setRole(Role.user);
            }
        } else {
            user.setRole(Role.user);
        }

        user.setActive(request.getActive() != null ? request.getActive() : true);
        if (Boolean.FALSE.equals(user.getActive())) {
            user.setLockReason(
                    request.getLockReason() != null && !request.getLockReason().isBlank()
                            ? request.getLockReason().trim()
                            : "Tài khoản đang tạm khóa bởi Quản trị viên"
            );
        }

        return toResponse(userRepository.save(user));
    }

    // =========================
    // CẬP NHẬT USER (HỖ TRỢ LƯU LÝ DO KHÓA TÀI KHOẢN)
    // =========================
    @Transactional
    public UserReponse updateUser(Long id, UserRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID: " + id));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            existingUser.setUsername(request.getUsername());
        }
        if (request.getName() != null) {
            existingUser.setName(request.getName());
        }
        if (request.getPhone() != null) {
            existingUser.setPhone(request.getPhone());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            existingUser.setEmail(request.getEmail());
        }
        if (request.getGender() != null) {
            existingUser.setGender(request.getGender());
        }
        if (request.getAddress() != null) {
            existingUser.setAddress(request.getAddress());
        }
        if (request.getAvatar() != null) {
            existingUser.setAvatar(request.getAvatar());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existingUser.setPassword(request.getPassword());
        }
        if (request.getRole() != null) {
            try {
                existingUser.setRole(Role.valueOf(request.getRole().toLowerCase()));
            } catch (Exception ignored) {}
        }
        if (request.getActive() != null) {
            existingUser.setActive(request.getActive());
            if (Boolean.FALSE.equals(request.getActive())) {
                String reason = request.getLockReason();
                if (reason == null || reason.isBlank()) {
                    reason = existingUser.getLockReason();
                }
                if (reason == null || reason.isBlank()) {
                    reason = "Vi phạm chính sách hoạt động hoặc theo quyết định của Quản trị viên.";
                }
                existingUser.setLockReason(reason.trim());
            } else {
                existingUser.setLockReason(null);
            }
        } else if (request.getLockReason() != null) {
            existingUser.setLockReason(request.getLockReason().trim());
        }

        return toResponse(userRepository.save(existingUser));
    }

    // =========================
    // ĐỔI MẬT KHẨU
    // =========================
    @Transactional
    public UserReponse changePassword(
            Long id,
            String oldPassword,
            String newPassword
    ) {
        if (oldPassword == null || oldPassword.isBlank()) {
            throw new AppException("Mật khẩu cũ không được để trống");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new AppException("Mật khẩu mới không được để trống");
        }
        if (newPassword.length() < 8) {
            throw new AppException("Mật khẩu mới phải có ít nhất 8 ký tự");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng"));

        if (!user.getPassword().equals(oldPassword)) {
            throw new AppException("Mật khẩu hiện tại không chính xác");
        }
        if (newPassword.equals(oldPassword)) {
            throw new AppException("Mật khẩu mới phải khác mật khẩu hiện tại");
        }
        user.setPassword(newPassword);
        return toResponse(userRepository.save(user));
    }

    // =========================
    // XÓA USER (XỬ LÝ AN TOÀN RÀNG BUỘC KHÓA NGOẠI)
    // =========================
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getName() != null) {
            String currentUsername = auth.getName();
            if (currentUsername.equalsIgnoreCase(user.getUsername()) || currentUsername.equalsIgnoreCase(user.getEmail())) {
                throw new AppException("Bạn đang đăng nhập bằng tài khoản này nên không thể tự xóa chính mình!");
            }
        }

        if (orderRepository.existsByUserId(id)) {
            user.setActive(false);
            user.setLockReason("Tài khoản đã phát sinh đơn hàng nên được hệ thống chuyển sang trạng thái tạm khóa để bảo toàn lịch sử giao dịch.");
            userRepository.save(user);
            throw new AppException("Tài khoản này đã phát sinh đơn hàng nên không thể xóa vĩnh viễn khỏi hệ thống. Tài khoản đã được tự động chuyển sang trạng thái \"Tạm khóa\".");
        }

        try {
            cartRepository.findByUserId(id).ifPresent(cartRepository::delete);
            userRepository.delete(user);
            userRepository.flush();
        } catch (DataIntegrityViolationException e) {
            user.setActive(false);
            user.setLockReason("Tài khoản có dữ liệu liên kết nên được chuyển sang trạng thái tạm khóa.");
            userRepository.save(user);
            throw new AppException("Không thể xóa vĩnh viễn do tài khoản có dữ liệu liên kết. Hệ thống đã tự động chuyển sang trạng thái \"Tạm khóa\".");
        }
    }

    @Transactional
    public UserReponse uploadAvatar(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID: " + userId));

        if (user.getAvatar() != null && !user.getAvatar().startsWith("http")) {
            fileStorageService.deleteFile(user.getAvatar());
        }

        String avatarUrl = fileStorageService.storeFile(file, "avatars");
        user.setAvatar(avatarUrl);
        userRepository.save(user);

        return toResponse(user);
    }

    // =========================
    // CHUYỂN USER -> USER REPONSE
    // =========================
    private UserReponse toResponse(User user) {
        Long cartId = cartRepository.findByUserId(user.getId())
                .map(Cart::getId)
                .orElse(null);

        return UserReponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .phone(user.getPhone())
                .email(user.getEmail())
                .gender(user.getGender())
                .address(user.getAddress())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .active(user.getActive() != null ? user.getActive() : true)
                .lockReason(user.getLockReason())
                .unlockedVouchers(user.getUnlockedVouchers() != null ? user.getUnlockedVouchers() : "WELCOME50K")
                .usedVouchers(user.getUsedVouchers() != null ? user.getUsedVouchers() : "")
                .cartId(cartId)
                .build();
    }
}
