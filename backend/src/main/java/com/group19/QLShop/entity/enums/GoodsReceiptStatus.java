package com.group19.QLShop.entity.enums;

public enum GoodsReceiptStatus {
    DRAFT,      // Phiếu tạm (đang lập, chưa cập nhật kho)
    COMPLETED,  // Đã nhập kho (đã cộng tồn kho & cập nhật giá vốn)
    CANCELLED   // Đã hủy phiếu nhập
}

