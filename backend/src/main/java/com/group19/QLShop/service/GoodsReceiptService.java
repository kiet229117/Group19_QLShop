package com.group19.QLShop.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.dto.reponse.GoodsReceiptItemResponse;
import com.group19.QLShop.dto.reponse.GoodsReceiptResponse;
import com.group19.QLShop.dto.request.GoodsReceiptItemRequest;
import com.group19.QLShop.dto.request.GoodsReceiptRequest;
import com.group19.QLShop.entity.GoodsReceipt;
import com.group19.QLShop.entity.GoodsReceiptItem;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductVariant;
import com.group19.QLShop.entity.Supplier;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.enums.GoodsReceiptStatus;
import com.group19.QLShop.repository.GoodsReceiptRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.ProductVariantRepository;
import com.group19.QLShop.repository.SupplierRepository;
import com.group19.QLShop.repository.UserRepository;

@Service
@Transactional
public class GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    public GoodsReceiptService(
            GoodsReceiptRepository goodsReceiptRepository,
            SupplierRepository supplierRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository) {
        this.goodsReceiptRepository = goodsReceiptRepository;
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
    }

    // ==========================================
    // 1. TẠO PHIẾU NHẬP HÀNG MỚI (DRAFT)
    // ==========================================
    public GoodsReceiptResponse createReceipt(GoodsReceiptRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh sách hàng hóa nhập không được để trống");
        }

        Supplier supplier;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseGet(() -> supplierRepository.findAll().stream().findFirst()
                            .orElseGet(() -> supplierRepository.save(Supplier.builder()
                                    .code("NCC-DEFAULT-01")
                                    .name("Xưởng May Gia Công Mặc Định")
                                    .phone("0901234567")
                                    .email("xuongmay@qlshop.vn")
                                    .address("TP. Hồ Chí Minh")
                                    .active(true)
                                    .build())));
        } else {
            supplier = supplierRepository.findAll().stream().findFirst()
                    .orElseGet(() -> supplierRepository.save(Supplier.builder()
                            .code("NCC-DEFAULT-01")
                            .name("Xưởng May Gia Công Mặc Định")
                            .phone("0901234567")
                            .email("xuongmay@qlshop.vn")
                            .address("TP. Hồ Chí Minh")
                            .active(true)
                            .build()));
        }

        User user = null;
        if (request.getImportedById() != null) {
            user = userRepository.findById(request.getImportedById())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy nhân viên nhập kho"));
        } else {
            // Lấy user đầu tiên (thường là Admin) nếu không truyền
            user = userRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hệ thống chưa có user thực hiện"));
        }

        String receiptCode = "PNK-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" 
                + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        GoodsReceipt receipt = GoodsReceipt.builder()
                .receiptCode(receiptCode)
                .supplier(supplier)
                .importedBy(user)
                .note(request.getNote())
                .status(GoodsReceiptStatus.DRAFT)
                .totalAmount(0.0)
                .build();

        double totalAmount = 0.0;
        List<GoodsReceiptItem> items = new ArrayList<>();

        for (GoodsReceiptItemRequest itemReq : request.getItems()) {
            if (itemReq.getProductId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã sản phẩm không được để trống");
            }
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượng nhập phải lớn hơn 0");
            }
            if (itemReq.getImportPrice() == null || itemReq.getImportPrice() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn giá nhập không hợp lệ");
            }

            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm ID: " + itemReq.getProductId()));

            ProductVariant variant = null;
            if (itemReq.getVariantId() != null) {
                variant = productVariantRepository.findById(itemReq.getVariantId()).orElse(null);
            }
            if (variant == null && product.getVariants() != null && !product.getVariants().isEmpty()) {
                variant = product.getVariants().get(0);
            }

            double lineTotal = itemReq.getQuantity() * itemReq.getImportPrice();
            totalAmount += lineTotal;

            GoodsReceiptItem item = GoodsReceiptItem.builder()
                    .goodsReceipt(receipt)
                    .product(product)
                    .productVariant(variant)
                    .quantity(itemReq.getQuantity())
                    .importPrice(itemReq.getImportPrice())
                    .totalPrice(lineTotal)
                    .build();

            items.add(item);
        }

        receipt.setItems(items);
        receipt.setTotalAmount(totalAmount);

        GoodsReceipt saved = goodsReceiptRepository.save(receipt);
        return mapToResponse(saved);
    }

    // ==========================================
    // 2. HOÀN TẤT NHẬP KHO (DUYỆT & CỘNG TỒN KHO + CẬP NHẬT GIÁ VỐN)
    // ==========================================
    public GoodsReceiptResponse completeReceipt(Long receiptId) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phiếu nhập với ID: " + receiptId));

        if (receipt.getStatus() == GoodsReceiptStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phiếu nhập kho này đã được hoàn tất trước đó!");
        }
        if (receipt.getStatus() == GoodsReceiptStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể hoàn tất phiếu nhập đã bị hủy!");
        }

        // Thực hiện nhập kho thực tế cho từng mặt hàng
        for (GoodsReceiptItem item : receipt.getItems()) {
            ProductVariant variant = item.getProductVariant();
            Product product = item.getProduct();

            if (variant == null && product != null && product.getVariants() != null && !product.getVariants().isEmpty()) {
                variant = product.getVariants().get(0);
            }

            // 1. Cập nhật tồn kho và giá vốn của Variant
            if (variant != null) {
                int currentStock = Math.max(0, variant.getStockQuantity());
                variant.setStockQuantity(currentStock + item.getQuantity());
                variant.setCostPrice(item.getImportPrice()); // Cập nhật giá vốn nhập gần nhất
                productVariantRepository.save(variant);
            }

            // 2. Cập nhật giá vốn chung của sản phẩm
            if (product != null) {
                product.setCostPrice(item.getImportPrice());
                productRepository.save(product);
            }
        }

        receipt.setStatus(GoodsReceiptStatus.COMPLETED);
        GoodsReceipt saved = goodsReceiptRepository.save(receipt);

        return mapToResponse(saved);
    }

    // ==========================================
    // 3. HỦY PHIẾU NHẬP (CANCEL)
    // ==========================================
    public GoodsReceiptResponse cancelReceipt(Long receiptId) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phiếu nhập với ID: " + receiptId));

        if (receipt.getStatus() == GoodsReceiptStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phiếu nhập đã hoàn tất và nhập kho, không thể hủy!");
        }

        receipt.setStatus(GoodsReceiptStatus.CANCELLED);
        GoodsReceipt saved = goodsReceiptRepository.save(receipt);
        return mapToResponse(saved);
    }

    // ==========================================
    // 4. LẤY CHI TIẾT THEO ID
    // ==========================================
    @Transactional(readOnly = true)
    public GoodsReceiptResponse getReceiptById(Long id) {
        GoodsReceipt receipt = goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phiếu nhập"));
        return mapToResponse(receipt);
    }

    // ==========================================
    // 5. DANH SÁCH TẤT CẢ PHIẾU NHẬP
    // ==========================================
    @Transactional(readOnly = true)
    public List<GoodsReceiptResponse> getAllReceipts() {
        return goodsReceiptRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private GoodsReceiptResponse mapToResponse(GoodsReceipt receipt) {
        List<GoodsReceiptItemResponse> itemResponses = receipt.getItems().stream()
                .map(i -> GoodsReceiptItemResponse.builder()
                        .id(i.getId())
                        .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                        .productName(i.getProduct() != null ? i.getProduct().getName() : "")
                        .variantId(i.getProductVariant() != null ? i.getProductVariant().getId() : null)
                        .variantColor(i.getProductVariant() != null ? i.getProductVariant().getColor() : null)
                        .variantSize(i.getProductVariant() != null ? i.getProductVariant().getSize() : null)
                        .quantity(i.getQuantity())
                        .importPrice(i.getImportPrice())
                        .totalPrice(i.getTotalPrice())
                        .build())
                .toList();

        return GoodsReceiptResponse.builder()
                .id(receipt.getId())
                .receiptCode(receipt.getReceiptCode())
                .supplierId(receipt.getSupplier() != null ? receipt.getSupplier().getId() : null)
                .supplierName(receipt.getSupplier() != null ? receipt.getSupplier().getName() : "")
                .importedById(receipt.getImportedBy() != null ? receipt.getImportedBy().getId() : null)
                .importedByName(receipt.getImportedBy() != null ? receipt.getImportedBy().getName() : "")
                .status(receipt.getStatus().name())
                .totalAmount(receipt.getTotalAmount())
                .note(receipt.getNote())
                .createdAt(receipt.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}

