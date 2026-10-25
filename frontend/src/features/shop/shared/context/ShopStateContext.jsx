/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import {
  INITIAL_CART_ITEMS,
  INITIAL_ORDERS,
  INITIAL_USER_PROFILE,
  SHOP_VOUCHERS,
} from '../data/shopMockData';
import { SHOP_Brands_Map } from '../../products/services/shopCatalogLookups';
import { getProductPricing, getProductThumbnail } from '../utils/productUtils';

const ShopStateContext = createContext(null);

const BASE_SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 499000;

export function calculateVoucherDiscount(voucher, subtotal) {
  if (!voucher || subtotal <= 0 || subtotal < (voucher.minOrder || 0)) return 0;
  if (voucher.type === 'PERCENT') {
    const raw = Math.round((subtotal * voucher.value) / 100);
    return voucher.maxDiscount ? Math.min(raw, voucher.maxDiscount) : raw;
  }
  return Math.min(voucher.value, subtotal);
}

/**
 * Context quản lý toàn bộ state giao diện cục bộ của Client Shop:
 *  - Giỏ hàng (thêm, tăng/giảm số lượng, xóa, chọn từng dòng, chọn tất cả, áp mã giảm giá)
 *  - Đơn hàng (tạo đơn mô phỏng khi thanh toán, hủy đơn mô phỏng, mua lại vào giỏ)
 *  - Hồ sơ cá nhân & sổ địa chỉ (chỉnh sửa, lưu mô phỏng, đăng xuất/đăng nhập giao diện)
 * Hoàn toàn không thực hiện bất kỳ HTTP request nào.
 */
