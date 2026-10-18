package com.group19.QLShop.dto.request;

import java.time.LocalDateTime;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    @NotBlank(message = "Mã voucher không được để trống")
    @Pattern(regexp = "^[A-Z0-9_-]{3,20}$", message = "Mã voucher phải viết hoa, từ 3-20 ký tự (chữ, số, gạch ngang)")
    private String code;

    @NotBlank(message = "Tên voucher không được để trống")
    private String name;

    private String description;

    @NotBlank(message = "Loại giảm giá không được để trống (PERCENTAGE hoặc FIXED_AMOUNT)")
    private String discountType;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    @Positive(message = "Giá trị giảm giá phải lớn hơn 0")
    private Double discountValue;

    private Double maxDiscountAmount;

    @Builder.Default
    private Double minOrderValue = 0.0;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;

    @Builder.Default
    private Integer usageLimit = 100;

    @Builder.Default
    private Boolean active = true;
}