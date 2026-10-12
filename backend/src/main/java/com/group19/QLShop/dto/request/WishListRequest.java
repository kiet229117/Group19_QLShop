package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor
@AllArgsConstructor
public class WishListRequest {

    @NotNull(message = "ID sản phẩm không được để trống")
    private Long productId;

    // Tùy chọn (nếu không truyền, backend tự lấy từ tài khoản đang đăng nhập)
    private Long userId;
}

