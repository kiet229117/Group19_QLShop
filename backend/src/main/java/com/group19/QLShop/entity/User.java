package com.group19.QLShop.entity;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.group19.QLShop.entity.enums.Role;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(unique = true, nullable = false)
    private String username;

    private String phone;

    @Column(unique = true, nullable = false)
    private String email;

    private String gender;
    private String address;
    private String password;
    private String avatar;

    @Enumerated(EnumType.STRING)
    private Role role = Role.user;

    private Boolean active = true;

    @Column(name = "lock_reason", columnDefinition = "TEXT")
    private String lockReason;

    // Danh sách mã voucher đã mở khóa của riêng tài khoản (mặc định mới đăng ký có WELCOME50K)
    @Column(name = "unlocked_vouchers", columnDefinition = "TEXT")
    private String unlockedVouchers = "WELCOME50K";

    // Danh sách mã voucher tài khoản này đã sử dụng
    @Column(name = "used_vouchers", columnDefinition = "TEXT")
    private String usedVouchers = "";

    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;

    // Một người dùng thì chỉ có 1 giỏ thôi
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;
}
