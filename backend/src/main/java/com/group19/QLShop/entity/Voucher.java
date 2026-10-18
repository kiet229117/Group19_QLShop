package com.group19.QLShop.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "vouchers")
public class Voucher {
        @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false)
    private String name; // Tên chương trình nhe 2 bạn (no product)

    private String description;

    @Column(name = "discount_type", nullable = false, length = 20)
    private String discountType;

    @Column(name = "discount_value", nullable = false)
    private Double discountValue;

    @Column(name = "max_discount_amount")
    private Double maxDiscountAmount; // tiền giảm tối đa 

    @Column(name = "min_order_value")
    private Double minOrderValue; // Giá trị đơn hàng tối thiểu để được áp mã

     @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "usage_limit")
    private Integer usageLimit; //giới hạn sài voucher

    @Builder.Default
    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0; // số lượt dùng nhe

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}
