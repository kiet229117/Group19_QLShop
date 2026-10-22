import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import ModalShell from './ModalShell';
import { deleteProduct } from '../services/productService';
import { getApiErrorMessage, getErrorStatus, isConstraintError } from '../utils/apiError';

export default function ConfirmDeleteModal({ product, auth, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (deleting) return;
    if (!auth.canWrite) {
      auth.requestLogin();
      setError('Bạn cần đăng nhập tài khoản ADMIN để xóa sản phẩm.');
      return;
    }
    if (!auth.canDelete) {
      setError('Chỉ tài khoản ADMIN mới được xóa sản phẩm (tài khoản STAFF không có quyền này).');
      return;
    }
    setDeleting(true);
    setError('');
    try {
      await deleteProduct(product.id);
      onDeleted(product);
    } catch (err) {
      if (getErrorStatus(err) === 401) auth.requestLogin();
      setError(
        isConstraintError(err)
          ? 'Không thể xóa vì sản phẩm đã phát sinh dữ liệu liên quan (đơn hàng, phiếu nhập kho, giỏ hàng...). Hãy đưa tồn kho về 0 thay vì xóa.'
          : getApiErrorMessage(err, 'Không thể xóa sản phẩm.'),
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ModalShell
      title="Xóa sản phẩm"
      size="sm"
      onClose={onClose}
      disableClose={deleting}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-3.5 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold disabled:opacity-60"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Xóa vĩnh viễn
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-gray-700 leading-relaxed">
          Bạn sắp xóa sản phẩm <strong className="text-gray-900">{product.name}</strong>{' '}
          <span className="text-gray-400">({product.code})</span>.
        </p>
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            Sản phẩm cùng {product.variants.length} biến thể, hình ảnh và giá khuyến mãi sẽ bị xóa khỏi database. Thao
            tác này không thể hoàn tác.
          </span>
        </div>
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-medium">{error}</div>
        )}
      </div>
    </ModalShell>
  );
}
