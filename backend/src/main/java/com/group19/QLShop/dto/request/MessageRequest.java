package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    /**
     * ID của sản phẩm khách hàng đang hỏi (tùy chọn: có thể để trống nếu chat chung)
     */
    private Long productId;

    /**
     * ID của cuộc hội thoại có sẵn (tùy chọn)
     */
    private Long conversationId;

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String content;
}
