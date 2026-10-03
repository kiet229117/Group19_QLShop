package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.Data;


@Data

public class CartItemRequest {

    @NotNull(message = "Product ID không được để trống")
    private Long productId;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private int quantity;
}