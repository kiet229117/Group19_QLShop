package com.group19.QLShop.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.entity.Cart;
import com.group19.QLShop.entity.CartItems;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.repository.CartItemRepository;
import com.group19.QLShop.repository.CartRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.UserRepository;

@Service
public class CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, 
                       CartItemRepository cartItemRepository,
                       UserRepository userRepository, 
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // 1. Lấy giỏ hàng của user (tự động tạo mới nếu chưa có)
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    // 2. Thêm sản phẩm vào giỏ hàng (tự động cộng dồn số lượng nếu đã tồn tại)
    public CartItems addToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));

        CartItems item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseGet(() -> {
                    CartItems newItem = new CartItems();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(0); // Khởi tạo bằng 0 để cộng dồn
                    return newItem;
                });

        item.setQuantity(item.getQuantity() + quantity);
        return cartItemRepository.save(item);
    }

    // 3. Xóa một sản phẩm cụ thể khỏi giỏ hàng
    public void removeCartItem(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        CartItems item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sản phẩm không có trong giỏ hàng"));

        cartItemRepository.delete(item);
    }
}