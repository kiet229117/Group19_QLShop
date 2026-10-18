package com.group19.QLShop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherApplyRequest {
    @NotBlank(message = "Mã voucher không được để trống")
    private String code;

    @NotNull(message = "Tổng tiền đơn hàng không được để trống")
    @Positive(message = "Tổng tiền đơn hàng phải lớn hơn 0")
    private Double orderAmount;
}