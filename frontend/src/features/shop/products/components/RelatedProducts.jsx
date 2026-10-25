import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGrid, { ProductGridSkeleton } from '../../../../components/shop/common/ProductGrid';
import useShopQuery from '../../shared/hooks/useShopQuery';
import { normalizePage } from '../../shared/utils/pageUtils';
import shopProductService from '../services/shopProductService';
import { shopPaths } from '../../shopPaths';

/**
 * Sản phẩm cùng danh mục (hoặc cùng thương hiệu) trên trang Chi tiết sản phẩm.
 * Loại trừ sản phẩm hiện tại khỏi danh sách.
 */
export default function RelatedProducts({
  currentProductId,
  categoryId,
  brandId,
  categoryMap,
  brandMap,
}) {
  const hasFilter = Boolean(categoryId || brandId);

  const query = useShopQuery(
    (signal) =>
      shopProductService.filterProducts(
        {
          categoryId: categoryId || undefined,
          brandId: !categoryId && brandId ? brandId : undefined,
          page: 0,
          pageSize: 5,
        },
        signal
      ),
    `related::${categoryId || ''}::${brandId || ''}`,
    { enabled: hasFilter }
  );

  const items = normalizePage(query.data)
    .items.filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (!hasFilter || (!query.loading && items.length === 0)) return null;

  return (
    <section className="space-y-6 border-t border-zinc-200 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Gợi ý tương tự
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900">
            Sản phẩm liên quan
          </h2>
        </div>
        <Link
          to={shopPaths.products(categoryId ? { categoryId } : { brandId })}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-emerald-600"
        >
          Xem thêm
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {query.loading ? (
        <ProductGridSkeleton count={4} columns={4} />
      ) : (
        <ProductGrid
          products={items}
          categoryMap={categoryMap}
          brandMap={brandMap}
          columns={4}
        />
      )}
    </section>
  );
}
