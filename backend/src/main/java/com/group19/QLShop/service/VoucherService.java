package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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
import com.group19.QLShop.repository.UserRepository;
import com.group19.QLShop.repository.VoucherRepository;

@Service
@Transactional(readOnly = true)
public class VoucherService {

    private static final Set<String> CAMPAIGN_CODES = Set.of(
            "WELCOME50K", "POLO10", "AOPOLO10", "HOODIE30K", "TEELAB20"
    );

    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public VoucherService(
            VoucherRepository voucherRepository,
            UserRepository userRepository,
            OrderRepository orderRepository) {
        this.voucherRepository = voucherRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    // Chuẩn hóa mã AOPOLO10 và POLO10 thống nhất thành POLO10
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

    // Đồng bộ các voucher đã mở khóa và đã dùng của User dựa trên cả cột DB và lịch sử đơn hàng thật
    @Transactional
    public User syncUserVoucherWallet(User user) {
        if (user == null) return null;

        Set<String> unlocked = parseCodeSet(user.getUnlockedVouchers());
        // Mặc định mọi tài khoản đăng ký đều có sẵn mã WELCOME50K
        unlocked.add("WELCOME50K");

        Set<String> used = parseCodeSet(user.getUsedVouchers());

        List<Order> userOrders = orderRepository.findByUserId(user.getId());
        for (Order ord : userOrders) {
            if (ord.getStatus() == OrderStatus.CANCELLED) continue;

            if (ord.getVoucherCode() != null && !ord.getVoucherCode().isBlank()) {
                used.add(normalizeCode(ord.getVoucherCode()));
            }

            double discount = ord.getDiscountAmount() != null ? ord.getDiscountAmount() : 0.0;
            double subtotal = ord.getTotalAmount() + discount;
            List<OrderItem> items = ord.getOrderItems() != null ? ord.getOrderItems() : List.of();

            unlocked.addAll(evaluateOrderItemsForVouchers(items, subtotal));
        }

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

    // Kiểm tra điều kiện mở khóa Voucher từ 1 đơn hàng chuẩn theo 4 mã trên hệ thống:
    // 1. WELCOME50K: Ưu Đãi Khách Hàng Mới (Giảm 50.000đ cho đơn từ 250.000đ) -> Có sẵn khi đăng ký
    // 2. POLO10: Giảm 10% Áo Polo Routine (Giảm 10% tối đa 40.000đ cho đơn từ 300.000đ) -> Khi đặt mua Áo Polo hoặc đơn >= 300.000đ
    // 3. HOODIE30K: Khuyến Mãi Áo Khoác & Hoodie (Giảm 30.000đ cho đơn từ 350.000đ) -> Khi đặt mua Áo Khoác / Hoodie hoặc đơn >= 350.000đ
    // 4. TEELAB20: Siêu Sale Áo Thun Teelab (Giảm 20% tối đa 60.000đ cho đơn từ 400.000đ) -> Khi đặt mua Áo Thun / Teelab hoặc đơn >= 400.000đ
    public Set<String> evaluateOrderItemsForVouchers(List<OrderItem> items, double subtotalAmount) {
        Set<String> unlocked = new LinkedHashSet<>();

        boolean hasPolo = false;
        boolean hasTee = false;
        boolean hasHoodieOrJacket = false;

        if (items != null) {
            for (OrderItem item : items) {
                Product p = item.getProduct();
                String pName = (p != null && p.getName() != null) ? p.getName().toLowerCase() : "";
                if (pName.contains("polo") || pName.contains("routine")) {
                    hasPolo = true;
                }
                if (pName.contains("thun") || pName.contains("teelab") || pName.contains("tee")) {
                    hasTee = true;
                }
                if (pName.contains("hoodie") || pName.contains("khoác") || pName.contains("khoac")
                        || pName.contains("sweater") || pName.contains("jacket") || pName.contains("bomber")
                        || pName.contains("cardigan")) {
                    hasHoodieOrJacket = true;
                }
            }
        }

        // 1. Khi đặt Áo Polo (hoặc đơn đạt từ 300.000đ) -> Nhận mã POLO10
        if (hasPolo || subtotalAmount >= 300000) {
            unlocked.add("POLO10");
        }

        // 2. Khi đặt Áo Khoác & Hoodie (hoặc đơn đạt từ 350.000đ) -> Nhận mã HOODIE30K
        if (hasHoodieOrJacket || subtotalAmount >= 350000) {
            unlocked.add("HOODIE30K");
        }

        // 3. Khi đặt Áo Thun Teelab (hoặc đơn đạt từ 400.000đ) -> Nhận mã TEELAB20
        if (hasTee || subtotalAmount >= 400000) {
            unlocked.add("TEELAB20");
        }

        return unlocked;
    }

    // Được gọi ngay khi tạo đơn hàng thành công (OrderService.createOrder) để lưu mã mới mở khóa & trả về danh sách mã mới
    @Transactional
    public List<VoucherResponse> evaluateAndUnlockVouchersForOrder(
            User user,
            List<OrderItem> orderItems,
            double subtotalAmount,
            String usedVoucherCode) {
        if (user == null) return List.of();

        Set<String> unlockedBefore = parseCodeSet(user.getUnlockedVouchers());
        unlockedBefore.add("WELCOME50K");

        Set<String> used = parseCodeSet(user.getUsedVouchers());
        if (usedVoucherCode != null && !usedVoucherCode.isBlank()) {
            used.add(normalizeCode(usedVoucherCode));
        }

        Set<String> newlyEarnedCodes = evaluateOrderItemsForVouchers(orderItems, subtotalAmount);
        List<String> trulyNewCodes = new ArrayList<>();
        for (String code : newlyEarnedCodes) {
            String norm = normalizeCode(code);
            if (!unlockedBefore.contains(norm)) {
                unlockedBefore.add(norm);
                trulyNewCodes.add(norm);
            }
        }

        user.setUnlockedVouchers(joinCodeSet(unlockedBefore));
        user.setUsedVouchers(joinCodeSet(used));
        userRepository.save(user);

        if (trulyNewCodes.isEmpty()) {
            return List.of();
        }

        List<Voucher> allActive = voucherRepository.findAvailableVouchers(LocalDateTime.now());
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

    // 1. Cho Khách hàng: Lấy danh sách voucher HIỆN CÓ của riêng tài khoản đang đăng nhập
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
                    if (used.contains(norm)) {
                        return false;
                    }
                    // Nếu là 1 trong 4 mã chiến dịch thì phải nằm trong danh sách đã mở khóa của User
                    if (CAMPAIGN_CODES.contains(norm) || CAMPAIGN_CODES.contains(v.getCode().toUpperCase())) {
                        return unlocked.contains(norm);
                    }
                    // Nếu Admin tạo thêm mã mới ngoài 4 mã chiến dịch thì cho phép hiển thị nếu user chưa dùng
                    return true;
                })
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Giữ hàm không tham số tương thích ngược
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
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã sử dụng mã giảm giá " + normCode + " ở đơn hàng trước rồi!");
            }
            if ((CAMPAIGN_CODES.contains(normCode) || CAMPAIGN_CODES.contains(voucher.getCode().toUpperCase()))
                    && !unlocked.contains(normCode)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Tài khoản của bạn chưa mở khóa mã " + normCode + ". Hãy đặt mua sản phẩm hoặc đạt mốc đơn hàng tương ứng để nhận mã!");
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

    // 4. Cho Admin: Thêm voucher mới
    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        String cleanCode = request.getCode().trim().toUpperCase();
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
                .build();
    }
}
