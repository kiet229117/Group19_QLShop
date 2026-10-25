import { formatCurrency } from '../../../features/shop/shared/utils/formatters';
import { getProductPricing } from '../../../features/shop/shared/utils/productUtils';

const SIZE_CLASSES = {
  sm: { current: 'text-base', original: 'text-xs' },
  md: { current: 'text-lg', original: 'text-sm' },
  lg: { current: 'text-3xl', original: 'text-base' },
};

/**
 * Hiển thị giá sản phẩm. Tính giá sale theo dữ liệu `price` và `productPrice.salePrice` thực tế.
 * Không hiển thị gì nếu sản phẩm không có giá hợp lệ.
 */
export default function ProductPrice({ product, size = 'md', showBadge = false, className = '' }) {
  const { currentPrice, originalPrice, onSale, discountPercent } = getProductPricing(product);
  if (currentPrice === null) {
    return <span className={`text-sm text-zinc-400 ${className}`}>Liên hệ để biết giá</span>;
  }

  const sizes = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span className={`font-bold tracking-tight ${onSale ? 'text-rose-600' : 'text-zinc-900'} ${sizes.current}`}>
        {formatCurrency(currentPrice)}
      </span>
      {onSale && (
        <span className={`text-zinc-400 line-through ${sizes.original}`}>{formatCurrency(originalPrice)}</span>
      )}
      {showBadge && onSale && Number.isFinite(discountPercent) && (
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 ring-1 ring-rose-100">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
