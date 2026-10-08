package com.group19.QLShop.dto.reponse;

import java.time.LocalDateTime;
import java.util.List;

import com.group19.QLShop.entity.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;

    private Long userId;

    private String userName;

    private String receiverName;

    private String receiverPhone;

    private String shippingAddress;

    private String note;

    private double totalAmount;

    private OrderStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<OrderItemResponse> items;
}

