package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private UserResponse user;
    // Tùy chọn token để phòng khi client cần biết hoặc debug, nhưng cookie HTTP-Only mới là nơi lưu trữ chính
    private String token;
    private String tokenType;

    public AuthResponse(String token) {
        this.token = token;
        this.tokenType = "Bearer";
    }

    public AuthResponse(String message, UserResponse user) {
        this.message = message;
        this.user = user;
    }
}
