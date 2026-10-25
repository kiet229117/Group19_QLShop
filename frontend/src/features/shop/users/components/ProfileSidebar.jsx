import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  LogOut,
  LogIn,
  Award,
  ShoppingBag,
  Lock,
  Camera,
  Loader2,
} from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';
import { useShopState } from '../../shared/context/ShopStateContext';
import { toast } from '../../../../components/common/Toast';

const MENU_ITEMS = [
  { key: 'info', label: 'Hồ sơ cá nhân', icon: User },
  { key: 'addresses', label: 'Sổ địa chỉ giao hàng', icon: MapPin },
];

/**
 * Sidebar điều hướng trang Hồ sơ cá nhân (kèm nút đổi nhanh ảnh đại diện & Đổi mật khẩu).
 */
export default function ProfileSidebar({
  profile,
  activeSection = 'info',
  ordersCount = 0,
  demoSignedIn = true,
  onSelectSection,
  onToggleDemoSignOut,
}) {
  const { uploadProfileAvatar } = useShopState();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const avatarUrl = resolveShopImageUrl(profile?.avatar);
  const isChangePasswordActive =
    activeSection === 'password' ||
    location.pathname === shopPaths.changePassword();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp hình ảnh hợp lệ.');
      e.target.value = '';
      return;
    }
    setUploading(true);
    try {
      await uploadProfileAvatar(file);
    } catch {
      // Đã báo lỗi trong context
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleMenuClick = (key) => {
    if (onSelectSection) {
      onSelectSection(key);
    } else {
      navigate(shopPaths.profile(key === 'info' ? undefined : key));
    }
  };

  return (
    <aside className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* Thẻ tóm tắt thành viên */}
      <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
        <div className="relative h-16 w-16 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-100 ring-2 ring-emerald-500/20">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.fullname || 'Avatar'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                <User className="h-7 w-7" />
              </div>
            )}
          </div>
          {demoSignedIn && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Đổi ảnh đại diện"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900 text-white shadow transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-base font-black text-zinc-900">
            {profile?.fullname || 'Khách vãng lai'}
          </h2>
          <p className="truncate text-xs text-zinc-500">
            {profile?.email || 'Chưa đăng nhập'}
          </p>
          {profile?.fullname && (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 ring-1 ring-amber-200">
              <Award className="h-3 w-3" aria-hidden="true" />
              {profile?.memberTier || 'Thành viên'}
            </span>
          )}
        </div>
      </div>

      {/* Menu điều hướng hồ sơ */}
      <nav aria-label="Menu hồ sơ" className="space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = !isChangePasswordActive && activeSection === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleMenuClick(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                active
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <Link
          to={shopPaths.changePassword()}
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            isChangePasswordActive
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Đổi mật khẩu</span>
        </Link>

        <Link
          to={shopPaths.orders()}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          <span className="flex items-center gap-3">
            <Package className="h-4 w-4 shrink-0" aria-hidden="true" />
            Đơn hàng của tôi
          </span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-700">
            {ordersCount}
          </span>
        </Link>

        <Link
          to={shopPaths.cart()}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
          Giỏ hàng của tôi
        </Link>
      </nav>

      {/* Nút đăng xuất / đăng nhập tài khoản */}
      <div className="border-t border-zinc-100 pt-4">
        {demoSignedIn ? (
          <button
            type="button"
            onClick={onToggleDemoSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Đăng xuất tài khoản
          </button>
        ) : (
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Đăng nhập tài khoản
          </Link>
        )}
      </div>
    </aside>
  );
}
