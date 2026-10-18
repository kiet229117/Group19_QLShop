package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherApplyResponse {
    private Boolean valid;             // Hợp lệ hay không
    private String code;               // Mã voucher
    private Double originalAmount;     // Tiền hàng ban đầu
    private Double discountAmount;     // Số tiền được giảm
    private Double finalAmount;        // Số tiền thanh toán thực tế (sau khi giảm)
    private String message;            // Lời nhắn (VD: "Áp mã thành công! Bạn được giảm 50.000đ")
}