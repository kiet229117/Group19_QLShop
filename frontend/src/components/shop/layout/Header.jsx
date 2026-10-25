import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Tag,
  Layers,
  Package,
  Heart,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import ProductSearch from '../common/ProductSearch';
import useShopCategories from '../../../features/shop/categories/hooks/useShopCategories';
import useShopBrands from '../../../features/shop/brands/hooks/useShopBrands';
import { useShopState } from '../../../features/shop/shared/context/ShopStateContext';
import { shopPaths } from '../../../features/shop/shopPaths';
import useShopWishlist from '../../../features/shop/wishlist/hooks/useShopWishlist';
import { useAuth } from '../../../features/auth/context/AuthContext';

/**
 * Header Client Shop - Thiết kế gọn gàng, hiện đại, chuẩn UI thương mại điện tử
 */
export default function Header() {
  const { cartSummary, orders, profile } = useShopState();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { count: wishlistCount } = useShopWishlist();
  const { categories } = useShopCategories();
  const { brands } = useShopBrands();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const locationKey = `${location.pathname}${location.search}`;
  const [openedAtLocationKey, setOpenedAtLocationKey] = useState(null);
  const mobileMenuOpen = openedAtLocationKey === locationKey;

  const toggleMobileMenu = () => {
    setOpenedAtLocationKey((prev) => (prev === locationKey ? null : locationKey));
  };
  const closeMobileMenu = () => setOpenedAtLocationKey(null);

  const currentKeyword = location.pathname.endsWith('/products')
    ? searchParams.get('keyword') || ''
    : '';

  const handleSearch = (keyword) => {
    closeMobileMenu();
    navigate(shopPaths.products(keyword ? { keyword } : undefined));
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
      isActive
        ? 'bg-zinc-900 text-white shadow-xs'
        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      {/* 1. Top bar thông báo thanh mảnh */}
      <div className="border-b border-zinc-100 bg-zinc-900 px-4 py-1 text-[11px] text-zinc-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="truncate font-medium">
            🔥 SHOP3AE — Miễn phí vận chuyển từ 499k (Nhập mã: <span className="font-bold text-amber-300">QLSHOP50</span>)
          </p>
          <div className="hidden items-center gap-4 sm:flex text-zinc-400">
            <Link to={shopPaths.products({ hasSale: 'true' })} className="transition hover:text-emerald-400">
              Ưu đãi hot
            </Link>
            <span className="h-3 w-px bg-zinc-700" />
            <Link to={shopPaths.orders()} className="transition hover:text-emerald-400">
              Tra cứu đơn hàng ({orders.length})
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Thanh chính: Chiều cao chuẩn 64px (h-16), bố cục cân đối gọn gàng */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Nút menu mobile & Logo */}
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link to={shopPaths.home()} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-xs font-black tracking-wider text-white shadow-xs">
              S3
            </span>
            <div className="hidden sm:block leading-none">
              <span className="block text-base font-black tracking-tight text-zinc-900">
                SHOP3AE
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-emerald-600">
                Fashion
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Điều hướng Desktop - Gọn gàng, tinh tế */}
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex shrink-0">
          <NavLink to={shopPaths.home()} end className={navLinkClass}>
            Trang chủ
          </NavLink>
          <NavLink to={shopPaths.products()} className={navLinkClass}>
            Sản phẩm
          </NavLink>

          {/* Dropdown Danh mục */}
          <div className="group relative">
            <NavLink to={shopPaths.categories()} className={navLinkClass}>
              Danh mục
              <ChevronDown className="h-3 w-3 opacity-60 transition group-hover:rotate-180" />
            </NavLink>
            {categories.length > 0 && (
              <div className="invisible absolute left-0 top-full w-60 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 z-50">
                <div className="rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl">
                  <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
                    {categories.slice(0, 10).map((cat) => (
                      <Link
                        key={cat.id}
                        to={shopPaths.categoryDetail(cat.slug || cat.id)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-emerald-700"
                      >
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-zinc-100 p-1">
                    <Link
                      to={shopPaths.categories()}
                      className="block rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold text-emerald-700 hover:bg-emerald-50"
                    >
                      Tất cả danh mục →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown Thương hiệu */}
          <div className="group relative">
            <NavLink to={shopPaths.brands()} className={navLinkClass}>
              Thương hiệu
              <ChevronDown className="h-3 w-3 opacity-60 transition group-hover:rotate-180" />
            </NavLink>
            {brands.length > 0 && (
              <div className="invisible absolute left-0 top-full w-60 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 z-50">
                <div className="rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl">
                  <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
                    {brands.slice(0, 10).map((b) => (
                      <Link
                        key={b.id}
                        to={shopPaths.brandDetail(b.slug || b.id)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-emerald-700"
                      >
                        <span className="truncate">{b.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-zinc-100 p-1">
                    <Link
                      to={shopPaths.brands()}
                      className="block rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold text-emerald-700 hover:bg-emerald-50"
                    >
                      Tất cả thương hiệu →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to={shopPaths.wishlist()} className={navLinkClass}>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
            Yêu thích
            {wishlistCount > 0 && (
              <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </NavLink>
        </nav>

        {/* 3. Thanh tìm kiếm trung tâm: Rộng rãi, gọn gàng */}
        <div className="hidden flex-1 max-w-lg xl:max-w-xl md:block mx-2">
          <ProductSearch defaultValue={currentKeyword} onSubmit={handleSearch} />
        </div>

        {/* 4. Nhóm nút thao tác bên phải: Icon đồng nhất, thanh lịch */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Nút Yêu thích (mobile/tablet icon button) */}
          <Link
            to={shopPaths.wishlist()}
            title="Danh sách yêu thích"
            aria-label={`Sản phẩm yêu thích (${wishlistCount})`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600 lg:hidden"
          >
            <Heart className="h-4 w-4 text-rose-500" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Nút Giỏ hàng: Chỉ icon + badge đếm */}
          <Link
            to={shopPaths.cart()}
            aria-label={`Giỏ hàng (${cartSummary.totalCount} sản phẩm)`}
            title="Giỏ hàng"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            <ShoppingBag className="h-4 w-4 text-zinc-700" aria-hidden="true" />
            {cartSummary.totalCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white shadow-xs">
                {cartSummary.totalCount}
              </span>
            )}
          </Link>

          {/* Khu vực Tài khoản / Đăng nhập */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              state={{ from: location }}
              title="Đăng nhập tài khoản"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-zinc-900 px-3 text-xs font-bold text-white transition hover:bg-emerald-600 shadow-xs"
            >
              <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          ) : (
            <div className="group relative">
              <Link
                to={shopPaths.profile()}
                title="Hồ sơ tài khoản"
                aria-label="Hồ sơ cá nhân"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 text-xs font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-white"
              >
                <User className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span className="hidden max-w-[100px] truncate sm:inline">
                  {user?.name || user?.username || profile?.fullname || 'Tài khoản'}
                </span>
                <ChevronDown className="h-3 w-3 opacity-60 transition group-hover:rotate-180" />
              </Link>

              {/* Dropdown menu tài khoản */}
              <div className="invisible absolute right-0 top-full w-56 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 z-50">
                <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl text-left">
                  <div className="border-b border-zinc-100 px-3 py-2">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {user?.name || user?.username || 'Thành viên'}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
                    <span className="mt-1 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {user?.role || 'USER'}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      to={shopPaths.profile()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      to={shopPaths.orders()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <Package className="h-3.5 w-3.5 text-zinc-400" />
                      Đơn hàng của tôi ({orders.length})
                    </Link>
                    <Link
                      to={shopPaths.wishlist()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <Heart className="h-3.5 w-3.5 text-rose-500" />
                      Yêu thích ({wishlistCount})
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Trang Quản trị Admin
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-zinc-100 pt-1">
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ô tìm kiếm cho thiết bị di động */}
      <div className="border-t border-zinc-100 px-4 py-2 md:hidden">
        <ProductSearch defaultValue={currentKeyword} onSubmit={handleSearch} />
      </div>

      {/* Menu mobile (Drawer) gọn gàng */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 shadow-xl lg:hidden">
          <nav aria-label="Menu di động" className="space-y-1">
            <NavLink
              to={shopPaths.home()}
              end
              onClick={closeMobileMenu}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Trang chủ
            </NavLink>
            <NavLink
              to={shopPaths.products()}
              onClick={closeMobileMenu}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Tất cả sản phẩm
            </NavLink>
            <NavLink
              to={shopPaths.categories()}
              onClick={closeMobileMenu}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <Layers className="h-4 w-4 text-zinc-400" />
              Danh mục ({categories.length})
            </NavLink>
            <NavLink
              to={shopPaths.brands()}
              onClick={closeMobileMenu}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <Tag className="h-4 w-4 text-zinc-400" />
              Thương hiệu ({brands.length})
            </NavLink>
            <NavLink
              to={shopPaths.wishlist()}
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                Sản phẩm yêu thích
              </span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to={shopPaths.cart()}
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
                Giỏ hàng của tôi
              </span>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                {cartSummary.totalCount}
              </span>
            </NavLink>
            <NavLink
              to={shopPaths.orders()}
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-zinc-400" />
                Đơn hàng của tôi
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                {orders.length}
              </span>
            </NavLink>
            {!isAuthenticated ? (
              <Link
                to="/login"
                state={{ from: location }}
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                Đăng nhập / Đăng ký
              </Link>
            ) : (
              <>
                <NavLink
                  to={shopPaths.profile()}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  <User className="h-4 w-4 text-emerald-600" />
                  Hồ sơ cá nhân ({user?.name || user?.username || profile?.fullname})
                </NavLink>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Trang Quản trị Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất tài khoản
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
