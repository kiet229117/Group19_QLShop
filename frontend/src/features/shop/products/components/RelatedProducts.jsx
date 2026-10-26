import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Tag, Sparkles } from 'lucide-react';
import ProductGrid, { ProductGridSkeleton } from '../../../../components/shop/common/ProductGrid';
import useShopQuery from '../../shared/hooks/useShopQuery';
import shopProductService from '../services/shopProductService';
import { shopPaths } from '../../shopPaths';

/**
 * Khu vực Sản phẩm liên quan theo Danh mục (Category) và Thương hiệu (Brand)
 * hiển thị ngay phía dưới phần Bình luận trên trang Chi tiết sản phẩm.
 */
export default function RelatedProducts({
  currentProductId,
  categoryId,
  brandId,
  category,
  brand,
  categoryMap,
  brandMap,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'category' | 'brand'

  const resolvedCategory =
    category || (categoryId != null ? categoryMap?.get(String(categoryId)) : null);
  const resolvedBrand =
    brand || (brandId != null ? brandMap?.get(String(brandId)) : null);

  const query = useShopQuery(
    (signal) =>
      shopProductService.getRelatedByCategoryAndBrand(
        {
          currentProductId,
          categoryId,
          brandId,
          limit: 8,
        },
        signal
      ),
    `related::${currentProductId || ''}::${categoryId || ''}::${brandId || ''}`,
    { enabled: Boolean(currentProductId || categoryId || brandId) }
  );

  const data = query.data || { combined: [], byCategory: [], byBrand: [] };
  const combinedItems = data.combined || [];
  const categoryItems = data.byCategory || [];
  const brandItems = data.byBrand || [];

  let displayedItems = combinedItems;
  if (activeTab === 'category') {
    displayedItems = categoryItems;
  } else if (activeTab === 'brand') {
    displayedItems = brandItems;
  }

  return (
    <section className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Gợi ý theo Danh mục &amp; Thương hiệu
          </p>
          <h2 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl">
            Sản phẩm liên quan
          </h2>
          <p className="text-xs text-zinc-500 sm:text-sm">
            Các mẫu áo cùng danh mục{' '}
            {resolvedCategory?.name ? (
              <strong className="font-bold text-zinc-800">{resolvedCategory.name}</strong>
            ) : null}{' '}
            {resolvedCategory?.name && resolvedBrand?.name ? 'hoặc cùng thương hiệu ' : ''}
            {resolvedBrand?.name ? (
              <strong className="font-bold text-zinc-800">{resolvedBrand.name}</strong>
            ) : null}
          </p>
        </div>

        {/* Bộ lọc tab nhanh: Tất cả / Cùng Danh mục / Cùng Thương hiệu */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tất cả liên quan ({combinedItems.length})</span>
          </button>

          {categoryId && (
            <button
              type="button"
              onClick={() => setActiveTab('category')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'category'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>
                Cùng danh mục{resolvedCategory?.name ? `: ${resolvedCategory.name}` : ''} (
                {categoryItems.length})
              </span>
            </button>
          )}

          {brandId && (
            <button
              type="button"
              onClick={() => setActiveTab('brand')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'brand'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>
                Cùng thương hiệu{resolvedBrand?.name ? `: ${resolvedBrand.name}` : ''} (
                {brandItems.length})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Danh sách sản phẩm liên quan */}
      {query.loading ? (
        <ProductGridSkeleton count={4} columns={4} />
      ) : displayedItems.length > 0 ? (
        <ProductGrid
          products={displayedItems.slice(0, 8)}
          categoryMap={categoryMap}
          brandMap={brandMap}
          columns={4}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center">
          <p className="text-sm font-bold text-zinc-700">
            Hiện chưa có thêm mẫu áo khác trong nhóm này.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Bạn có thể chuyển sang tab{' '}
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="font-bold text-emerald-600 underline hover:text-emerald-700"
            >
              Tất cả liên quan
            </button>{' '}
            để xem các mẫu áo gợi ý phù hợp nhất!
          </p>
        </div>
      )}

      {/* Liên kết xem thêm theo Danh mục & Thương hiệu */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 text-xs font-semibold">
        <div className="flex flex-wrap items-center gap-2">
          {resolvedCategory && (
            <Link
              to={shopPaths.categoryDetail(resolvedCategory.slug || resolvedCategory.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-600" />
              <span>Xem tất cả danh mục {resolvedCategory.name}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {resolvedBrand && (
            <Link
              to={shopPaths.brandDetail(resolvedBrand.slug || resolvedBrand.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Tag className="h-3.5 w-3.5 text-emerald-600" />
              <span>Xem tất cả thương hiệu {resolvedBrand.name}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <Link
          to={shopPaths.products(categoryId ? { categoryId } : brandId ? { brandId } : {})}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          <span>Khám phá thêm sản phẩm</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
