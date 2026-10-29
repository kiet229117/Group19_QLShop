import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, Ticket, X, Gift, AlertTriangle } from 'lucide-react';
import ProductImage from '../../../../components/shop/common/ProductImage';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { formatCurrency } from '../../shared/utils/formatters';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { evaluateOrderAgainstApiCatalog, normalizeVoucherCode } from '../../shared/context/ShopStateContext';
import { shopPaths } from '../../shopPaths';
import { isValidShippingAddress } from '../../shared/utils/addressUtils';

/**
 * Cột tóm tắt đơn hàng bên phải trang Thanh toán (Chỉ hiển thị các Voucher khách hàng đang sở hữu từ API).
 */
export default function CheckoutSummary({
  items = [],
  summary,
  vouchers = [],
  catalogVouchers = [],
  usedVoucherCodes = new Set(),
  appliedVoucherCode = '',
  onApplyVoucher,
  shippingAddress = '',
}) {
  const { subtotal, shippingFee, discount, totalAmount, activeVoucher } = summary;
  const [feedback, setFeedback] = useState(null);
  const isAddressMissingOrInvalid = !isValidShippingAddress(shippingAddress);

  const handleToggleVoucher = async (code) => {
    const nextCode = appliedVoucherCode === code ? '' : code;
    const res = await onApplyVoucher?.(nextCode);
    if (res) setFeedback(res);
  };

  // Kiểm tra đơn hàng hiện tại sẽ mở khóa thêm những Voucher mới nào từ API sau khi đặt hàng
  // NGUYÊN TẮC: Mã đã có trong ví HOẶC mã đã từng sử dụng thì TUYỆT ĐỐI không được nhận lại
  const ownedCodes = new Set(vouchers.map((v) => normalizeVoucherCode(v.code)));
  const earnedCodesFromThisOrder = evaluateOrderAgainstApiCatalog(
    { subtotal, totalAmount, items, status: 'PENDING' },
    catalogVouchers
  );
  const upcomingRewards = catalogVouchers.filter((cv) => {
    const norm = normalizeVoucherCode(cv.code);
    return (
      earnedCodesFromThisOrder.includes(norm) &&
      !ownedCodes.has(norm) &&
      !usedVoucherCodes.has(norm)
    );
  });

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
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
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

      {/* Khu vực Voucher hiện có của tài khoản khi Thanh toán (lấy chuẩn từ API) */}
      <div className="space-y-2.5 border-t border-zinc-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600">
            <Ticket className="h-3.5 w-3.5 text-emerald-600" />
            Voucher hiện có của bạn ({vouchers.length})
          </span>
          {appliedVoucherCode && (
            <button
              type="button"
              onClick={() => handleToggleVoucher(appliedVoucherCode)}
              className="text-[11px] font-bold text-rose-600 hover:underline"
            >
              Bỏ chọn mã
            </button>
          )}
        </div>

        {feedback && (
          <p
            className={`text-xs font-medium ${
              feedback.ok ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {feedback.message}
          </p>
        )}

        {vouchers.length > 0 ? (
          <div className="space-y-2">
            {vouchers.map((v) => {
              const isSelected = appliedVoucherCode === v.code;
              const minOrderVal = Number(v.minOrderValue ?? v.minOrderAmount ?? v.minOrder ?? 0);
              const eligible = subtotal >= minOrderVal;
              return (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => handleToggleVoucher(v.code)}
                  className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500/20'
                      : 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-zinc-900 px-2 py-0.5 text-[11px] font-bold text-white">
                        {v.code}
                      </span>
                      {v.badgeText && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                          {v.badgeText}
                        </span>
                      )}
                      {!eligible && minOrderVal > 0 && (
                        <span className="text-[10px] font-semibold text-amber-600">
                          (Đơn tối thiểu {formatCurrency(minOrderVal)})
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs font-bold text-zinc-800">
                      {v.name || v.description}
                    </p>
                    {v.productName ? (
                      <p className="truncate text-[11px] font-semibold text-emerald-700">
                        Áp dụng riêng cho: {v.productName}
                      </p>
                    ) : v.unlockCondition ? (
                      <p className="truncate text-[11px] font-medium text-amber-700">
                        {v.unlockCondition}
                      </p>
                    ) : null}
                    {v.description && (
                      <p className="truncate text-[11px] text-zinc-500">{v.description}</p>
                    )}
                  </div>
                  {isSelected ? (
                    <X className="h-4 w-4 shrink-0 text-emerald-700" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-300" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-3 text-xs text-zinc-500">
            Bạn hiện chưa có voucher nào khả dụng trong ví. Hoàn tất đơn hàng đủ điều kiện để nhận ngay Voucher mới từ hệ thống!
          </div>
        )}

        {/* Thông báo phần thưởng sẽ nhận được sau khi đặt đơn này (dựa chuẩn trên API catalogVouchers) */}
        {upcomingRewards.length > 0 && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-2.5 text-[11px] text-amber-900">
            <Gift className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold">Quà tặng sau khi đặt đơn này: </span>
              <span>
                Đơn hàng của bạn đủ điều kiện nhận Voucher mới:{' '}
                <strong>
                  {upcomingRewards.map((r) => `${r.code} (${r.badgeText})`).join(' • ')}
                </strong>
                !
              </span>
            </div>
          </div>
        )}
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
            {discount > 0 ? `-${formatCurrency(discount)}` : '0 ₫'}
          </dd>
        </div>
        <div className="flex justify-between text-zinc-600">
          <dt className="flex flex-col">
            <span>Phí vận chuyển</span>
            {summary?.shippingDistanceKm != null && (
              <span className="text-[11px] text-emerald-700 font-medium">
                {summary.shippingDistanceKm} km ({summary.shippingTier})
              </span>
            )}
          </dt>
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
        {isAddressMissingOrInvalid && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>Chưa đủ địa chỉ nhận hàng:</strong> Vui lòng nhập đầy đủ số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố ở cột bên trái trước khi đặt hàng.
            </span>
          </div>
        )}

        <ShopButton type="submit" variant="primary" size="lg" fullWidth>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Xác nhận Đặt hàng ngay
        </ShopButton>

        <ShopButton to={shopPaths.cart()} variant="outline" size="md" fullWidth>
          Quay lại giỏ hàng
        </ShopButton>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-400">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Chỉ hiển thị các Voucher thuộc sở hữu của tài khoản bạn từ API
      </p>
    </aside>
  );
}
