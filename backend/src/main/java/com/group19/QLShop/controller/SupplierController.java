package com.group19.QLShop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.entity.Supplier;
import com.group19.QLShop.exception.AppException;
import com.group19.QLShop.repository.GoodsReceiptRepository;
import com.group19.QLShop.repository.SupplierRepository;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository supplierRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;

    public SupplierController(SupplierRepository supplierRepository, GoodsReceiptRepository goodsReceiptRepository) {
        this.supplierRepository = supplierRepository;
        this.goodsReceiptRepository = goodsReceiptRepository;
    }

    // 1. Lấy tất cả nhà cung cấp
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    // 2. Thêm mới nhà cung cấp
    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        Supplier saved = supplierRepository.save(supplier);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 3. Lấy chi tiết nhà cung cấp theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return supplierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Cập nhật thông tin nhà cung cấp
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy Nhà cung cấp với ID: " + id));

        if (request.getName() != null) supplier.setName(request.getName());
        if (request.getCode() != null) supplier.setCode(request.getCode());
        if (request.getContactPerson() != null) supplier.setContactPerson(request.getContactPerson());
        if (request.getPhone() != null) supplier.setPhone(request.getPhone());
        if (request.getEmail() != null) supplier.setEmail(request.getEmail());
        if (request.getAddress() != null) supplier.setAddress(request.getAddress());
        if (request.getActive() != null) supplier.setActive(request.getActive());

        Supplier updated = supplierRepository.save(supplier);
        return ResponseEntity.ok(updated);
    }

    // 5. Xóa nhà cung cấp
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplier(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy Nhà cung cấp với ID: " + id));

        // Kiểm tra xem nhà cung cấp đã có lịch sử phiếu nhập kho chưa
        if (goodsReceiptRepository.existsBySupplierId(id)) {
            supplier.setActive(false);
            supplierRepository.save(supplier);
            throw new AppException("Nhà cung cấp này đã có lịch sử phiếu nhập kho liên kết trong hệ thống nên không thể xóa vĩnh viễn. Đã chuyển sang trạng thái tạm ngưng.");
        }

        supplierRepository.delete(supplier);
        return ResponseEntity.ok("Xóa Nhà cung cấp thành công");
    }
}
