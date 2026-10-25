import { Link } from 'react-router-dom';
import useShopCategories from '../../../features/shop/categories/hooks/useShopCategories';
import useShopBrands from '../../../features/shop/brands/hooks/useShopBrands';
import { shopPaths } from '../../../features/shop/shopPaths';

/**
 * Footer của Client Shop.
 */
export default function Footer() {
  const { categories } = useShopCategories();
  const { brands } = useShopBrands();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Cột 1: Thương hiệu */}
          <div className="space-y-4">
            <Link to={shopPaths.home()} className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white">
                QL
              </span>
              <span className="text-lg font-black tracking-tight text-white">
                QLShop Fashion
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Không gian mua sắm trực tuyến của QLShop — khám phá các dòng sản phẩm thời trang theo danh mục, thương hiệu và bộ sưu tập mới nhất.
            </p>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Khám phá
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to={shopPaths.home()} className="transition hover:text-white">
                  Trang chủ Shop
                </Link>
              </li>
              <li>
                <Link to={shopPaths.products()} className="transition hover:text-white">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to={shopPaths.products({ hasSale: 'true' })}
                  className="transition hover:text-white"
                >
                  Sản phẩm đang giảm giá
                </Link>
              </li>
              <li>
                <Link to={shopPaths.categories()} className="transition hover:text-white">
                  Danh mục sản phẩm
                </Link>
              </li>
              <li>
                <Link to={shopPaths.brands()} className="transition hover:text-white">
                  Thương hiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Danh mục */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Danh mục nổi bật
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={shopPaths.categoryDetail(cat.slug || cat.id)}
                    className="transition hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Mua sắm & Tài khoản */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Mua sắm & Cá nhân
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to={shopPaths.cart()} className="transition hover:text-white">
                  Giỏ hàng của tôi
                </Link>
              </li>
              <li>
                <Link to={shopPaths.checkout()} className="transition hover:text-white">
                  Thanh toán đơn hàng
                </Link>
              </li>
              <li>
                <Link to={shopPaths.orders()} className="transition hover:text-white">
                  Lịch sử đơn hàng
                </Link>
              </li>
              <li>
                <Link to={shopPaths.profile()} className="transition hover:text-white">
                  Hồ sơ cá nhân
                </Link>
              </li>
              {brands.slice(0, 2).map((brand) => (
                <li key={brand.id}>
                  <Link
                    to={shopPaths.brandDetail(brand.slug || brand.id)}
                    className="transition hover:text-white"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {year} QLShop Fashion. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-4">
            <Link to={shopPaths.cart()} className="hover:text-zinc-300">
              Giỏ hàng
            </Link>
            <Link to={shopPaths.orders()} className="hover:text-zinc-300">
              Đơn hàng
            </Link>
            <Link to={shopPaths.profile()} className="hover:text-zinc-300">
              Hồ sơ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
