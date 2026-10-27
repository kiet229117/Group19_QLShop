package com.group19.QLShop.service;

import java.time.LocalDateTime;
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
import com.group19.QLShop.dto.reponse.VoucherResponse;
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
    private final EmailService emailService;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            UserRepository userRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            VoucherService voucherService,
            EmailService emailService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.voucherService = voucherService;
        this.emailService = emailService;
    }

    // ==========================================
    // 1. TẠO ĐƠN HÀNG (Có Trừ Tồn Kho Variant & Tặng Voucher Tự Động Chuẩn Theo API)
    // ==========================================
    @Transactional(rollbackFor = Exception.class)
    public OrderResponse createOrder(OrderRequest request) {
        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID không được để trống");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy User với ID: " + request.getUserId()));

        String cleanAddress = request.getShippingAddress() != null ? request.getShippingAddress().trim() : "";
        if (isPlaceholderAddress(cleanAddress) || cleanAddress.length() < 10 || cleanAddress.split("\\s+").length < 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Bạn chưa nhập địa chỉ nhận hàng hợp lệ! Vui lòng nhập đầy đủ số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố.");
        }

        // Nếu tài khoản User chưa có địa chỉ mặc định trong hồ sơ thì tự động lưu địa chỉ hợp lệ vừa nhập
        if (isPlaceholderAddress(user.getAddress())) {
            user.setAddress(cleanAddress);
            userRepository.save(user);
        }

        Order order = new Order();
        order.setUser(user);
        order.setReceiverName(request.getReceiverName().trim());
        order.setReceiverPhone(request.getReceiverPhone().trim());
        order.setShippingAddress(cleanAddress);
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
                } else {
                    List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
                    if (variants != null && !variants.isEmpty()) {
                        variant = variants.stream()
                                .filter(v -> v.getStockQuantity() >= itemReq.getQuantity())
                                .findFirst()
                                .orElse(variants.get(0));
                    }
                }

                if (variant != null) {
                    if (variant.getStockQuantity() < itemReq.getQuantity()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Sản phẩm \"" + product.getName() + "\" (" + variant.getColor() + " - Size " + variant.getSize() +
                                ") vừa hết hàng! Vui lòng bỏ chọn sản phẩm này khỏi giỏ hàng.");
                    }
                    variant.setStockQuantity(variant.getStockQuantity() - itemReq.getQuantity());
                    productVariantRepository.save(variant);
                }

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setProductVariant(variant);
                orderItem.setQuantity(itemReq.getQuantity());

                // Lấy giá bán áp dụng
                double priceToUse = getEffectivePrice(product);
                orderItem.setPrice(priceToUse);

                // Lưu giá vốn (COGS)
                Double costPrice = (variant != null && variant.getCostPrice() != null)
                        ? variant.getCostPrice()
                        : (product.getCostPrice() != null ? product.getCostPrice() : 0.0);
                orderItem.setCostPrice(costPrice);

                totalAmount += priceToUse * itemReq.getQuantity();
                orderItems.add(orderItem);
            }

            // Xóa các sản phẩm đã đặt khỏi giỏ hàng của User trên DB (nếu có)
            cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
                for (OrderItemRequest itemReq : request.getItems()) {
                    cartItemRepository.findByCartIdAndProductId(cart.getId(), itemReq.getProductId())
                            .ifPresent(cartItemRepository::delete);
                }
            });
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

                double priceToUse = getEffectivePrice(product);
                orderItem.setPrice(priceToUse);

                Double costPrice = product.getCostPrice() != null ? product.getCostPrice() : 0.0;
                orderItem.setCostPrice(costPrice);

                totalAmount += priceToUse * cartItem.getQuantity();
                orderItems.add(orderItem);
            }

            cartItemRepository.deleteByCartId(cart.getId());
        }

        // ---> XỬ LÝ MÃ GIẢM GIÁ (VOUCHER) NẾU CÓ <---
        double discountAmount = 0.0;
        String appliedVoucherCode = null;
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            VoucherApplyRequest applyReq = VoucherApplyRequest.builder()
                    .code(request.getVoucherCode().trim())
                    .orderAmount(totalAmount)
                    .userId(user.getId())
                    .build();
            VoucherApplyResponse voucherResult = voucherService.applyVoucher(applyReq, user.getUsername());
            discountAmount = voucherResult.getDiscountAmount();
            appliedVoucherCode = voucherResult.getCode();
            voucherService.recordVoucherUsage(appliedVoucherCode);
        }

        double finalAmount = Math.max(0.0, totalAmount - discountAmount);
        order.setTotalAmount(finalAmount);
        order.setVoucherCode(appliedVoucherCode);
        order.setDiscountAmount(discountAmount);
        order.setOrderItems(orderItems);

        // Đánh giá các voucher mới mở khóa TRƯỚC khi lưu đơn mới để so sánh chính xác với lịch sử đơn cũ
        List<VoucherResponse> newlyUnlockedVouchers = voucherService.evaluateAndUnlockVouchersForOrder(
                user, orderItems, totalAmount, appliedVoucherCode);

        Order savedOrder = orderRepository.save(order);

        // Gửi email xác nhận đơn hàng cho khách
        emailService.sendOrderConfirmationEmail(savedOrder);

        OrderResponse response = toOrderResponse(savedOrder);
        response.setNewlyUnlockedVouchers(newlyUnlockedVouchers);
        return response;
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

        if (request.getStatus() == OrderStatus.CANCELLED && order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant v = item.getProductVariant();
                if (v != null) {
                    v.setStockQuantity(v.getStockQuantity() + item.getQuantity());
                    productVariantRepository.save(v);
                }
            }
        }

        order.setStatus(request.getStatus());
        order.setUpdatedAt(LocalDateTime.now());
        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    // ==========================================
    // 6. YÊU CẦU HỦY ĐƠN HÀNG (CHỜ ADMIN DUYỆT + LÝ DO HỦY)
    // ==========================================
    @Transactional
    public OrderResponse requestCancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đã hoàn thành, không thể yêu cầu hủy");
        }
        if (order.getStatus() == OrderStatus.SHIPPING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đang được vận chuyển, không thể hủy đơn trực tiếp");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đã ở trạng thái hủy trước đó");
        }
        if (order.getStatus() == OrderStatus.CANCEL_REQUESTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng đã gửi yêu cầu hủy và đang chờ Admin duyệt");
        }

        order.setStatus(OrderStatus.CANCEL_REQUESTED);
        String finalReason = (reason != null && !reason.trim().isEmpty()) ? reason.trim() : "Khách hàng yêu cầu hủy đơn";
        order.setCancelReason(finalReason);
        order.setUpdatedAt(LocalDateTime.now());

        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    // ==========================================
    // [ADMIN] DUYỆT YÊU CẦU HỦY ĐƠN (HOÀN TỒN KHO & HOÀN VOUCHER)
    // ==========================================
    @Transactional
    public OrderResponse approveCancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            return toOrderResponse(order);
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());

        // 1. HOÀN LẠI SỐ LƯỢNG TỒN KHO CHO BIẾN THỂ SẢN PHẨM
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getProductVariant();
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    productVariantRepository.save(variant);
                }
            }
        }

        // 2. HOÀN LẠI MÃ VOUCHER ĐÃ DÙNG CHO TÀI KHOẢN
        if (order.getVoucherCode() != null && !order.getVoucherCode().isBlank()) {
            voucherService.restoreVoucherUsage(order.getUser(), order.getVoucherCode());
        }

        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    // ==========================================
    // [ADMIN] TỪ CHỐI YÊU CẦU HỦY ĐƠN
    // ==========================================
    @Transactional
    public OrderResponse rejectCancelOrder(Long orderId, String rejectReason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() != OrderStatus.CANCEL_REQUESTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng không ở trạng thái yêu cầu hủy");
        }

        order.setStatus(OrderStatus.PENDING);
        String note = (rejectReason != null && !rejectReason.trim().isEmpty())
                ? "Admin từ chối hủy: " + rejectReason.trim()
                : null;
        order.setCancelReason(note);
        order.setUpdatedAt(LocalDateTime.now());

        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    // ==========================================
    // 6. HỦY ĐƠN HÀNG TRỰC TIẾP (ADMIN) (HOÀN TỒN KHO & HOÀN VOUCHER)
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
        order.setUpdatedAt(LocalDateTime.now());

