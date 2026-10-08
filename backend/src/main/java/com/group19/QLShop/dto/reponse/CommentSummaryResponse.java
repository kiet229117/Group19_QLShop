package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommentSummaryResponse {
    private Long productId;
    private long totalComments;
    private double averageRating;
}