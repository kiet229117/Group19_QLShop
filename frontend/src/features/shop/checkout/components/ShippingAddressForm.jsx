import { Link } from 'react-router-dom';
import { MapPin, User, Phone, Mail, FileText, AlertTriangle, Info } from 'lucide-react';
import ShopInput from '../../../../components/shop/common/ShopInput';
import AddressAutocompleteInput from '../../../../components/shop/common/AddressAutocompleteInput';
import { shopPaths } from '../../shopPaths';
import { isPlaceholderAddress } from '../../shared/utils/addressUtils';

/**
 * Form thông tin người nhận & địa chỉ giao hàng trên trang Thanh toán.
 * Cảnh báo rõ ràng khi tài khoản chưa cập nhật địa chỉ nhận hàng hoặc nhập sai thông tin.
 */
export default function ShippingAddressForm({
  values,
  errors = {},
  savedAddresses = [],
  profileDefaultAddress = '',
  onSelectSavedAddress,
  subtotal = 0,
  onLocationChange,
  onChangeField,
  onBlurField,
}) {
  const errorMessages = Object.values(errors).filter(Boolean);
  const isAddressMissing = isPlaceholderAddress(values.shippingAddress);

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
              Vui lòng điền đầy đủ và chính xác các thông tin có dấu (*)
            </p>
          </div>
        </div>
      </div>

      {/* Cảnh báo khi tài khoản chưa cập nhật địa chỉ mặc định và ô địa chỉ đang trống */}
      {isAddressMissing && errorMessages.length === 0 && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-2xs"
        >
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-extrabold text-amber-950">
                Bạn chưa cập nhật địa chỉ nhận hàng!
              </p>
              <p className="text-amber-800">
                {!profileDefaultAddress
                  ? 'Hồ sơ cá nhân của bạn hiện chưa có địa chỉ giao hàng mặc định. Vui lòng nhập đầy đủ địa chỉ nhận hàng chi tiết bên dưới (hoặc cập nhật trong Hồ sơ) để có thể đặt hàng.'
                  : 'Vui lòng nhập đầy đủ địa chỉ nhận hàng chi tiết (Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố) trước khi đặt hàng.'}
              </p>
            </div>
          </div>
          <Link
            to={shopPaths.profile()}
            className="shrink-0 rounded-xl border border-amber-400 bg-white px-3 py-1.5 text-[11px] font-bold text-amber-900 transition hover:bg-amber-100"
          >
            Cập nhật Hồ sơ
          </Link>
        </div>
      )}

      {/* Cảnh báo tổng hợp nổi bật nếu người dùng bỏ trống hoặc nhập sai thông tin */}
      {errorMessages.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-800 shadow-2xs"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-extrabold text-rose-900">
              Không thể đặt hàng — Vui lòng kiểm tra lại thông tin nhận hàng ({errorMessages.length} mục chưa hợp lệ):
            </p>
            <ul className="list-disc space-y-0.5 pl-4 font-medium text-rose-700">
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
          name="recipientName"
          label="Họ và tên người nhận (*)"
          icon={User}
          placeholder="Nhập họ và tên người nhận"
          value={values.recipientName}
          error={errors.recipientName}
          onChange={(e) => onChangeField('recipientName', e.target.value)}
          onBlur={() => onBlurField?.('recipientName')}
        />

        <ShopInput
          name="recipientPhone"
          label="Số điện thoại (*)"
          icon={Phone}
          placeholder="VD: 0912345678"
          value={values.recipientPhone}
          error={errors.recipientPhone}
          onChange={(e) => onChangeField('recipientPhone', e.target.value)}
          onBlur={() => onBlurField?.('recipientPhone')}
        />
      </div>

      <ShopInput
        name="recipientEmail"
        label="Email nhận thông báo đơn hàng"
        icon={Mail}
        type="email"
        placeholder="example@qlshop.vn"
        value={values.recipientEmail}
        error={errors.recipientEmail}
        onChange={(e) => onChangeField('recipientEmail', e.target.value)}
        onBlur={() => onBlurField?.('recipientEmail')}
      />

      <AddressAutocompleteInput
        name="shippingAddress"
        label="Địa chỉ nhận hàng chi tiết (*)"
        icon={MapPin}
        placeholder="Nhập số nhà, tên đường hoặc tìm kiếm tự động (VD: 268 Lý Thường Kiệt...)"
        value={values.shippingAddress}
        subtotal={subtotal}
        onLocationChange={onLocationChange}
        error={errors.shippingAddress}
        onChange={(e) => onChangeField('shippingAddress', e.target.value)}
        onBlur={() => onBlurField?.('shippingAddress')}
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
