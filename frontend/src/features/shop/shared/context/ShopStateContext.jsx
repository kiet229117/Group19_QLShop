/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Ticket, Sparkles, Gift, CheckCircle2, Copy, X } from 'lucide-react';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import shopOrderService from '../../orders/services/shopOrderService';
import shopVoucherService from '../../vouchers/services/shopVoucherService';
import shopUserService from '../../users/services/shopUserService';
import shopCartService from '../../cart/services/shopCartService';
import shopProductService from '../../products/services/shopProductService';
import { getProductPricing, getProductThumbnail } from '../utils/productUtils';

const ShopStateContext = createContext(null);

const BASE_SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 499000;

// Danh mục 4 Voucher chuẩn khớp 100% với trang Quản trị Voucher (API Backend)
const DEFAULT_VOUCHER_CATALOG = [
  {
    id: 1,
    code: 'WELCOME50K',
    name: 'Ưu Đãi Khách Hàng Mới',
    description: 'Giảm ngay 50.000đ cho đơn hàng mua áo từ 250.000đ',
    discountType: 'FIXED_AMOUNT',
    discountValue: 50000,
    maxDiscountAmount: null,
    minOrderValue: 250000,
    unlockRule: 'Nhận ngay khi đăng ký tài khoản mới',
    badgeText: 'Giảm 50.000 đ',
  },
  {
    id: 2,
    code: 'POLO10',
    aliasCode: 'AOPOLO10',
    name: 'Giảm 10% Áo Polo Routine',
    description: 'Giảm 10% tối đa 40.000đ cho đơn hàng từ 300.000đ',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    maxDiscountAmount: 40000,
    minOrderValue: 300000,
    unlockRule: 'Đặt mua sản phẩm Áo Polo Routine hoặc đơn hàng từ 300.000đ',
    badgeText: 'Giảm 10% (Tối đa 40.000 đ)',
  },
  {
    id: 3,
    code: 'TEELAB20',
    name: 'Siêu Sale Áo Thun Teelab',
    description: 'Giảm 20% tối đa 60.000đ cho đơn hàng từ 400.000đ',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxDiscountAmount: 60000,
    minOrderValue: 400000,
    unlockRule: 'Đặt mua sản phẩm Áo Thun Teelab hoặc đơn hàng từ 400.000đ',
    badgeText: 'Giảm 20% (Tối đa 60.000 đ)',
  },
  {
    id: 4,
    code: 'HOODIE30K',
    name: 'Khuyến Mãi Áo Khoác & Hoodie',
    description: 'Giảm ngay 30.000đ cho đơn mua áo khoác mùa đông từ 350.000đ',
    discountType: 'FIXED_AMOUNT',
    discountValue: 30000,
    maxDiscountAmount: null,
    minOrderValue: 350000,
    unlockRule: 'Đặt mua sản phẩm Áo Khoác & Hoodie hoặc đơn hàng từ 350.000đ',
    badgeText: 'Giảm 30.000 đ',
  },
];

// Chuẩn hóa mã voucher để POLO10 và AOPOLO10 luôn khớp nhau
function normalizeVoucherCode(code) {
  const clean = String(code || '').trim().toUpperCase();
  if (clean === 'AOPOLO10') return 'POLO10';
  return clean;
}

