package com.group19.QLShop.service;

import com.group19.QLShop.entity.Product;
import com.group19.QLShop.repository.BrandRepository;
import com.group19.QLShop.repository.CategoryRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.dto.reponse.ProductReponse;
import com.group19.QLShop.dto.request.ProductRequest;
import com.group19.QLShop.entity.Brand;
import com.group19.QLShop.entity.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service 
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    public ProductService(ProductRepository productRepository, BrandRepository brandRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

     // Xem sản phẩm bằng slug (Trả về DTO)
    public ProductReponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với slug: " + slug));
        return toResponse(product);
    }

    // Xem tất cả (Chuyển Page<Product> sang Page<ProductReponse>)
    public Page<ProductReponse> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::toResponse);
    }

    // Thêm sản phẩm (Nhận ProductRequest DTO)
    public ProductReponse addProduct(ProductRequest request) {
        // Tìm và kiểm tra Thương hiệu tồn tại từ brandId trong request
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu với ID: " + request.getBrandId()));

        // Tìm và kiểm tra Danh mục tồn tại từ categoryId trong request
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        // Map dữ liệu từ Request DTO vào Entity mới
        Product newProduct = new Product();
        newProduct.setName(request.getName());
        newProduct.setPrice(request.getPrice());
        newProduct.setDescription(request.getDescription());
        newProduct.setRating(request.getRating());
        newProduct.setSlug(request.getSlug());
        newProduct.setBrand(brand);
        newProduct.setCategory(category);

        Product savedProduct = productRepository.save(newProduct);
        return toResponse(savedProduct);
    }

    // Sửa sản phẩm (Nhận ProductRequest DTO)
    public ProductReponse updateProduct(Long id, ProductRequest request) {
        Product exists = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với ID: " + id));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu với ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với ID: " + request.getCategoryId()));


        exists.setName(request.getName());
        exists.setPrice(request.getPrice());
        exists.setDescription(request.getDescription());
        exists.setRating(request.getRating());
        exists.setSlug(request.getSlug());
        exists.setBrand(brand);
        exists.setCategory(category);

        Product updatedProduct = productRepository.save(exists);
        return toResponse(updatedProduct);
    }

    // Xóa sản phẩm
    public void deleteProduct(Long id) {
        Product exists = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với ID: " + id));

        productRepository.delete(exists);
    }

    // Hàm chuyển đổi (Mapping) từ Entity sang Response DTO chính xác
    private ProductReponse toResponse(Product product) {
        ProductReponse response = new ProductReponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setDescription(product.getDescription());
        response.setRating(product.getRating());
        response.setSlug(product.getSlug());
        
        // Lấy ID an toàn từ mối quan hệ Entity (nếu có liên kết)
        if (product.getBrand() != null) {
            response.setBrandId(product.getBrand().getId());
        }
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
        }
        
        return response;
    }
}
