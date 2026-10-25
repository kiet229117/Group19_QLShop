import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import { useShopState } from '../../shared/context/ShopStateContext';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import { shopPaths } from '../../shopPaths';
import ProfileSidebar from '../components/ProfileSidebar';
import ChangePasswordForm from '../components/ChangePasswordForm';

/**
 * Trang Đổi mật khẩu (`/shop/change-password`).
 * Hiển thị ProfileSidebar và ChangePasswordForm kết nối API POST /api/auth/change-password.
 */
export default function ChangePasswordPage() {
  const { profile, orders } = useShopState();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất tài khoản thành công.');
    } catch {
      toast.error('Có lỗi khi đăng xuất');
    }
  };

  const handleSelectSection = (sectionKey) => {
    if (sectionKey === 'password') return;
    navigate(shopPaths.profile(sectionKey === 'info' ? undefined : sectionKey));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb
        items={[
          { label: 'Hồ sơ cá nhân', to: shopPaths.profile() },
          { label: 'Đổi mật khẩu' },
        ]}
      />

      {!isAuthenticated && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-xs sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-emerald-900">
              Bạn chưa đăng nhập tài khoản QLShop
            </h3>
            <p className="text-xs text-emerald-700">
              Vui lòng đăng nhập tài khoản để thực hiện đổi mật khẩu bảo mật.
            </p>
          </div>
          <Link
            to="/login"
            state={{ from: location }}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-600"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập ngay
          </Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <ProfileSidebar
            profile={profile}
            activeSection="password"
            ordersCount={orders.length}
            demoSignedIn={isAuthenticated}
            onSelectSection={handleSelectSection}
            onToggleDemoSignOut={handleSignOut}
          />
        </div>

        <div className="space-y-6 lg:col-span-8">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

