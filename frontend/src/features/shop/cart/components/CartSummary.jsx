import { useState } from 'react';
import { Ticket, CheckCircle2, ArrowRight, Truck, Sparkles, X } from 'lucide-react';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { formatCurrency } from '../../shared/utils/formatters';
import { shopPaths } from '../../shopPaths';

/**
 * Tóm tắt đơn hàng và áp dụng voucher mô phỏng trên trang Giỏ hàng.
 */
export default function CartSummary({
  summary,
  vouchers = [],
  appliedVoucherCode = '',
  onApplyVoucher,
  onProceedCheckout,
}) {
  const [codeInput, setCodeInput] = useState(appliedVoucherCode);
  const [feedback, setFeedback] = useState(null);

  const {
    selectedCount,
    subtotal,
    shippingFee,
    discount,
    totalAmount,
    activeVoucher,
    freeShippingThreshold,
  } = summary;

  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCode = (e) => {
    e.preventDefault();
    const res = onApplyVoucher?.(codeInput);
    if (res) setFeedback(res);
  };

  const handleSelectSuggestedVoucher = (code) => {
    const nextCode = appliedVoucherCode === code ? '' : code;
    setCodeInput(nextCode);
    const res = onApplyVoucher?.(nextCode);
    if (res) setFeedback(res);
  };

  return (
    <aside className="space-y-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h2 className="text-lg font-black tracking-tight text-zinc-900">
          Tóm tắt đơn hàng
        </h2>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">
          {selectedCount} sản phẩm đã chọn
        </span>
      </div>

      {/* Thanh tiến độ miễn phí vận chuyển minh họa */}
      <div className="rounded-2xl bg-emerald-50/70 p-3.5 text-xs text-emerald-900 ring-1 ring-emerald-100">
        <div className="flex items-center gap-2 font-semibold">
          <Truck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          {subtotal === 0 ? (
            <span>Chọn sản phẩm để tính phí vận chuyển</span>
          ) : remainingForFreeShip > 0 ? (
            <span>
              Mua thêm <strong>{formatCurrency(remainingForFreeShip)}</strong> để được{' '}
              <strong>Miễn phí vận chuyển</strong>
            </span>
          ) : (
            <span>Đơn hàng của bạn đã đủ điều kiện Miễn phí vận chuyển!</span>
          )}
        </div>
      </div>

      {/* Nhập hoặc chọn voucher */}
      <div className="space-y-3 border-t border-zinc-100 pt-4">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <Ticket className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Mã giảm giá / Voucher (Mô phỏng)
        </label>

        <form onSubmit={handleApplyCode} className="flex gap-2">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="Nhập mã (VD: QLSHOP50)"
            className="h-10 flex-1 rounded-xl border border-zinc-200 px-3.5 text-sm font-semibold uppercase text-zinc-900 placeholder:normal-case placeholder:font-normal placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
          <ShopButton type="submit" variant="outline" size="sm">
            Áp dụng
          </ShopButton>
        </form>

        {feedback && (
          <p
            className={`text-xs font-medium ${
              feedback.ok ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {feedback.message}
          </p>
        )}

        {/* Danh sách voucher mẫu có thể bấm chọn ngay */}
        {vouchers.length > 0 && (
          <div className="space-y-2 pt-1">
            {vouchers.map((v) => {
              const isSelected = appliedVoucherCode === v.code;
              const eligible = subtotal >= v.minOrder;
              return (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => handleSelectSuggestedVoucher(v.code)}
                  className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-zinc-900 px-2 py-0.5 text-[11px] font-bold text-white">
                        {v.code}
                      </span>
                      {!eligible && subtotal > 0 && (
                        <span className="text-[11px] text-amber-600">
                          (Đơn tối thiểu {formatCurrency(v.minOrder)})
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-zinc-600">{v.title}</p>
                  </div>
                  {isSelected ? (
                    <X className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-300" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chi tiết tiền */}
      <dl className="space-y-3 border-t border-zinc-100 pt-4 text-sm">
        <div className="flex items-center justify-between text-zinc-600">
          <dt>Tạm tính</dt>
          <dd className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</dd>
        </div>

        <div className="flex items-center justify-between text-zinc-600">
          <dt>
            Giảm giá Voucher
            {activeVoucher && discount > 0 ? ` (${activeVoucher.code})` : ''}
          </dt>
          <dd className="font-semibold text-emerald-600">
            {discount > 0 ? `-${formatCurrency(discount)}` : '0 ₫'}
          </dd>
        </div>

        <div className="flex items-center justify-between text-zinc-600">
          <dt>Phí vận chuyển (Minh họa)</dt>
          <dd className="font-semibold text-zinc-900">
            {subtotal === 0
              ? '0 ₫'
              : shippingFee === 0
                ? 'Miễn phí'
                : formatCurrency(shippingFee)}
          </dd>
        </div>

        <div className="flex items-baseline justify-between border-t border-zinc-200 pt-3">
          <dt className="text-base font-bold text-zinc-900">Tổng thanh toán</dt>
          <dd className="text-2xl font-black tracking-tight text-rose-600">
            {formatCurrency(totalAmount)}
          </dd>
        </div>
      </dl>

      <div className="space-y-2.5 pt-2">
        <ShopButton
          variant="primary"
          size="lg"
          fullWidth
          disabled={selectedCount === 0}
          onClick={onProceedCheckout}
        >
          Tiến hành thanh toán ({selectedCount})
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ShopButton>

        <ShopButton to={shopPaths.products()} variant="outline" size="md" fullWidth>
          Tiếp tục mua sắm
        </ShopButton>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-400">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Chế độ giao diện mô phỏng — số liệu tính trực tiếp trên trình duyệt
      </p>
    </aside>
  );
}