export function calculateVoucherDiscount(voucher, subtotal) {
  if (!voucher || subtotal <= 0) return 0;
  const minOrder = Number(
    voucher.minOrderValue ?? voucher.minOrderAmount ?? voucher.minOrder ?? 0
  );
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

// Kiểm tra một đơn hàng mở khóa những mã voucher nào (khớp chuẩn 4 Voucher trên ảnh API)
function evaluateOrderUnlockedCodes(order) {
  const unlocked = [];
  if (!order || order.status === 'CANCELLED') return unlocked;

  const amount = Math.max(Number(order.subtotal || 0), Number(order.totalAmount || 0));
  const items = Array.isArray(order.items) ? order.items : [];

  // 1. POLO10 (Giảm 10% Áo Polo Routine - đơn từ 300.000đ): Khi mua Áo Polo hoặc đơn từ 300.000đ
  const hasPolo = items.some((it) => {
    const itemName = String(it.name || it.productName || it.slug || '').toLowerCase();
    return itemName.includes('polo') || itemName.includes('routine');
  });
  if (hasPolo || amount >= 300000) {
    unlocked.push('POLO10');
  }

  // 2. HOODIE30K (Khuyến Mãi Áo Khoác & Hoodie - đơn từ 350.000đ): Khi mua Áo Khoác/Hoodie hoặc đơn từ 350.000đ
  const hasHoodieOrJacket = items.some((it) => {
    const itemName = String(it.name || it.productName || it.slug || '').toLowerCase();
    return (
      itemName.includes('hoodie') ||
      itemName.includes('khoác') ||
      itemName.includes('khoac') ||
      itemName.includes('sweater') ||
      itemName.includes('jacket') ||
      itemName.includes('bomber') ||
      itemName.includes('cardigan')
    );
  });
  if (hasHoodieOrJacket || amount >= 350000) {
    unlocked.push('HOODIE30K');
  }

  // 3. TEELAB20 (Siêu Sale Áo Thun Teelab - đơn từ 400.000đ): Khi mua Áo Thun Teelab hoặc đơn từ 400.000đ
  const hasTshirt = items.some((it) => {
    const itemName = String(it.name || it.productName || it.slug || '').toLowerCase();
    return itemName.includes('thun') || itemName.includes('teelab') || itemName.includes('tee');
  });
  if (hasTshirt || amount >= 400000) {
    unlocked.push('TEELAB20');
  }

  return unlocked;
}

const EMPTY_PROFILE = {
  fullname: '',
  username: '',
  email: '',
  phone: '',
  birthday: '',
  gender: '',
  defaultAddress: '',
  avatar: '',
  addresses: [],
};

export function ShopStateProvider({ children }) {
  const { user, isAuthenticated, setUser } = useAuth();
  const userKey = user?.id || user?.username || null;
  const cartStorageKey = userKey ? `qlshop_cart_items_${userKey}` : 'qlshop_cart_items';
  const ordersStorageKey = userKey ? `qlshop_client_orders_${userKey}` : 'qlshop_client_orders';

  // 1. Giỏ hàng (đồng bộ theo từng user + lưu trong localStorage + đồng bộ API Backend)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const initUserRaw =
        sessionStorage.getItem('qlshop_user') || localStorage.getItem('qlshop_user');
      const initUser = initUserRaw ? JSON.parse(initUserRaw) : null;
      const initKey = initUser?.id || initUser?.username;
      const perUserSaved = initKey
        ? localStorage.getItem(`qlshop_cart_items_${initKey}`)
        : null;
      if (perUserSaved) return JSON.parse(perUserSaved);
      const saved = localStorage.getItem('qlshop_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Lưu giỏ hàng ra localStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      if (isAuthenticated && userKey) {
        const serialized = JSON.stringify(cartItems);
        localStorage.setItem(cartStorageKey, serialized);
        localStorage.setItem('qlshop_cart_items', serialized);
      } else if (!isAuthenticated) {
        localStorage.removeItem('qlshop_cart_items');
      }
    } catch (e) {
      console.warn('Lỗi lưu giỏ hàng vào localStorage:', e);
    }
  }, [cartItems, isAuthenticated, userKey, cartStorageKey]);

  // Tải & đồng bộ giỏ hàng của User từ localStorage + API Backend khi đăng nhập hoặc F5
  const fetchUserCart = useCallback(async () => {
    if (!isAuthenticated || !userKey) {
      setCartItems([]);
      return;
    }

    let localItems = [];
    try {
      const rawUserCart = localStorage.getItem(`qlshop_cart_items_${userKey}`);
      const rawLegacyCart = localStorage.getItem('qlshop_cart_items');
      if (rawUserCart !== null) {
        localItems = JSON.parse(rawUserCart) || [];
      } else if (rawLegacyCart !== null) {
        localItems = JSON.parse(rawLegacyCart) || [];
      }
    } catch {
      localItems = [];
    }

    if (!user?.id) {
      setCartItems(localItems);
      return;
    }

    try {
      const res = await shopCartService.getCartByUserId(user.id);
      const serverItems = Array.isArray(res?.items) ? res.items : [];

      if (serverItems.length > 0 && localItems.length === 0) {
        const mappedFromServer = serverItems.map((it) => {
          const size = it.size || 'L';
          const color = it.color || 'Đen';
          return {
            id: `cart-${it.productId}-${size}-${color}`,
            cartItemId: it.id,
            productId: it.productId,
            variantId: it.variantId || null,
            slug: it.productSlug || `san-pham-${it.productId}`,
            name: it.productName || `Sản phẩm #${it.productId}`,
            image: it.productImage || '/images/products/1.jpg',
            brandName: it.brandName || 'QLShop Fashion',
            size,
            color,
            unitPrice: Number(it.price) || 0,
            originalPrice: Number(it.originalPrice || it.price) || 0,
            quantity: Number(it.quantity) || 1,
            stockQuantity: 20,
            selected: true,
          };
        });
        setCartItems(mappedFromServer);
      } else {
        // Gắn cartItemId từ server vào localItems (nếu khớp productId)
        const merged = localItems.map((localIt) => {
          const matchedServer = serverItems.find(
            (s) => Number(s.productId) === Number(localIt.productId)
          );
          return matchedServer ? { ...localIt, cartItemId: matchedServer.id } : localIt;
        });
        setCartItems(merged);
      }
    } catch {
      setCartItems(localItems);
    }
  }, [isAuthenticated, userKey, user?.id]);

  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart]);

  // Đồng bộ tồn kho thực tế (Real-time Stock Sync) cho các sản phẩm đang nằm trong giỏ hàng
  const notifiedOutOfStockRef = useRef(new Set());
  const syncCartStockWithServer = useCallback(
    async (silent = false) => {
      if (!isAuthenticated) return;
      try {
        const res = await shopProductService.getAllProducts(0, 100);
        const productsList = Array.isArray(res) ? res : res?.content || [];
        if (productsList.length === 0) return;

        const newlyOutOfStockMessages = [];
        const reducedQtyMessages = [];

        setCartItems((prev) => {
          if (prev.length === 0) return prev;
          let hasChanges = false;

          const next = prev.map((cartIt) => {
            const matchedProd = productsList.find(
              (p) =>
                Number(p.id) === Number(cartIt.productId) ||
                (cartIt.slug && p.slug === cartIt.slug)
            );
            if (!matchedProd) return cartIt;

            const variants = Array.isArray(matchedProd.variants) ? matchedProd.variants : [];
            let matchedVar = null;
            if (cartIt.variantId) {
              matchedVar = variants.find((v) => Number(v.id) === Number(cartIt.variantId));
            }
            if (!matchedVar) {
              matchedVar = variants.find(
                (v) =>
                  (!cartIt.size || v.size === cartIt.size) &&
                  (!cartIt.color || v.color === cartIt.color)
              );
            }
            if (!matchedVar && variants.length > 0) {
              matchedVar = variants[0];
            }

            const liveStock = matchedVar
              ? Math.max(0, Number(matchedVar.stockQuantity) || 0)
              : variants.reduce((s, v) => s + Math.max(0, Number(v.stockQuantity) || 0), 0);

            const prevStock = cartIt.stockQuantity;
            const isNowOut = liveStock <= 0;

            // Nếu phân loại trong giỏ vừa bị hết hàng (0 chiếc)
            if (isNowOut) {
              if (!notifiedOutOfStockRef.current.has(cartIt.id)) {
                notifiedOutOfStockRef.current.add(cartIt.id);
                newlyOutOfStockMessages.push(
                  `Sản phẩm "${cartIt.name}" (${cartIt.color} - Size ${cartIt.size}) trong giỏ hàng của bạn vừa tạm hết hàng!`
                );
              }
              if (prevStock !== 0 || cartIt.selected || !cartIt.outOfStock) {
                hasChanges = true;
                return {
                  ...cartIt,
                  variantId: matchedVar?.id ?? cartIt.variantId,
                  stockQuantity: 0,
                  outOfStock: true,
                  selected: false, // Tự động bỏ chọn để không bị tính tiền nhầm
                };
              }
              return cartIt;
            }

            // Nếu có hàng trở lại (ví dụ Admin vừa nhập thêm kho)
            notifiedOutOfStockRef.current.delete(cartIt.id);
            let nextQty = Number(cartIt.quantity) || 1;
            if (nextQty > liveStock) {
              reducedQtyMessages.push(
                `Sản phẩm "${cartIt.name}" (${cartIt.color} - Size ${cartIt.size}) chỉ còn ${liveStock} chiếc trong kho, hệ thống đã tự điều chỉnh số lượng trong giỏ.`
              );
              nextQty = liveStock;
              hasChanges = true;
            }

            if (
              prevStock !== liveStock ||
              cartIt.outOfStock ||
              nextQty !== cartIt.quantity ||
              (matchedVar?.id && matchedVar.id !== cartIt.variantId)
            ) {
              hasChanges = true;
              return {
                ...cartIt,
                variantId: matchedVar?.id ?? cartIt.variantId,
                stockQuantity: liveStock,
                outOfStock: false,
                quantity: nextQty,
              };
            }

            return cartIt;
          });

          return hasChanges ? next : prev;
        });

        if (!silent) {
          newlyOutOfStockMessages.forEach((msg) => toast.warning(msg));
          reducedQtyMessages.forEach((msg) => toast.info(msg));
        }
      } catch {
        // Bỏ qua nếu mất kết nối tạm thời
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    syncCartStockWithServer(false);
    const onFocusOrUpdate = () => syncCartStockWithServer(false);
    window.addEventListener('focus', onFocusOrUpdate);
    window.addEventListener('qlshop:products-updated', onFocusOrUpdate);
    const intervalId = setInterval(() => syncCartStockWithServer(false), 15000);
    return () => {
      window.removeEventListener('focus', onFocusOrUpdate);
      window.removeEventListener('qlshop:products-updated', onFocusOrUpdate);
      clearInterval(intervalId);
    };
  }, [isAuthenticated, syncCartStockWithServer]);

  // Xóa sạch giỏ hàng khi đăng xuất
  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      setOrders([]);
      setProfile(EMPTY_PROFILE);
      setAppliedVoucherCode('');
      setServerDiscount(0);
      setRewardPopupVouchers([]);
      try {
        localStorage.removeItem('qlshop_cart_items');
      } catch (e) {
        console.warn(e);
      }
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // 2. Danh sách Voucher gốc từ Backend + Ví Voucher cá nhân của từng User
  const [catalogVouchers, setCatalogVouchers] = useState(DEFAULT_VOUCHER_CATALOG);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  const [serverDiscount, setServerDiscount] = useState(0);

  // State lưu các mã đã mở khóa và đã sử dụng của User hiện tại
  const [userVoucherWallet, setUserVoucherWallet] = useState({
    unlockedCodes: ['WELCOME50K'],
    usedCodes: [],
    welcomed: true,
  });

  // State hiển thị Popup / Toast nổi bật khi User vừa nhận được Voucher mới
  const [rewardPopupVouchers, setRewardPopupVouchers] = useState([]);
  const prevUserKeyRef = useRef(null);

  const fetchVouchers = useCallback(async () => {
    try {
      const res = await shopVoucherService.getAvailableVouchers(user?.id);
      const list = Array.isArray(res) ? res : res?.content || [];
      if (list.length > 0) {
        // Đồng bộ thông tin từ DB với catalog chuẩn
        const merged = list.map((v) => {
          const normCode = normalizeVoucherCode(v.code);
          const preset = DEFAULT_VOUCHER_CATALOG.find((d) => d.code === normCode);
          return {
            ...preset,
            ...v,
            code: normCode,
            backendCode: v.code,
            name: v.name || preset?.name || `Voucher ${normCode}`,
            description: v.description || preset?.description || '',
            unlockRule: preset?.unlockRule || 'Ưu đãi dành riêng cho tài khoản của bạn',
            badgeText:
              preset?.badgeText ||
              (v.discountType === 'PERCENTAGE'
                ? `GIẢM ${v.discountValue}%`
                : `GIẢM ${Math.round((v.discountValue || 0) / 1000)}K`),
          };
        });
        setCatalogVouchers((prev) => {
          const map = new Map(DEFAULT_VOUCHER_CATALOG.map((d) => [d.code, d]));
          merged.forEach((m) => map.set(m.code, m));
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.warn('Không thể tải voucher từ Backend, dùng danh mục mặc định:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // 3. Đơn hàng (kết nối API Backend + lưu dự phòng localStorage để F5 không bao giờ bị mất)
  const [orders, setOrders] = useState(() => {
    try {
      const initUserRaw =
        sessionStorage.getItem('qlshop_user') || localStorage.getItem('qlshop_user');
      const initUser = initUserRaw ? JSON.parse(initUserRaw) : null;
      const initKey = initUser?.id || initUser?.username;
      const perUserSaved = initKey
        ? localStorage.getItem(`qlshop_client_orders_${initKey}`)
        : null;
      if (perUserSaved) return JSON.parse(perUserSaved);
      const saved = localStorage.getItem('qlshop_client_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Tự động đồng bộ danh sách đơn hàng vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (!isAuthenticated || !userKey) return;
    try {
      const serialized = JSON.stringify(orders);
      localStorage.setItem(ordersStorageKey, serialized);
      localStorage.setItem('qlshop_client_orders', serialized);
    } catch (e) {
      console.warn('Lỗi lưu đơn hàng vào localStorage:', e);
    }
  }, [orders, isAuthenticated, userKey, ordersStorageKey]);

  // Tải đơn hàng của User từ API khi đã đăng nhập và gộp an toàn với đơn lưu cục bộ
  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) {
      if (!isAuthenticated) setOrders([]);
      return;
    }

    let cachedOrders = [];
    try {
      const rawUserOrders = localStorage.getItem(`qlshop_client_orders_${userKey}`);
      const rawLegacyOrders = localStorage.getItem('qlshop_client_orders');
      if (rawUserOrders) {
        cachedOrders = JSON.parse(rawUserOrders) || [];
      } else if (rawLegacyOrders) {
        cachedOrders = JSON.parse(rawLegacyOrders) || [];
      }
    } catch {
      cachedOrders = [];
    }

    setLoadingOrders(true);
    try {
      const res = await shopOrderService.getOrdersByUserId(user.id, 0, 50);
      const list = Array.isArray(res) ? res : res?.content || [];
      const formatted = list.map((o) => {
        // Tìm đơn tương ứng trong cache cục bộ để giữ nguyên ảnh/size/màu/phí ship nếu API thiếu
        const cachedMatch = cachedOrders.find(
          (c) => String(c.id) === String(o.id) || (o.orderCode && c.code === o.orderCode)
        );

        const rawItems = o.orderItems || o.items || [];
        const mappedItems = rawItems.map((it, idx) => {
          const cachedItem = cachedMatch?.items?.find(
            (ci) => Number(ci.productId) === Number(it.productId)
          );
          return {
            id: it.id || idx + 1,
            productId: it.productId,
            slug: it.productSlug || it.slug || cachedItem?.slug || `san-pham-${it.productId}`,
            name:
              it.productName ||
              it.name ||
              cachedItem?.name ||
              `Sản phẩm #${it.productId}`,
            image:
              it.productImage ||
              it.image ||
              cachedItem?.image ||
              '/images/products/1.jpg',
            size: it.size || cachedItem?.size || 'L',
            color: it.color || cachedItem?.color || 'Đen',
            unitPrice: Number(it.price ?? it.unitPrice ?? cachedItem?.unitPrice ?? 0),
            quantity: Number(it.quantity ?? cachedItem?.quantity ?? 1),
          };
        });

        const computedItemsSubtotal = mappedItems.reduce(
          (sum, it) => sum + it.unitPrice * it.quantity,
          0
        );
        const discountVal = Number(o.discountAmount ?? cachedMatch?.discount ?? 0);
        const totalVal = Number(o.totalAmount ?? cachedMatch?.totalAmount ?? 0);
        const subtotalVal =
          computedItemsSubtotal > 0
            ? computedItemsSubtotal
            : totalVal + discountVal;
        const shippingFeeVal =
          cachedMatch?.shippingFee !== undefined
            ? Number(cachedMatch.shippingFee)
            : subtotalVal === 0 || subtotalVal >= FREE_SHIPPING_THRESHOLD
            ? 0
            : BASE_SHIPPING_FEE;

        return {
          id: o.id,
          code: o.orderCode || cachedMatch?.code || `QL-${o.id}`,
          createdAt: o.createdAt
            ? new Date(o.createdAt).toLocaleString('vi-VN')
            : cachedMatch?.createdAt || 'Mới tạo',
          status: o.status || 'PENDING',
          paymentMethod: o.paymentMethod || cachedMatch?.paymentMethod || 'COD',
          paymentMethodLabel:
            (o.paymentMethod || cachedMatch?.paymentMethod) === 'BANK_TRANSFER'
              ? 'Chuyển khoản VietQR'
              : 'Thanh toán khi nhận hàng (COD)',
          paymentStatus: cachedMatch?.paymentStatus || 'UNPAID',
          paymentStatusLabel:
            o.status === 'CANCELLED'
              ? 'Đã hủy đơn'
              : o.status === 'COMPLETED'
              ? 'Đã thanh toán'
              : 'Chờ giao hàng',
          recipientName:
            o.receiverName ||
            o.recipientName ||
            cachedMatch?.recipientName ||
            user.name ||
            'Khách hàng',
          recipientPhone:
            o.receiverPhone ||
            o.recipientPhone ||
            cachedMatch?.recipientPhone ||
            user.phone ||
            '',
          recipientEmail: cachedMatch?.recipientEmail || user.email || '',
          shippingAddress: o.shippingAddress || cachedMatch?.shippingAddress || '',
          note: o.note ?? cachedMatch?.note ?? '',
          subtotal: subtotalVal,
          shippingFee: shippingFeeVal,
          discount: discountVal,
          voucherCode: o.voucherCode
            ? normalizeVoucherCode(o.voucherCode)
            : cachedMatch?.voucherCode || '',
          totalAmount: totalVal,
          items: mappedItems.length > 0 ? mappedItems : cachedMatch?.items || [],
          timeline: [
            {
              step: 'ORDERED',
              label: 'Đặt hàng thành công',
              time: o.createdAt
                ? new Date(o.createdAt).toLocaleString('vi-VN')
                : cachedMatch?.createdAt || 'Đã ghi nhận',
              done: true,
            },
            {
              step: 'CONFIRMED',
              label: 'Cửa hàng đã xác nhận',
              time: o.status !== 'PENDING' ? 'Đã duyệt' : 'Đang xử lý',
              done:
                o.status === 'CONFIRMED' ||
                o.status === 'SHIPPING' ||
                o.status === 'COMPLETED',
            },
            {
              step: 'SHIPPING',
              label: 'Đang giao hàng',
              time:
                o.status === 'SHIPPING' || o.status === 'COMPLETED'
                  ? 'Đang vận chuyển'
                  : '—',
              done: o.status === 'SHIPPING' || o.status === 'COMPLETED',
            },
            {
              step: 'COMPLETED',
              label: 'Giao hàng thành công',
              time: o.status === 'COMPLETED' ? 'Hoàn tất' : '—',
              done: o.status === 'COMPLETED',
            },
          ],
        };
      });

      // Giữ lại cả các đơn hàng cục bộ (mã bắt đầu bằng DH...) nếu trước đó tạo khi ngoại tuyến
      const serverIds = new Set(formatted.map((f) => String(f.id)));
      const localOnlyOrders = cachedOrders.filter(
        (co) => !serverIds.has(String(co.id)) && String(co.id).startsWith('DH')
      );

      const mergedOrders = [...formatted, ...localOnlyOrders];
      setOrders(mergedOrders);
    } catch (err) {
      console.warn('Lỗi tải đơn hàng của người dùng, dùng dữ liệu đã lưu:', err);
      if (cachedOrders.length > 0) {
        setOrders(cachedOrders);
      }
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.id, user?.name, user?.phone, user?.email, isAuthenticated, userKey]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Khởi tạo & đồng bộ Ví Voucher cá nhân theo từng tài khoản (userKey) và lịch sử đơn hàng
  useEffect(() => {
    if (!isAuthenticated || !userKey) {
      setUserVoucherWallet({ unlockedCodes: [], usedCodes: [], welcomed: true });
      prevUserKeyRef.current = null;
      return;
    }

    const storageKey = `qlshop_voucher_wallet_${userKey}`;
    let savedWallet = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) savedWallet = JSON.parse(raw);
    } catch {
      savedWallet = null;
    }

    // Mặc định khi mới đăng ký đều có WELCOME50K (kết hợp đồng bộ từ user.unlockedVouchers của Backend)
    const serverUnlocked = user?.unlockedVouchers
      ? String(user.unlockedVouchers)
          .split(',')
          .map((c) => normalizeVoucherCode(c))
          .filter(Boolean)
      : [];
    const serverUsed = user?.usedVouchers
      ? String(user.usedVouchers)
          .split(',')
          .map((c) => normalizeVoucherCode(c))
          .filter(Boolean)
      : [];

    const unlockedSet = new Set([
      ...(savedWallet?.unlockedCodes || ['WELCOME50K']),
      ...serverUnlocked,
    ]);
    unlockedSet.add('WELCOME50K');

    const usedSet = new Set([...(savedWallet?.usedCodes || []), ...serverUsed]);

    // Quét lịch sử đơn hàng thực tế của user để mở khóa các mã đã đạt điều kiện và đánh dấu mã đã dùng
    orders.forEach((ord) => {
      if (ord.status !== 'CANCELLED') {
        const codesFromOrder = evaluateOrderUnlockedCodes(ord);
        codesFromOrder.forEach((c) => unlockedSet.add(c));
        if (ord.voucherCode) {
          usedSet.add(normalizeVoucherCode(ord.voucherCode));
        }
      }
    });

    const isBrandNewWallet = !savedWallet;
    const nextWallet = {
      unlockedCodes: Array.from(unlockedSet),
      usedCodes: Array.from(usedSet),
      welcomed: true,
    };

    setUserVoucherWallet(nextWallet);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextWallet));
    } catch (e) {
      console.warn(e);
    }

    // Nếu tài khoản mới vừa đăng ký (chưa từng mở ví và chưa có đơn hàng nào), hiện thông báo tặng WELCOME50K
    if (isBrandNewWallet && orders.length === 0 && prevUserKeyRef.current !== userKey) {
      const welcomeVoucher =
        catalogVouchers.find((v) => normalizeVoucherCode(v.code) === 'WELCOME50K') ||
        DEFAULT_VOUCHER_CATALOG[0];
      if (welcomeVoucher) {
        setRewardPopupVouchers([
          {
            ...welcomeVoucher,
            rewardReason: 'Chào mừng thành viên mới đăng ký tài khoản QLShop!',
          },
        ]);
      }
    }
    prevUserKeyRef.current = userKey;
  }, [isAuthenticated, userKey, orders, catalogVouchers]);

  // Danh sách Voucher HIỆN CÓ của riêng tài khoản đang đăng nhập (chỉ hiện các mã đã mở khóa & chưa dùng)
  const vouchers = useMemo(() => {
    if (!isAuthenticated || !userKey) return [];
    const unlockedSet = new Set(
      (userVoucherWallet.unlockedCodes || []).map((c) => normalizeVoucherCode(c))
    );
    const usedSet = new Set(
      (userVoucherWallet.usedCodes || []).map((c) => normalizeVoucherCode(c))
    );

    return catalogVouchers.filter((v) => {
      const norm = normalizeVoucherCode(v.code);
      return unlockedSet.has(norm) && !usedSet.has(norm);
    });
  }, [isAuthenticated, userKey, catalogVouchers, userVoucherWallet]);

  // 4. Thông tin cá nhân Profile
  const [profile, setProfile] = useState(() => {
    try {
      const token =
        sessionStorage.getItem('qlshop_token') || localStorage.getItem('qlshop_token');
      const savedUser =
        sessionStorage.getItem('qlshop_user') || localStorage.getItem('qlshop_user');
      if (token && savedUser) {
        const u = JSON.parse(savedUser);
        return {
          ...EMPTY_PROFILE,
          id: u.id,
          username: u.username || '',
          fullname: u.fullname || u.name || u.username || '',
          email: u.email || '',
          phone: u.phone || '',
          gender: u.gender || '',
          defaultAddress: u.address || '',
          avatar: u.avatar || '',
        };
      }
      return EMPTY_PROFILE;
    } catch {
      return EMPTY_PROFILE;
    }
  });

  useEffect(() => {
    if (user && isAuthenticated) {
      setProfile((prev) => ({
        ...EMPTY_PROFILE,
        ...prev,
        id: user.id,
        username: user.username || prev.username || '',
        fullname: user.fullname || user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || prev.gender || '',
        defaultAddress: user.address || prev.defaultAddress || '',
        avatar: user.avatar || prev.avatar || '',
      }));
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

  // Thêm sản phẩm vào giỏ (Cập nhật tức thì giao diện + đồng bộ ngầm với API Backend)
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
    const variantId = variant?.id || product?.variants?.[0]?.id || null;
    const stockQuantity = variant ? Number(variant.stockQuantity) || 20 : 20;
    const itemId = `cart-${product.id}-${size || 'F'}-${color || 'Default'}`;
    const brandName = product.brandName || product.brand?.name || 'QLShop Fashion';
    const clampedQty = Math.max(1, Math.min(stockQuantity, Number(quantity) || 1));

    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === itemId);
      if (existing) {
        return prev.map((it) =>
          it.id === itemId
            ? {
                ...it,
                quantity: Math.min(stockQuantity, it.quantity + clampedQty),
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
          quantity: clampedQty,
          stockQuantity,
          selected: true,
        },
        ...prev,
      ];
    });

    // Đồng bộ ngầm lên Backend API Cart
    if (user?.id && product?.id) {
      shopCartService
        .addItemToCart(user.id, {
          productId: Number(product.id),
          quantity: clampedQty,
        })
        .then((savedItem) => {
          if (savedItem?.id) {
            setCartItems((prev) =>
              prev.map((it) =>
                it.id === itemId ? { ...it, cartItemId: savedItem.id } : it
              )
            );
          }
        })
        .catch(() => {});
    }

    toast.success(`Đã thêm "${product.name}" (${color} - ${size}) vào giỏ hàng!`);
    return itemId;
  };

  const updateCartQuantity = (itemId, nextQuantity) => {
    const targetItem = cartItems.find((item) => item.id === itemId);
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const max = item.stockQuantity || 99;
        const clamped = Math.max(1, Math.min(max, Number(nextQuantity) || 1));
        return { ...item, quantity: clamped };
      })
    );

    if (user?.id && targetItem?.cartItemId) {
      const diff = (Number(nextQuantity) || 1) - (Number(targetItem.quantity) || 1);
      if (diff === 1) {
        shopCartService.increaseItemQuantity(user.id, targetItem.cartItemId).catch(() => {});
      } else if (diff === -1 && Number(targetItem.quantity) > 1) {
        shopCartService.decreaseItemQuantity(user.id, targetItem.cartItemId).catch(() => {});
      }
    }
  };

  const removeCartItem = (itemId) => {
    const targetItem = cartItems.find((item) => item.id === itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    if (user?.id && targetItem?.cartItemId) {
      shopCartService.removeItemFromCart(user.id, targetItem.cartItemId).catch(() => {});
    }
    toast.info('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const clearSelectedCartItems = () => {
    const selectedToRemove = cartItems.filter((item) => item.selected);
    setCartItems((prev) => prev.filter((item) => !item.selected));
    if (user?.id) {
      selectedToRemove.forEach((it) => {
        if (it.cartItemId) {
          shopCartService.removeItemFromCart(user.id, it.cartItemId).catch(() => {});
        }
      });
    }
  };

  const clearAllCart = () => {
    setCartItems([]);
    setAppliedVoucherCode('');
    setServerDiscount(0);
    if (user?.id) {
      shopCartService.clearUserCart(user.id).catch(() => {});
    }
  };

  const toggleSelectCartItem = (itemId) => {
    const target = cartItems.find((item) => item.id === itemId);
    if (target && (target.outOfStock || Number(target.stockQuantity) <= 0)) {
      toast.warning(
        `Sản phẩm "${target.name}" (${target.color} - Size ${target.size}) hiện đang tạm hết hàng, không thể chọn thanh toán!`
      );
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAllCart = (checked) => {
    setCartItems((prev) =>
      prev.map((item) => {
        const isOut = item.outOfStock || Number(item.stockQuantity) <= 0;
        return { ...item, selected: isOut ? false : Boolean(checked) };
      })
    );
  };

  // Tính toán tóm tắt giỏ hàng (Bỏ qua các sản phẩm bị tạm hết hàng)
  const cartSummary = useMemo(() => {
    const totalCount = cartItems.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const outOfStockItems = cartItems.filter(
      (it) => it.outOfStock || Number(it.stockQuantity) <= 0
    );
    const availableItems = cartItems.filter(
      (it) => !it.outOfStock && Number(it.stockQuantity ?? 20) > 0
    );
    const selectedItems = availableItems.filter((it) => it.selected);
    const selectedCount = selectedItems.reduce(
      (sum, it) => sum + (Number(it.quantity) || 0),
      0
    );
    const subtotal = selectedItems.reduce(
      (sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 0),
      0
    );

    const activeVoucher =
      vouchers.find(
        (v) => normalizeVoucherCode(v.code) === normalizeVoucherCode(appliedVoucherCode)
      ) || null;

    const discount = activeVoucher
      ? serverDiscount > 0
        ? serverDiscount
        : calculateVoucherDiscount(activeVoucher, subtotal)
      : 0;

    const shippingFee =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_FEE;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);
    const allSelected =
      availableItems.length > 0 && selectedItems.length === availableItems.length;

    return {
      totalCount,
      selectedItems,
      outOfStockItems,
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

  // Áp dụng mã giảm giá (chỉ cho phép áp dụng mã mà tài khoản đã sở hữu & chưa dùng)
  const applyVoucher = async (rawCode) => {
    const clean = normalizeVoucherCode(rawCode);
    if (!clean) {
      setAppliedVoucherCode('');
      setServerDiscount(0);
      return { ok: true, message: 'Đã gỡ mã giảm giá.' };
    }

    // Kiểm tra xem tài khoản đã sở hữu voucher này chưa
    const ownedVoucher = vouchers.find((v) => normalizeVoucherCode(v.code) === clean);
    if (!ownedVoucher) {
      const alreadyUsed = (userVoucherWallet.usedCodes || []).includes(clean);
      const msg = alreadyUsed
        ? `Bạn đã sử dụng mã "${clean}" ở đơn hàng trước rồi!`
        : `Tài khoản của bạn chưa sở hữu mã "${clean}". Hãy đặt đơn từ 99K hoặc mua Áo Polo để nhận mã!`;
      toast.error(msg);
      return { ok: false, message: msg };
    }

    // Kiểm tra giá trị đơn tối thiểu
    const minOrder = Number(ownedVoucher.minOrderValue || 0);
    if (cartSummary.subtotal < minOrder) {
      const minMsg = `Đơn hàng cần đạt tối thiểu ${new Intl.NumberFormat('vi-VN').format(
        minOrder
      )}đ để áp dụng mã ${clean}!`;
      toast.warning(minMsg);
      return { ok: false, message: minMsg };
    }

    try {
      const codeForServer = ownedVoucher.backendCode || clean;
      const res = await shopVoucherService.applyVoucher({
        code: codeForServer,
        orderAmount: cartSummary.subtotal,
        userId: user?.id,
      });

      if (res && res.valid) {
        setAppliedVoucherCode(clean);
        setServerDiscount(Number(res.discountAmount) || 0);
        toast.success(
          `Áp dụng thành công mã ${clean}! Giảm ${new Intl.NumberFormat('vi-VN').format(
            res.discountAmount
          )}đ`
        );
        return { ok: true, voucher: ownedVoucher, message: res.message || 'Mã giảm giá hợp lệ!' };
      }
    } catch {
      // Fallback tính toán trực tiếp từ voucher hợp lệ của user
    }

    const calculatedDiscount = calculateVoucherDiscount(ownedVoucher, cartSummary.subtotal);
    setAppliedVoucherCode(clean);
    setServerDiscount(calculatedDiscount);
    toast.success(
      `Đã áp dụng mã ${clean}! Giảm ${new Intl.NumberFormat('vi-VN').format(calculatedDiscount)}đ`
    );
    return {
      ok: true,
      voucher: ownedVoucher,
      message: `Áp dụng mã ${clean} thành công (-${new Intl.NumberFormat('vi-VN').format(
        calculatedDiscount
      )}đ)!`,
    };
  };

  // Kiểm tra và trao thưởng Voucher mới sau khi đặt hàng thành công
  const checkAndGrantOrderVouchers = useCallback(
    (placedOrder, usedCodeInOrder) => {
      if (!userKey) return;
      const storageKey = `qlshop_voucher_wallet_${userKey}`;
      const currentUnlocked = new Set(
        (userVoucherWallet.unlockedCodes || ['WELCOME50K']).map((c) => normalizeVoucherCode(c))
      );
      const currentUsed = new Set(
        (userVoucherWallet.usedCodes || []).map((c) => normalizeVoucherCode(c))
      );

      if (usedCodeInOrder) {
        currentUsed.add(normalizeVoucherCode(usedCodeInOrder));
      }

      const newlyEarnedList = [];
      const orderAmount = Math.max(
        Number(placedOrder.subtotal || 0),
        Number(placedOrder.totalAmount || 0)
      );
      const items = Array.isArray(placedOrder.items) ? placedOrder.items : [];

      // Điều kiện 1: Đặt mua Áo Polo Routine (hoặc đơn từ 300.000đ) -> Nhận POLO10 (Giảm 10% tối đa 40.000đ cho đơn từ 300.000đ)
      const boughtPolo = items.some((it) => {
        const n = String(it.name || it.productName || it.slug || '').toLowerCase();
        return n.includes('polo') || n.includes('routine');
      });
      if ((boughtPolo || orderAmount >= 300000) && !currentUnlocked.has('POLO10')) {
        currentUnlocked.add('POLO10');
        const vObj =
          catalogVouchers.find((v) => normalizeVoucherCode(v.code) === 'POLO10') ||
          DEFAULT_VOUCHER_CATALOG.find((v) => v.code === 'POLO10');
        if (vObj) {
          newlyEarnedList.push({
            ...vObj,
            code: 'POLO10',
            rewardReason: boughtPolo
              ? 'Đặt mua sản phẩm Áo Polo Routine!'
              : 'Đặt đơn hàng đạt mốc từ 300.000đ!',
          });
        }
      }

      // Điều kiện 2: Đặt mua Áo Khoác & Hoodie (hoặc đơn từ 350.000đ) -> Nhận HOODIE30K (Giảm 30.000đ cho đơn từ 350.000đ)
      const boughtHoodie = items.some((it) => {
        const n = String(it.name || it.productName || it.slug || '').toLowerCase();
        return (
          n.includes('hoodie') ||
          n.includes('khoác') ||
          n.includes('khoac') ||
          n.includes('sweater') ||
          n.includes('jacket') ||
          n.includes('bomber') ||
          n.includes('cardigan')
        );
      });
      if ((boughtHoodie || orderAmount >= 350000) && !currentUnlocked.has('HOODIE30K')) {
        currentUnlocked.add('HOODIE30K');
        const vObj =
          catalogVouchers.find((v) => normalizeVoucherCode(v.code) === 'HOODIE30K') ||
          DEFAULT_VOUCHER_CATALOG.find((v) => v.code === 'HOODIE30K');
        if (vObj) {
          newlyEarnedList.push({
            ...vObj,
            rewardReason: boughtHoodie
              ? 'Đặt mua sản phẩm Áo Khoác & Hoodie!'
              : 'Đặt đơn hàng đạt mốc từ 350.000đ!',
          });
        }
      }

      // Điều kiện 3: Đặt mua Áo Thun Teelab (hoặc đơn từ 400.000đ) -> Nhận TEELAB20 (Giảm 20% tối đa 60.000đ cho đơn từ 400.000đ)
      const boughtTee = items.some((it) => {
        const n = String(it.name || it.productName || it.slug || '').toLowerCase();
        return n.includes('thun') || n.includes('teelab') || n.includes('tee');
      });
      if ((boughtTee || orderAmount >= 400000) && !currentUnlocked.has('TEELAB20')) {
        currentUnlocked.add('TEELAB20');
        const vObj =
          catalogVouchers.find((v) => normalizeVoucherCode(v.code) === 'TEELAB20') ||
          DEFAULT_VOUCHER_CATALOG.find((v) => v.code === 'TEELAB20');
        if (vObj) {
          newlyEarnedList.push({
            ...vObj,
            rewardReason: boughtTee
              ? 'Đặt mua sản phẩm Áo Thun Teelab!'
              : 'Đặt đơn hàng đạt mốc từ 400.000đ!',
          });
        }
      }

      const updatedWallet = {
        unlockedCodes: Array.from(currentUnlocked),
        usedCodes: Array.from(currentUsed),
        welcomed: true,
      };
      setUserVoucherWallet(updatedWallet);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedWallet));
      } catch (e) {
        console.warn(e);
      }

      if (newlyEarnedList.length > 0) {
        setRewardPopupVouchers(newlyEarnedList);
        newlyEarnedList.forEach((v) => {
          toast.success(`🎁 Chúc mừng! Bạn vừa nhận được mã giảm giá ${v.code} (${v.name})!`);
        });
      }
    },
    [userKey, userVoucherWallet, catalogVouchers]
  );

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

    const activeVoucherObj = vouchers.find(
      (v) => normalizeVoucherCode(v.code) === normalizeVoucherCode(appliedVoucherCode)
    );
    const serverVoucherCode = activeVoucherObj?.backendCode || appliedVoucherCode || null;

    const orderPayload = {
      userId: user?.id || null,
      receiverName: recipientName.trim(),
      receiverPhone: recipientPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      note: note || '',
      voucherCode: serverVoucherCode,
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
      const orderedIds = new Set(itemsToOrder.map((it) => it.id));
      setCartItems((prev) => prev.filter((it) => !orderedIds.has(it.id)));

      // Kiểm tra & tặng Voucher mới cho khách hàng
      checkAndGrantOrderVouchers(newOrder, appliedVoucherCode);

      setAppliedVoucherCode('');
      setServerDiscount(0);
      window.dispatchEvent(new CustomEvent('qlshop:products-updated'));

      toast.success(`Đặt hàng thành công! Mã đơn hàng: #${orderCode}`);
      return newOrder;
    } catch (err) {
      console.error('Lỗi khi gửi đơn hàng lên Backend:', err);
      const serverMsg = err?.response?.data?.message || err?.message || '';
      // Nếu lỗi do hết hàng hoặc không đủ tồn kho (400 Bad Request), đồng bộ lại tồn kho giỏ hàng và báo ngay cho khách
      if (
        err?.response?.status === 400 ||
        serverMsg.includes('hết hàng') ||
        serverMsg.includes('chỉ còn')
      ) {
        await syncCartStockWithServer(true);
        toast.error(
          serverMsg ||
            'Một số sản phẩm trong giỏ hàng vừa hết hàng hoặc không đủ số lượng tồn kho!'
        );
        throw err;
      }
      const localId = `DH${Date.now()}`;
      const localOrder = {
        id: localId,
        code: `QL-${localId}`,
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'PENDING',
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
      const orderedIds = new Set(itemsToOrder.map((it) => it.id));
      setCartItems((prev) => prev.filter((it) => !orderedIds.has(it.id)));

      checkAndGrantOrderVouchers(localOrder, appliedVoucherCode);
      setAppliedVoucherCode('');
      setServerDiscount(0);

      toast.success('Đã lưu đơn hàng của bạn!');
      return localOrder;
    }
  };

  // Hủy đơn hàng
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
      window.dispatchEvent(new CustomEvent('qlshop:products-updated'));
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
      let updatedUserFromServer = null;
      if (user?.id) {
        updatedUserFromServer = await shopUserService.updateProfile(user.id, {
          ...profile,
          ...nextFields,
        });
      }

      setProfile((prev) => {
        const updated = {
          ...prev,
          ...nextFields,
          ...(updatedUserFromServer?.avatar ? { avatar: updatedUserFromServer.avatar } : {}),
        };
        localStorage.setItem('qlshop_profile', JSON.stringify(updated));
        return updated;
      });

      if (user) {
        const nextUser = {
          ...user,
          name: nextFields.fullname ?? user.name,
          fullname: nextFields.fullname ?? user.fullname,
          email: nextFields.email ?? user.email,
          phone: nextFields.phone ?? user.phone,
          gender: nextFields.gender ?? user.gender,
          address: nextFields.defaultAddress ?? user.address,
          avatar: nextFields.avatar ?? updatedUserFromServer?.avatar ?? user.avatar,
        };
        setUser?.(nextUser);
        sessionStorage.setItem('qlshop_user', JSON.stringify(nextUser));
        localStorage.setItem('qlshop_user', JSON.stringify(nextUser));
      }

      toast.success('Đã cập nhật hồ sơ cá nhân thành công!');
    } catch (err) {
      console.warn('Lỗi cập nhật hồ sơ:', err);
      setProfile((prev) => ({ ...prev, ...nextFields }));
      toast.success('Đã cập nhật thông tin!');
    }
  };

  // Tải lên và cập nhật ảnh đại diện
  const uploadProfileAvatar = async (file) => {
    if (!file) return null;
    try {
      const res = await shopUserService.uploadAvatar(user?.id, file);
      const avatarPath = res?.avatar || res?.url || '';

      if (avatarPath) {
        setProfile((prev) => {
          const updated = { ...prev, avatar: avatarPath };
          localStorage.setItem('qlshop_profile', JSON.stringify(updated));
          return updated;
        });

        if (user) {
          const nextUser = { ...user, avatar: avatarPath };
          setUser?.(nextUser);
          sessionStorage.setItem('qlshop_user', JSON.stringify(nextUser));
          localStorage.setItem('qlshop_user', JSON.stringify(nextUser));
        }

        toast.success('Cập nhật ảnh đại diện thành công!');
        return avatarPath;
      }
      return null;
    } catch (err) {
      console.error('Lỗi tải ảnh đại diện lên server:', err);
      toast.error(
        err.response?.data?.message ||
          'Không thể tải ảnh lên máy chủ. Vui lòng thử lại!'
      );
      throw err;
    }
  };

  const value = {
    cartItems,
    cartSummary,
    vouchers,
    catalogVouchers,
    userVoucherWallet,
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
    placeSimulatedOrder: placeOrder,
    cancelOrder,
    cancelOrderSimulated: cancelOrder,
    reorderToCart,
    profile,
    updateProfile,
    updateProfileSimulated: updateProfile,
    uploadProfileAvatar,
    demoSignedIn,
    setDemoSignedIn,
    fetchVouchers,
    fetchUserOrders,
    syncCartStockWithServer,
  };

  return (
    <ShopStateContext.Provider value={value}>
      {children}

      {/* =========================================================================
          TOAST / BANNER NỔI BẬT KHI NGƯỜI DÙNG VỪA NHẬN ĐƯỢC VOUCHER MỚI
          ========================================================================= */}
      {rewardPopupVouchers.length > 0 && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-emerald-950 via-zinc-900 to-zinc-950 p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Hiệu ứng ánh sáng nền */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />

            <button
              type="button"
              onClick={() => setRewardPopupVouchers([])}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30">
                <Gift className="h-7 w-7 stroke-[2.2]" />
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Phần thưởng Voucher mới
              </div>

              <h3 className="mt-2 text-xl font-black tracking-tight text-white">
                Chúc mừng bạn nhận được {rewardPopupVouchers.length} Mã Giảm Giá!
              </h3>
              <p className="mt-1 text-xs text-zinc-300">
                Voucher đã được tự động thêm vào Ví Voucher của bạn để dùng khi Thanh toán.
              </p>
            </div>

            {/* Danh sách thẻ vé Voucher vừa nhận */}
            <div className="relative z-10 mt-5 space-y-3">
              {rewardPopupVouchers.map((v) => (
                <div
                  key={v.code}
                  className="relative overflow-hidden rounded-2xl border border-amber-300/40 bg-gradient-to-r from-amber-50 to-white p-4 text-zinc-900 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1 text-xs font-black tracking-wider text-white shadow-2xs">
                          <Ticket className="h-3.5 w-3.5" />
                          {v.code}
                        </span>
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-900 ring-1 ring-amber-300">
                          {v.badgeText ||
                            (v.discountType === 'PERCENTAGE'
                              ? `GIẢM ${v.discountValue}%`
                              : `GIẢM ${new Intl.NumberFormat('vi-VN').format(
                                  v.discountValue || 0
                                )}Đ`)}
                        </span>
                      </div>

                      <p className="text-sm font-black text-zinc-900">{v.name}</p>
                      <p className="text-[11px] text-zinc-600">{v.description}</p>
                      {v.rewardReason && (
                        <p className="pt-1 text-[11px] font-bold text-emerald-700">
                          ✨ Lý do nhận: {v.rewardReason}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(v.code);
                        toast.success(`Đã sao chép mã ${v.code}!`);
                      }}
                      className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-zinc-700 shadow-2xs transition hover:border-emerald-500 hover:text-emerald-700"
                    >
                      <Copy className="h-3 w-3" />
                      Lưu mã
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-6">
              <button
                type="button"
                onClick={() => setRewardPopupVouchers([])}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:brightness-105"
              >
                <CheckCircle2 className="h-4 w-4" />
                Tuyệt vời! Đã nhận vào Ví Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </ShopStateContext.Provider>
  );
}

export function useShopState() {
  const ctx = useContext(ShopStateContext);
  if (!ctx) {
    throw new Error('useShopState phải được sử dụng bên trong ShopStateProvider');
  }
  return ctx;
}

export default ShopStateContext;
