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
    private final com.group19.QLShop.repository.ProductVariantRepository productVariantRepository;

    public ProductService(ProductRepository productRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            FileStorageService fileStorageService,
            ProductImageRepository productImageRepository,
            com.group19.QLShop.repository.ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
        this.productImageRepository = productImageRepository;
        this.productVariantRepository = productVariantRepository;
    }

    private String generateSlug(String text) {
        if (text == null || text.isBlank()) return "san-pham-" + System.currentTimeMillis();
        String normalized = java.text.Normalizer.normalize(text.trim().toLowerCase(), java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replace('đ', 'd')
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return normalized.length() >= 3 ? normalized : normalized + "-" + System.currentTimeMillis();
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

        String finalSlug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? request.getSlug().trim()
                : generateSlug(request.getName());
        if (productRepository.existsBySlug(finalSlug)) {
            finalSlug = finalSlug + "-" + (System.currentTimeMillis() % 10000);
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
        newProduct.setCostPrice(request.getCostPrice() != null ? request.getCostPrice() : request.getPrice() * 0.6);
        newProduct.setDescription(request.getDescription());
        newProduct.setRating(request.getRating() != null ? request.getRating() : 4.8);
        newProduct.setSlug(finalSlug);
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

        // Lưu ảnh từ MultipartFile hoặc từ request.getImage()
        if (images != null && !images.isEmpty() && !images.get(0).isEmpty()) {
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
        } else if (request.getImage() != null && !request.getImage().isBlank()) {
            ProductImage productImage = new ProductImage();
            productImage.setImageUrl(request.getImage().trim());
            productImage.setIsPrimary(true);
            productImage.setProduct(savedProduct);
            ProductImage savedImage = productImageRepository.save(productImage);
            savedProduct.getImages().add(savedImage);
        }

        return toResponse(savedProduct);
    }

    // Sửa sản phẩm (An toàn khoá ngoại variant_id và cập nhật số lượng tồn kho từng Size/Màu)
    @Transactional(rollbackFor = Exception.class)
    public ProductReponse updateProduct(Long id, ProductRequest request, List<MultipartFile> images) {
        
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm với ID: " + id));

        if (productRepository.existsByName(request.getName()) && !existingProduct.getName().equals(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên sản phẩm '" + request.getName() + "' đã tồn tại");
        }

        String finalSlug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? request.getSlug().trim()
                : (existingProduct.getSlug() != null && !existingProduct.getSlug().isBlank()
                        ? existingProduct.getSlug()
                        : generateSlug(request.getName()));

        if (productRepository.existsBySlug(finalSlug) && !existingProduct.getSlug().equals(finalSlug)) {
            finalSlug = finalSlug + "-" + id;
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thương hiệu ID: " + request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục ID: " + request.getCategoryId()));

        existingProduct.setName(request.getName());
        existingProduct.setPrice(request.getPrice()); // Cập nhật giá gốc
        if (request.getCostPrice() != null) {
            existingProduct.setCostPrice(request.getCostPrice());
        }
        existingProduct.setDescription(request.getDescription());
        if (request.getRating() != null) {
            existingProduct.setRating(request.getRating());
        }
        existingProduct.setSlug(finalSlug);
        existingProduct.setBrand(brand);
        existingProduct.setCategory(category);
        existingProduct.setHot(request.isHot());

        // Cập nhật biến thể trực tiếp tại chỗ (in-place) để không làm mất ID liên kết với OrderItems / GoodsReceiptItems
        if (request.getVariants() != null) {
            List<ProductVariant> currentVariants = existingProduct.getVariants();
            for (ProductVariant incoming : request.getVariants()) {
                ProductVariant matched = null;
                if (incoming.getId() != null) {
                    matched = currentVariants.stream()
                            .filter(cv -> incoming.getId().equals(cv.getId()))
                            .findFirst()
                            .orElse(null);
                }
                if (matched == null) {
                    matched = currentVariants.stream()
                            .filter(cv -> java.util.Objects.equals(cv.getColor(), incoming.getColor())
                                    && java.util.Objects.equals(cv.getSize(), incoming.getSize()))
                            .findFirst()
                            .orElse(null);
                }

                if (matched != null) {
                    matched.setColor(incoming.getColor());
                    matched.setSize(incoming.getSize());
                    matched.setStockQuantity(Math.max(0, incoming.getStockQuantity()));
                    if (incoming.getCostPrice() != null) {
                        matched.setCostPrice(incoming.getCostPrice());
                    }
                } else {
                    ProductVariant newVar = new ProductVariant();
                    newVar.setProduct(existingProduct);
                    newVar.setColor(incoming.getColor());
                    newVar.setSize(incoming.getSize());
                    newVar.setStockQuantity(Math.max(0, incoming.getStockQuantity()));
                    newVar.setCostPrice(incoming.getCostPrice() != null ? incoming.getCostPrice() : existingProduct.getCostPrice());
                    currentVariants.add(newVar);
                }
            }
        }

        Product updatedProduct = productRepository.save(existingProduct);

        // Cập nhật ảnh nếu upload file mới hoặc đổi URL ảnh
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
        } else if (request.getImage() != null && !request.getImage().isBlank()) {
            List<ProductImage> oldImages = productImageRepository.findByProductIdOrderByIsPrimaryDesc(id);
            if (!oldImages.isEmpty()) {
                ProductImage primaryImg = oldImages.get(0);
                primaryImg.setImageUrl(request.getImage().trim());
                primaryImg.setIsPrimary(true);
                productImageRepository.save(primaryImg);
            } else {
                ProductImage newImg = new ProductImage();
                newImg.setImageUrl(request.getImage().trim());
                newImg.setIsPrimary(true);
                newImg.setProduct(updatedProduct);
                productImageRepository.save(newImg);
            }
        }

        return toResponse(updatedProduct);
    }

    // Cập nhật nhanh tồn kho & giá vốn của 1 biến thể (SKU)
    @Transactional
    public ProductVariant updateVariantStock(Long variantId, Integer stockQuantity, Double costPrice) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy biến thể với ID: " + variantId));
        if (stockQuantity != null) {
            variant.setStockQuantity(Math.max(0, stockQuantity));
        }
        if (costPrice != null && costPrice >= 0) {
            variant.setCostPrice(costPrice);
        }
        return productVariantRepository.save(variant);
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
        response.setCostPrice(product.getCostPrice());
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