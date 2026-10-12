package com.group19.QLShop.service;

import com.group19.QLShop.dto.reponse.ProductPriceResponse;
import com.group19.QLShop.dto.request.ProductPriceRequest;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductPrice;
import com.group19.QLShop.repository.ProductPriceRepository;
import com.group19.QLShop.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class ProductPriceService {

    private final ProductPriceRepository productPriceRepository;
    private final ProductRepository productRepository;

    public ProductPriceService(ProductPriceRepository productPriceRepository, ProductRepository productRepository) {
        this.productPriceRepository = productPriceRepository;
        this.productRepository = productRepository;
    }

    // ==========================================
    // 1. ĐẶT / CẬP NHẬT GIÁ KHUYẾN MÃI CHO SẢN PHẨM
    // ==========================================
    public ProductPriceResponse setSalePrice(Long productId, ProductPriceRequest request) {
        // Kiểm tra dữ liệu đầu vào
        if (request.getSalePrice() == null || request.getSalePrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giá khuyến mãi phải lớn hơn 0");
        }

        // Tìm sản phẩm gốc
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Không tìm thấy sản phẩm với ID: " + productId));

        // Kiểm tra nghiệp vụ: Giá sale phải nhỏ hơn giá gốc
        if (request.getSalePrice() >= product.getPrice()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Giá khuyến mãi (" + request.getSalePrice() + ") phải nhỏ hơn giá gốc (" + product.getPrice() + ")");
        }

        // Tìm xem sản phẩm đã có bảng giá sale chưa, nếu chưa thì tạo mới
        ProductPrice productPrice = productPriceRepository.findByProductId(productId)
                .orElseGet(() -> {
                    ProductPrice newPrice = new ProductPrice();
                    newPrice.setProduct(product);
                    return newPrice;
                });

        productPrice.setSalePrice(request.getSalePrice());
        ProductPrice savedPrice = productPriceRepository.save(productPrice);

        return toResponse(savedPrice, product);
    }

    // ==========================================
    // 2. XEM THÔNG TIN GIÁ KHUYẾN MÃI CỦA 1 SẢN PHẨM
    // ==========================================
    @Transactional(readOnly = true)
    public ProductPriceResponse getSalePriceByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Không tìm thấy sản phẩm với ID: " + productId));

        ProductPrice productPrice = productPriceRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Sản phẩm '" + product.getName() + "' hiện không có chương trình giảm giá"));

        if (productPrice.getSalePrice() == null || productPrice.getSalePrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Sản phẩm '" + product.getName() + "' hiện không có chương trình giảm giá");
        }

        return toResponse(productPrice, product);
    }

    // ==========================================
    // 3. HỦY CHƯƠNG TRÌNH KHUYẾN MÃI (XÓA SALE)
    // ==========================================
    public void removeSalePrice(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Không tìm thấy sản phẩm với ID: " + productId));

        ProductPrice productPrice = productPriceRepository.findByProductId(productId).orElse(null);
        if (productPrice != null) {
            product.setProductPrice(null); // Gỡ liên kết hai chiều
            productPriceRepository.delete(productPrice);
        }
    }

    // ==========================================
    // 4. LẤY TẤT CẢ SẢN PHẨM ĐANG GIẢM GIÁ (FLASH SALE)
    // ==========================================
    @Transactional(readOnly = true)
    public List<ProductPriceResponse> getAllOnSaleProducts() {
        return productPriceRepository.findBySalePriceIsNotNullAndSalePriceGreaterThan(0.0)
                .stream()
                .map(price -> toResponse(price, price.getProduct()))
                .toList();
    }

    // ==========================================
    // HÀM CHUYỂN ĐỔI (MAPPER) SANG RESPONSE DTO
    // ==========================================
    private ProductPriceResponse toResponse(ProductPrice productPrice, Product product) {
        double originalPrice = product.getPrice();
        Double salePrice = productPrice.getSalePrice();
        Integer discountPercent = null;

        // Tự động tính % giảm giá: round(((gốc - sale) / gốc) * 100)
        if (salePrice != null && salePrice > 0 && originalPrice > 0 && salePrice < originalPrice) {
            discountPercent = (int) Math.round(((originalPrice - salePrice) / originalPrice) * 100);
        }

        return ProductPriceResponse.builder()
                .id(productPrice.getId())
                .productId(product.getId())
                .productName(product.getName())
                .originalPrice(originalPrice)
                .salePrice(salePrice)
                .discountPercent(discountPercent)
                .build();
    }
}