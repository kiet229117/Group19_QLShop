package com.group19.QLShop.service;

import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductVariant;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import com.group19.QLShop.entity.ProductImage;
import com.group19.QLShop.repository.ProductImageRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private final ProductImageRepository productImageRepository;

    public ProductService(ProductRepository productRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            FileStorageService fileStorageService,
            ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
        this.productImageRepository = productImageRepository;
    }

    // Xem sản phẩm bằng slug
    public ProductReponse getProductBySlug(String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug sản phẩm không được để trống");
        }
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy sản phẩm với slug: " + slug));
        return toResponse(product);
    }

    // Xem tất cả sản phẩm
    public Page<ProductReponse> getAllProducts(int page, int size) {
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::toResponse);
    }

    // Thêm sản phẩm (Có xử lý đa ảnh)
    @Transactional(rollbackFor = Exception.class) // Đảm bảo rollback dữ liệu nếu lưu file lỗi
    public ProductReponse addProduct(ProductRequest request, List<MultipartFile> images) throws IOException {

        if (productRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tên sản phẩm '" + request.getName() + "' đã tồn tại trên hệ thống");
        }

        if (productRepository.existsBySlug(request.getSlug())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Slug '" + request.getSlug() + "' đã tồn tại trên hệ thống");
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy thương hiệu với ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        Product newProduct = new Product();
        newProduct.setName(request.getName());
        newProduct.setPrice(request.getPrice());
        newProduct.setDescription(request.getDescription());
        newProduct.setRating(request.getRating());
        newProduct.setSlug(request.getSlug());
        newProduct.setBrand(brand);
        newProduct.setCategory(category);

        // ---> THÊM MỚI LOGIC SALE, HOT & SIZE/COLOR (VARIANTS) TẠI ĐÂY <---
        newProduct.setSalePrice(request.getSalePrice());
        newProduct.setHot(request.isHot());

        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariant variant : request.getVariants()) {
                variant.setProduct(newProduct); // Gán khóa ngoại
            }
            newProduct.setVariants(request.getVariants());
        }
        // ------------------------------------------------------------------

        // 1. Lưu thông tin sản phẩm vào DB trước để sinh ID
        Product savedProduct = productRepository.save(newProduct);

        // 2. Xử lý và lưu danh sách ảnh đi kèm (nếu có)
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    String fileName = fileStorageService.storeFile(file);

                    ProductImage productImage = new ProductImage();
                    productImage.setImageUrl(fileName);
                    productImage.setProduct(savedProduct); 

                    productImageRepository.save(productImage);
                }
            }
        }

        return toResponse(savedProduct);
    }
    
    // Sửa/Cập nhật sản phẩm (Có xử lý cập nhật lại danh sách ảnh)
    @Transactional(rollbackFor = Exception.class)
    public ProductReponse updateProduct(Long id, ProductRequest request, List<MultipartFile> images) throws IOException {
        
        // 1. Kiểm tra sản phẩm có tồn tại không
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với ID: " + id));

        // 2. Kiểm tra trùng tên với sản phẩm khác
        if (productRepository.existsByName(request.getName()) && !existingProduct.getName().equals(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên sản phẩm '" + request.getName() + "' đã tồn tại");
        }

        // 3. Kiểm tra trùng slug với sản phẩm khác
        if (productRepository.existsBySlug(request.getSlug()) && !existingProduct.getSlug().equals(request.getSlug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug '" + request.getSlug() + "' đã tồn tại");
        }

        // 4. Tìm kiếm Brand và Category mới
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục ID: " + request.getCategoryId()));

        // 5. Cập nhật thông tin cơ bản
        existingProduct.setName(request.getName());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setRating(request.getRating());
        existingProduct.setSlug(request.getSlug());
        existingProduct.setBrand(brand);
        existingProduct.setCategory(category);

        // ---> THÊM MỚI LOGIC CẬP NHẬT SALE, HOT & VARIANTS <---
        existingProduct.setSalePrice(request.getSalePrice());
        existingProduct.setHot(request.isHot());

        if (request.getVariants() != null) {
            existingProduct.getVariants().clear(); // Xóa Size/Color cũ
            for (ProductVariant variant : request.getVariants()) {
                variant.setProduct(existingProduct); // Gán khóa ngoại lại
                existingProduct.getVariants().add(variant); // Thêm cái mới
            }
        }
        // ------------------------------------------------------

        // Lưu thông tin sản phẩm cập nhật trước
        Product updatedProduct = productRepository.save(existingProduct);

        // 6. Xử lý cập nhật ảnh 
        if (images != null && !images.isEmpty() && !images.get(0).isEmpty()) {
            
            List<ProductImage> oldImages = productImageRepository.findByProductId(id);
            
            for (ProductImage oldImg : oldImages) {
                fileStorageService.deleteImage(oldImg.getImageUrl());
            }
            
            productImageRepository.deleteAll(oldImages);

            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    String imagePath = fileStorageService.storeFile(file);

                    ProductImage newProductImage = new ProductImage();
                    newProductImage.setImageUrl(imagePath);
                    newProductImage.setProduct(updatedProduct);

                    productImageRepository.save(newProductImage);
                }
            }
        }

        return toResponse(updatedProduct);
    }

    // Xóa sản phẩm
    @Transactional
    public void deleteProduct(Long id) {
        Product exists = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy sản phẩm với ID: " + id));

        productRepository.delete(exists);
    }

    // Tìm kiếm sản phẩm theo tên (Có phân trang)
    public Page<ProductReponse> searchProducts(String keyword, int page, int size) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập từ khóa");
        }

        if (productRepository.countByNameContainingIgnoreCase(keyword) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm");
        }
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.searchByNameContainingIgnoreCase(keyword, pageable);
        return products.map(this::toResponse);
    }

    // Lọc theo thương hiệu
    public Page<ProductReponse> findProductsByBrand(Long brandId, int page, int size) {
        if (productRepository.countByBrandId(brandId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm của thương hiệu này");
        }

        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByBrandId(brandId, pageable);
        return products.map(this::toResponse);
    }

    // Lọc theo danh mục
    public Page<ProductReponse> findProductsByCategory(Long categoryId, int page, int size) {
        if (productRepository.countByCategoryId(categoryId) == 0) {
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khoảng giá không hợp lệ");
        }

        if (productRepository.countByPriceBetween(minPrice, maxPrice) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm trong khoảng giá này");
        }
        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
        return products.map(this::toResponse);
    }

    // Hàm kiểm tra tính hợp lệ của phân trang 
    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số trang không được nhỏ hơn 0");
        }
        if (size <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kích thước trang phải lớn hơn 0");
        }
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

        // ---> THÊM MỚI TRẢ VỀ DỮ LIỆU SALE, HOT & VARIANTS TẠI ĐÂY <---
        response.setSalePrice(product.getSalePrice());
        response.setHot(product.isHot());
        
        if (product.getVariants() != null) {
            response.setVariants(product.getVariants());
        }
        // --------------------------------------------------------------

        if (product.getBrand() != null) {
            response.setBrandId(product.getBrand().getId());
        }
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
        }

        return response;
    }
}