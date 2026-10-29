import { Link } from 'react-router-dom';
import { Flame, Sparkles, Eye, Heart, AlertTriangle } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';
import {
  getProductImages,
  getProductPricing,
  getUniqueVariantValues,
  isOutOfStock,
  isLowStock,
  getTotalStock,
} from '../../../features/shop/shared/utils/productUtils';
import { formatNumber } from '../../../features/shop/shared/utils/formatters';
import { shopPaths } from '../../../features/shop/shopPaths';
import useShopWishlist from '../../../features/shop/wishlist/hooks/useShopWishlist';

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
  const totalStock = getTotalStock(product);
  const outOfStock = isOutOfStock(product);
  const lowStock = isLowStock(product);
  const sizes = getUniqueVariantValues(product.variants, 'size');
  const colors = getUniqueVariantValues(product.variants, 'color');
  const detailUrl = product.slug ? shopPaths.productDetail(product.slug) : null;
  const isHot = Boolean(product.hot ?? product.isHot);
  const { isWishlisted, toggleWishlist } = useShopWishlist();
  const isFav = isWishlisted(product.id);

  const Wrapper = detailUrl ? Link : 'div';
  const wrapperProps = detailUrl ? { to: detailUrl } : {};

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5">
      <Wrapper {...wrapperProps} className="relative block overflow-hidden">
        <ProductImage
          src={primaryImage}
          alt={product.name || 'Sản phẩm'}
          aspect="aspect-[3/4]"
          imgClassName={`transition-transform duration-500 ease-out group-hover:scale-105 ${
            outOfStock ? 'opacity-75 grayscale-[25%]' : ''
          }`}
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

        {/* Nút yêu thích */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow-sm backdrop-blur transition hover:scale-110 hover:bg-white hover:text-rose-500"
        >
          <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
        </button>

        {/* Badges từ dữ liệu thực tế */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {outOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              Hết hàng
            </span>
          ) : lowStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Sắp hết hàng
            </span>
          ) : null}

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

        {outOfStock ? (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-zinc-900/90 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs shadow-sm">
            Hết hàng
          </div>
        ) : lowStock ? (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-amber-500/95 px-3 py-1 text-center text-xs font-bold text-white backdrop-blur-xs shadow-sm">
            Sắp hết hàng (còn {totalStock})
          </div>
        ) : null}
      </Wrapper>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
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

        <div className="mt-3.5 space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <ProductPrice product={product} size="sm" />
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <ProductRating value={product.rating} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              {outOfStock ? (
                <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200">
                  Hết hàng
                </span>
              ) : lowStock ? (
                <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                  Sắp hết ({totalStock})
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                <span>Đã bán</span> <strong className="font-bold text-zinc-800">{formatNumber(product.soldQuantity ?? 0)}</strong>
              </span>
            </div>
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
                <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">{colors.length} màu</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
