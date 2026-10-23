package com.group19.QLShop.dto.reponse;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Long productId;
    private String productName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
