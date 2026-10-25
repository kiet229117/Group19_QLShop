/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import shopOrderService from '../../orders/services/shopOrderService';
import shopVoucherService from '../../vouchers/services/shopVoucherService';
import shopUserService from '../../users/services/shopUserService';
import { getProductPricing, getProductThumbnail } from '../utils/productUtils';

const ShopStateContext = createContext(null);

const BASE_SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 499000;

export function calculateVoucherDiscount(voucher, subtotal) {
  if (!voucher || subtotal <= 0) return 0;
  const minOrder = Number(voucher.minOrderAmount || voucher.minOrder || 0);
  if (subtotal < minOrder) return 0;

  const discountType = voucher.discountType || voucher.type;
  const discountVal = Number(voucher.discountValue ?? voucher.value ?? 0);
  const maxDiscount = Number(voucher.maxDiscountAmount || voucher.maxDiscount || 0);

  if (discountType === 'PERCENT' || discountType === 'PERCENTAGE') {
    const raw = Math.round((subtotal * discountVal) / 100);
    return maxDiscount > 0 ? Math.min(raw, maxDiscount) : raw;
  }
  return Math.min(discountVal, subtotal);
}

const EMPTY_PROFILE = {
  fullname: '',
  email: '',
  phone: '',
  birthday: '',
  gender: '',
  defaultAddress: '',
  addresses: [],
};

/**
 * Context quản lý toàn bộ state phía Client Shop:
 *  - Giỏ hàng (lưu localStorage, hỗ trợ biến thể SKU variantId)
 *  - Đơn hàng (kết nối trực tiếp POST /api/orders, GET /api/orders/user/{id}, PUT /api/orders/{id}/cancel)
 *  - Mã giảm giá (kết nối GET /api/vouchers/available, POST /api/vouchers/apply)
 *  - Hồ sơ cá nhân (đồng bộ AuthContext & PUT /api/users/{id})
 */