export function ShopStateProvider({ children }) {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('QLSHOP50');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [profile, setProfile] = useState(INITIAL_USER_PROFILE);
  const [demoSignedIn, setDemoSignedIn] = useState(true);

  // thêm sản phẩm vào giỏ hàng cục bộ
  const addToCart = (product, { size = 'L', color = 'Đen', quantity = 1 } = {}) => {
    if (!product) return null;
    const { currentPrice, originalPrice } = getProductPricing(product);
    const unitPrice = currentPrice ?? product.price ?? 0;
    const variant = (product.variants || []).find(
      (v) => (!size || v.size === size) && (!color || v.color === color)
    );
    const stockQuantity = variant ? Number(variant.stockQuantity) || 20 : 20;
    const itemId = `cart-${product.id}-${size || 'F'}-${color || 'Default'}`;
    const brandName =
      SHOP_Brands_Map.get(String(product.brandId))?.name || 'QLShop Fashion';

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
  };

  const clearSelectedCartItems = () => {
    setCartItems((prev) => prev.filter((item) => !item.selected));
  };

  const clearAllCart = () => {
    setCartItems([]);
    setAppliedVoucherCode('');
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

  const applyVoucher = (rawCode) => {
    const clean = String(rawCode || '').trim().toUpperCase();
    if (!clean) {
      setAppliedVoucherCode('');
      return { ok: true, message: 'Đã gỡ mã giảm giá.' };
    }
    const found = SHOP_VOUCHERS.find((v) => v.code.toUpperCase() === clean);
    if (!found) {
      return {
        ok: false,
        message: 'Mã giảm giá không tồn tại. Bạn có thể chọn QLSHOP50, SUMMER10 hoặc FREESHIP.',
      };
    }
    setAppliedVoucherCode(found.code);
    return { ok: true, voucher: found, message: `Đã áp dụng mã ${found.code} (mô phỏng).` };
  };

  // Tính toán tổng giỏ hàng
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
      SHOP_VOUCHERS.find((v) => v.code === appliedVoucherCode) || null;
    const discount = calculateVoucherDiscount(activeVoucher, subtotal);
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
  }, [cartItems, appliedVoucherCode]);

  // Đặt hàng mô phỏng (chỉ lưu vào state React cục bộ)
  const placeSimulatedOrder = ({
    recipientName,
    recipientPhone,
    recipientEmail,
    shippingAddress,
    note,
    paymentMethod,
  }) => {
    const itemsToOrder =
      cartSummary.selectedItems.length > 0 ? cartSummary.selectedItems : cartItems;

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const idSuffix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}${pad(now.getHours())}${pad(now.getMinutes())}`;
    const orderId = `DH${idSuffix}`;
    const orderCode = `QL-${idSuffix}`;
    const formattedTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;

    const paymentLabels = {
      COD: 'Thanh toán khi nhận hàng (COD)',
      BANK_TRANSFER: 'Chuyển khoản ngân hàng (VietQR)',
      E_WALLET: 'Ví điện tử MoMo / VNPAY (Minh họa)',
    };

    const newOrder = {
      id: orderId,
      code: orderCode,
      createdAt: formattedTime,
      status: 'PENDING',
      paymentMethod,
      paymentMethodLabel: paymentLabels[paymentMethod] || paymentLabels.COD,
      paymentStatus: 'UNPAID',
      paymentStatusLabel:
        paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chờ xác nhận (Mô phỏng)',
      recipientName,
      recipientPhone,
      recipientEmail,
      shippingAddress,
      note: note || '',
      subtotal: cartSummary.subtotal,
      shippingFee: cartSummary.shippingFee,
      discount: cartSummary.discount,
      voucherCode: cartSummary.activeVoucher?.code || '',
      totalAmount: cartSummary.totalAmount,
      isSimulated: true,
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
          label: 'Đặt hàng thành công (Mô phỏng giao diện)',
          time: formattedTime,
          done: true,
        },
        { step: 'CONFIRMED', label: 'Chờ cửa hàng xác nhận', time: 'Đang xử lý', done: false },
        { step: 'SHIPPING', label: 'Đang giao hàng', time: '—', done: false },
        { step: 'COMPLETED', label: 'Hoàn thành đơn hàng', time: '—', done: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    // Xóa các sản phẩm đã đặt khỏi giỏ
    setCartItems((prev) => prev.filter((it) => !it.selected));

    return newOrder;
  };

  // Hủy đơn hàng mô phỏng trên giao diện
  const cancelOrderSimulated = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (String(order.id) !== String(orderId)) return order;
        return {
          ...order,
          status: 'CANCELLED',
          paymentStatusLabel: 'Đã hủy đơn (Mô phỏng)',
          timeline: [
            ...order.timeline.filter((t) => t.done),
            {
              step: 'CANCELLED',
              label: 'Đơn hàng đã hủy trên giao diện',
              time: 'Vừa xong',
              done: true,
            },
          ],
        };
      })
    );
  };

  // Mua lại các sản phẩm trong đơn hàng vào giỏ cục bộ
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
            quantity: next[existingIndex].quantity + it.quantity,
            selected: true,
          };
        } else {
          next.unshift({
            id: itemId,
            productId: it.productId,
            slug: it.slug,
            name: it.name,
            image: it.image,
            brandName: 'QLShop Fashion',
            size: it.size || 'L',
            color: it.color || 'Đen',
            unitPrice: it.unitPrice,
            originalPrice: it.unitPrice,
            quantity: it.quantity,
            stockQuantity: 20,
            selected: true,
          });
        }
      });
      return next;
    });
  };

  // Cập nhật thông tin hồ sơ cá nhân trong state cục bộ
  const updateProfileSimulated = (nextFields) => {
    setProfile((prev) => ({
      ...prev,
      ...nextFields,
    }));
  };

  const value = {
    cartItems,
    cartSummary,
    vouchers: SHOP_VOUCHERS,
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
    placeSimulatedOrder,
    cancelOrderSimulated,
    reorderToCart,
    profile,
    updateProfileSimulated,
    demoSignedIn,
    setDemoSignedIn,
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
