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

      // Xem sản phẩm bằng slug
    public ProductReponse getProductBySlug(String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug sản phẩm không được để trống");
        }
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với slug: " + slug));
        return toResponse(product);
    }

    // Xem tất cả sản phẩm
    public Page<ProductReponse> getAllProducts(int page, int size) {
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::toResponse);
    }

    // Thêm sản phẩm 
    public ProductReponse addProduct(ProductRequest request) {
        
        if (productRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên sản phẩm '" + request.getName() + "' đã tồn tại trên hệ thống");
        }
        if (productRepository.existsBySlug(request.getSlug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug '" + request.getSlug() + "' đã tồn tại trên hệ thống");
        }


        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu với ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với ID: " + request.getCategoryId()));

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

    // Sửa sản phẩm
    public ProductReponse updateProduct(Long id, ProductRequest request) {
       

        Product exists = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với ID: " + id));

      if (productRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên sản phẩm '" + request.getName() + "' đã tồn tại trên hệ thống");
        }
        if (productRepository.existsBySlug(request.getSlug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug '" + request.getSlug() + "' đã tồn tại trên hệ thống");
        }

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

    // Tìm kiếm sản phẩm theo tên (Có phân trang)
    public Page<ProductReponse> searchProducts(String keyword, int page, int size) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập từ khóa");
        }

        if(productRepository.countByNameContainingIgnoreCase(keyword) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm");
        }
        validatePagination(page, size); 

    
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.searchByNameContainingIgnoreCase(keyword, pageable);
        return products.map(this::toResponse);
    }

    // Lọc theo thương hiệu
    public Page<ProductReponse> findProductsByBrand(Long brandId, int page, int size) {
      if(productRepository.countByBrandId(brandId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm của thương hiệu này");
        }

        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByBrandId(brandId, pageable);
        return products.map(this::toResponse);
    }

    // Lọc theo danh mục
    public Page<ProductReponse> findProductsByCategory(Long categoryId, int page, int size) {

        if(productRepository.countByCategoryId(categoryId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm của danh mục này");
        }

        validatePagination(page, size); 

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(this::toResponse);
    }

    // Lọc theo khoảng giá
    public Page<ProductReponse> findProductsByPriceRange(Double minPrice, Double maxPrice, int page, int size) {
        if (minPrice == null || maxPrice == null || minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khoảng giá không hợp lệ ");
        }

        if(productRepository.countByPriceBetween(minPrice, maxPrice) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm trong khoảng giá này");
        }
        validatePagination(page, size); 

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
        return products.map(this::toResponse);
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
        
        if (product.getBrand() != null) {
            response.setBrandId(product.getBrand().getId());
        }
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
        }
        
        return response;
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số trang (page) không được nhỏ hơn 0");
        }
        if (size <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kích thước trang (size) phải lớn hơn 0");
        }
    }
}
