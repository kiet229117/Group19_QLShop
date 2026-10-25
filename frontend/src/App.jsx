import { shopRoutes } from './features/shop/shopRoutes';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import ClientLayout from './components/layout/ClientLayout';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ToastProvider } from './components/common/Toast';

// Auth Pages & Route Guard
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

// Admin Pages
import ProductsPage from './features/admin-products/pages/ProductsPage';
import DashboardPage from './features/admin-dashboard/pages/DashboardPage';
import CategoriesPage from './features/admin-categories/pages/CategoriesPage';
import BrandsPage from './features/admin-brands/pages/BrandsPage';
import GoodsReceiptsPage from './features/admin-goods-receipts/pages/GoodsReceiptsPage';
import SupplierPage from './features/admin-suppliers/pages/SupplierPage';
import OrdersPage from './features/admin-orders/pages/OrdersPage';
import VouchersPage from './features/admin-vouchers/pages/VouchersPage';
import ReturnsPage from './features/admin-orders/pages/ReturnsPage';
import UsersPage from './features/admin-users/pages/UsersPage';
import ChatsPage from './features/admin-chats/pages/ChatsPage';
import BannersPage from './features/admin-banners/pages/BannersPage';
import CommentsPage from './features/admin-comments/pages/CommentsPage';
import SettingsPage from './features/admin-settings/pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* =========================================================================
                1. GIAO DIỆN XÁC THỰC (AUTHENTICATION: LOGIN / REGISTER / FORGOT PASSWORD)
                ========================================================================= */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* =========================================================================
                2. GIAO DIỆN KHÁCH HÀNG (CLIENT STOREFRONT)
                ========================================================================= */}
            <Route path="/" element={<Navigate to="/shop" replace />} />
            {shopRoutes}

            {/* =========================================================================
                3. GIAO DIỆN QUẢN TRỊ VIÊN (ADMIN PORTAL) - YÊU CẦU ĐĂNG NHẬP
                ========================================================================= */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Mặc định /admin chuyển thẳng vào màn hình Sản phẩm & Biến thể */}
              <Route index element={<ProductsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="goods-receipts" element={<GoodsReceiptsPage />} />
              <Route path="suppliers" element={<SupplierPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="vouchers" element={<VouchersPage />} />
              <Route path="returns" element={<ReturnsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="chats" element={<ChatsPage />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="comments" element={<CommentsPage />} />
              <Route path="settings/*" element={<SettingsPage />} />

              {/* Các route phụ fallback về products */}
              <Route path="*" element={<Navigate to="/admin/products" replace />} />
            </Route>

            {/* Fallback cho tất cả các đường dẫn khác */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
