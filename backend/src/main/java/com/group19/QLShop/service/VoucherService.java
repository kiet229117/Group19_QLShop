package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.dto.reponse.VoucherApplyResponse;
import com.group19.QLShop.dto.reponse.VoucherResponse;
import com.group19.QLShop.dto.request.VoucherApplyRequest;
import com.group19.QLShop.dto.request.VoucherRequest;
import com.group19.QLShop.entity.Order;
import com.group19.QLShop.entity.OrderItem;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.Voucher;
import com.group19.QLShop.entity.enums.OrderStatus;
import com.group19.QLShop.repository.OrderRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.UserRepository;
import com.group19.QLShop.repository.VoucherRepository;

@Service
@Transactional(readOnly = true)
public class VoucherService {

    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public VoucherService(
            VoucherRepository voucherRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository) {
        this.voucherRepository = voucherRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // Chuẩn hóa mã AOPOLO10 và POLO10 thống nhất thành POLO10 để khớp chuẩn giao diện & DB
    public static String normalizeCode(String code) {
        if (code == null) return "";
        String clean = code.trim().toUpperCase();
        if ("AOPOLO10".equals(clean)) {
            return "POLO10";
        }
        return clean;
    }

    private Set<String> parseCodeSet(String csv) {
        Set<String> set = new LinkedHashSet<>();
        if (csv == null || csv.isBlank()) return set;
        for (String part : csv.split(",")) {
            String norm = normalizeCode(part);
            if (!norm.isEmpty()) {
                set.add(norm);
            }
        }
        return set;
    }

    private String joinCodeSet(Set<String> set) {
        return String.join(",", set);
    }

    // Kiểm tra xem một Voucher từ DB có phải là Voucher Chào Mừng Khách Hàng Mới không
    public boolean isWelcomeVoucher(Voucher v) {
        if (v == null) return false;
        String text = ((v.getCode() != null ? v.getCode() : "") + " "
                + (v.getName() != null ? v.getName() : "") + " "
                + (v.getDescription() != null ? v.getDescription() : "")).toLowerCase();
        return text.contains("welcome")
                || text.contains("khách hàng mới")
                || text.contains("khach hang moi")
                || text.contains("thành viên mới")
                || text.contains("thanh vien moi")
                || text.contains("tân thủ");
    }

    // Tạo mô tả điều kiện nhận mã chuẩn từ dữ liệu API của từng Voucher
    public String buildUnlockConditionText(Voucher v) {
        if (v == null) return "";
        double minVal = v.getMinOrderValue() != null ? v.getMinOrderValue() : 0.0;
        String minStr = minVal > 0 ? String.format("%,.0fđ", minVal) : "0đ";

        if (v.getProduct() != null) {
            return "Chỉ áp dụng khi mua sản phẩm: " + v.getProduct().getName()
                    + (minVal > 0 ? " (Đơn từ " + minStr + ")" : "");
        }

        if (isWelcomeVoucher(v)) {
            return minVal > 0
                    ? "Nhận ngay khi đăng ký tài khoản mới (Áp dụng đơn từ " + minStr + ")"
                    : "Nhận ngay khi đăng ký tài khoản mới";
        }

        String text = ((v.getCode() != null ? v.getCode() : "") + " "
                + (v.getName() != null ? v.getName() : "") + " "
                + (v.getDescription() != null ? v.getDescription() : "")).toLowerCase();

        if (text.contains("polo") || text.contains("routine")) {
            return "Nhận khi đặt mua sản phẩm Áo Polo / Routine (Áp dụng đơn từ " + minStr + ")";
        }
        if (text.contains("teelab") || text.contains("thun") || text.contains("tee")) {
            return "Nhận khi đặt mua sản phẩm Áo Thun / Teelab (Áp dụng đơn từ " + minStr + ")";
        }
        if (text.contains("hoodie") || text.contains("khoác") || text.contains("khoac")
                || text.contains("sweater") || text.contains("jacket") || text.contains("bomber")
                || text.contains("cardigan")) {
            return "Nhận khi đặt mua sản phẩm Áo Khoác & Hoodie (Áp dụng đơn từ " + minStr + ")";
        }
        if (text.contains("sơ mi") || text.contains("so mi") || text.contains("oxford")) {
            return "Nhận khi đặt mua sản phẩm Áo Sơ Mi (Áp dụng đơn từ " + minStr + ")";
        }
        if (minVal > 0) {
            return "Nhận khi đặt đơn hàng đạt từ " + minStr;
        }
        return "Ưu đãi dành cho khách hàng đủ điều kiện";
    }

    // Kiểm tra một đơn hàng thực tế đủ điều kiện mở khóa những Voucher nào trong danh sách Voucher từ DB
    public Set<String> evaluateOrderItemsForVouchers(List<OrderItem> items, double subtotalAmount) {
        List<Voucher> activeVouchers = voucherRepository.findAvailableVouchers(LocalDateTime.now());
        return evaluateOrderAgainstVouchers(items, subtotalAmount, activeVouchers);
    }

    public Set<String> evaluateOrderAgainstVouchers(
            List<OrderItem> items,
            double subtotalAmount,
            List<Voucher> activeVouchers) {
        Set<String> unlocked = new LinkedHashSet<>();
        if (activeVouchers == null || activeVouchers.isEmpty()) {
            return unlocked;
        }

        boolean hasPolo = false;
        boolean hasTee = false;
        boolean hasHoodieOrJacket = false;
        boolean hasShirt = false;

        if (items != null) {
            for (OrderItem item : items) {
                Product p = item.getProduct();
                String pName = (p != null && p.getName() != null) ? p.getName().toLowerCase() : "";
                String brandName = (p != null && p.getBrand() != null && p.getBrand().getName() != null)
                        ? p.getBrand().getName().toLowerCase()
                        : "";
                String catName = (p != null && p.getCategory() != null && p.getCategory().getName() != null)
                        ? p.getCategory().getName().toLowerCase()
                        : "";
                String combinedProductText = pName + " " + brandName + " " + catName;

                if (combinedProductText.contains("polo") || combinedProductText.contains("routine")) {
                    hasPolo = true;
                }
                if (combinedProductText.contains("thun") || combinedProductText.contains("teelab") || combinedProductText.contains("tee")) {
                    hasTee = true;
                }
                if (combinedProductText.contains("hoodie") || combinedProductText.contains("khoác")
                        || combinedProductText.contains("khoac") || combinedProductText.contains("sweater")
                        || combinedProductText.contains("jacket") || combinedProductText.contains("bomber")
                        || combinedProductText.contains("cardigan") || combinedProductText.contains("chống nắng")) {
                    hasHoodieOrJacket = true;
                }
                if (combinedProductText.contains("sơ mi") || combinedProductText.contains("so mi") || combinedProductText.contains("oxford")) {
                    hasShirt = true;
                }
            }
        }

        for (Voucher v : activeVouchers) {
            if (isWelcomeVoucher(v)) {
                continue;
            }
            String normCode = normalizeCode(v.getCode());
            String vText = ((v.getCode() != null ? v.getCode() : "") + " "
                    + (v.getName() != null ? v.getName() : "") + " "
                    + (v.getDescription() != null ? v.getDescription() : "")).toLowerCase();
            double minOrder = v.getMinOrderValue() != null ? v.getMinOrderValue() : 0.0;

            boolean requiresPolo = vText.contains("polo") || vText.contains("routine");
            boolean requiresTee = vText.contains("teelab") || vText.contains("thun") || vText.contains("tee");
            boolean requiresHoodie = vText.contains("hoodie") || vText.contains("khoác") || vText.contains("khoac")
                    || vText.contains("sweater") || vText.contains("jacket") || vText.contains("bomber")
                    || vText.contains("cardigan");
            boolean requiresShirt = vText.contains("sơ mi") || vText.contains("so mi") || vText.contains("oxford");

            if (requiresPolo) {
                if (hasPolo) {
                    unlocked.add(normCode);
                }
            } else if (requiresTee) {
                if (hasTee) {
                    unlocked.add(normCode);
                }
            } else if (requiresHoodie) {
                if (hasHoodieOrJacket) {
                    unlocked.add(normCode);
                }
            } else if (requiresShirt) {
                if (hasShirt) {
                    unlocked.add(normCode);
                }
            } else {
                // Voucher chung không giới hạn dòng sản phẩm -> mở khóa khi đạt giá trị đơn tối thiểu trên API
                if (subtotalAmount >= minOrder && subtotalAmount > 0) {
                    unlocked.add(normCode);
                }
            }
        }

        // Nếu đơn hàng >= 300.000đ nhưng sản phẩm chưa khớp danh mục nào (VD: Áo Sơ Mi Denim), mở khóa POLO10 để đảm bảo quyền lợi
        if (unlocked.isEmpty() && subtotalAmount >= 300000) {
            for (Voucher v : activeVouchers) {
                if (!isWelcomeVoucher(v)) {
                    unlocked.add(normalizeCode(v.getCode()));
                    break;
                }
            }
        }

        return unlocked;
    }

    // Đồng bộ Ví Voucher của User dựa chuẩn trên danh sách Voucher từ API và lịch sử đơn hàng thực tế trên DB
    @Transactional
    public User syncUserVoucherWallet(User user) {
        if (user == null) return null;

        List<Voucher> activeVouchers = voucherRepository.findAvailableVouchers(LocalDateTime.now());
        Set<String> unlocked = new LinkedHashSet<>();
        Set<String> used = parseCodeSet(user.getUsedVouchers());

        // 1. Quét các đơn hàng thực tế không bị hủy của User để thu thập chính xác các mã đã dùng
        List<Order> userOrders = orderRepository.findByUserId(user.getId());
        for (Order ord : userOrders) {
            if (ord.getStatus() == OrderStatus.CANCELLED) continue;

            if (ord.getVoucherCode() != null && !ord.getVoucherCode().isBlank()) {
                used.add(normalizeCode(ord.getVoucherCode()));
            }
        }

        // 2. Mọi tài khoản đăng ký đều nhận được các mã Welcome đang chạy trên API (trừ khi đã từng sử dụng)
        for (Voucher v : activeVouchers) {
            String norm = normalizeCode(v.getCode());
            if (isWelcomeVoucher(v) && !used.contains(norm)) {
                unlocked.add(norm);
            }
        }
        if (unlocked.isEmpty() && !used.contains("WELCOME50K")) {
            unlocked.add("WELCOME50K");
        }

        // 3. Quét các đơn hàng thực tế không bị hủy của User để mở khóa đúng các mã đạt điều kiện (loại trừ mã đã dùng)
        for (Order ord : userOrders) {
            if (ord.getStatus() == OrderStatus.CANCELLED) continue;

            double discount = ord.getDiscountAmount() != null ? ord.getDiscountAmount() : 0.0;
            double subtotal = ord.getTotalAmount() + discount;
            List<OrderItem> items = ord.getOrderItems() != null ? ord.getOrderItems() : List.of();

            Set<String> eligible = evaluateOrderAgainstVouchers(items, subtotal, activeVouchers);
            for (String code : eligible) {
                String norm = normalizeCode(code);
                if (!used.contains(norm)) {
                    unlocked.add(norm);
                }
            }
        }

        // BẢO ĐẢM NGUYÊN TẮC: Mã nào đã dùng thì TUYỆT ĐỐI không bao giờ được nhận lại hay nằm trong unlocked
        unlocked.removeAll(used);

        String nextUnlockedCsv = joinCodeSet(unlocked);
        String nextUsedCsv = joinCodeSet(used);

        boolean changed = false;
        if (!nextUnlockedCsv.equals(user.getUnlockedVouchers())) {
            user.setUnlockedVouchers(nextUnlockedCsv);
            changed = true;
        }
        if (!nextUsedCsv.equals(user.getUsedVouchers())) {
            user.setUsedVouchers(nextUsedCsv);
            changed = true;
        }
        if (changed) {
            user = userRepository.save(user);
        }
        return user;
    }

    // Được gọi ngay khi tạo đơn hàng thành công (OrderService.createOrder) để lưu mã mới mở khóa & trả về danh sách mã mới từ API
    @Transactional
    public List<VoucherResponse> evaluateAndUnlockVouchersForOrder(
            User user,
            List<OrderItem> orderItems,
            double subtotalAmount,
            String usedVoucherCode) {
        if (user == null) return List.of();

        List<Voucher> allActive = voucherRepository.findAvailableVouchers(LocalDateTime.now());

        // Lấy danh sách voucher đã dùng từ trước + voucher vừa dùng trong đơn hiện tại
        Set<String> used = parseCodeSet(user.getUsedVouchers());
        if (usedVoucherCode != null && !usedVoucherCode.isBlank()) {
            used.add(normalizeCode(usedVoucherCode));
        }

        List<Order> previousOrders = orderRepository.findByUserId(user.getId());
        for (Order ord : previousOrders) {
            if (ord.getStatus() != OrderStatus.CANCELLED && ord.getVoucherCode() != null && !ord.getVoucherCode().isBlank()) {
                used.add(normalizeCode(ord.getVoucherCode()));
            }
        }

        // Tính tập voucher đã có từ trước (không chứa bất kỳ mã nào trong used)
        Set<String> unlockedBefore = new LinkedHashSet<>();
        for (Voucher v : allActive) {
            String norm = normalizeCode(v.getCode());
            if (isWelcomeVoucher(v) && !used.contains(norm)) {
                unlockedBefore.add(norm);
            }
        }
        if (unlockedBefore.isEmpty() && !used.contains("WELCOME50K")) {
            unlockedBefore.add("WELCOME50K");
        }

        for (Order ord : previousOrders) {
            if (ord.getStatus() == OrderStatus.CANCELLED) continue;
            // Bỏ qua đơn hàng vừa mới tạo (nếu đã nằm trong danh sách) bằng cách kiểm tra sau
            if (ord.getOrderItems() == orderItems) continue;
            double discount = ord.getDiscountAmount() != null ? ord.getDiscountAmount() : 0.0;
            double prevSubtotal = ord.getTotalAmount() + discount;
            List<OrderItem> prevItems = ord.getOrderItems() != null ? ord.getOrderItems() : List.of();
            Set<String> pastEligible = evaluateOrderAgainstVouchers(prevItems, prevSubtotal, allActive);
            for (String code : pastEligible) {
                String norm = normalizeCode(code);
                if (!used.contains(norm)) {
                    unlockedBefore.add(norm);
                }
            }
        }
        unlockedBefore.removeAll(used);

        Set<String> newlyEarnedCodes = evaluateOrderAgainstVouchers(orderItems, subtotalAmount, allActive);
        List<String> trulyNewCodes = new ArrayList<>();
        for (String code : newlyEarnedCodes) {
            String norm = normalizeCode(code);
            // NẾU TÀI KHOẢN ĐÃ TỪNG DÙNG MÃ NÀY THÌ TUYỆT ĐỐI KHÔNG ĐƯỢC NHẬN LẠI
            if (used.contains(norm)) {
                continue;
            }
            if (!unlockedBefore.contains(norm)) {
                unlockedBefore.add(norm);
                trulyNewCodes.add(norm);
            }
        }

        unlockedBefore.removeAll(used);

        user.setUnlockedVouchers(joinCodeSet(unlockedBefore));
        user.setUsedVouchers(joinCodeSet(used));
        userRepository.save(user);

        if (trulyNewCodes.isEmpty()) {
            return List.of();
        }

        List<VoucherResponse> newlyUnlockedResponses = new ArrayList<>();
        for (String newCode : trulyNewCodes) {
            Voucher matched = findVoucherByCodeOrAlias(newCode, allActive);
            if (matched != null) {
                newlyUnlockedResponses.add(toResponse(matched));
            }
        }
        return newlyUnlockedResponses;
    }

    private Voucher findVoucherByCodeOrAlias(String code, List<Voucher> pool) {
        String norm = normalizeCode(code);
        if (pool != null) {
            for (Voucher v : pool) {
                if (normalizeCode(v.getCode()).equals(norm)) {
                    return v;
                }
            }
        }
        return voucherRepository.findByCodeIgnoreCase(norm)
                .orElseGet(() -> {
                    if ("POLO10".equalsIgnoreCase(norm)) {
                        return voucherRepository.findByCodeIgnoreCase("AOPOLO10").orElse(null);
                    }
                    return null;
                });
    }

    // 1. Cho Khách hàng: Lấy danh sách voucher HIỆN CÓ của riêng tài khoản đang đăng nhập chuẩn từ API
    @Transactional
    public List<VoucherResponse> getAvailableVouchersForUser(Long userId, String username) {
        List<Voucher> allAvailable = voucherRepository.findAvailableVouchers(LocalDateTime.now());

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        if (user == null && username != null && !username.isBlank() && !"anonymousUser".equalsIgnoreCase(username)) {
            user = userRepository.findByUsername(username)
                    .orElseGet(() -> userRepository.findByEmail(username).orElse(null));
        }

        // Nếu chưa đăng nhập: không trả về kho voucher cá nhân
        if (user == null) {
            return List.of();
        }

        user = syncUserVoucherWallet(user);
        Set<String> unlocked = parseCodeSet(user.getUnlockedVouchers());
        Set<String> used = parseCodeSet(user.getUsedVouchers());

        return allAvailable.stream()
                .filter(v -> {
                    String norm = normalizeCode(v.getCode());
                    return unlocked.contains(norm) && !used.contains(norm);
                })
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Lấy toàn bộ danh mục voucher đang có hiệu lực trên hệ thống (cho trang Catalog / Hướng dẫn nhận mã)
    public List<VoucherResponse> getAvailableVouchers() {
        return voucherRepository.findAvailableVouchers(LocalDateTime.now())
                .stream().map(this::toResponse).toList();
    }

    // 2. Cho Khách hàng: Kiểm tra & tính toán tiền giảm khi nhập mã ở giỏ hàng/thanh toán
    public VoucherApplyResponse applyVoucher(VoucherApplyRequest request) {
        return applyVoucher(request, null);
    }

    @Transactional
    public VoucherApplyResponse applyVoucher(VoucherApplyRequest request, String username) {
        String rawCode = request.getCode() != null ? request.getCode().trim() : "";
        String normCode = normalizeCode(rawCode);

        Voucher voucher = voucherRepository.findByCodeIgnoreCase(rawCode)
                .orElseGet(() -> {
                    if ("POLO10".equalsIgnoreCase(rawCode)) {
                        return voucherRepository.findByCodeIgnoreCase("AOPOLO10").orElse(null);
                    }
                    if ("AOPOLO10".equalsIgnoreCase(rawCode)) {
                        return voucherRepository.findByCodeIgnoreCase("POLO10").orElse(null);
                    }
                    return null;
                });

        if (voucher == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không tồn tại trên hệ thống");
        }

        // Kiểm tra quyền sở hữu voucher trong Ví cá nhân của User (nếu xác định được User)
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null && username != null && !username.isBlank() && !"anonymousUser".equalsIgnoreCase(username)) {
            user = userRepository.findByUsername(username)
                    .orElseGet(() -> userRepository.findByEmail(username).orElse(null));
        }

        if (user != null) {
            user = syncUserVoucherWallet(user);
            Set<String> unlocked = parseCodeSet(user.getUnlockedVouchers());
            Set<String> used = parseCodeSet(user.getUsedVouchers());

            if (used.contains(normCode)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã sử dụng mã giảm giá " + normCode + " ở đơn hàng trước rồi! Mỗi tài khoản chỉ được sử dụng mã này 1 lần duy nhất.");
            }
            if (!unlocked.contains(normCode)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Tài khoản của bạn chưa đủ điều kiện nhận mã " + normCode + " (" + buildUnlockConditionText(voucher) + ")");
            }
        }

        // Kiểm tra trạng thái bật/tắt
        if (!Boolean.TRUE.equals(voucher.getActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá hiện đang tạm khóa");
        }

        LocalDateTime now = LocalDateTime.now();
        // Kiểm tra ngày bắt đầu
        if (now.isBefore(voucher.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá chưa đến ngày áp dụng");
        }
        // Kiểm tra ngày hết hạn
        if (now.isAfter(voucher.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết hạn sử dụng");
        }
        // Kiểm tra lượt dùng
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết lượt sử dụng");
        }
        // Kiểm tra giá trị đơn hàng tối thiểu
        if (voucher.getMinOrderValue() != null && request.getOrderAmount() < voucher.getMinOrderValue()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                String.format("Đơn hàng phải từ %,.0f VNĐ trở lên mới đủ điều kiện dùng mã này", voucher.getMinOrderValue()));
        }

        // ---> KIỂM TRA RÀNG BUỘC SẢN PHẨM TRONG ĐƠN HÀNG / GIỎ HÀNG <---
        List<Long> reqProductIds = request.getProductIds() != null ? request.getProductIds() : List.of();

        // 1. Trường hợp Voucher được gán trực tiếp cho 1 sản phẩm cụ thể
        if (voucher.getProduct() != null) {
            Long requiredProductId = voucher.getProduct().getId();
            boolean hasProduct = reqProductIds.contains(requiredProductId);
            if (!hasProduct) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        String.format("Mã %s chỉ áp dụng khi mua sản phẩm '%s'. Vui lòng chọn sản phẩm này vào giỏ hàng để được giảm giá!",
                                normCode, voucher.getProduct().getName()));
            }
        } else {
            // 2. Trường hợp Voucher theo dòng sản phẩm (dựa vào từ khóa tên/mã/mô tả như POLO, TEELAB/Thun, HOODIE, SƠ MI)
            String vText = ((voucher.getCode() != null ? voucher.getCode() : "") + " "
                    + (voucher.getName() != null ? voucher.getName() : "") + " "
                    + (voucher.getDescription() != null ? voucher.getDescription() : "")).toLowerCase();

            boolean requiresPolo = vText.contains("polo") || vText.contains("routine");
            boolean requiresTee = vText.contains("teelab") || vText.contains("thun") || vText.contains("tee");
            boolean requiresHoodie = vText.contains("hoodie") || vText.contains("khoác") || vText.contains("khoac")
                    || vText.contains("sweater") || vText.contains("jacket") || vText.contains("bomber")
                    || vText.contains("cardigan");
            boolean requiresShirt = vText.contains("sơ mi") || vText.contains("so mi") || vText.contains("oxford");

            if (!isWelcomeVoucher(voucher) && (requiresPolo || requiresTee || requiresHoodie || requiresShirt)) {
                if (reqProductIds.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            String.format("Mã %s yêu cầu có sản phẩm phù hợp trong giỏ hàng để áp dụng!", normCode));
                }

                List<Product> productsInCart = productRepository.findAllById(reqProductIds);
                boolean matchesCategory = false;
                String categoryLabel = "";

                if (requiresPolo) {
                    categoryLabel = "Áo Polo / Routine";
                    matchesCategory = productsInCart.stream().anyMatch(p -> {
                        String pText = (p.getName() + " "
                                + (p.getBrand() != null ? p.getBrand().getName() : "") + " "
                                + (p.getCategory() != null ? p.getCategory().getName() : "")).toLowerCase();
                        return pText.contains("polo") || pText.contains("routine");
                    });
                } else if (requiresTee) {
                    categoryLabel = "Áo Thun / Teelab";
                    matchesCategory = productsInCart.stream().anyMatch(p -> {
                        String pText = (p.getName() + " "
                                + (p.getBrand() != null ? p.getBrand().getName() : "") + " "
                                + (p.getCategory() != null ? p.getCategory().getName() : "")).toLowerCase();
                        return pText.contains("thun") || pText.contains("teelab") || pText.contains("tee");
                    });
                } else if (requiresHoodie) {
                    categoryLabel = "Áo Khoác & Hoodie";
                    matchesCategory = productsInCart.stream().anyMatch(p -> {
                        String pText = (p.getName() + " "
                                + (p.getBrand() != null ? p.getBrand().getName() : "") + " "
                                + (p.getCategory() != null ? p.getCategory().getName() : "")).toLowerCase();
                        return pText.contains("hoodie") || pText.contains("khoác") || pText.contains("khoac")
                                || pText.contains("sweater") || pText.contains("jacket") || pText.contains("bomber");
                    });
                } else if (requiresShirt) {
                    categoryLabel = "Áo Sơ Mi";
                    matchesCategory = productsInCart.stream().anyMatch(p -> {
                        String pText = (p.getName() + " "
                                + (p.getBrand() != null ? p.getBrand().getName() : "") + " "
                                + (p.getCategory() != null ? p.getCategory().getName() : "")).toLowerCase();
                        return pText.contains("sơ mi") || pText.contains("so mi") || pText.contains("oxford");
                    });
                }

                if (!matchesCategory) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            String.format("Mã %s chỉ áp dụng khi mua sản phẩm dòng %s. Đơn hàng của bạn chưa có sản phẩm phù hợp!",
                                    normCode, categoryLabel));
                }
            }
        }

        // TÍNH TOÁN TIỀN ĐƯỢC GIẢM
        double discountAmount = 0.0;
        if ("PERCENTAGE".equalsIgnoreCase(voucher.getDiscountType())) {
            discountAmount = request.getOrderAmount() * (voucher.getDiscountValue() / 100.0);
            if (voucher.getMaxDiscountAmount() != null && discountAmount > voucher.getMaxDiscountAmount()) {
                discountAmount = voucher.getMaxDiscountAmount();
            }
        } else if ("FIXED_AMOUNT".equalsIgnoreCase(voucher.getDiscountType())) {
            discountAmount = voucher.getDiscountValue();
        }

        if (discountAmount > request.getOrderAmount()) {
            discountAmount = request.getOrderAmount();
        }

        double finalAmount = request.getOrderAmount() - discountAmount;
        String displayCode = normalizeCode(voucher.getCode());
        Product p = voucher.getProduct();
        Long pId = p != null ? p.getId() : null;
        String pName = p != null ? p.getName() : null;
        String pImg = (p != null && p.getImages() != null && !p.getImages().isEmpty())
                ? p.getImages().get(0).getImageUrl()
                : null;

        return VoucherApplyResponse.builder()
                .valid(true)
                .code(displayCode)
                .originalAmount(request.getOrderAmount())
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .message(String.format("Áp dụng mã %s thành công! Bạn được giảm %,.0f VNĐ", displayCode, discountAmount))
                .build();
    }

    // 3. Cho Đơn hàng: Tăng số lượt dùng voucher khi khách đặt hàng thành công
    @Transactional
    public void recordVoucherUsage(String code) {
        if (code == null || code.isBlank()) return;
        Voucher v = voucherRepository.findByCodeIgnoreCase(code.trim())
                .orElseGet(() -> {
                    if ("POLO10".equalsIgnoreCase(code.trim())) {
                        return voucherRepository.findByCodeIgnoreCase("AOPOLO10").orElse(null);
                    }
                    return null;
                });
        if (v != null) {
            v.setUsedCount(v.getUsedCount() + 1);
            voucherRepository.save(v);
        }
    }

    // Hoàn lại quyền sở hữu voucher và giảm lượt sử dụng khi đơn hàng bị hủy
    @Transactional
    public void restoreVoucherUsage(User user, String code) {
        if (code == null || code.isBlank()) return;
        String normCode = normalizeCode(code);

        // Giảm lượt dùng trong bảng Voucher
        Voucher v = voucherRepository.findByCodeIgnoreCase(code.trim())
                .orElseGet(() -> {
                    if ("POLO10".equalsIgnoreCase(code.trim())) {
                        return voucherRepository.findByCodeIgnoreCase("AOPOLO10").orElse(null);
                    }
                    return null;
                });
        if (v != null && v.getUsedCount() != null && v.getUsedCount() > 0) {
            v.setUsedCount(v.getUsedCount() - 1);
            voucherRepository.save(v);
        }

        // Hoàn quyền sở hữu mã voucher cho User
        if (user != null) {
            Set<String> used = parseCodeSet(user.getUsedVouchers());
            Set<String> unlocked = parseCodeSet(user.getUnlockedVouchers());

            used.remove(normCode);
            unlocked.add(normCode);

            user.setUsedVouchers(joinCodeSet(used));
            user.setUnlockedVouchers(joinCodeSet(unlocked));
            userRepository.save(user);
        }
    }

    // 4. Cho Admin: Thêm voucher mới
    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        String cleanCode = request.getCode().trim().toUpperCase();
        Product product = null;
        if (request.getProductId() != null) {
            product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Sản phẩm ràng buộc ID " + request.getProductId() + " không tồn tại"));
        }
        if (voucherRepository.existsByCodeIgnoreCase(cleanCode)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã voucher '" + cleanCode + "' đã tồn tại");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày kết thúc phải sau ngày bắt đầu");
        }

        Voucher voucher = Voucher.builder()
                .code(cleanCode)
                .name(request.getName())
                .description(request.getDescription())
                .discountType(request.getDiscountType().toUpperCase())
                .discountValue(request.getDiscountValue())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .minOrderValue(request.getMinOrderValue() != null ? request.getMinOrderValue() : 0.0)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .active(request.getActive() != null ? request.getActive() : true)
                .product(product)
                .build();

        return toResponse(voucherRepository.save(voucher));
    }

    // 5. Cho Admin: Lấy tất cả voucher (phân trang)
    public Page<VoucherResponse> getAllVouchers(int page, int size) {
        return voucherRepository.findAll(PageRequest.of(page, size)).map(this::toResponse);
    }

    // 6. Cho Admin: Xóa voucher
    @Transactional
    public void deleteVoucher(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy voucher ID: " + id));
        voucherRepository.delete(voucher);
    }

    public VoucherResponse toResponse(Voucher voucher) {
        String displayCode = normalizeCode(voucher.getCode());
        Product p = voucher.getProduct();
        Long pId = p != null ? p.getId() : null;
        String pName = p != null ? p.getName() : null;
        String pImg = (p != null && p.getImages() != null && !p.getImages().isEmpty())
                ? p.getImages().get(0).getImageUrl()
                : null;
        return VoucherResponse.builder()
                .id(voucher.getId())
                .code(displayCode)
                .name(voucher.getName())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .minOrderValue(voucher.getMinOrderValue())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .usageLimit(voucher.getUsageLimit())
                .usedCount(voucher.getUsedCount())
                .active(voucher.getActive())
                .unlockCondition(buildUnlockConditionText(voucher))
                .productId(pId)
                .productName(pName)
                .productImageUrl(pImg)
                .build();
    }
}