<<<<<<< HEAD
        // Hoàn lại tồn kho các biến thể sản phẩm khi đơn hàng bị hủy
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant v = item.getProductVariant();
                if (v != null) {
                    v.setStockQuantity(v.getStockQuantity() + item.getQuantity());
                    productVariantRepository.save(v);

        // 1. HOÀN LẠI SỐ LƯỢNG TỒN KHO CHO SẢN PHẨM / BIẾN THỂ
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getProductVariant();
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    productVariantRepository.save(variant);

                }
            }
        }


        // 2. HOÀN LẠI MÃ VOUCHER ĐÃ DÙNG CHO TÀI KHOẢN (ĐỂ KHÁCH CÓ THỂ DÙNG LẠI Ở ĐƠN SAU)
        if (order.getVoucherCode() != null && !order.getVoucherCode().isBlank()) {
            voucherService.restoreVoucherUsage(order.getUser(), order.getVoucherCode());
        }


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
    // 8. TỰ ĐỘNG DUYỆT ĐƠN HÀNG CHỜ QUÁ THỜI GIAN ĐỆM (PHƯƠNG ÁN 4: 15 PHÚT)
    // ==========================================
    @Transactional
    public int autoConfirmPendingOrders(int thresholdMinutes) {
        return autoConfirmPendingOrdersBySeconds(thresholdMinutes * 60);
    }

    @Transactional
    public int autoConfirmPendingOrdersBySeconds(int thresholdSeconds) {
        LocalDateTime cutOff = LocalDateTime.now().minusSeconds(thresholdSeconds);
        List<Order> pendingOrders = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING, cutOff);
        if (pendingOrders.isEmpty()) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        for (Order order : pendingOrders) {
            order.setStatus(OrderStatus.CONFIRMED);
            order.setUpdatedAt(now);
        }
        orderRepository.saveAll(pendingOrders);
        return pendingOrders.size();
    }

    // ==========================================
    // 9. [ADMIN] DUYỆT HÀNG LOẠT TOÀN BỘ ĐƠN CHỜ XÁC NHẬN (CONFIRM ALL)
    // ==========================================
    @Transactional
    public int confirmAllPendingOrders() {
        List<Order> pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING);
        if (pendingOrders.isEmpty()) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        for (Order order : pendingOrders) {
            order.setStatus(OrderStatus.CONFIRMED);
            order.setUpdatedAt(now);
        }
        orderRepository.saveAll(pendingOrders);
        return pendingOrders.size();
    }

    // ==========================================
    // HELPER: TÍNH GIÁ BÁN THỰC TẾ
    // ==========================================
    private double getEffectivePrice(Product product) {
        if (product == null) {
            return 0.0;
        }
        if (product.getProductPrice() != null) {
            Double salePrice = product.getProductPrice().getSalePrice();
            if (salePrice != null && salePrice > 0) {
                return salePrice;
            }
        }
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
                .cancelReason(order.getCancelReason())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        Product p = item.getProduct();
        ProductVariant v = item.getProductVariant();
        String primaryImage = null;
        if (p != null && p.getImages() != null && !p.getImages().isEmpty()) {
            primaryImage = p.getImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .map(com.group19.QLShop.entity.ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(p.getImages().get(0).getImageUrl());
        }
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(p != null ? p.getId() : null)
                .productName(p != null ? p.getName() : null)
                .productSlug(p != null ? p.getSlug() : null)
                .productImage(primaryImage)
                .size(v != null ? v.getSize() : "L")
                .color(v != null ? v.getColor() : "Đen")
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .total(item.getPrice() * item.getQuantity())
                .build();
    }

    // Phát hiện địa chỉ rỗng hoặc chỉ là câu placeholder ("Chưa cập nhật địa chỉ", "Chưa có địa chỉ"...)
    private static boolean isPlaceholderAddress(String address) {
        if (address == null || address.isBlank()) return true;
        String norm = java.text.Normalizer.normalize(address, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd').replace('Đ', 'D')
                .toLowerCase()
                .replaceAll("\\s+", " ")
                .trim();
        String[] placeholders = {
                "chua cap nhat", "chua co dia chi", "chua nhap", "khong co", "khong ro",
                "dia chi mac dinh", "nhap dia chi", "n/a", "null", "undefined"
        };
        for (String p : placeholders) {
            if (norm.contains(p)) return true;
        }
        return false;
    }
}
