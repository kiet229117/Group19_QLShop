package com.group19.QLShop.dto.reponse;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceiptResponse {
    private Long id;
    private String receiptCode;
    private Long supplierId;
    private String supplierName;
    private Long importedById;
    private String importedByName;
    private String status;
    private Double totalAmount;
    private String note;
    private LocalDateTime createdAt;
    private List<GoodsReceiptItemResponse> items;
}

