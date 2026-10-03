package com.group19.QLShop.service;

import com.group19.QLShop.entity.Cart;
import com.group19.QLShop.entity.CartItems;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.repository.CartItemRepository;
import com.group19.QLShop.repository.CartRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.UserRepository;
import com.group19.QLShop.dto.request.CartItemRequest;
import com.group19.QLShop.dto.reponse.CartReponse;
import com.group19.QLShop.dto.reponse.CartItemReponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // [ADMIN] XEM TẤT CẢ GIỎ HÀNG
    // =========================

    public List<CartReponse> getAllCarts() {

        return cartRepository.findAll()
                .stream()
                .map(this::toCartReponse)
                .toList();
    }


    // =========================
    // XEM GIỎ HÀNG (USER + ADMIN)
    // =========================

    public CartReponse getCart(Long userId) {

        // Tìm Cart của User
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User chưa có giỏ hàng"));

        return toCartReponse(cart);
    }


    // =========================
    // THÊM SẢN PHẨM VÀO GIỎ
    // =========================

    public CartItemReponse addProduct(
            Long userId,
            CartItemRequest request
    ) {

        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Số lượng phải lớn hơn 0");
        }

        // Tìm User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        // Tìm hoặc tạo Cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        // Tìm Product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Product"));

        // Kiểm tra sản phẩm đã có trong Cart chưa
        var existingItem =
                cartItemRepository.findByCartIdAndProductId(
                        cart.getId(),
                        request.getProductId()
                );

        // Nếu đã có → cộng thêm số lượng
        if (existingItem.isPresent()) {

            CartItems cartItem = existingItem.get();

            cartItem.setQuantity(
                    cartItem.getQuantity() + request.getQuantity()
            );

            return toItemResponse(cartItemRepository.save(cartItem));
        }

        // Nếu chưa có → tạo CartItems mới
        CartItems cartItem = new CartItems();

        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());

        return toItemResponse(cartItemRepository.save(cartItem));
    }


    // =========================
    // TĂNG SỐ LƯỢNG +1
    // =========================

    public CartItemReponse increaseQuantity(
            Long userId,
            Long cartItemId
    ) {

        // Tìm Cart của User
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User chưa có giỏ hàng"));

        // Tìm CartItem
        CartItems cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

        // Kiểm tra CartItem có thuộc Cart của User không
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Sản phẩm không thuộc giỏ hàng của User");
        }

        // Tăng số lượng lên 1
        cartItem.setQuantity(cartItem.getQuantity() + 1);

        return toItemResponse(cartItemRepository.save(cartItem));
    }


    // =========================
    // GIẢM SỐ LƯỢNG -1
    // =========================

    public CartItemReponse decreaseQuantity(
            Long userId,
            Long cartItemId
    ) {

        // Tìm Cart của User
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User chưa có giỏ hàng"));

        // Tìm CartItem
        CartItems cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

        // Kiểm tra CartItem có thuộc Cart của User không
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Sản phẩm không thuộc giỏ hàng của User");
        }

        // Nếu số lượng = 1 → xóa sản phẩm
        if (cartItem.getQuantity() == 1) {

            cartItemRepository.delete(cartItem);

            return null;
        }

        // Giảm số lượng xuống 1
        cartItem.setQuantity(cartItem.getQuantity() - 1);

        return toItemResponse(cartItemRepository.save(cartItem));
    }


    // =========================
    // XÓA SẢN PHẨM KHỎI GIỎ
    // =========================

    public void removeProduct(
            Long userId,
            Long cartItemId
    ) {

        // Tìm Cart của User
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User chưa có giỏ hàng"));

        // Tìm CartItem
        CartItems cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

        // Kiểm tra sản phẩm thuộc Cart của User
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Sản phẩm không thuộc giỏ hàng của User");
        }

        // Xóa sản phẩm
        cartItemRepository.delete(cartItem);
    }


    // =========================
    // XÓA TOÀN BỘ GIỎ HÀNG
    // =========================

    @Transactional
    public void clearCart(Long userId) {

        // Tìm Cart của User
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User chưa có giỏ hàng"));

        // Xóa tất cả sản phẩm
        cartItemRepository.deleteByCartId(cart.getId());
    }


    // =========================
    // CHUYỂN CART -> CART RESPONSE
    // =========================

    private CartReponse toCartReponse(Cart cart) {

        List<CartItemReponse> items = cartItemRepository.findByCartId(cart.getId())
                .stream()
                .map(this::toItemResponse)
                .toList();

        return CartReponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .build();
    }


    // =========================
    // CHUYỂN CARTITEMS -> CARTITEM RESPONSE
    // =========================

    private CartItemReponse toItemResponse(CartItems cartItem) {

        Product product = cartItem.getProduct();

        return CartItemReponse.builder()
                .id(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .price(product.getPrice())
                .quantity(cartItem.getQuantity())
                .total(product.getPrice() * cartItem.getQuantity())
                .build();
    }
}