package com.group19.QLShop.dto.reponse;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String userRole;
    private Long productId;
    private String productName;
    private Long parentId;
    private String content;
    private String replyContent;
    private String replyAuthor;
    private LocalDateTime repliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
