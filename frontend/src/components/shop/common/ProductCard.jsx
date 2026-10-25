import { Link } from 'react-router-dom';
import { Flame, Sparkles, Eye } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';
import {
  getProductImages,
  getProductPricing,
  getUniqueVariantValues,
  isOutOfStock,
} from '../../../features/shop/shared/utils/productUtils';
import { formatNumber } from '../../../features/shop/shared/utils/formatters';
import { shopPaths } from '../../../features/shop/shopPaths';

/**
 * Thẻ hiển thị một sản phẩm (`ProductReponse`).
 * Nhận dữ liệu qua props; không tự gọi API.
 * `categoryName` và `brandName` có thể được truyền từ map tra cứu của trang cha nếu có.
 */
export default function ProductCard({ product, categoryName, brandName }) {
  if (!product) return null;

  const images = getProductImages(product);
  const primaryImage = images[0] || '';
  const secondaryImage = images[1] || '';
  const { onSale, discountPercent } = getProductPricing(product);
  const outOfStock = isOutOfStock(product);
  const sizes = getUniqueVariantValues(product.variants, 'size');
  const colors = getUniqueVariantValues(product.variants, 'color');
  const detailUrl = product.slug ? shopPaths.productDetail(product.slug) : null;
  const isHot = Boolean(product.hot ?? product.isHot);

  const Wrapper = detailUrl ? Link : 'div';
  const wrapperProps = detailUrl ? { to: detailUrl } : {};

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5">
      <Wrapper {...wrapperProps} className="relative block overflow-hidden">
        <ProductImage
          src={primaryImage}
          alt={product.name || 'Sản phẩm'}
          aspect="aspect-[3/4]"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {secondaryImage && (
          <img
            src={secondaryImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {/* Badges từ dữ liệu thực tế */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {onSale && Number.isFinite(discountPercent) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              -{discountPercent}%
            </span>
          )}
          {isHot && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              <Flame className="h-3 w-3" aria-hidden="true" />
              Hot
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-zinc-900/85 px-3 py-1.5 text-center text-xs font-semibold text-white backdrop-blur-xs">
            Tạm hết hàng
          </div>
        )}
      </Wrapper>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {(brandName || categoryName) && (
            <div className="mb-1 flex items-center justify-between gap-2 text-xs text-zinc-500">
              <span className="truncate font-medium uppercase tracking-wider">
                {brandName || categoryName}
              </span>
              {Number(product.views) > 0 && (
                <span className="inline-flex shrink-0 items-center gap-1 text-zinc-400" title="Lượt xem">
                  <Eye className="h-3 w-3" aria-hidden="true" />
                  {formatNumber(product.views)}
                </span>
              )}
            </div>
          )}

          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-zinc-900">
            {detailUrl ? (
              <Link to={detailUrl} className="transition hover:text-emerald-700">
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </h3>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <ProductPrice product={product} size="sm" />
            <ProductRating value={product.rating} size="sm" />
          </div>

          {(sizes.length > 0 || colors.length > 0) && (
            <div className="flex flex-wrap items-center justify-between gap-1 border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">
              {sizes.length > 0 && (
                <span className="truncate">
                  Size: <strong className="font-semibold text-zinc-700">{sizes.slice(0, 5).join(', ')}</strong>
                  {sizes.length > 5 ? ` +${sizes.length - 5}` : ''}
                </span>
              )}
              {colors.length > 0 && (
                <span className="shrink-0 text-zinc-400">{colors.length} màu</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
