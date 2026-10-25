import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, Eye } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';
import {
  getProductPricing,
  getProductThumbnail,
  getUniqueVariantValues,
  isOutOfStock,
} from '../../../features/shop/shared/utils/productUtils';
import { formatNumber } from '../../../features/shop/shared/utils/formatters';
import { shopPaths } from '../../../features/shop/shopPaths';

/**
 * Danh sách sản phẩm dạng hàng ngang (list view) dùng trên trang danh sách khi người dùng chuyển chế độ xem.
 */
export default function ProductList({ products = [], categoryMap, brandMap, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {products.map((product) => {
        const thumbnail = getProductThumbnail(product);
        const { onSale, discountPercent } = getProductPricing(product);
        const outOfStock = isOutOfStock(product);
        const sizes = getUniqueVariantValues(product.variants, 'size');
        const colors = getUniqueVariantValues(product.variants, 'color');
        const detailUrl = product.slug ? shopPaths.productDetail(product.slug) : null;
        const isHot = Boolean(product.hot ?? product.isHot);
        const category =
          categoryMap && product?.categoryId != null
            ? categoryMap.get(String(product.categoryId))
            : null;
        const brand =
          brandMap && product?.brandId != null ? brandMap.get(String(product.brandId)) : null;

        return (
          <article
            key={product.id ?? product.slug}
            className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 transition hover:border-zinc-300 hover:shadow-lg sm:flex-row sm:items-center sm:gap-6"
          >
            <Link
              to={detailUrl || '#'}
              className="relative block w-full shrink-0 overflow-hidden rounded-xl sm:w-44"
            >
              <ProductImage
                src={thumbnail}
                alt={product.name || 'Sản phẩm'}
                aspect="aspect-[3/4]"
                imgClassName="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1">
                {onSale && Number.isFinite(discountPercent) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />-{discountPercent}%
                  </span>
                )}
                {isHot && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    <Flame className="h-3 w-3" aria-hidden="true" />
                    Hot
                  </span>
                )}
              </div>
            </Link>

            <div className="flex flex-1 flex-col justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  {brand?.name && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-semibold text-zinc-700">
                      {brand.name}
                    </span>
                  )}
                  {category?.name && <span>{category.name}</span>}
                  {Number(product.views) > 0 && (
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatNumber(product.views)} lượt xem
                    </span>
                  )}
                  {outOfStock && (
                    <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 font-semibold text-white">
                      Tạm hết hàng
                    </span>
                  )}
                </div>

                <h3 className="mt-1.5 text-lg font-bold text-zinc-900">
                  {detailUrl ? (
                    <Link to={detailUrl} className="transition hover:text-emerald-700">
                      {product.name}
                    </Link>
                  ) : (
                    product.name
                  )}
                </h3>

                {product.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{product.description}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-3">
                <div className="space-y-1">
                  <ProductPrice product={product} size="md" showBadge />
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <ProductRating value={product.rating} size="sm" />
                    {sizes.length > 0 && <span>Size: {sizes.join(', ')}</span>}
                    {colors.length > 0 && <span>Màu: {colors.join(', ')}</span>}
                  </div>
                </div>

                {detailUrl && (
                  <Link
                    to={detailUrl}
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
