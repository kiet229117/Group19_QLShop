import { Banknote, Building2, Wallet, CheckCircle2 } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'COD',
    title: 'Thanh toán khi nhận hàng (COD)',
    description: 'Kiểm tra sản phẩm trước khi thanh toán tiền mặt cho nhân viên giao hàng.',
    icon: Banknote,
    badge: 'Phổ biến nhất',
  },
  {
    id: 'BANK_TRANSFER',
    title: 'Chuyển khoản ngân hàng (Quét mã QR 24/7)',
    description: 'Quét mã QR chuyển khoản nhanh 24/7 qua ứng dụng ngân hàng.',
    icon: Building2,
    badge: 'Khuyên dùng',
  },

];

/**
 * Bộ chọn phương thức thanh toán dạng thẻ rõ ràng.
 */
export default function PaymentMethodSelector({ value = 'COD', onChange }) {
  return (
    <section className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8">
      <div className="border-b border-zinc-100 pb-4">
        <h2 className="text-base font-black text-zinc-900">Phương thức thanh toán</h2>
        <p className="text-xs text-zinc-500">
          Vui lòng chọn hình thức thanh toán thuận tiện nhất cho bạn.
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Phương thức thanh toán">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const selected = value === method.id;

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                selected
                  ? 'border-zinc-900 bg-zinc-900/[0.03] ring-1 ring-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selected}
                onChange={() => onChange?.(method.id)}
                className="sr-only"
              />

              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                  selected
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900">{method.title}</span>
                  {method.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        selected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed">
                  {method.description}
                </p>
              </div>

              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  selected
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                {selected && <CheckCircle2 className="h-4 w-4" />}
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
