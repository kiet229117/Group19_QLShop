import { MapPin, User, Phone, Mail, FileText } from 'lucide-react';
import ShopInput from '../../../../components/shop/common/ShopInput';

/**
 * Form thông tin người nhận & địa chỉ giao hàng trên trang Thanh toán.
 * Hỗ trợ chọn nhanh từ sổ địa chỉ mẫu hoặc nhập mới, kèm hiển thị lỗi validation từng trường.
 */
export default function ShippingAddressForm({
  values,
  errors = {},
  savedAddresses = [],
  onSelectSavedAddress,
  onChangeField,
}) {
  return (
    <section className="space-y-5 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-black text-zinc-900">Thông tin giao hàng</h2>
            <p className="text-xs text-zinc-500">
              Vui lòng điền đầy đủ các thông tin có dấu (*)
            </p>
          </div>
        </div>
      </div>

      {/* Chọn nhanh từ sổ địa chỉ mẫu */}
      {savedAddresses.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Chọn nhanh địa chỉ đã lưu
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {savedAddresses.map((addr) => {
              const isSelected = values.shippingAddress === addr.address;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => onSelectSavedAddress?.(addr)}
                  className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-bold text-white">
                      {addr.label}
                    </span>
                    <span className="text-xs font-bold text-zinc-900">
                      {addr.recipientName}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-600">{addr.address}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ShopInput
          label="Họ và tên người nhận (*)"
          icon={User}
          placeholder="Nhập họ và tên"
          value={values.recipientName}
          error={errors.recipientName}
          onChange={(e) => onChangeField('recipientName', e.target.value)}
        />

        <ShopInput
          label="Số điện thoại (*)"
          icon={Phone}
          placeholder="VD: 0908 246 810"
          value={values.recipientPhone}
          error={errors.recipientPhone}
          onChange={(e) => onChangeField('recipientPhone', e.target.value)}
        />
      </div>

      <ShopInput
        label="Email nhận thông báo đơn hàng"
        icon={Mail}
        type="email"
        placeholder="example@qlshop.vn"
        value={values.recipientEmail}
        error={errors.recipientEmail}
        onChange={(e) => onChangeField('recipientEmail', e.target.value)}
      />

      <ShopInput
        label="Địa chỉ nhận hàng chi tiết (*)"
        icon={MapPin}
        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
        value={values.shippingAddress}
        error={errors.shippingAddress}
        onChange={(e) => onChangeField('shippingAddress', e.target.value)}
      />

      <div>
        <label
          htmlFor="checkout-order-note"
          className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          <FileText className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          Ghi chú đơn hàng (Tùy chọn)
        </label>
        <textarea
          id="checkout-order-note"
          rows={3}
          value={values.note}
          onChange={(e) => onChangeField('note', e.target.value)}
          placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
          className="w-full rounded-xl border border-zinc-200 bg-white p-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-100"
        />
      </div>
    </section>
  );
}
