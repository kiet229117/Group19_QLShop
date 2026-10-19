package com.group19.QLShop.dto.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptRequest {
    private Long supplierId;
    private Long importedById; // Người nhập (Admin/Staff)
    private String note;
    private List<GoodsReceiptItemRequest> items;
}

