import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import ProductImage from '../../../../components/shop/common/ProductImage';
import ProductQuantitySelector from '../../../../components/shop/common/ProductQuantitySelector';
import { formatCurrency } from '../../shared/utils/formatters';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';

/**
 * Hiển thị một dòng sản phẩm trong giỏ hàng.
 */
export default function CartItem({
  item,
  onToggleSelect,
  onQuantityChange,
  onRemove,
}) {
  if (!item) return null;

  const lineTotal = (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1);
  const hasDiscount =
    Number(item.originalPrice) > 0 && Number(item.originalPrice) > Number(item.unitPrice);
  const detailLink = item.slug ? shopPaths.productDetail(item.slug) : shopPaths.products();

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:gap-5 ${
        item.selected
          ? 'border-zinc-200 bg-white shadow-xs'
          : 'border-zinc-200/60 bg-zinc-50/50 opacity-80'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <input
          type="checkbox"
          checked={Boolean(item.selected)}
          onChange={() => onToggleSelect?.(item.id)}
          aria-label={`Chọn ${item.name}`}
          className="h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-emerald-500"
        />

        <Link
          to={detailLink}
          className="block h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-100"
        >
          <ProductImage
            src={resolveShopImageUrl(item.image)}
            alt={item.name}
            aspect="aspect-[3/4]"
          />
        </Link>

        {/* Thông tin trên mobile nằm cạnh ảnh */}
        <div className="min-w-0 flex-1 sm:hidden">
          {item.brandName && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {item.brandName}
            </p>
          )}
          <Link
            to={detailLink}
            className="line-clamp-2 text-sm font-bold text-zinc-900 hover:text-emerald-700"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-xs text-zinc-500">
            Phân loại: <strong className="text-zinc-700">{item.size}</strong> •{' '}
            <strong className="text-zinc-700">{item.color}</strong>
          </p>
        </div>
      </div>

      {/* Thông tin trên màn hình >= sm */}
      <div className="hidden min-w-0 flex-1 sm:block">
        {item.brandName && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {item.brandName}
          </p>
        )}
        <Link
          to={detailLink}
          className="line-clamp-1 text-base font-bold text-zinc-900 transition hover:text-emerald-700"
        >
          {item.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-lg bg-zinc-100 px-2.5 py-0.5 font-semibold text-zinc-700">
            Size: {item.size}
          </span>
          <span className="rounded-lg bg-zinc-100 px-2.5 py-0.5 font-semibold text-zinc-700">
            Màu: {item.color}
          </span>
          {item.stockQuantity && (
            <span className="text-zinc-400">Còn {item.stockQuantity} SP</span>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-bold text-zinc-900">
            {formatCurrency(item.unitPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Điều chỉnh số lượng + Thành tiền + Xóa */}
      <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-3 sm:border-0 sm:pt-0">
        <ProductQuantitySelector
          size="sm"
          value={item.quantity}
          min={1}
          max={item.stockQuantity || 99}
          onChange={(nextQty) => onQuantityChange?.(item.id, nextQty)}
        />

        <div className="min-w-[110px] text-right">
          <p className="text-xs text-zinc-400 sm:hidden">Thành tiền</p>
          <p className="text-base font-black text-rose-600">
            {formatCurrency(lineTotal)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove?.(item.id)}
          aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
          title="Xóa sản phẩm"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
