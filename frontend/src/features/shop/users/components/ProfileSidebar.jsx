import { Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  LogOut,
  LogIn,
  Award,
  ShoppingBag,
} from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';

const MENU_ITEMS = [
  { key: 'info', label: 'Hồ sơ cá nhân', icon: User },
  { key: 'addresses', label: 'Sổ địa chỉ giao hàng', icon: MapPin },
];

/**
 * Sidebar điều hướng trang Hồ sơ cá nhân.
 */
export default function ProfileSidebar({
  profile,
  activeSection = 'info',
  ordersCount = 0,
  demoSignedIn = true,
  onSelectSection,
  onToggleDemoSignOut,
}) {
  const avatarUrl = resolveShopImageUrl(profile?.avatar);

  return (
    <aside className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      {/* Thẻ tóm tắt thành viên */}
      <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 ring-2 ring-emerald-500/20">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profile?.fullname}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400">
              <User className="h-7 w-7" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-black text-zinc-900">
            {profile?.fullname}
          </h2>
          <p className="truncate text-xs text-zinc-500">{profile?.email}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 ring-1 ring-amber-200">
            <Award className="h-3 w-3" aria-hidden="true" />
            {profile?.memberTier || 'Thành viên'}
          </span>
        </div>
      </div>

      {/* Menu điều hướng hồ sơ */}
      <nav aria-label="Menu hồ sơ" className="space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectSection?.(item.key)}
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

      {/* Nút đăng xuất chỉ là thao tác giao diện */}
      <div className="border-t border-zinc-100 pt-4">
        <button
          type="button"
          onClick={onToggleDemoSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
        >
          {demoSignedIn ? (
            <>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Đăng xuất (Mô phỏng giao diện)
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden="true" />
               Bật lại trạng thái đã đăng nhập mẫu
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
