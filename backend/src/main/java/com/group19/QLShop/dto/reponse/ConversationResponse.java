package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private Long id;

    // Thông tin đối phương trò chuyện (Shop hoặc Khách hàng)
    private Long partnerId;
    private String partnerName;
    private String partnerAvatar;
    private String partnerRole;

    // Thông tin sản phẩm liên quan (nếu có)
    private Long productId;
    private String productName;
    private Double productPrice;
    private String productImageUrl;

    // Xem trước tin nhắn cuối cùng
    private String lastMessage;
    private LocalDateTime lastMessageAt;

    // Số lượng tin nhắn chưa đọc
    private long unreadCount;
}

