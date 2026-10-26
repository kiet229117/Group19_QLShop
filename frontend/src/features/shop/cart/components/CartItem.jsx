import { Link } from 'react-router-dom';
import { Trash2, AlertTriangle, XCircle } from 'lucide-react';
import ProductImage from '../../../../components/shop/common/ProductImage';
import ProductQuantitySelector from '../../../../components/shop/common/ProductQuantitySelector';
import { formatCurrency } from '../../shared/utils/formatters';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';

/**
 * Hiển thị một dòng sản phẩm trong giỏ hàng (Có cảnh báo trực tiếp khi phân loại hết hàng hoặc sắp hết).
 */
export default function CartItem({
  item,
  onToggleSelect,
  onQuantityChange,
  onRemove,
}) {
  if (!item) return null;

  const stockQty = item.stockQuantity !== undefined ? Number(item.stockQuantity) : 20;
  const isOutOfStock = Boolean(item.outOfStock) || stockQty <= 0;
  const isLowStock = !isOutOfStock && stockQty <= 5;

  const lineTotal = (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1);
  const hasDiscount =
    Number(item.originalPrice) > 0 && Number(item.originalPrice) > Number(item.unitPrice);
  const detailLink = item.slug ? shopPaths.productDetail(item.slug) : shopPaths.products();

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:gap-5 ${
        isOutOfStock
          ? 'border-rose-200 bg-rose-50/40'
          : item.selected
          ? 'border-zinc-200 bg-white shadow-xs'
          : 'border-zinc-200/60 bg-zinc-50/50 opacity-80'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <input
          type="checkbox"
          checked={!isOutOfStock && Boolean(item.selected)}
          disabled={isOutOfStock}
          onChange={() => onToggleSelect?.(item.id)}
          aria-label={`Chọn ${item.name}`}
          className="h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        />

        <Link
          to={detailLink}
          className="relative block h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-100"
        >
          <ProductImage
            src={resolveShopImageUrl(item.image)}
            alt={item.name}
            aspect="aspect-[3/4]"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/75 p-1 text-center text-[10px] font-extrabold uppercase tracking-wider text-white">
              Hết hàng
            </div>
          )}
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
          {isOutOfStock && (
            <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
              <XCircle className="h-3 w-3 shrink-0" />
              Sản phẩm vừa hết hàng
            </p>
          )}
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
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-2.5 py-0.5 font-bold text-rose-700 ring-1 ring-rose-200">
              <XCircle className="h-3.5 w-3.5 shrink-0" />
              Phân loại này đã hết hàng (0 SP)
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-0.5 font-bold text-amber-800">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              Sắp hết • Chỉ còn {stockQty} SP
            </span>
          ) : (
            <span className="text-zinc-400">Còn {stockQty} SP</span>
          )}
        </div>

        {isOutOfStock && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">
            Sản phẩm bạn để trong giỏ hiện đã được đặt hết. Vui lòng xóa khỏi giỏ hoặc bấm vào sản phẩm để chọn Size/Màu khác.
          </p>
        )}

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
          max={Math.max(1, stockQty)}
          disabled={isOutOfStock}
          onChange={(nextQty) => onQuantityChange?.(item.id, nextQty)}
        />

        <div className="min-w-[110px] text-right">
          <p className="text-xs text-zinc-400 sm:hidden">Thành tiền</p>
          {isOutOfStock ? (
            <p className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
              Tạm hết hàng
            </p>
          ) : (
            <p className="text-base font-black text-rose-600">
              {formatCurrency(lineTotal)}
            </p>
          )}
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