export function ShopStateProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  // 1. Giỏ hàng (lưu trong localStorage để không bị mất khi reload)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('qlshop_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (isAuthenticated) {
        localStorage.setItem('qlshop_cart_items', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('qlshop_cart_items');
      }
    } catch (e) {
      console.warn('Lỗi lưu giỏ hàng vào localStorage:', e);
    }
  }, [cartItems, isAuthenticated]);

  // Xóa sạch giỏ hàng khi đăng xuất
  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      setProfile(EMPTY_PROFILE);
      try {
        localStorage.removeItem('qlshop_cart_items');
      } catch (e) {
        console.warn(e);
      }
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // 2. Vouchers từ Backend API
  const [vouchers, setVouchers] = useState([]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  const [serverDiscount, setServerDiscount] = useState(0);

  const fetchVouchers = useCallback(async () => {
    try {
      const res = await shopVoucherService.getAvailableVouchers();
      const list = Array.isArray(res) ? res : res?.content || [];
      setVouchers(list);
    } catch (err) {
      console.warn('Không thể tải voucher từ Backend:', err);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // 3. Đơn hàng (kết nối API Backend hoặc localStorage)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('qlshop_client_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('qlshop_client_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Lỗi lưu đơn hàng vào localStorage:', e);
    }
  }, [orders]);

  // Tải đơn hàng của User từ API khi đã đăng nhập
  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoadingOrders(true);
    try {
      const res = await shopOrderService.getOrdersByUserId(user.id, 0, 50);
      const list = Array.isArray(res) ? res : res?.content || [];
      if (list.length > 0) {
        // Chuẩn hóa cấu trúc đơn hàng trả về từ Backend
        const formatted = list.map((o) => ({
          id: o.id,
          code: o.orderCode || `QL-${o.id}`,
          createdAt: o.createdAt
            ? new Date(o.createdAt).toLocaleString('vi-VN')
            : 'Mới tạo',
          status: o.status || 'PENDING',
          paymentMethod: o.paymentMethod || 'COD',
          paymentMethodLabel:
            o.paymentMethod === 'BANK_TRANSFER'
              ? 'Chuyển khoản VietQR'
              : 'Thanh toán khi nhận hàng (COD)',
          recipientName: o.receiverName || o.recipientName || user.name || 'Khách hàng',
          recipientPhone: o.receiverPhone || o.recipientPhone || user.phone || '',
          shippingAddress: o.shippingAddress || '',
          note: o.note || '',
          subtotal: Number(o.totalAmount || 0),
          shippingFee: 0,
          discount: Number(o.discountAmount || 0),
          totalAmount: Number(o.totalAmount || 0),
          items: (o.orderItems || o.items || []).map((it, idx) => ({
            id: it.id || idx + 1,
            productId: it.productId,
            name: it.productName || it.name || `Sản phẩm #${it.productId}`,
            image: it.productImage || it.image || '/images/products/1.jpg',
            size: it.size || 'L',
            color: it.color || 'Đen',
            unitPrice: it.price || it.unitPrice || 0,
            quantity: it.quantity || 1,
          })),
          timeline: [
            {
              step: 'ORDERED',
              label: 'Đặt hàng thành công',
              time: o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : 'Đã ghi nhận',
              done: true,
            },
            {
              step: 'CONFIRMED',
              label: 'Cửa hàng đã xác nhận',
              time: o.status !== 'PENDING' ? 'Đã duyệt' : 'Đang xử lý',
              done: o.status === 'CONFIRMED' || o.status === 'SHIPPING' || o.status === 'COMPLETED',
            },
            {
              step: 'SHIPPING',
              label: 'Đang giao hàng',
              time: o.status === 'SHIPPING' || o.status === 'COMPLETED' ? 'Đang vận chuyển' : '—',
              done: o.status === 'SHIPPING' || o.status === 'COMPLETED',
            },
            {
              step: 'COMPLETED',
              label: 'Giao hàng thành công',
              time: o.status === 'COMPLETED' ? 'Hoàn tất' : '—',
              done: o.status === 'COMPLETED',
            },
          ],
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.warn('Lỗi tải đơn hàng của người dùng:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.id, user?.name, user?.phone]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // 4. Thông tin cá nhân Profile (chỉ có khi người dùng đã đăng nhập)
  const [profile, setProfile] = useState(() => {
    try {
      const token = localStorage.getItem('qlshop_token');
      const savedUser = localStorage.getItem('qlshop_user');
      if (token && savedUser) {
        const u = JSON.parse(savedUser);
        return {
          ...EMPTY_PROFILE,
          id: u.id,
          fullname: u.fullname || u.name || u.username || '',
          email: u.email || '',
          phone: u.phone || '',
          defaultAddress: u.address || '',
          avatar: u.avatar || '',
        };
      }
      return EMPTY_PROFILE;
    } catch {
      return EMPTY_PROFILE;
    }
  });

  // Đồng bộ Profile khi user đăng nhập / đăng xuất
  useEffect(() => {
    if (user && isAuthenticated) {
      setProfile({
        ...EMPTY_PROFILE,
        id: user.id,
        fullname: user.fullname || user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        defaultAddress: user.address || '',
        avatar: user.avatar || '',
      });
    } else {
      setProfile(EMPTY_PROFILE);
      try {
        localStorage.removeItem('qlshop_profile');
      } catch (e) {
        console.warn(e);
      }
    }
  }, [user, isAuthenticated]);

  const [demoSignedIn, setDemoSignedIn] = useState(Boolean(user));

  // Thêm sản phẩm vào giỏ (yêu cầu đã đăng nhập)
  const addToCart = (product, { size = 'L', color = 'Đen', quantity = 1 } = {}) => {
    if (!product) return null;
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng!');
      return false;
    }
    const { currentPrice, originalPrice } = getProductPricing(product);
    const unitPrice = currentPrice ?? product.price ?? 0;
    const variant = (product.variants || []).find(
      (v) => (!size || v.size === size) && (!color || v.color === color)
    );
    const variantId = variant?.id || null;
    const stockQuantity = variant ? Number(variant.stockQuantity) || 20 : 20;
    const itemId = `cart-${product.id}-${size || 'F'}-${color || 'Default'}`;
    const brandName = product.brandName || product.brand?.name || 'QLShop Fashion';

    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === itemId);
      if (existing) {
        return prev.map((it) =>
          it.id === itemId
            ? {
                ...it,
                quantity: Math.min(stockQuantity, it.quantity + quantity),
                selected: true,
              }
            : it
        );
      }
      return [
        {
          id: itemId,
          productId: product.id,
          variantId,
          slug: product.slug,
          name: product.name,
          image: getProductThumbnail(product) || '/images/products/1.jpg',
          brandName,
          size,
          color,
          unitPrice,
          originalPrice: originalPrice || product.price,
          quantity: Math.max(1, Math.min(stockQuantity, quantity)),
          stockQuantity,
          selected: true,
        },
        ...prev,
      ];
    });

    toast.success(`Đã thêm "${product.name}" (${color} - ${size}) vào giỏ hàng!`);
    return itemId;
  };

  const updateCartQuantity = (itemId, nextQuantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const max = item.stockQuantity || 99;
        const clamped = Math.max(1, Math.min(max, Number(nextQuantity) || 1));
        return { ...item, quantity: clamped };
      })
    );
  };

  const removeCartItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.info('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const clearSelectedCartItems = () => {
    setCartItems((prev) => prev.filter((item) => !item.selected));
  };

  const clearAllCart = () => {
    setCartItems([]);
    setAppliedVoucherCode('');
    setServerDiscount(0);
  };

  const toggleSelectCartItem = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAllCart = (checked) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, selected: Boolean(checked) })));
  };

  // Tính toán tóm tắt giỏ hàng
  const cartSummary = useMemo(() => {
    const totalCount = cartItems.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const selectedItems = cartItems.filter((it) => it.selected);
    const selectedCount = selectedItems.reduce(
      (sum, it) => sum + (Number(it.quantity) || 0),
      0
    );
    const subtotal = selectedItems.reduce(
      (sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 0),
      0
    );

    const activeVoucher =
      vouchers.find((v) => v.code?.toUpperCase() === appliedVoucherCode.toUpperCase()) || null;
    
    // Ưu tiên giảm giá tính từ backend applyVoucher nếu có
    const discount =
      serverDiscount > 0 ? serverDiscount : calculateVoucherDiscount(activeVoucher, subtotal);

    const shippingFee =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_FEE;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);
    const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

    return {
      totalCount,
      selectedItems,
      selectedCount,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      activeVoucher,
      allSelected,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };
  }, [cartItems, vouchers, appliedVoucherCode, serverDiscount]);

  // Áp dụng mã giảm giá (kết nối API Backend POST /api/vouchers/apply)
  const applyVoucher = async (rawCode) => {
    const clean = String(rawCode || '').trim().toUpperCase();
    if (!clean) {
      setAppliedVoucherCode('');
      setServerDiscount(0);
      return { ok: true, message: 'Đã gỡ mã giảm giá.' };
    }

    try {
      const res = await shopVoucherService.applyVoucher({
        code: clean,
        orderAmount: cartSummary.subtotal,
      });

      if (res && res.valid) {
        setAppliedVoucherCode(clean);
        setServerDiscount(Number(res.discountAmount) || 0);
        toast.success(`Áp dụng thành công mã giảm giá ${clean}! Giảm ${new Intl.NumberFormat('vi-VN').format(res.discountAmount)}đ`);
        return { ok: true, voucher: res.voucher, message: res.message || 'Mã giảm giá hợp lệ!' };
      } else {
        toast.error(res?.message || 'Mã giảm giá không hợp lệ hoặc đã hết lượt dùng');
        return { ok: false, message: res?.message || 'Mã giảm giá không hợp lệ' };
      }
    } catch {
      // Fallback tính toán cục bộ nếu backend gặp sự cố
      const found = vouchers.find((v) => v.code?.toUpperCase() === clean);
      if (found) {
        setAppliedVoucherCode(found.code);
        setServerDiscount(calculateVoucherDiscount(found, cartSummary.subtotal));
        toast.success(`Đã áp dụng mã giảm giá ${found.code}!`);
        return { ok: true, voucher: found, message: 'Đã áp dụng mã giảm giá thành công!' };
      }
      toast.error('Mã giảm giá không tồn tại hoặc chưa đạt giá trị đơn hàng tối thiểu.');
      return { ok: false, message: 'Mã giảm giá không hợp lệ.' };
    }
  };

  // 5. ĐẶT HÀNG THỰC TẾ (Gọi POST /api/orders)
  const placeOrder = async ({
    recipientName,
    recipientPhone,
    recipientEmail,
    shippingAddress,
    note,
    paymentMethod = 'COD',
  }) => {
    const itemsToOrder =
      cartSummary.selectedItems.length > 0 ? cartSummary.selectedItems : cartItems;

    if (itemsToOrder.length === 0) {
      toast.error('Giỏ hàng trống! Vui lòng chọn sản phẩm để thanh toán.');
      throw new Error('Giỏ hàng trống');
    }

    // Chuẩn bị payload chuẩn OrderRequest cho Backend
    const orderPayload = {
      userId: user?.id || null,
      receiverName: recipientName.trim(),
      receiverPhone: recipientPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      note: note || '',
      voucherCode: appliedVoucherCode || null,
      items: itemsToOrder.map((it) => ({
        productId: Number(it.productId),
        variantId: it.variantId ? Number(it.variantId) : null,
        quantity: Number(it.quantity) || 1,
      })),
    };

    try {
      const res = await shopOrderService.createOrder(orderPayload);
      const backendOrder = res.data || res;

      const orderId = backendOrder.id || `DH${Date.now()}`;
      const orderCode = backendOrder.orderCode || `QL-${orderId}`;

      const newOrder = {
        id: orderId,
        code: orderCode,
        createdAt: new Date().toLocaleString('vi-VN'),
        status: backendOrder.status || 'PENDING',
        paymentMethod,
        paymentMethodLabel:
          paymentMethod === 'BANK_TRANSFER'
            ? 'Chuyển khoản VietQR'
            : 'Thanh toán khi nhận hàng (COD)',
        paymentStatus: 'UNPAID',
        paymentStatusLabel: 'Chờ giao hàng',
        recipientName,
        recipientPhone,
        recipientEmail,
        shippingAddress,
        note: note || '',
        subtotal: cartSummary.subtotal,
        shippingFee: cartSummary.shippingFee,
        discount: cartSummary.discount,
        voucherCode: appliedVoucherCode || '',
        totalAmount: backendOrder.totalAmount || cartSummary.totalAmount,
        items: itemsToOrder.map((it, idx) => ({
          id: idx + 1,
          productId: it.productId,
          slug: it.slug,
          name: it.name,
          image: it.image,
          size: it.size,
          color: it.color,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
        })),
        timeline: [
          {
            step: 'ORDERED',
            label: 'Đặt hàng thành công',
            time: new Date().toLocaleString('vi-VN'),
            done: true,
          },
          { step: 'CONFIRMED', label: 'Chờ cửa hàng xác nhận', time: 'Đang xử lý', done: false },
          { step: 'SHIPPING', label: 'Đang giao hàng', time: '—', done: false },
          { step: 'COMPLETED', label: 'Hoàn thành đơn hàng', time: '—', done: false },
        ],
      };

      setOrders((prev) => [newOrder, ...prev]);
      // Xóa các sản phẩm đã đặt thành công khỏi giỏ hàng
      setCartItems((prev) => prev.filter((it) => !it.selected));
      setAppliedVoucherCode('');
      setServerDiscount(0);

      toast.success(`Đặt hàng thành công! Mã đơn hàng: #${orderCode}`);
      return newOrder;
    } catch (err) {
      console.error('Lỗi khi gửi đơn hàng lên Backend:', err);
      // Fallback lưu local nếu backend mất kết nối
      const localId = `DH${Date.now()}`;
      const localOrder = {
        id: localId,
        code: `QL-${localId}`,
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'PENDING',
        paymentMethod,
        paymentMethodLabel: 'Thanh toán khi nhận hàng (COD)',
        recipientName,
        recipientPhone,
        recipientEmail,
        shippingAddress,
        note: note || '',
        subtotal: cartSummary.subtotal,
        shippingFee: cartSummary.shippingFee,
        discount: cartSummary.discount,
        voucherCode: appliedVoucherCode || '',
        totalAmount: cartSummary.totalAmount,
        items: itemsToOrder,
        timeline: [
          {
            step: 'ORDERED',
            label: 'Đặt hàng thành công',
            time: new Date().toLocaleString('vi-VN'),
            done: true,
          },
          { step: 'CONFIRMED', label: 'Chờ cửa hàng xác nhận', time: 'Đang xử lý', done: false },
          { step: 'SHIPPING', label: 'Đang giao hàng', time: '—', done: false },
          { step: 'COMPLETED', label: 'Hoàn thành đơn hàng', time: '—', done: false },
        ],
      };
      setOrders((prev) => [localOrder, ...prev]);
      setCartItems((prev) => prev.filter((it) => !it.selected));
      toast.success('Đã lưu đơn hàng của bạn!');
      return localOrder;
    }
  };

  // Hủy đơn hàng (kết nối API Backend PUT /api/orders/{id}/cancel)
  const cancelOrder = async (orderId) => {
    try {
      if (typeof orderId === 'number' || /^\d+$/.test(String(orderId))) {
        await shopOrderService.cancelOrder(orderId);
      }
      setOrders((prev) =>
        prev.map((order) => {
          if (String(order.id) !== String(orderId)) return order;
          return {
            ...order,
            status: 'CANCELLED',
            paymentStatusLabel: 'Đã hủy đơn',
            timeline: [
              ...order.timeline.filter((t) => t.done),
              {
                step: 'CANCELLED',
                label: 'Đơn hàng đã được hủy',
                time: new Date().toLocaleString('vi-VN'),
                done: true,
              },
            ],
          };
        })
      );
      toast.success(`Đã hủy thành công đơn hàng #${orderId}!`);
    } catch (err) {
      console.warn('Lỗi khi hủy đơn hàng:', err);
      toast.error('Không thể hủy đơn hàng này. Vui lòng liên hệ CSKH.');
    }
  };

  // Mua lại các sản phẩm trong đơn hàng vào giỏ
  const reorderToCart = (order) => {
    if (!order || !Array.isArray(order.items)) return;
    setCartItems((prev) => {
      const next = [...prev];
      order.items.forEach((it) => {
        const itemId = `cart-${it.productId}-${it.size || 'L'}-${it.color || 'Đen'}`;
        const existingIndex = next.findIndex((c) => c.id === itemId);
        if (existingIndex >= 0) {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + (Number(it.quantity) || 1),
            selected: true,
          };
        } else {
          next.unshift({
            id: itemId,
            productId: it.productId,
            slug: it.slug || `san-pham-${it.productId}`,
            name: it.name,
            image: it.image || '/images/products/1.jpg',
            brandName: 'QLShop Fashion',
            size: it.size || 'L',
            color: it.color || 'Đen',
            unitPrice: Number(it.unitPrice) || 0,
            originalPrice: Number(it.unitPrice) || 0,
            quantity: Number(it.quantity) || 1,
            stockQuantity: 20,
            selected: true,
          });
        }
      });
      return next;
    });
    toast.success('Đã thêm lại các sản phẩm vào giỏ hàng!');
  };

  // Cập nhật thông tin hồ sơ cá nhân
  const updateProfile = async (nextFields) => {
    try {
      if (user?.id) {
        await shopUserService.updateProfile(user.id, nextFields);
      }
      setProfile((prev) => {
        const updated = { ...prev, ...nextFields };
        localStorage.setItem('qlshop_profile', JSON.stringify(updated));
        return updated;
      });
      toast.success('Đã cập nhật hồ sơ cá nhân thành công!');
    } catch (err) {
      console.warn('Lỗi cập nhật hồ sơ:', err);
      setProfile((prev) => ({ ...prev, ...nextFields }));
      toast.success('Đã cập nhật thông tin!');
    }
  };

  const value = {
    cartItems,
    cartSummary,
    vouchers,
    appliedVoucherCode,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearSelectedCartItems,
    clearAllCart,
    toggleSelectCartItem,
    toggleSelectAllCart,
    applyVoucher,
    orders,
    loadingOrders,
    placeOrder,
    placeSimulatedOrder: placeOrder, // alias tương thích ngược
    cancelOrder,
    cancelOrderSimulated: cancelOrder, // alias tương thích ngược
    reorderToCart,
    profile,
    updateProfile,
    updateProfileSimulated: updateProfile, // alias tương thích ngược
    demoSignedIn,
    setDemoSignedIn,
    fetchVouchers,
    fetchUserOrders,
  };

  return <ShopStateContext.Provider value={value}>{children}</ShopStateContext.Provider>;
}

export function useShopState() {
  const ctx = useContext(ShopStateContext);
  if (!ctx) {
    throw new Error('useShopState phải được sử dụng bên trong ShopStateProvider');
  }
  return ctx;
}

export default ShopStateContext;
