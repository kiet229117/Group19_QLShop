import ShopModal from './ShopModal';
import ShopButton from './ShopButton';

/**
 * Hộp thoại xác nhận thao tác trên giao diện (VD: xóa sản phẩm khỏi giỏ, hủy đơn hàng mô phỏng).
 */
export default function ConfirmDialog({
  open,
  title = 'Xác nhận thao tác',
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  onConfirm,
  onClose,
}) {
  return (
    <ShopModal open={open} title={title} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-6">
        {description && <p className="text-sm leading-relaxed text-zinc-600">{description}</p>}
        <div className="flex items-center justify-end gap-2.5">
          <ShopButton variant="outline" size="sm" onClick={onClose}>
            {cancelLabel}
          </ShopButton>
          <ShopButton
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </ShopButton>
        </div>
      </div>
    </ShopModal>
  );
}
