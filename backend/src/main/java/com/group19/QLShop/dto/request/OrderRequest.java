package com.group19.QLShop.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private Long userId;

    @NotBlank(message = "Tên người nhận không được để trống")
    @Size(min = 2, max = 100, message = "Tên người nhận phải từ 2 đến 100 ký tự")
    private String receiverName;

    @NotBlank(message = "Số điện thoại người nhận không được để trống")
    @Pattern(regexp = "^0[0-9]{8,10}$", message = "Số điện thoại không hợp lệ (ví dụ: 0912345678)")
    @Size(min = 9, max = 11, message = "Số điện thoại phải từ 9 đến 11 ký tự")
    private String receiverPhone;

    @NotBlank(message = "Bạn chưa cập nhật địa chỉ nhận hàng! Vui lòng nhập địa chỉ giao hàng chi tiết.")
    @Size(min = 10, max = 255, message = "Địa chỉ nhận hàng phải từ 10 đến 255 ký tự (ghi rõ số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)")
    private String shippingAddress;

    private String note;

    // Phí vận chuyển (tính dựa trên khoảng cách OpenStreetMap)
    private Double shippingFee;

    // Phương thức thanh toán (COD, BANK_TRANSFER, etc.)
    private String paymentMethod;

    // Mã voucher áp dụng cho đơn hàng (nếu có)
    private String voucherCode;

    // Tùy chọn: Nếu người dùng đặt hàng trực tiếp truyền danh sách sản phẩm.
    // Nếu để trống (null hoặc rỗng), hệ thống có thể lấy từ Cart của User
    @Valid
    private List<OrderItemRequest> items;
}
