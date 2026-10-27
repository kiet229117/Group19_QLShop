import { useState } from 'react';
import { AlertCircle, AlertTriangle, Check, Loader2, X } from 'lucide-react';
import ShopButton from '../../../../components/shop/common/ShopButton';

const PRESET_REASONS = [
  'Muốn thay đổi sản phẩm, kích thước (size) hoặc màu sắc',
  'Muốn thay đổi địa chỉ nhận hàng hoặc số điện thoại người nhận',
  'Tìm thấy mẫu áo tương tự với giá tốt hơn ở nơi khác',
  'Đổi ý, hiện tại không còn nhu cầu mua sắm nữa',
  'Thời gian giao hàng dự kiến quá lâu hoặc phí vận chuyển không phù hợp',
  'Lý do khác (vui lòng ghi chi tiết bên dưới)',
];

export default function CancelOrderModal({
  open,
  orderId,
  orderCode,
  onClose,
  onSubmit,
}) {
  const [selectedReason, setSelectedReason] = useState(PRESET_REASONS[0]);
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const isOther = selectedReason === PRESET_REASONS[PRESET_REASONS.length - 1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOther && !customNote.trim()) {
      setError('Vui lòng nhập lý do cụ thể khi chọn "Lý do khác"');
      return;
    }

    const finalReason = isOther
      ? customNote.trim()
      : customNote.trim()
      ? `${selectedReason}: ${customNote.trim()}`
      : selectedReason;

    setSubmitting(true);
    setError('');
    try {
      await onSubmit(finalReason);
      onClose();
    } catch (err) {
      setError(err?.message || 'Có lỗi xảy ra khi gửi yêu cầu hủy đơn');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={submitting ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={submitting ? undefined : onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-zinc-900">
              Yêu cầu hủy đơn #{orderCode || orderId}
            </h3>
            <p className="text-xs text-zinc-500">
              Yêu cầu hủy sẽ được gửi đến Admin để xét duyệt
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 leading-relaxed">
            <p className="font-bold">Lưu ý quan trọng:</p>
            <p className="mt-0.5 text-amber-800">
              Sau khi bạn gửi yêu cầu, đơn hàng sẽ chuyển sang trạng thái <strong>Chờ duyệt hủy</strong>. Admin cửa hàng sẽ kiểm tra tiến độ đơn hàng và phản hồi duyệt hoặc liên hệ hỗ trợ bạn sớm nhất.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
              Chọn lý do hủy đơn (*):
            </label>
            <div className="space-y-2">
              {PRESET_REASONS.map((reason) => {
                const isChecked = selectedReason === reason;
                return (
                  <label
                    key={reason}
                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-xs font-medium cursor-pointer transition ${
                      isChecked
                        ? 'border-zinc-900 bg-zinc-900/5 text-zinc-900 font-bold ring-1 ring-zinc-900'
                        : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      value={reason}
                      checked={isChecked}
                      onChange={() => {
                        setSelectedReason(reason);
                        setError('');
                      }}
                      className="mt-0.5 h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span>{reason}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="cancel-custom-note"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1"
            >
              Ghi chú thêm cho cửa hàng {isOther ? '(* Bắt buộc)' : '(Tùy chọn)'}:
            </label>
            <textarea
              id="cancel-custom-note"
              rows={3}
              value={customNote}
              onChange={(e) => {
                setCustomNote(e.target.value);
                if (error) setError('');
              }}
              placeholder={
                isOther
                  ? 'Vui lòng mô tả chi tiết lý do bạn muốn hủy đơn...'
                  : 'Ghi chú thêm nếu bạn muốn giải thích chi tiết hơn cho shop...'
              }
              className="w-full rounded-xl border border-zinc-200 p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-100"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 border-t border-zinc-100 pt-4">
            <ShopButton
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={onClose}
            >
              Đóng & Giữ đơn
            </ShopButton>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang gửi yêu cầu...</span>
                </>
              ) : (
                <span>Gửi yêu cầu hủy đơn</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

