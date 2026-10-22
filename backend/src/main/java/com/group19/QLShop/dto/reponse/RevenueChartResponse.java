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
    private Double cost;         // Giá vốn (COGS) của ngày
    private Double profit;       // Lợi nhuận gộp của ngày (revenue - cost)
    private Long orderCount;     // Số đơn hàng thành công trong ngày
}
