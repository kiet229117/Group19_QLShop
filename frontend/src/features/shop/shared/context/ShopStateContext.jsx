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
import { cleanSavedAddress, validateShippingAddress, buildUserAddressBook } from '../utils/addressUtils';

const ShopStateContext = createContext(null);

const BASE_SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 499000;

// Chuẩn hóa mã voucher để POLO10 và AOPOLO10 luôn đồng nhất
export function normalizeVoucherCode(code) {
  const clean = String(code || '').trim().toUpperCase();
  if (clean === 'AOPOLO10') return 'POLO10';
  return clean;
}

// Kiểm tra xem voucher từ API có phải mã chào mừng thành viên mới không
export function isWelcomeVoucherFromApi(v) {
  if (!v) return false;
  const text = `${v.code || ''} ${v.name || ''} ${v.description || ''}`.toLowerCase();
  return (
    text.includes('welcome') ||
    text.includes('khách hàng mới') ||
    text.includes('khach hang moi') ||
    text.includes('thành viên mới') ||
    text.includes('tân thủ')
  );
}

// Tạo mô tả điều kiện nhận mã chuẩn từ dữ liệu API của từng Voucher
export function buildUnlockRuleFromApi(v) {
  if (!v) return '';
  if (v.unlockCondition) return v.unlockCondition;

  const minVal = Number(v.minOrderValue || 0);
  const minStr = minVal > 0 ? `${new Intl.NumberFormat('vi-VN').format(minVal)}đ` : '0đ';

  if (isWelcomeVoucherFromApi(v)) {
    return minVal > 0
      ? `Nhận ngay khi đăng ký tài khoản mới (Áp dụng đơn từ ${minStr})`
      : 'Nhận ngay khi đăng ký tài khoản mới';
  }

  const text = `${v.code || ''} ${v.name || ''} ${v.description || ''}`.toLowerCase();
  if (text.includes('polo') || text.includes('routine')) {
    return `Nhận khi đặt mua sản phẩm Áo Polo / Routine (Áp dụng đơn từ ${minStr})`;
  }
  if (text.includes('teelab') || text.includes('thun') || text.includes('tee')) {
    return `Nhận khi đặt mua sản phẩm Áo Thun / Teelab (Áp dụng đơn từ ${minStr})`;
  }
  if (
    text.includes('hoodie') ||
    text.includes('khoác') ||
    text.includes('khoac') ||
    text.includes('sweater') ||
    text.includes('jacket') ||
    text.includes('bomber') ||
    text.includes('cardigan')
  ) {
    return `Nhận khi đặt mua sản phẩm Áo Khoác & Hoodie (Áp dụng đơn từ ${minStr})`;
  }
  if (text.includes('sơ mi') || text.includes('so mi') || text.includes('oxford')) {
    return `Nhận khi đặt mua sản phẩm Áo Sơ Mi (Áp dụng đơn từ ${minStr})`;
  }
  if (minVal > 0) {
    return `Nhận khi đặt đơn hàng đạt từ ${minStr}`;
  }
  return v.description || 'Ưu đãi dành cho khách hàng đủ điều kiện';
}

// Chuẩn hóa đối tượng Voucher trả về từ API Backend
export function formatApiVoucher(v) {
  if (!v) return null;
  const normCode = normalizeVoucherCode(v.code);
  const discountVal = Number(v.discountValue || 0);
  const maxDiscount = Number(v.maxDiscountAmount || 0);
  const isPercent = v.discountType === 'PERCENTAGE' || v.discountType === 'PERCENT';

  const badgeText = isPercent
    ? maxDiscount > 0
      ? `Giảm ${discountVal}% (Tối đa ${new Intl.NumberFormat('vi-VN').format(maxDiscount)} đ)`
      : `Giảm ${discountVal}%`
    : `Giảm ${new Intl.NumberFormat('vi-VN').format(discountVal)} đ`;

  return {
    ...v,
    code: normCode,
    backendCode: v.code,
    name: v.name || `Voucher ${normCode}`,
    description: v.description || '',
    minOrderValue: Number(v.minOrderValue || 0),
    unlockRule: buildUnlockRuleFromApi(v),
    badgeText,
  };
}

