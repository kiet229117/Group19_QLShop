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
} from 'lucide-react';
import ProductSearch from '../common/ProductSearch';
import useShopCategories from '../../../features/shop/categories/hooks/useShopCategories';
import useShopBrands from '../../../features/shop/brands/hooks/useShopBrands';
import { useShopState } from '../../../features/shop/shared/context/ShopStateContext';
import { shopPaths } from '../../../features/shop/shopPaths';

/**
 * Header của Client Shop (thuần Frontend, dùng state cục bộ từ `useShopState`, không gọi API).
 */
export default function Header() {
  const { cartSummary, orders, profile } = useShopState();
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
    `inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      {/* Thanh thông báo trên cùng */}
      <div className="border-b border-zinc-100 bg-zinc-900 px-4 py-1.5 text-xs text-zinc-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="truncate font-medium">
            QLShop Fashion — Miễn phí vận chuyển cho đơn hàng từ 499.000₫ (Mã giảm giá: QLSHOP50)
          </p>
          <div className="hidden items-center gap-4 sm:flex">
            <Link to={shopPaths.products({ hasSale: 'true' })} className="hover:text-emerald-400">
              Ưu đãi đang diễn ra
            </Link>
            <Link to={shopPaths.orders()} className="hover:text-emerald-400">
              Tra cứu đơn hàng ({orders.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Thanh chính */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to={shopPaths.home()} className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-black tracking-tight text-white shadow-sm">
              QL
            </span>
            <div className="leading-tight">
              <span className="block text-lg font-black tracking-tight text-zinc-900">
                QLShop
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-emerald-600">
                Fashion Store
              </span>
            </div>
          </Link>
        </div>

        {/* Điều hướng desktop */}
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
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
              <ChevronDown className="h-3.5 w-3.5 opacity-70 transition group-hover:rotate-180" />
            </NavLink>
            {categories.length > 0 && (
              <div className="invisible absolute left-0 top-full w-64 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    {categories.slice(0, 10).map((cat) => (
                      <Link
                        key={cat.id}
                        to={shopPaths.categoryDetail(cat.slug || cat.id)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-emerald-700"
                      >
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-1 border-t border-zinc-100 pt-1">
                    <Link
                      to={shopPaths.categories()}
                      className="block rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                    >
                      Xem tất cả danh mục →
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
              <ChevronDown className="h-3.5 w-3.5 opacity-70 transition group-hover:rotate-180" />
            </NavLink>
            {brands.length > 0 && (
              <div className="invisible absolute left-0 top-full w-64 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    {brands.slice(0, 10).map((brand) => (
                      <Link
                        key={brand.id}
                        to={shopPaths.brandDetail(brand.slug || brand.id)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-emerald-700"
                      >
                        <span className="truncate">{brand.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-1 border-t border-zinc-100 pt-1">
                    <Link
                      to={shopPaths.brands()}
                      className="block rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                    >
                      Xem tất cả thương hiệu →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to={shopPaths.orders()} className={navLinkClass}>
            Đơn hàng
          </NavLink>
        </nav>

        {/* Thanh tìm kiếm */}
        <div className="hidden max-w-md flex-1 md:block">
          <ProductSearch defaultValue={currentKeyword} onSubmit={handleSearch} />
        </div>

        {/* Khu vực Giỏ hàng & Hồ sơ cá nhân */}
        <div className="flex items-center gap-2">
          <Link
            to={shopPaths.orders()}
            title="Đơn hàng của tôi"
            className="hidden h-10 items-center gap-1.5 rounded-full border border-zinc-200 px-3.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 sm:inline-flex lg:hidden"
          >
            <Package className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <span>Đơn hàng</span>
          </Link>

          <Link
            to={shopPaths.cart()}
            aria-label={`Giỏ hàng (${cartSummary.totalCount} sản phẩm)`}
            title="Giỏ hàng"
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 text-xs font-bold text-zinc-800 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            <ShoppingBag className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[11px] font-bold text-white">
              {cartSummary.totalCount}
            </span>
          </Link>

          <Link
            to={shopPaths.profile()}
            title="Hồ sơ cá nhân"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 text-xs font-semibold text-zinc-800 transition hover:border-zinc-900 hover:bg-white"
          >
            <User className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="hidden max-w-[120px] truncate md:inline">
              {profile?.fullname || 'Hồ sơ'}
            </span>
          </Link>
        </div>
      </div>

      {/* Ô tìm kiếm trên màn hình nhỏ */}
      <div className="border-t border-zinc-100 px-4 py-2.5 md:hidden">
        <ProductSearch defaultValue={currentKeyword} onSubmit={handleSearch} />
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav aria-label="Menu di động" className="space-y-1">
            <NavLink
              to={shopPaths.home()}
              end
              onClick={closeMobileMenu}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Trang chủ
            </NavLink>
            <NavLink
              to={shopPaths.products()}
              onClick={closeMobileMenu}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Tất cả sản phẩm
            </NavLink>
            <NavLink
              to={shopPaths.categories()}
              onClick={closeMobileMenu}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <Layers className="h-4 w-4 text-zinc-400" />
              Danh mục ({categories.length})
            </NavLink>
            <NavLink
              to={shopPaths.brands()}
              onClick={closeMobileMenu}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <Tag className="h-4 w-4 text-zinc-400" />
              Thương hiệu ({brands.length})
            </NavLink>
            <NavLink
              to={shopPaths.cart()}
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
                Giỏ hàng của tôi
              </span>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-bold text-white">
                {cartSummary.totalCount}
              </span>
            </NavLink>
            <NavLink
              to={shopPaths.orders()}
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-zinc-400" />
                Đơn hàng của tôi
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-700">
                {orders.length}
              </span>
            </NavLink>
            <NavLink
              to={shopPaths.profile()}
              onClick={closeMobileMenu}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <User className="h-4 w-4 text-emerald-600" />
              Hồ sơ cá nhân ({profile?.fullname})
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
