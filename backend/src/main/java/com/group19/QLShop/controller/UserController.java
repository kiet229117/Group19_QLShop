package com.group19.QLShop.controller;

import com.group19.QLShop.dto.request.UserRequest;
import com.group19.QLShop.dto.reponse.UserReponse;
import com.group19.QLShop.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // LẤY TẤT CẢ USER
    // GET /api/users
    // =========================

    @GetMapping
    public ResponseEntity<List<UserReponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }


    // =========================
    // LẤY USER THEO ID
    // GET /api/users/{id}
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<UserReponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }


    // =========================
    // TÌM USER THEO USERNAME
    // GET /api/users/username/{username}
    // =========================

    @GetMapping("/username/{username}")
    public ResponseEntity<UserReponse> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }


    // =========================
    // TÌM USER THEO EMAIL
    // GET /api/users/email/{email}
    // =========================

    @GetMapping("/email/{email}")
    public ResponseEntity<UserReponse> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }


    // =========================
    // ĐĂNG KÝ USER
    // POST /api/users
    // =========================

    @PostMapping
    public ResponseEntity<UserReponse> createUser(
            @Valid @RequestBody UserRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }


    // =========================
    // CẬP NHẬT USER
    // PUT /api/users/{id}
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<UserReponse> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }


    // =========================
    // ĐỔI MẬT KHẨU
    // PUT /api/users/{id}/password
    // =========================

   @PutMapping("/{id}/password")
public ResponseEntity<UserReponse> changePassword(
        @PathVariable Long id,
        @RequestBody UserRequest request
) {
    return ResponseEntity.ok(
            userService.changePassword(
                    id,
                    request.getOldPassword(),
                    request.getNewPassword()
            )
    );
}


    // =========================
    // XÓA USER
    // DELETE /api/users/{id}
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Xóa User thành công");
    }
}