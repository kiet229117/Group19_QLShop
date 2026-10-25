import { shopRoutes } from './features/shop/shopRoutes';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import ClientLayout from './components/layout/ClientLayout';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ToastProvider } from './components/common/Toast';

// Auth Pages & Route Guard
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

// Admin Pages
import ProductsPage from './features/admin-products/pages/ProductsPage';
import DashboardPage from './features/admin-dashboard/pages/DashboardPage';
import CategoriesPage from './features/admin-categories/pages/CategoriesPage';
import BrandsPage from './features/admin-brands/pages/BrandsPage';
import GoodsReceiptsPage from './features/admin-goods-receipts/pages/GoodsReceiptsPage';
import SupplierPage from './features/admin-suppliers/pages/SupplierPage';
import UsersPage from './features/admin-users/pages/UsersPage';
import ChatsPage from './features/admin-chats/pages/ChatsPage';
import BannersPage from './features/admin-banners/pages/BannersPage';
import CommentsPage from './features/admin-comments/pages/CommentsPage';
import SettingsPage from './features/admin-settings/pages/SettingsPage';
// Client Placeholder / Trang chủ người dùng
function ClientHome() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl">
        QL
      </div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cửa hàng Quần Áo QLShop</h1>
      <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
        Giao diện Khách hàng (Client Storefront). Bạn có thể truy cập hệ thống quản trị bằng nút bên dưới:
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <a
          href="/admin"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition"
        >
          Truy cập Admin Portal &rarr;
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* =========================================================================
                1. GIAO DIỆN XÁC THỰC (AUTHENTICATION: LOGIN / REGISTER)
                ========================================================================= */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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
              {/* Mặc định /admin chuyển thẳng vào màn hình Sản phẩm & Biến thể gọn gàng theo thiết kế mới */}
              <Route index element={<ProductsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="goods-receipts" element={<GoodsReceiptsPage />} />
              <Route path="suppliers" element={<SupplierPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="chats" element={<ChatsPage />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="comments" element={<CommentsPage />} />
              <Route path="settings/*" element={<SettingsPage />} />
              
              {/* Các route phụ tạm thời trỏ về products */}
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
