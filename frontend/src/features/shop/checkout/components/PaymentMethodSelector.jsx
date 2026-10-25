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
    title: 'Chuyển khoản ngân hàng (VietQR)',
    description: 'Lựa chọn minh họa trên giao diện — không phát sinh giao dịch chuyển khoản thật.',
    icon: Building2,
    badge: 'Minh họa',
  },
  {
    id: 'E_WALLET',
    title: 'Ví điện tử MoMo / VNPAY',
    description: 'Lựa chọn minh họa cổng ví điện tử trên giao diện.',
    icon: Wallet,
    badge: 'Minh họa',
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
          Lựa chọn phương thức thanh toán (chỉ mô phỏng trên giao diện, không trừ tiền thật).
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
                  : 'border-zinc-200 hover:border-zinc-300'
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
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900">{method.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      selected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {method.badge}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {method.description}
                </p>
              </div>

              <CheckCircle2
                className={`h-5 w-5 shrink-0 ${
                  selected ? 'text-emerald-600' : 'text-zinc-200'
                }`}
                aria-hidden="true"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
