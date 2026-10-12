package com.group19.QLShop.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.dto.reponse.WishListResponse;
import com.group19.QLShop.dto.reponse.WishListToggleResponse;
import com.group19.QLShop.dto.request.WishListRequest;
import com.group19.QLShop.exception.AppException;
import com.group19.QLShop.service.WishListService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;

    // ==========================================
    // 1. LẤY DANH SÁCH YÊU THÍCH CỦA TÀI KHOẢN ĐANG ĐĂNG NHẬP (HOẶC THEO USERID)
    // GET /api/wishlists
    // GET /api/wishlists?userId=1
    // ==========================================
    @GetMapping
    public ResponseEntity<List<WishListResponse>> getWishlists(
            @RequestParam(required = false) Long userId,
            Authentication authentication) {

        Long resolvedUserId = resolveUserId(authentication, userId);
        if (resolvedUserId == null) {
            throw new AppException("Vui lòng đăng nhập hoặc truyền tham số userId để xem danh sách yêu thích");
        }
        return ResponseEntity.ok(wishListService.getWishlistByUserId(resolvedUserId));
    }

    // ==========================================
    // 2. TƯƠNG THÍCH NGƯỢC VỚI API CŨ
    // GET /api/wishlists/userId?userId=1
    // ==========================================
    @GetMapping("/userId")
    public ResponseEntity<List<WishListResponse>> getAllWishListsByUserId(@RequestParam Long userId) {
        return ResponseEntity.ok(wishListService.getWishlistByUserId(userId));
    }

    // ==========================================
    // 3. LẤY DANH SÁCH YÊU THÍCH THEO PATH VARIABLE
    // GET /api/wishlists/user/{userId}
    // ==========================================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WishListResponse>> getWishlistByUserPathVariable(@PathVariable Long userId) {
        return ResponseEntity.ok(wishListService.getWishlistByUserId(userId));
    }

    // ==========================================
    // 4. THÊM SẢN PHẨM VÀO YÊU THÍCH
    // POST /api/wishlists
    // Body: { "productId": 10 } hoặc { "userId": 1, "productId": 10 }
    // ==========================================
    @PostMapping
    public ResponseEntity<WishListResponse> addToWishlist(
            @Valid @RequestBody WishListRequest request,
            Authentication authentication) {

        Long resolvedUserId = resolveUserId(authentication, request.getUserId());
        if (resolvedUserId == null) {
            throw new AppException("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích");
        }

        WishListResponse response = wishListService.addToWishlist(resolvedUserId, request.getProductId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==========================================
    // 5. TOGGLE YÊU THÍCH (THÊM / XÓA THEO TRẠNG THÁI HIỆN TẠI - DÙNG CHO NÚT THẢ TIM)
    // POST /api/wishlists/toggle
    // Hỗ trợ cả Query Param: /api/wishlists/toggle?productId=10
    // Hoặc Body: { "productId": 10 }
    // ==========================================
    @PostMapping("/toggle")
    public ResponseEntity<WishListToggleResponse> toggleWishlist(
            @RequestBody(required = false) WishListRequest request,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {

        Long targetProductId = (request != null && request.getProductId() != null) ? request.getProductId() : productId;
        if (targetProductId == null) {
            throw new AppException("ID sản phẩm không được để trống");
        }

        Long explicitUserId = (request != null && request.getUserId() != null) ? request.getUserId() : userId;
        Long resolvedUserId = resolveUserId(authentication, explicitUserId);
        if (resolvedUserId == null) {
            throw new AppException("Vui lòng đăng nhập để thao tác yêu thích sản phẩm");
        }

        return ResponseEntity.ok(wishListService.toggleWishlist(resolvedUserId, targetProductId));
    }

    // ==========================================
    // 6. KIỂM TRA SẢN PHẨM ĐÃ ĐƯỢC YÊU THÍCH CHƯA
    // GET /api/wishlists/check/{productId}
    // ==========================================
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Object>> checkWishlist(
            @PathVariable Long productId,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {

        Long resolvedUserId = resolveUserId(authentication, userId);
        boolean isWishlisted = false;
        if (resolvedUserId != null) {
            isWishlisted = wishListService.isWishlisted(resolvedUserId, productId);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("isWishlisted", isWishlisted);
        return ResponseEntity.ok(result);
    }

    // ==========================================
    // 7. XÓA SẢN PHẨM KHỎI YÊU THÍCH THEO PRODUCT ID
    // DELETE /api/wishlists/product/{productId}
    // ==========================================
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> removeFromWishlistByProductId(
            @PathVariable Long productId,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {

        Long resolvedUserId = resolveUserId(authentication, userId);
        if (resolvedUserId == null) {
            throw new AppException("Vui lòng đăng nhập để xóa sản phẩm khỏi danh sách yêu thích");
        }

        wishListService.removeFromWishlist(resolvedUserId, productId);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // 8. XÓA MỤC YÊU THÍCH THEO ID BẢN GHI
    // DELETE /api/wishlists/{id}
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWishlistById(
            @PathVariable Long id,
            Authentication authentication) {

        Long resolvedUserId = resolveUserId(authentication, null);
        wishListService.deleteWishlistItem(id, resolvedUserId);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // 9. TƯƠNG THÍCH NGƯỢC VỚI API DELETE CŨ THEO QUERY PARAM
    // DELETE /api/wishlists?id=1
    // ==========================================
    @DeleteMapping
    public ResponseEntity<Void> deleteWishListLegacy(
            @RequestParam Long id,
            Authentication authentication) {

        Long resolvedUserId = resolveUserId(authentication, null);
        wishListService.deleteWishlistItem(id, resolvedUserId);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // HELPER: TỰ ĐỘNG NHẬN DIỆN USER ID TỪ TOKEN HOẶC THAM SỐ
    // ==========================================
    private Long resolveUserId(Authentication authentication, Long explicitUserId) {
        if (explicitUserId != null) {
            return explicitUserId;
        }
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            return wishListService.getUserIdByUsernameOrEmail(authentication.getName());
        }
        return null;
    }
}
