package com.group19.QLShop.dto.reponse;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private Long userId;
    private Long productId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}