import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGrid, { ProductGridSkeleton } from '../../../../components/shop/common/ProductGrid';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopErrorState from '../../../../components/shop/common/ShopErrorState';

/**
 * Khối hiển thị một danh sách sản phẩm trên Trang chủ (Sản phẩm mới / Nổi bật / Đang giảm giá).
 * Tái sử dụng `ProductGrid`, `ShopErrorState`, `ShopEmptyState`.
 */
export default function ProductShowcaseSection({
  eyebrow,
  title,
  viewAllTo,
  products = [],
  loading = false,
  error = null,
  onRetry,
  categoryMap,
  brandMap,
  emptyTitle = 'Chưa có sản phẩm trong mục này',
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900">{title}</h2>
        </div>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 transition hover:text-emerald-600"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton count={4} columns={4} />
      ) : error ? (
        <ShopErrorState error={error} onRetry={onRetry} compact />
      ) : products.length === 0 ? (
        <ShopEmptyState title={emptyTitle} compact />
      ) : (
        <ProductGrid
          products={products}
          categoryMap={categoryMap}
          brandMap={brandMap}
          columns={4}
        />
      )}
    </section>
  );
}
