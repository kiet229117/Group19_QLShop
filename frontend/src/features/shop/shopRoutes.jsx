import { Route, Navigate } from 'react-router-dom';
import ShopLayout from '../../components/shop/layout/ShopLayout';
import ShopHomePage from './shop-home/pages/ShopHomePage';
import ProductCatalogPage from './products/pages/ProductCatalogPage';
import ProductDetailPage from './products/pages/ProductDetailPage';
import CategoriesPage from './categories/pages/CategoriesPage';
import CategoryProductsPage from './categories/pages/CategoryProductsPage';
import BrandsPage from './brands/pages/BrandsPage';
import BrandProductsPage from './brands/pages/BrandProductsPage';
import CartPage from './cart/pages/CartPage';
import CheckoutPage from './checkout/pages/CheckoutPage';
import OrderSuccessPage from './checkout/pages/OrderSuccessPage';
import OrdersPage from './orders/pages/OrdersPage';
import OrderDetailPage from './orders/pages/OrderDetailPage';
import ProfilePage from './users/pages/ProfilePage';
import { SHOP_BASE_PATH } from './shopPaths';

/**
 * Module định tuyến của Client Shop (hoàn chỉnh các trang khám phá sản phẩm, giỏ hàng,
 * thanh toán, xác nhận đặt hàng, danh sách & chi tiết đơn hàng, hồ sơ cá nhân).
 */
export const shopRoutes = (
  <Route path={SHOP_BASE_PATH} element={<ShopLayout />}>
    <Route index element={<ShopHomePage />} />
    <Route path="products" element={<ProductCatalogPage />} />
    <Route path="products/:slug" element={<ProductDetailPage />} />
    <Route path="categories" element={<CategoriesPage />} />
    <Route path="categories/:slug" element={<CategoryProductsPage />} />
    <Route path="brands" element={<BrandsPage />} />
    <Route path="brands/:slug" element={<BrandProductsPage />} />
    <Route path="cart" element={<CartPage />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="checkout/success" element={<OrderSuccessPage />} />
    <Route path="orders" element={<OrdersPage />} />
    <Route path="orders/:id" element={<OrderDetailPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="*" element={<Navigate to={SHOP_BASE_PATH} replace />} />
  </Route>
);

export default shopRoutes;
