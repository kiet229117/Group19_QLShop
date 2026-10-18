package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusDistributionResponse {

    private String status;           // PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED
    private String displayName;      // Chờ duyệt, Đã duyệt, Đang giao, Đã hoàn thành, Đã hủy
    private Long count;              // Số lượng đơn
    private Double percentage;       // Tỷ lệ % (ví dụ: 45.5%)
}

