/**
 * Đường dẫn tập trung của Client Shop.
 * Toàn bộ Shop được mount dưới tiền tố SHOP_BASE_PATH (xem shopRoutes.jsx) để không xung đột
 * với route "/" (ClientLayout) và "/admin" hiện có.
 */
export const SHOP_BASE_PATH = '/shop';

const withBase = (path = '') => `${SHOP_BASE_PATH}${path}`;

export const shopPaths = {
  home: () => withBase(''),
  products: (query) => {
    const search = query ? new URLSearchParams(query).toString() : '';
    return withBase(`/products${search ? `?${search}` : ''}`);
  },
  productDetail: (slug) => withBase(`/products/${encodeURIComponent(slug)}`),
  categories: () => withBase('/categories'),
  categoryDetail: (slug) => withBase(`/categories/${encodeURIComponent(slug)}`),
  brands: () => withBase('/brands'),
  brandDetail: (slug) => withBase(`/brands/${encodeURIComponent(slug)}`),
  cart: () => withBase('/cart'),
  checkout: () => withBase('/checkout'),
  checkoutSuccess: (orderId) =>
    withBase(`/checkout/success${orderId ? `?orderId=${encodeURIComponent(orderId)}` : ''}`),
  orders: () => withBase('/orders'),
  orderDetail: (id) => withBase(`/orders/${encodeURIComponent(id)}`),
  profile: (tab) => withBase(`/profile${tab ? `?tab=${encodeURIComponent(tab)}` : ''}`),
};

/** Các route xác thực hiện có trong ứng dụng (App.jsx) – tái sử dụng, không tạo mới. */
export const authPaths = {
  login: '/login',
  register: '/register',
  admin: '/admin',
};
