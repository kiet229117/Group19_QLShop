

package com.group19.QLShop.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "User ID không được để trống")
    private Long userId;

    @NotBlank(message = "Tên người nhận không được để trống")
    @Size(min = 2, max = 100, message = "Tên người nhận phải từ 2 đến 100 ký tự")
    private String receiverName;

    @NotBlank(message = "Số điện thoại người nhận không được để trống")
    @Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "Số điện thoại không hợp lệ (ví dụ: 0912345678)")
    @Size(min = 10, max = 10, message = "Số điện thoại phải có đúng 10 ký tự")
    private String receiverPhone;

    @NotBlank(message = "Địa chỉ nhận hàng không được để trống")
    @Size(max = 255, message = "Địa chỉ nhận hàng không vượt quá 255 ký tự")
    private String shippingAddress;

    private String note;

    // Tùy chọn: Nếu người dùng đặt hàng trực tiếp truyền danh sách sản phẩm.
    // Nếu để trống (null hoặc rỗng), hệ thống có thể lấy từ Cart của User
    @Valid
    private List<OrderItemRequest> items;
}
