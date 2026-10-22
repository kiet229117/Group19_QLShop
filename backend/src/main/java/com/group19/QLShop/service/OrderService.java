package com.group19.QLShop.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.dto.reponse.OrderItemResponse;
import com.group19.QLShop.dto.reponse.OrderResponse;
import com.group19.QLShop.dto.reponse.VoucherApplyResponse;
import com.group19.QLShop.dto.request.OrderItemRequest;
import com.group19.QLShop.dto.request.OrderRequest;
import com.group19.QLShop.dto.request.OrderStatusUpdateRequest;
import com.group19.QLShop.dto.request.VoucherApplyRequest;
import com.group19.QLShop.entity.Cart;
import com.group19.QLShop.entity.CartItems;
import com.group19.QLShop.entity.Order;
import com.group19.QLShop.entity.OrderItem;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductVariant;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.enums.OrderStatus;
import com.group19.QLShop.repository.CartItemRepository;
import com.group19.QLShop.repository.CartRepository;
import com.group19.QLShop.repository.OrderRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.ProductVariantRepository;
import com.group19.QLShop.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final VoucherService voucherService;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            UserRepository userRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            VoucherService voucherService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.voucherService = voucherService;
    }

    // ==========================================
    // 1. TẠO ĐƠN HÀNG (Có Trừ Tồn Kho Variant)
    // ==========================================
    @Transactional(rollbackFor = Exception.class)
    public OrderResponse createOrder(OrderRequest request) {
        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID không được để trống");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy User với ID: " + request.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setReceiverName(request.getReceiverName().trim());
        order.setReceiverPhone(request.getReceiverPhone().trim());
        order.setShippingAddress(request.getShippingAddress().trim());
        order.setNote(request.getNote());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        // Đặt hàng trực tiếp qua danh sách items
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderItemRequest itemReq : request.getItems()) {
                if (itemReq.getQuantity() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượng sản phẩm phải lớn hơn 0");
                }

                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Không tìm thấy sản phẩm với ID: " + itemReq.getProductId()));

                ProductVariant variant = null;
                // ---> KIỂM TRA & TRỪ TỒN KHO VARIANT <---
                if (itemReq.getVariantId() != null) {
                    variant = productVariantRepository.findById(itemReq.getVariantId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                    "Không tìm thấy phân loại sản phẩm với ID: " + itemReq.getVariantId()));

                    if (variant.getStockQuantity() < itemReq.getQuantity()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Sản phẩm " + product.getName() + " (" + variant.getColor() + " - " + variant.getSize() + 
                                ") chỉ còn " + variant.getStockQuantity() + " chiếc trong kho!");
                    }

                    // Trừ số lượng tồn kho
                    variant.setStockQuantity(variant.getStockQuantity() - itemReq.getQuantity());
                    productVariantRepository.save(variant);
                }

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setProductVariant(variant);
                orderItem.setQuantity(itemReq.getQuantity());
                
                // Lấy giá bán áp dụng (ưu tiên salePrice từ ProductPrice, nếu không lấy price gốc từ Product)
                double priceToUse = getEffectivePrice(product);
                orderItem.setPrice(priceToUse);

                // Lưu giá vốn (COGS) tại thời điểm bán để tính Lợi Nhuận thực tế
                Double costPrice = (variant != null && variant.getCostPrice() != null)
                        ? variant.getCostPrice()
                        : (product.getCostPrice() != null ? product.getCostPrice() : 0.0);
                orderItem.setCostPrice(costPrice);

                totalAmount += priceToUse * itemReq.getQuantity();
                orderItems.add(orderItem);
            }
        } else {
            // Checkout từ giỏ hàng
            Cart cart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng của người dùng đang trống"));

            List<CartItems> cartItems = cartItemRepository.findByCartId(cart.getId());
            if (cartItems.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng không có sản phẩm nào để đặt");
            }

            for (CartItems cartItem : cartItems) {
                Product product = cartItem.getProduct();
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(cartItem.getQuantity());
                
                // Lấy giá áp dụng
                double priceToUse = getEffectivePrice(product);
                orderItem.setPrice(priceToUse);

                // Lưu giá vốn (COGS) tại thời điểm bán
                Double costPrice = product.getCostPrice() != null ? product.getCostPrice() : 0.0;
                orderItem.setCostPrice(costPrice);

                totalAmount += priceToUse * cartItem.getQuantity();
                orderItems.add(orderItem);
            }

            // Xóa giỏ hàng sau khi đặt
            cartItemRepository.deleteByCartId(cart.getId());
        }

        // ---> XỬ LÝ MÃ GIẢM GIÁ (VOUCHER) NẾU CÓ <---
        double discountAmount = 0.0;
        String appliedVoucherCode = null;
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            VoucherApplyResponse voucherResult = voucherService.applyVoucher(
                    new VoucherApplyRequest(request.getVoucherCode().trim(), totalAmount));
            discountAmount = voucherResult.getDiscountAmount();
            appliedVoucherCode = voucherResult.getCode();
            // Ghi nhận tăng số lượt sử dụng voucher
            voucherService.recordVoucherUsage(appliedVoucherCode);
        }

        double finalAmount = Math.max(0.0, totalAmount - discountAmount);
        order.setTotalAmount(finalAmount);
        order.setVoucherCode(appliedVoucherCode);
        order.setDiscountAmount(discountAmount);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return toOrderResponse(savedOrder);
    }

    // ==========================================
    // 2. LẤY CHI TIẾT ĐƠN HÀNG THEO ID
    // ==========================================
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với ID: " + id));
        return toOrderResponse(order);
    }

    // ==========================================
    // 3. LẤY TẤT CẢ ĐƠN HÀNG (PHÂN TRANG - ADMIN)
    // ==========================================
    public Page<OrderResponse> getAllOrders(int page, int size) {
        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return orderRepository.findAll(pageable).map(this::toOrderResponse);
    }

    // ==========================================
    // 4. LẤY DANH SÁCH ĐƠN HÀNG CỦA MỘT USER
    // ==========================================
    public Page<OrderResponse> getOrdersByUserId(Long userId, int page, int size) {
        validatePagination(page, size);
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy User với ID: " + userId);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return orderRepository.findByUserId(userId, pageable).map(this::toOrderResponse);
    }

    // ==========================================
    // 5. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (ADMIN)
    // ==========================================
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể cập nhật đơn hàng đã bị hủy");
        }
        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể cập nhật đơn hàng đã hoàn thành");
        }

        order.setStatus(request.getStatus());
        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    // ==========================================
    // 6. HỦY ĐƠN HÀNG
    // ==========================================
    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đã hoàn thành, không thể hủy");
        }
        if (order.getStatus() == OrderStatus.SHIPPING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đang giao, không thể hủy");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đã ở trạng thái hủy trước đó");
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    // ==========================================
    // 7. XÓA ĐƠN HÀNG (ADMIN)
    // ==========================================
    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với ID: " + orderId));
        orderRepository.delete(order);
    }

    // ==========================================
    // HELPER: TÍNH GIÁ BÁN THỰC TẾ
    // ==========================================
    private double getEffectivePrice(Product product) {
        if (product == null) {
            return 0.0;
        }

        // 1. Kiểm tra nếu có bảng ProductPrice và có salePrice > 0 thì dùng giá sale
        if (product.getProductPrice() != null) {
            Double salePrice = product.getProductPrice().getSalePrice();
            if (salePrice != null && salePrice > 0) {
                return salePrice;
            }
        }

        // 2. Nếu không có sale hoặc không có ProductPrice, lấy giá gốc từ Product
        return product.getPrice();
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số trang không được âm");
        }
        if (size <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kích thước trang phải lớn hơn 0");
        }
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems() != null
                ? order.getOrderItems().stream().map(this::toOrderItemResponse).toList()
                : List.of();

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getName() : null)
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .totalAmount(order.getTotalAmount())
                .voucherCode(order.getVoucherCode())
                .discountAmount(order.getDiscountAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        Product p = item.getProduct();
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(p != null ? p.getId() : null)
                .productName(p != null ? p.getName() : null)
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .total(item.getPrice() * item.getQuantity())
                .build();
    }
}