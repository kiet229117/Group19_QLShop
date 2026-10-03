package com.group19.QLShop.service;





import java.util.List;

import org.springframework.stereotype.Service;

import com.group19.QLShop.dto.reponse.UserReponse;
import com.group19.QLShop.dto.request.UserRequest;
import com.group19.QLShop.entity.Cart;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.enums.Role;
import com.group19.QLShop.repository.CartRepository;
import com.group19.QLShop.repository.UserRepository;
@Service
public class UserService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public UserService(
            UserRepository userRepository,
            CartRepository cartRepository
    ) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    // =========================
    // LẤY TẤT CẢ USER
    // =========================

    public List<UserReponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toReponse)
                .toList();
    }


    // =========================
    // LẤY USER THEO ID
    // =========================

    public UserReponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy User"));

        return toReponse(user);
    }


    // =========================
    // TÌM USER THEO USERNAME
    // =========================

    public UserReponse getUserByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy User"));

        return toReponse(user);
    }


    // =========================
    // TÌM USER THEO EMAIL
    // =========================

    public UserReponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy User"));

        return toReponse(user);
    }


    // =========================
    // ĐĂNG KÝ USER
    // =========================

    public UserReponse createUser(UserRequest request) {

        // Kiểm tra username đã tồn tại
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username đã tồn tại");
        }

        // Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
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

        // Đăng ký luôn là role user
        user.setRole(Role.user);

        return toReponse(userRepository.save(user));
    }


    // =========================
    // CẬP NHẬT USER
    // =========================

    public UserReponse updateUser(Long id, UserRequest request) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy User"));
existingUser.setUsername(request.getUsername());
        existingUser.setName(request.getName());
        existingUser.setPhone(request.getPhone());
        existingUser.setEmail(request.getEmail());
        existingUser.setGender(request.getGender());
        existingUser.setAddress(request.getAddress());
        existingUser.setAvatar(request.getAvatar());

        return toReponse(userRepository.save(existingUser));
    }


    // =========================
    // ĐỔI MẬT KHẨU
    // =========================

  public UserReponse changePassword(
            Long id,
            String oldPassword,
            String newPassword
    ) {
        // Kiểm tra dữ liệu gửi lên
        if (oldPassword == null || oldPassword.isBlank()) {
            throw new RuntimeException("Mật khẩu cũ không được để trống");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("Mật khẩu mới không được để trống");
        }
        if (newPassword.length() < 8) {
            throw new RuntimeException("Mật khẩu mới phải có ít nhất 8 ký tự");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy User"));
        // Kiểm tra mật khẩu cũ
        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }
        // Mật khẩu mới không được trùng mật khẩu cũ
        if (newPassword.equals(oldPassword)) {
            throw new RuntimeException("Mật khẩu mới phải khác mật khẩu cũ");
        }
        user.setPassword(newPassword);
        return toReponse(userRepository.save(user));
    }


    // =========================
    // XÓA USER
    // =========================

    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy User"));

        userRepository.delete(user);
    }


    // =========================
    // CHUYỂN USER -> USER REPONSE
    // =========================

    private UserReponse toReponse(User user) {

        // Lấy id giỏ hàng của User (chưa có giỏ thì null)
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
                .cartId(cartId)
                .build();
    }
}