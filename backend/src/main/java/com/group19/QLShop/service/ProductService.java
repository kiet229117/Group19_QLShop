package com.group19.QLShop.service;

import com.group19.QLShop.entity.Product;

import com.group19.QLShop.entity.ProductVariant;
import com.group19.QLShop.repository.BrandRepository;
import com.group19.QLShop.repository.CategoryRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.dto.reponse.ProductReponse;
import com.group19.QLShop.dto.reponse.ProductPriceResponse; // THÊM IMPORT NÀY
import com.group19.QLShop.dto.request.ProductRequest;
import com.group19.QLShop.entity.Brand;
import com.group19.QLShop.entity.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import com.group19.QLShop.dto.reponse.ProductSuggestionItem;
import com.group19.QLShop.dto.reponse.SearchSuggestionResponse;
import com.group19.QLShop.dto.request.ProductFilterRequest;
import com.group19.QLShop.specification.ProductSpecification;
import com.group19.QLShop.entity.ProductImage;
import com.group19.QLShop.repository.ProductImageRepository;

@Service
@Transactional(readOnly = true)
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

    // Sản phẩm hot (xem nhiều nhất)
public Page<ProductReponse> getHotProducts(int page, int size) {
    validatePagination(page, size);
    Pageable pageable = PageRequest.of(page, size);
    return productRepository.findHotProducts(pageable).map(this::toResponse);
}

// Sản phẩm đang sale
public Page<ProductReponse> getSaleProducts(int page, int size) {
    validatePagination(page, size);
    Pageable pageable = PageRequest.of(page, size);
    return productRepository.findSaleProducts(pageable).map(this::toResponse);
}

