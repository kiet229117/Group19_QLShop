package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {
    @NotNull(message = "UserId không được để trống")
    private Long userId;

    @NotNull(message = "ProductId không được để trống")
    private Long productId;

    @NotBlank(message = "Nội dung bình luận không được để trống")
    private String content;
}
