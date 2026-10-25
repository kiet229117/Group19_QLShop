import { ArrowRight, Calendar, CreditCard, RotateCcw } from 'lucide-react';
import ProductImage from '../../../../components/shop/common/ProductImage';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { formatCurrency } from '../../shared/utils/formatters';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';
import OrderStatus from './OrderStatus';

/**
 * Thẻ tóm tắt một đơn hàng trong trang Danh sách đơn hàng.
 */
export default function OrderCard({ order, onReorder }) {
  if (!order) return null;

  const firstItems = (order.items || []).slice(0, 2);
  const extraCount = Math.max(0, (order.items?.length || 0) - firstItems.length);

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs transition hover:border-zinc-300">
      {/* Header đơn hàng */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/70 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-black text-zinc-900">Mã đơn: #{order.code || order.id}</span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {order.createdAt}
          </span>
          {order.isSimulated && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              Đơn hàng mới
            </span>
          )}
        </div>
        <OrderStatus status={order.status} />
      </div>

      {/* Danh sách sản phẩm rút gọn */}
      <div className="divide-y divide-zinc-100 px-6 py-4">
        {firstItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-100">
              <ProductImage
                src={resolveShopImageUrl(item.image)}
                alt={item.name}
                aspect="aspect-[3/4]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-zinc-900">{item.name}</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Phân loại: {item.size} / {item.color} • SL: x{item.quantity}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-zinc-900">
                {formatCurrency((item.unitPrice || 0) * (item.quantity || 1))}
              </p>
              <p className="text-xs text-zinc-400">{formatCurrency(item.unitPrice)} / SP</p>
            </div>
          </div>
        ))}

        {extraCount > 0 && (
          <p className="pt-3 text-xs font-medium text-zinc-500">
            + {extraCount} sản phẩm khác trong đơn hàng này
          </p>
        )}
      </div>

      {/* Footer tổng tiền & nút xem chi tiết */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 bg-zinc-50/40 px-6 py-4">
        <div className="space-y-0.5">
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <CreditCard className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            {order.paymentMethodLabel}
          </p>
          <p className="text-sm text-zinc-600">
            Tổng thanh toán:{' '}
            <strong className="text-lg font-black text-rose-600">
              {formatCurrency(order.totalAmount)}
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onReorder && (
            <ShopButton
              variant="outline"
              size="sm"
              onClick={() => onReorder(order)}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Mua lại
            </ShopButton>
          )}
          <ShopButton to={shopPaths.orderDetail(order.id)} variant="primary" size="sm">
            Xem chi tiết
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </ShopButton>
        </div>
      </div>
    </article>
  );
}
