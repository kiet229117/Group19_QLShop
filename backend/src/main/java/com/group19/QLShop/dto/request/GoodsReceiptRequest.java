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

    // Tương thích cả khi client gửi "details" hoặc "items"
    public void setDetails(List<GoodsReceiptItemRequest> details) {
        if (this.items == null || this.items.isEmpty()) {
            this.items = details;
        }
    }

    public List<GoodsReceiptItemRequest> getDetails() {
        return this.items;
    }
}
