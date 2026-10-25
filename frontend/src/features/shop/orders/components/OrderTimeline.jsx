import { CheckCircle2, Circle, XCircle } from 'lucide-react';

/**
 * Tiến trình đơn hàng (Đặt hàng → Xác nhận → Đang giao → Hoàn thành).
 */
export default function OrderTimeline({ timeline = [], status = 'PENDING' }) {
  if (!Array.isArray(timeline) || timeline.length === 0) return null;

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
        Tiến trình đơn hàng
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {timeline.map((step, idx) => {
          const isCancelledStep = step.step === 'CANCELLED' || status === 'CANCELLED';
          const isDone = Boolean(step.done);

          return (
            <div
              key={`${step.step}-${idx}`}
              className={`relative flex items-start gap-3 rounded-2xl border p-4 sm:flex-col ${
                isDone
                  ? isCancelledStep && step.step === 'CANCELLED'
                    ? 'border-rose-200 bg-rose-50/50'
                    : 'border-emerald-200 bg-emerald-50/40'
                  : 'border-zinc-200/70 bg-zinc-50/60'
              }`}
            >
              <div className="flex items-center gap-2">
                {isDone ? (
                  step.step === 'CANCELLED' ? (
                    <XCircle className="h-5 w-5 text-rose-600" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  )
                ) : (
                  <Circle className="h-5 w-5 text-zinc-300" aria-hidden="true" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Bước {idx + 1}
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-900">{step.label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{step.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
