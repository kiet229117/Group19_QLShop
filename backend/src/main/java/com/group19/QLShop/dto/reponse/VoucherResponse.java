package com.group19.QLShop.dto.reponse;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String discountType;
    private Double discountValue;
    private Double maxDiscountAmount;
    private Double minOrderValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private Integer usedCount;
    private Boolean active;
}