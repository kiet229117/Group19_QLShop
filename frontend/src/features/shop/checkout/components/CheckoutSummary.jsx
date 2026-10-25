import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import ProductImage from '../../../../components/shop/common/ProductImage';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { formatCurrency } from '../../shared/utils/formatters';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';

/**
 * Cột tóm tắt đơn hàng bên phải trang Thanh toán.
 */
export default function CheckoutSummary({ items = [], summary }) {
  const { subtotal, shippingFee, discount, totalAmount, activeVoucher } = summary;

  return (
    <aside className="space-y-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h2 className="text-lg font-black tracking-tight text-zinc-900">
          Đơn hàng ({items.length} dòng SP)
        </h2>
        <ShopButton to={shopPaths.cart()} variant="ghost" size="sm">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Sửa giỏ hàng
        </ShopButton>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3.5">
            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-100">
              <ProductImage
                src={resolveShopImageUrl(item.image)}
                alt={item.name}
                aspect="aspect-[3/4]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-zinc-900">{item.name}</p>
              <p className="text-xs text-zinc-500">
                Size {item.size} • {item.color} • x{item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold text-zinc-900">
              {formatCurrency((item.unitPrice || 0) * (item.quantity || 1))}
            </p>
          </div>
        ))}
      </div>

      {/* Chi tiết tính tiền */}
      <dl className="space-y-2.5 border-t border-zinc-100 pt-4 text-sm">
        <div className="flex justify-between text-zinc-600">
          <dt>Tạm tính</dt>
          <dd className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-zinc-600">
          <dt>
            Mã giảm giá
            {activeVoucher && discount > 0 ? ` (${activeVoucher.code})` : ''}
          </dt>
          <dd className="font-semibold text-emerald-600">
            {discount > 0 ? `-${formatCurrency(discount)}` : '0 ₫'}
          </dd>
        </div>
        <div className="flex justify-between text-zinc-600">
          <dt>Phí vận chuyển (Minh họa)</dt>
          <dd className="font-semibold text-zinc-900">
            {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-zinc-200 pt-3">
          <dt className="text-base font-bold text-zinc-900">Tổng thanh toán</dt>
          <dd className="text-2xl font-black text-rose-600">
            {formatCurrency(totalAmount)}
          </dd>
        </div>
      </dl>

      <div className="space-y-2.5 pt-1">
        <ShopButton type="submit" variant="primary" size="lg" fullWidth>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Đặt hàng ngay (Mô phỏng)
        </ShopButton>

        <ShopButton to={shopPaths.cart()} variant="outline" size="md" fullWidth>
          Quay lại giỏ hàng
        </ShopButton>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-400">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Đơn hàng chỉ tạo trong phiên trình duyệt, không gọi API hay thanh toán thật.
      </p>
    </aside>
  );
}
