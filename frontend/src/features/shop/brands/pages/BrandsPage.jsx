import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopLoading from '../../../../components/shop/common/ShopLoading';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopErrorState from '../../../../components/shop/common/ShopErrorState';
import useShopBrands from '../hooks/useShopBrands';
import { shopPaths } from '../../shopPaths';

/**
 * Trang Danh sách Thương hiệu (`/shop/brands`).
 * Hiển thị toàn bộ thương hiệu thực tế từ `GET /api/brands`.
 */
export default function BrandsPage() {
  const { brands, loading, error, refetch } = useShopBrands();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Thương hiệu' }]} />

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Thương hiệu
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
          Các thương hiệu tại QLShop
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Chọn một thương hiệu để xem toàn bộ sản phẩm chính hãng của thương hiệu đó.
        </p>
      </div>

      {loading ? (
        <ShopLoading label="Đang tải danh sách thương hiệu..." />
      ) : error ? (
        <ShopErrorState error={error} onRetry={refetch} />
      ) : brands.length === 0 ? (
        <ShopEmptyState
          icon={Tag}
          title="Chưa có thương hiệu nào"
          description="Hệ thống hiện chưa có dữ liệu thương hiệu."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
            const logo = resolveShopImageUrl(brand.logo);
            return (
              <Link
                key={brand.id}
                to={shopPaths.brandDetail(brand.slug || brand.id)}
                className="group flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-16 w-28 items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
                    {logo ? (
                      <img
                        src={logo}
                        alt={brand.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Tag className="h-6 w-6 text-zinc-400" aria-hidden="true" />
                    )}
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-700">
                    {brand.name}
                  </h2>
                  {brand.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{brand.description}</p>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-400">
                      Xem các sản phẩm thuộc thương hiệu {brand.name}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
