package com.group19.QLShop.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueChartResponse {

    private String date;         // Định dạng YYYY-MM-DD
    private Double revenue;      // Doanh thu của ngày
    private Long orderCount;     // Số đơn hàng thành công trong ngày
}

