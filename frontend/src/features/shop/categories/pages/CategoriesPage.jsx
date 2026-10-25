import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopLoading from '../../../../components/shop/common/ShopLoading';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopErrorState from '../../../../components/shop/common/ShopErrorState';
import useShopCategories from '../hooks/useShopCategories';
import { shopPaths } from '../../shopPaths';

/**
 * Trang Danh mục sản phẩm (`/shop/categories`).
 * Hiển thị toàn bộ danh mục đang kích hoạt từ `GET /api/categories`.
 */
export default function CategoriesPage() {
  const { categories, loading, error, refetch } = useShopCategories();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Danh mục' }]} />

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Danh mục sản phẩm
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
          Khám phá theo dòng sản phẩm
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Chọn một danh mục để xem các sản phẩm thuộc nhóm đó.
        </p>
      </div>

      {loading ? (
        <ShopLoading label="Đang tải danh sách danh mục..." />
      ) : error ? (
        <ShopErrorState error={error} onRetry={refetch} />
      ) : categories.length === 0 ? (
        <ShopEmptyState
          icon={Layers}
          title="Chưa có danh mục sản phẩm"
          description="Hệ thống hiện chưa có danh mục nào đang kích hoạt."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const img = resolveShopImageUrl(cat.image);
            return (
              <Link
                key={cat.id}
                to={shopPaths.categoryDetail(cat.slug || cat.id)}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                    {img ? (
                      <img
                        src={img}
                        alt={cat.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <Layers className="h-7 w-7 text-zinc-400" aria-hidden="true" />
                    )}
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-700">
                    {cat.name}
                  </h2>
                  {cat.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{cat.description}</p>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-400">Xem sản phẩm thuộc danh mục này</p>
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
