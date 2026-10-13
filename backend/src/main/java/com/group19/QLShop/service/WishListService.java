package com.group19.QLShop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.group19.QLShop.dto.reponse.WishListResponse;
import com.group19.QLShop.dto.reponse.WishListToggleResponse;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductImage;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.WishList;
import com.group19.QLShop.exception.AppException;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.UserRepository;
import com.group19.QLShop.repository.WishListRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class WishListService {

    private final WishListRepository wishListRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /**
     * Lấy danh sách yêu thích của người dùng kèm đầy đủ thông tin Product (chỉ với 1 Query JOIN FETCH tối ưu).
     */
    @Transactional(readOnly = true)
    public List<WishListResponse> getWishlistByUserId(Long userId) {
        if (userId == null) {
            throw new AppException("User ID không hợp lệ");
        }
        return wishListRepository.findByUserIdWithProductDetails(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Tương thích ngược với tên hàm cũ
     */
    @Transactional(readOnly = true)
    public List<WishListResponse> getAllListByUserId(Long userId) {
        return getWishlistByUserId(userId);
    }

    /**
     * Thêm sản phẩm vào danh sách yêu thích (an toàn, không lỗi trùng lặp nhờ exists check + DB unique constraint).
     */
    @Transactional
    public WishListResponse addToWishlist(Long userId, Long productId) {
        if (userId == null || productId == null) {
            throw new AppException("User ID và Product ID không được để trống");
        }

        // Nếu đã có sẵn trong danh sách thì trả về bản ghi hiện tại
        Optional<WishList> existing = wishListRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng với ID: " + userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Không tìm thấy sản phẩm với ID: " + productId));

        WishList wishList = WishList.builder()
                .user(user)
                .product(product)
                .build();

        WishList saved = wishListRepository.save(wishList);
        return toResponse(saved);
    }

    /**
     * Toggle yêu thích: Nếu đã yêu thích thì xóa, nếu chưa thì thêm mới.
     * Tối ưu trực tiếp cho icon Trái Tim (Like/Unlike) ở Frontend.
     */
    @Transactional
    public WishListToggleResponse toggleWishlist(Long userId, Long productId) {
        if (userId == null || productId == null) {
            throw new AppException("User ID và Product ID không được để trống");
        }

        Optional<WishList> existing = wishListRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            wishListRepository.delete(existing.get());
            return WishListToggleResponse.builder()
                    .isWishlisted(false)
                    .message("Đã xóa sản phẩm khỏi danh sách yêu thích")
                    .productId(productId)
                    .wishlistItem(null)
                    .build();
        } else {
            WishListResponse item = addToWishlist(userId, productId);
            return WishListToggleResponse.builder()
                    .isWishlisted(true)
                    .message("Đã thêm sản phẩm vào danh sách yêu thích")
                    .productId(productId)
                    .wishlistItem(item)
                    .build();
        }
    }

    /**
     * Kiểm tra trạng thái yêu thích của 1 sản phẩm.
     */
    @Transactional(readOnly = true)
    public boolean isWishlisted(Long userId, Long productId) {
        if (userId == null || productId == null) {
            return false;
        }
        return wishListRepository.existsByUserIdAndProductId(userId, productId);
    }

    /**
     * Xóa sản phẩm khỏi danh sách yêu thích theo Product ID.
     */
    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (userId == null || productId == null) {
            throw new AppException("User ID và Product ID không được để trống");
        }
        wishListRepository.deleteByUserIdAndProductId(userId, productId);
    }

    /**
     * Xóa bản ghi wishlist theo ID mục.
     */
    @Transactional
    public void deleteWishlistItem(Long id, Long userId) {
        if (id == null) {
            throw new AppException("ID mục yêu thích không hợp lệ");
        }
        if (userId != null) {
            int deleted = wishListRepository.deleteByIdAndUserId(id, userId);
            if (deleted == 0 && wishListRepository.existsById(id)) {
                throw new AppException("Bạn không có quyền xóa mục yêu thích này");
            }
        } else {
            wishListRepository.deleteById(id);
        }
    }

    /**
     * Tương thích ngược với tên hàm cũ
     */
    @Transactional
    public void deleteWishList(Long id) {
        deleteWishlistItem(id, null);
    }

    /**
     * Chuyển đổi entity WishList sang WishListResponse kèm thông tin sản phẩm và ảnh đại diện chính.
     */
    public WishListResponse toResponse(WishList wishList) {
        if (wishList == null) return null;

        Product product = wishList.getProduct();
        String primaryImage = null;

        if (product != null && product.getImages() != null && !product.getImages().isEmpty()) {
            primaryImage = product.getImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElseGet(() -> product.getImages().get(0).getImageUrl());
        }

        return WishListResponse.builder()
                .id(wishList.getId())
                .userId(wishList.getUserId())
                .productId(wishList.getProductId())
                .productName(product != null ? product.getName() : null)
                .productSlug(product != null ? product.getSlug() : null)
                .productPrice(product != null ? product.getPrice() : null)
                .productRating(product != null ? product.getRating() : null)
                .productImage(primaryImage)
                .brandName(product != null && product.getBrand() != null ? product.getBrand().getName() : null)
                .categoryName(product != null && product.getCategory() != null ? product.getCategory().getName() : null)
                .createdAt(wishList.getCreatedAt())
                .build();
    }

    /**
     * Tìm ID của người dùng từ username hoặc email (trích xuất từ JWT Authentication).
     */
    @Transactional(readOnly = true)
    public Long getUserIdByUsernameOrEmail(String usernameOrEmail) {
        if (usernameOrEmail == null || usernameOrEmail.isBlank()) {
            return null;
        }
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .map(User::getId)
                .orElse(null);
    }
}