// Sản phẩm mới nhất
public Page<ProductReponse> getNewestProducts(int page, int size) {
    validatePagination(page, size);
    Pageable pageable = PageRequest.of(page, size);
    return productRepository.findNewestProducts(pageable).map(this::toResponse);
}
    
    // Thêm sản phẩm
    @Transactional(rollbackFor = Exception.class)
    public ProductReponse addProduct(ProductRequest request, List<MultipartFile> images) {

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
        newProduct.setPrice(request.getPrice()); // Gán giá gốc
        newProduct.setDescription(request.getDescription());
        newProduct.setRating(request.getRating());
        newProduct.setSlug(request.getSlug());
        newProduct.setBrand(brand);
        newProduct.setCategory(category);
        newProduct.setHot(request.isHot());

        // Xử lý biến thể (Size/Color)
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariant variant : request.getVariants()) {
                variant.setProduct(newProduct);
            }
            newProduct.setVariants(request.getVariants());
        }

        Product savedProduct = productRepository.save(newProduct);

        // Lưu ảnh
        if (images != null && !images.isEmpty()) {
            boolean isFirst = true;
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String fileName = fileStorageService.storeFile(file, "products");

                    ProductImage productImage = new ProductImage();
                    productImage.setImageUrl(fileName);
                    productImage.setIsPrimary(isFirst);
                    productImage.setProduct(savedProduct);

                    ProductImage savedImage = productImageRepository.save(productImage);
                    savedProduct.getImages().add(savedImage);
                    isFirst = false;
                }
            }
        }

        return toResponse(savedProduct);
    }

    // Sửa sản phẩm
    @Transactional(rollbackFor = Exception.class)
    public ProductReponse updateProduct(Long id, ProductRequest request, List<MultipartFile> images) {
        
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với ID: " + id));

        if (productRepository.existsByName(request.getName()) && !existingProduct.getName().equals(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên sản phẩm '" + request.getName() + "' đã tồn tại");
        }

        if (productRepository.existsBySlug(request.getSlug()) && !existingProduct.getSlug().equals(request.getSlug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug '" + request.getSlug() + "' đã tồn tại");
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục ID: " + request.getCategoryId()));

        existingProduct.setName(request.getName());
        existingProduct.setPrice(request.getPrice()); // Cập nhật giá gốc
        existingProduct.setDescription(request.getDescription());
        existingProduct.setRating(request.getRating());
        existingProduct.setSlug(request.getSlug());
        existingProduct.setBrand(brand);
        existingProduct.setCategory(category);
        existingProduct.setHot(request.isHot());

        // Cập nhật biến thể: giữ nguyên bản ghi cũ theo id (không làm mất liên kết với
        // đơn hàng / phiếu nhập), chỉ thêm biến thể mới (chưa có id) và xóa biến thể bị loại bỏ.
        if (request.getVariants() != null) {
            java.util.Map<Long, ProductVariant> existingById = new java.util.HashMap<>();
            for (ProductVariant oldVariant : existingProduct.getVariants()) {
                existingById.put(oldVariant.getId(), oldVariant);
            }

            Set<Long> keptIds = new java.util.HashSet<>();
            List<ProductVariant> addedVariants = new ArrayList<>();
            for (ProductVariant incoming : request.getVariants()) {
                ProductVariant target = incoming.getId() != null ? existingById.get(incoming.getId()) : null;
                if (target != null) {
                    target.setColor(incoming.getColor());
                    target.setSize(incoming.getSize());
                    target.setStockQuantity(incoming.getStockQuantity());
                    target.setCostPrice(incoming.getCostPrice());
                    keptIds.add(target.getId());
                } else {
                    incoming.setId(null);
                    incoming.setProduct(existingProduct);
                    addedVariants.add(incoming);
                }
            }

            existingProduct.getVariants().removeIf(v -> v.getId() != null && !keptIds.contains(v.getId()));
            existingProduct.getVariants().addAll(addedVariants);
        }

        Product updatedProduct = productRepository.save(existingProduct);

        // Cập nhật ảnh
        if (images != null && !images.isEmpty() && !images.get(0).isEmpty()) {
            List<ProductImage> oldImages = productImageRepository.findByProductId(id);
            for (ProductImage oldImg : oldImages) {
                fileStorageService.deleteFile(oldImg.getImageUrl());
            }
            productImageRepository.deleteAll(oldImages);
            existingProduct.getImages().clear();

            boolean isFirst = true;
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String imagePath = fileStorageService.storeFile(file, "products");

                    ProductImage newProductImage = new ProductImage();
                    newProductImage.setImageUrl(imagePath);
                    newProductImage.setIsPrimary(isFirst);
                    newProductImage.setProduct(updatedProduct);

                    ProductImage savedImage = productImageRepository.save(newProductImage);
                    existingProduct.getImages().add(savedImage);
                    isFirst = false;
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

        List<ProductImage> oldImages = productImageRepository.findByProductId(id);
        for (ProductImage oldImg : oldImages) {
            fileStorageService.deleteFile(oldImg.getImageUrl());
        }

        productRepository.delete(exists);
    }

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

    public Page<ProductReponse> findProductsByBrand(Long brandId, int page, int size) {
        if (productRepository.countByBrandId(brandId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm của thương hiệu này");
        }

        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByBrandId(brandId, pageable);
        return products.map(this::toResponse);
    }

    public Page<ProductReponse> findProductsByCategory(Long categoryId, int page, int size) {
        if (productRepository.countByCategoryId(categoryId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm của danh mục này");
        }

        validatePagination(page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(this::toResponse);
    }

    // Lọc theo khoảng giá gốc
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

    // ==========================================
    // TÌM KIẾM VÀ LỌC NÂNG CAO ĐA ĐIỀU KIỆN
    // ==========================================
    public Page<ProductReponse> filterProducts(ProductFilterRequest filterRequest) {
        if (filterRequest == null) {
            filterRequest = new ProductFilterRequest();
        }

        int page = Math.max(0, filterRequest.getPage());
        int size = filterRequest.getPageSize() > 0 ? filterRequest.getPageSize() : 10;

        // Xử lý sắp xếp linh hoạt
        Sort sort = Sort.by("id").descending(); // Mặc định áo mới nhất
        if (filterRequest.getSortBy() != null && !filterRequest.getSortBy().trim().isEmpty()) {
            String s = filterRequest.getSortBy().trim().toLowerCase();
            switch (s) {
                case "price_asc", "price-asc" -> sort = Sort.by("price").ascending();
                case "price_desc", "price-desc" -> sort = Sort.by("price").descending();
                case "newest" -> sort = Sort.by("id").descending();
                case "popular", "views" -> sort = Sort.by("views").descending().and(Sort.by("id").descending());
                case "rating" -> sort = Sort.by("rating").descending().and(Sort.by("id").descending());
                default -> sort = Sort.by("id").descending();
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Product> spec = ProductSpecification.filter(filterRequest);

        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    // ==========================================
    // GỢI Ý TÌM KIẾM THÔNG MINH KHI GÕ TỪ KHÓA (AUTOCOMPLETE)
    // ==========================================
    public SearchSuggestionResponse getSearchSuggestions(String keyword, int limit) {
        if (limit <= 0 || limit > 20) {
            limit = 6;
        }

        String searchKey = (keyword != null) ? keyword.trim() : "";
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> matchedProducts;

        if (searchKey.isEmpty()) {
            // Khi chưa gõ gì: Lấy các mẫu áo Hot / nhiều lượt xem nhất làm gợi ý xu hướng
            matchedProducts = productRepository.findHotProducts(pageable).getContent();
        } else {
            matchedProducts = productRepository.findSearchSuggestions(searchKey, pageable);
        }

        List<ProductSuggestionItem> productItems = new ArrayList<>();
        Set<String> keywordSet = new LinkedHashSet<>();

        for (Product product : matchedProducts) {
            // Tìm ảnh đại diện chính
            String imageUrl = null;
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                imageUrl = product.getImages().stream()
                        .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                        .map(ProductImage::getImageUrl)
                        .findFirst()
                        .orElse(product.getImages().get(0).getImageUrl());
            }

            Double salePrice = null;
            if (product.getProductPrice() != null && product.getProductPrice().getSalePrice() != null && product.getProductPrice().getSalePrice() > 0) {
                salePrice = product.getProductPrice().getSalePrice();
            }

            String catName = product.getCategory() != null ? product.getCategory().getName() : null;
            String brandName = product.getBrand() != null ? product.getBrand().getName() : null;

            productItems.add(ProductSuggestionItem.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .slug(product.getSlug())
                    .price(product.getPrice())
                    .salePrice(salePrice)
                    .image(imageUrl)
                    .categoryName(catName)
                    .brandName(brandName)
                    .build());

            // Tạo các cụm từ gợi ý tự nhiên
            if (catName != null) {
                keywordSet.add(catName);
            }
            if (brandName != null && !searchKey.isEmpty()) {
                keywordSet.add(searchKey + " " + brandName);
            }
            if (product.getName() != null) {
                keywordSet.add(product.getName());
            }
        }

        return SearchSuggestionResponse.builder()
                .keyword(searchKey)
                .keywordSuggestions(keywordSet.stream().limit(6).toList())
                .products(productItems)
                .build();
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số trang không được nhỏ hơn 0");
        }
        if (size <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kích thước trang phải lớn hơn 0");
        }
    }

    // Hàm chuyển đổi sang DTO
    private ProductReponse toResponse(Product product) {
        ProductReponse response = new ProductReponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setDescription(product.getDescription());
        response.setRating(product.getRating());
        response.setSlug(product.getSlug());
        response.setViews(product.getViews());
        response.setHot(product.isHot());

        // ---> GÁN THÔNG TIN KHUYẾN MÃI VÀO FIELD RIÊNG PRODUCT_PRICE NẾU CÓ <---
        if (product.getProductPrice() != null && product.getProductPrice().getSalePrice() != null) {
            Double sale = product.getProductPrice().getSalePrice();
            double original = product.getPrice();
            Integer discount = null;

            if (sale > 0 && original > 0 && sale < original) {
                discount = (int) Math.round(((original - sale) / original) * 100);
            }

            response.setProductPrice(ProductPriceResponse.builder()
                    .id(product.getProductPrice().getId())
                    .productId(product.getId())
                    .productName(product.getName())
                    .originalPrice(original)
                    .salePrice(sale)
                    .discountPercent(discount)
                    .build());
        }

        if (product.getVariants() != null) {
            response.setVariants(product.getVariants());
        }

        if (product.getBrand() != null) {
            response.setBrandId(product.getBrand().getId());
        }
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
        }

        List<ProductImage> imageEntities = product.getImages();
        if (imageEntities == null || imageEntities.isEmpty()) {
            imageEntities = productImageRepository.findByProductIdOrderByIsPrimaryDesc(product.getId());
        }

        List<String> imageUrls = new ArrayList<>();
        String primaryImageUrl = null;

        if (imageEntities != null && !imageEntities.isEmpty()) {
            for (ProductImage img : imageEntities) {
                if (img.getImageUrl() != null) {
                    imageUrls.add(img.getImageUrl());
                    if (Boolean.TRUE.equals(img.getIsPrimary()) && primaryImageUrl == null) {
                        primaryImageUrl = img.getImageUrl();
                    }
                }
            }
            if (primaryImageUrl == null && !imageUrls.isEmpty()) {
                primaryImageUrl = imageUrls.get(0);
            }
        }

        response.setImages(imageUrls);
        response.setPrimaryImage(primaryImageUrl);
        response.setImage(primaryImageUrl);

        return response;
    }
}