// Kiểm tra 1 đơn hàng thỏa mãn điều kiện mở khóa những Voucher nào trong danh mục API
export function evaluateOrderAgainstApiCatalog(order, apiCatalog = []) {
  const unlocked = [];
  if (!order || order.status === 'CANCELLED' || !Array.isArray(apiCatalog)) return unlocked;

  const amount = Math.max(Number(order.subtotal || 0), Number(order.totalAmount || 0));
  const items = Array.isArray(order.items) ? order.items : [];

  const combinedItemsText = items
    .map((it) => `${it.name || ''} ${it.productName || ''} ${it.brandName || ''} ${it.slug || ''}`)
    .join(' ')
    .toLowerCase();

  const hasPolo = combinedItemsText.includes('polo') || combinedItemsText.includes('routine');
  const hasTee =
    combinedItemsText.includes('thun') ||
    combinedItemsText.includes('teelab') ||
    combinedItemsText.includes('tee');
  const hasHoodie =
    combinedItemsText.includes('hoodie') ||
    combinedItemsText.includes('khoác') ||
    combinedItemsText.includes('khoac') ||
    combinedItemsText.includes('sweater') ||
    combinedItemsText.includes('jacket') ||
    combinedItemsText.includes('bomber') ||
    combinedItemsText.includes('cardigan') ||
    combinedItemsText.includes('chống nắng');
  const hasShirt =
    combinedItemsText.includes('sơ mi') ||
    combinedItemsText.includes('so mi') ||
    combinedItemsText.includes('oxford');

  for (const v of apiCatalog) {
    if (isWelcomeVoucherFromApi(v)) continue;
    const normCode = normalizeVoucherCode(v.code);
    const vText = `${v.code || ''} ${v.name || ''} ${v.description || ''}`.toLowerCase();
    const minOrder = Number(v.minOrderValue || 0);

    const reqPolo = vText.includes('polo') || vText.includes('routine');
    const reqTee = vText.includes('teelab') || vText.includes('thun') || vText.includes('tee');
    const reqHoodie =
      vText.includes('hoodie') ||
      vText.includes('khoác') ||
      vText.includes('khoac') ||
      vText.includes('sweater') ||
      vText.includes('jacket') ||
      vText.includes('bomber') ||
      vText.includes('cardigan');
    const reqShirt = vText.includes('sơ mi') || vText.includes('so mi') || vText.includes('oxford');

    if (reqPolo) {
      if (hasPolo) unlocked.push(normCode);
    } else if (reqTee) {
      if (hasTee) unlocked.push(normCode);
    } else if (reqHoodie) {
      if (hasHoodie) unlocked.push(normCode);
    } else if (reqShirt) {
      if (hasShirt) unlocked.push(normCode);
    } else if (amount >= minOrder && amount > 0) {
      unlocked.push(normCode);
    }
  }

  if (unlocked.length === 0 && amount >= 300000) {
    const firstNonWelcome = apiCatalog.find((v) => !isWelcomeVoucherFromApi(v));
    if (firstNonWelcome) {
      unlocked.push(normalizeVoucherCode(firstNonWelcome.code));
    }
  }

  return unlocked;
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

  // 1. Giỏ hàng
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

  // Xóa sạch giỏ hàng & state khi đăng xuất
  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      setOrders([]);
      setProfile(EMPTY_PROFILE);
      setVouchers([]);
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

  // 2. Danh sách Voucher lấy chuẩn 100% từ API Backend
  // - catalogVouchers: Toàn bộ voucher đang chạy trên hệ thống (GET /api/vouchers/catalog)
  // - vouchers: Các voucher hiện có trong Ví cá nhân của User đang đăng nhập (GET /api/vouchers/available?userId=...)
  const [catalogVouchers, setCatalogVouchers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  const [serverDiscount, setServerDiscount] = useState(0);

  // State hiển thị Popup / Toast nổi bật khi User vừa nhận được Voucher mới
  const [rewardPopupVouchers, setRewardPopupVouchers] = useState([]);
  const prevUserKeyRef = useRef(null);

  // 3. Đơn hàng của User (GET /api/orders/user/{userId})
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      return [];
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
        subtotal: Number(o.totalAmount || 0) + Number(o.discountAmount || 0),
        shippingFee: 0,
        discount: Number(o.discountAmount || 0),
        voucherCode: o.voucherCode ? normalizeVoucherCode(o.voucherCode) : '',
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
      return formatted;
    } catch (err) {
      console.warn('Lỗi tải đơn hàng của người dùng:', err);
      return [];
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.id, user?.name, user?.phone, user?.email, isAuthenticated, userKey]);

  // Tập hợp mã voucher tài khoản này đã từng sử dụng (mỗi voucher chỉ dùng 1 lần và không được nhận lại)
  const usedVoucherCodes = useMemo(() => {
    const set = new Set();
    if (user?.usedVouchers) {
      String(user.usedVouchers)
        .split(',')
        .map((c) => normalizeVoucherCode(c))
        .filter(Boolean)
        .forEach((c) => set.add(c));
    }
    (orders || []).forEach((o) => {
      if (o.voucherCode && o.status !== 'CANCELLED') {
        set.add(normalizeVoucherCode(o.voucherCode));
      }
    });
    return set;
  }, [user?.usedVouchers, orders]);

  // Tải danh mục Voucher hệ thống & Ví Voucher khả dụng của User trực tiếp từ API Backend
  const fetchVouchers = useCallback(async () => {
    try {
      // 1. Lấy danh mục toàn bộ voucher đang chạy từ API (GET /api/vouchers/catalog)
      let rawCatalog = [];
      try {
        const catRes = await shopVoucherService.getCatalogVouchers();
        rawCatalog = Array.isArray(catRes) ? catRes : catRes?.content || [];
      } catch {
        // Nếu Backend chưa restart có endpoint /catalog thì lấy tạm từ /available không truyền userId
        try {
          const fallbackRes = await shopVoucherService.getAvailableVouchers();
          rawCatalog = Array.isArray(fallbackRes) ? fallbackRes : fallbackRes?.content || [];
        } catch {
          rawCatalog = [];
        }
      }

      const formattedCatalog = rawCatalog.map(formatApiVoucher).filter(Boolean);
      setCatalogVouchers(formattedCatalog);

      // 2. Nếu chưa đăng nhập -> không có voucher cá nhân
      if (!isAuthenticated || !user?.id) {
        setVouchers([]);
        return;
      }

      // 3. Lấy danh sách voucher HIỆN CÓ của riêng tài khoản từ API (GET /api/vouchers/available?userId=...)
      const userRes = await shopVoucherService.getAvailableVouchers(user.id);
      const rawUserVouchers = Array.isArray(userRes) ? userRes : userRes?.content || [];
      const formattedUserVouchers = rawUserVouchers.map(formatApiVoucher).filter(Boolean);

      // Nếu Backend đã lọc theo điều kiện đơn hàng thì dùng trực tiếp kết quả API
      setVouchers(formattedUserVouchers);

      // Cập nhật catalogVouchers nếu catalog rỗng mà userVouchers có dữ liệu
      if (formattedCatalog.length === 0 && formattedUserVouchers.length > 0) {
        setCatalogVouchers(formattedUserVouchers);
      }
    } catch (err) {
      console.warn('Không thể tải voucher từ API Backend:', err);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Xóa cache ví voucher cũ trong localStorage (nếu có từ phiên trước) và thông báo mã Welcome cho tài khoản mới
  useEffect(() => {
    if (!isAuthenticated || !userKey) {
      prevUserKeyRef.current = null;
      return;
    }

    try {
      localStorage.removeItem(`qlshop_voucher_wallet_${userKey}`);
    } catch {
      // ignore
    }

    const welcomeNotifiedKey = `qlshop_welcome_notified_${userKey}`;
    const alreadyNotified = localStorage.getItem(welcomeNotifiedKey);

    if (!alreadyNotified && orders.length === 0 && vouchers.length === 1 && prevUserKeyRef.current !== userKey) {
      const welcomeVoucher = vouchers.find((v) => isWelcomeVoucherFromApi(v));
      if (welcomeVoucher) {
        setRewardPopupVouchers([
          {
            ...welcomeVoucher,
            rewardReason: 'Tặng ngay khi đăng ký tài khoản mới tại QLShop!',
          },
        ]);
        try {
          localStorage.setItem(welcomeNotifiedKey, '1');
        } catch {
          // ignore
        }
      }
    }
    prevUserKeyRef.current = userKey;
  }, [isAuthenticated, userKey, orders.length, vouchers]);

  // 4. Thông tin cá nhân Profile
  const [profile, setProfile] = useState(() => {
    try {
      const token =
        sessionStorage.getItem('qlshop_token') || localStorage.getItem('qlshop_token');
      const savedUser =
        sessionStorage.getItem('qlshop_user') || localStorage.getItem('qlshop_user');
      if (token && savedUser) {
        const u = JSON.parse(savedUser);
        const initAddr = cleanSavedAddress(u.address);
        return {
          ...EMPTY_PROFILE,
          id: u.id,
          username: u.username || '',
          fullname: u.fullname || u.name || u.username || '',
          email: u.email || '',
          phone: u.phone || '',
          gender: u.gender || '',
          defaultAddress: initAddr,
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
      const cleanUserAddr = cleanSavedAddress(user.address);
      const userKey = user.id || user.username;
      let savedExtra = [];
      try {
        const raw = localStorage.getItem(`qlshop_saved_addresses_${userKey}`);
        if (raw) savedExtra = JSON.parse(raw);
      } catch {
        savedExtra = [];
      }
      const builtAddresses = buildUserAddressBook(cleanUserAddr, user, orders, savedExtra);

      setProfile((prev) => ({
        ...EMPTY_PROFILE,
        ...(prev.id === user.id ? prev : {}),
        id: user.id,
        username: user.username || '',
        fullname: user.fullname || user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        defaultAddress: cleanUserAddr,
        avatar: user.avatar || '',
        addresses: builtAddresses,
      }));
    } else {
      setProfile(EMPTY_PROFILE);
      try {
        localStorage.removeItem('qlshop_profile');
      } catch (e) {
        console.warn(e);
      }
    }
  }, [user, isAuthenticated, orders]);

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
    const variant =
      (product.variants || []).find(
        (v) => (!size || v.size === size) && (!color || v.color === color)
      ) ||
      (product.variants || [])[0] ||
      null;
    const variantId = variant?.id || null;
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

  // Áp dụng mã giảm giá chuẩn qua API Backend (POST /api/vouchers/apply)
  const applyVoucher = async (rawCode) => {
    const clean = normalizeVoucherCode(rawCode);
    if (!clean) {
      setAppliedVoucherCode('');
      setServerDiscount(0);
      return { ok: true, message: 'Đã gỡ mã giảm giá.' };
    }

    // Kiểm tra xem mã này tài khoản đã từng sử dụng chưa (mỗi tài khoản chỉ được dùng 1 lần)
    if (usedVoucherCodes.has(clean)) {
      const msg = `Bạn đã sử dụng mã giảm giá "${clean}" ở đơn hàng trước rồi! Mỗi tài khoản chỉ được sử dụng mã này 1 lần duy nhất.`;
      toast.error(msg);
      return { ok: false, message: msg };
    }

    // Kiểm tra xem tài khoản đã sở hữu voucher này trong danh sách từ API chưa
    const ownedVoucher = vouchers.find((v) => normalizeVoucherCode(v.code) === clean);
    if (!ownedVoucher) {
      const catalogMatch = catalogVouchers.find((v) => normalizeVoucherCode(v.code) === clean);
      const msg = catalogMatch
        ? `Tài khoản của bạn chưa đủ điều kiện nhận mã "${clean}" (${catalogMatch.unlockRule}).`
        : `Mã giảm giá "${clean}" không có trong Ví Voucher của bạn hoặc đã được sử dụng!`;
      toast.error(msg);
      return { ok: false, message: msg };
    }

    // Kiểm tra giá trị đơn tối thiểu theo dữ liệu API
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
    } catch (err) {
      const apiErrMsg = err?.response?.data?.message;
      if (apiErrMsg) {
        toast.error(apiErrMsg);
        return { ok: false, message: apiErrMsg };
      }
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

  // 5. ĐẶT HÀNG THỰC TẾ QUA API (POST /api/orders) & NHẬN VOUCHER MỚI TỪ API KHI ĐỦ ĐIỀU KIỆN
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

    const cleanName = String(recipientName || '').trim();
    const cleanPhone = String(recipientPhone || '').replace(/\s+/g, '');
    const cleanAddress = String(shippingAddress || '').trim();

    if (!cleanName || cleanName.length < 2) {
      toast.error('Vui lòng nhập đầy đủ họ và tên người nhận hàng!');
      throw new Error('Chưa nhập họ tên người nhận');
    }

    if (!cleanPhone || !/^(0[35789])[0-9]{8}$/.test(cleanPhone)) {
      toast.error(
        'Số điện thoại nhận hàng không hợp lệ! Vui lòng nhập đúng 10 chữ số (bắt đầu bằng 03, 05, 07, 08, 09).'
      );
      throw new Error('Số điện thoại không hợp lệ');
    }

    const addressError = validateShippingAddress(cleanAddress);
    if (addressError) {
      toast.error(addressError, 'Chưa nhập địa chỉ nhận hàng');
      throw new Error(addressError);
    }

    const activeVoucherObj = vouchers.find(
      (v) => normalizeVoucherCode(v.code) === normalizeVoucherCode(appliedVoucherCode)
    );
    const serverVoucherCode = activeVoucherObj?.backendCode || appliedVoucherCode || null;

    const orderPayload = {
      userId: user?.id || null,
      receiverName: cleanName,
      receiverPhone: cleanPhone,
      shippingAddress: cleanAddress,
      note: note || '',
      voucherCode: serverVoucherCode,
      items: itemsToOrder.map((it) => ({
        productId: Number(it.productId),
        variantId: it.variantId ? Number(it.variantId) : null,
        quantity: Number(it.quantity) || 1,
      })),
    };

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
      totalAmount: backendOrder.totalAmount ?? cartSummary.totalAmount,
      items: itemsToOrder.map((it, idx) => ({
        id: idx + 1,
        productId: it.productId,
        slug: it.slug,
        name: it.name,
        brandName: it.brandName,
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
    setCartItems((prev) => prev.filter((it) => !it.selected));

    // Lấy danh sách Voucher mới vừa mở khóa trực tiếp từ response API Backend (newlyUnlockedVouchers)
    // Loại trừ bất kỳ mã nào đã từng sử dụng hoặc vừa sử dụng trong đơn này
    const currentUsedAndApplied = new Set(usedVoucherCodes);
    if (appliedVoucherCode) {
      currentUsedAndApplied.add(normalizeVoucherCode(appliedVoucherCode));
    }

    const apiNewlyUnlocked = Array.isArray(backendOrder.newlyUnlockedVouchers)
      ? backendOrder.newlyUnlockedVouchers
          .map(formatApiVoucher)
          .filter((v) => v && !currentUsedAndApplied.has(normalizeVoucherCode(v.code)))
      : [];

    if (apiNewlyUnlocked.length > 0) {
      const enriched = apiNewlyUnlocked.map((v) => ({
        ...v,
        rewardReason: v.unlockRule || 'Đơn hàng vừa đặt đã đủ điều kiện mở khóa ưu đãi!',
      }));
      setRewardPopupVouchers(enriched);
      enriched.forEach((v) => {
        toast.success(`🎁 Chúc mừng! Bạn đã đủ điều kiện và nhận được Voucher ${v.code} (${v.name})!`);
      });
    } else {
      // Nếu Backend chưa trả về newlyUnlockedVouchers, kiểm tra đối chiếu với danh sách từ API
      const prevOwnedCodes = new Set(vouchers.map((v) => normalizeVoucherCode(v.code)));
      const earnedCodes = evaluateOrderAgainstApiCatalog(newOrder, catalogVouchers);
      const newlyMatched = catalogVouchers
        .filter(
          (v) => {
            const norm = normalizeVoucherCode(v.code);
            return (
              earnedCodes.includes(norm) &&
              !prevOwnedCodes.has(norm) &&
              !currentUsedAndApplied.has(norm)
            );
          }
        )
        .map((v) => ({
          ...v,
          rewardReason: v.unlockRule || 'Đơn hàng vừa đặt đã đủ điều kiện mở khóa ưu đãi!',
        }));

      if (newlyMatched.length > 0) {
        setRewardPopupVouchers(newlyMatched);
        newlyMatched.forEach((v) => {
          toast.success(`🎁 Chúc mừng! Bạn đã đủ điều kiện và nhận được Voucher ${v.code} (${v.name})!`);
        });
      }
    }

    setAppliedVoucherCode('');
    setServerDiscount(0);

    // Đồng bộ lại Ví Voucher cá nhân trực tiếp từ API Backend
    await fetchVouchers();

    toast.success(`Đặt hàng thành công! Mã đơn hàng: #${orderCode}`);
    return newOrder;
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
      await fetchVouchers();
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

  // Cập nhật thông tin hồ sơ cá nhân đồng bộ trực tiếp với database (PUT /api/users/{id})
  const updateProfile = async (nextFields) => {
    try {
      let updatedUserFromServer = null;
      const targetAddress = nextFields.defaultAddress !== undefined ? nextFields.defaultAddress : nextFields.address;

      if (user?.id) {
        updatedUserFromServer = await shopUserService.updateProfile(user.id, {
          ...profile,
          ...nextFields,
          ...(targetAddress !== undefined ? { address: targetAddress } : {}),
        });
      }

      const userKey = user?.id || user?.username;
      const nextAddresses = nextFields.addresses;

      if (nextAddresses && userKey) {
        try {
          localStorage.setItem(`qlshop_saved_addresses_${userKey}`, JSON.stringify(nextAddresses));
        } catch (e) {
          console.warn('Lỗi lưu sổ địa chỉ vào localStorage:', e);
        }
      }

      setProfile((prev) => {
        const nextDefault = cleanSavedAddress(targetAddress !== undefined ? targetAddress : prev.defaultAddress);
        const baseAddresses = nextAddresses ?? prev.addresses ?? [];
        const builtAddresses = buildUserAddressBook(nextDefault, user, orders, baseAddresses);

        const updated = {
          ...prev,
          ...nextFields,
          defaultAddress: nextDefault,
          addresses: builtAddresses,
          ...(updatedUserFromServer?.avatar ? { avatar: updatedUserFromServer.avatar } : {}),
        };
        try {
          localStorage.setItem('qlshop_profile', JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
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
          address: targetAddress !== undefined ? targetAddress : user.address,
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
    usedVoucherCodes,
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
          POPUP / BANNER NỔI BẬT KHI NGƯỜI DÙNG ĐỦ ĐIỀU KIỆN NHẬN ĐƯỢC VOUCHER MỚI TỪ API
          ========================================================================= */}
      {rewardPopupVouchers.length > 0 && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-emerald-950 via-zinc-900 to-zinc-950 p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
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
                Phần thưởng Voucher từ hệ thống
              </div>

              <h3 className="mt-2 text-xl font-black tracking-tight text-white">
                Chúc mừng bạn nhận được {rewardPopupVouchers.length} Mã Giảm Giá!
              </h3>
              <p className="mt-1 text-xs text-zinc-300">
                Bạn đã đủ điều kiện nhận Voucher! Mã đã được lưu vào Ví Voucher của bạn để áp dụng khi Thanh toán.
              </p>
            </div>

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
                          {v.badgeText}
                        </span>
                      </div>

                      <p className="text-sm font-black text-zinc-900">{v.name}</p>
                      <p className="text-[11px] text-zinc-600">{v.description}</p>
                      {v.rewardReason && (
                        <p className="pt-1 text-[11px] font-bold text-emerald-700">
                          ✨ Điều kiện đạt được: {v.rewardReason}
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
                Tuyệt vời! Đã lưu vào Ví Voucher
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
