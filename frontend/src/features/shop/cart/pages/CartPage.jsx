import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopButton from '../../../../components/shop/common/ShopButton';
import ConfirmDialog from '../../../../components/shop/common/ConfirmDialog';
import { useShopState } from '../../shared/context/ShopStateContext';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import { shopPaths } from '../../shopPaths';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import EmptyCart from '../components/EmptyCart';

/**
 * Trang Giỏ hàng (`/shop/cart`).
 */
export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    cartSummary,
    vouchers,
    catalogVouchers,
    usedVoucherCodes,
    appliedVoucherCode,
    updateCartQuantity,
    removeCartItem,
    clearSelectedCartItems,
    toggleSelectCartItem,
    toggleSelectAllCart,
    applyVoucher,
    syncCartStockWithServer,
  } = useShopState();

  const [itemToRemove, setItemToRemove] = useState(null);
  const [confirmClearSelected, setConfirmClearSelected] = useState(false);

  // Mỗi khi khách mở trang Giỏ hàng, đồng bộ lại tồn kho mới nhất trên DB
  useEffect(() => {
    syncCartStockWithServer?.(false);
  }, [syncCartStockWithServer]);

  const outOfStockItems = cartSummary.outOfStockItems || [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Giỏ hàng' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Giỏ hàng của bạn
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
            Kiểm tra sản phẩm ({cartSummary.totalCount})
          </h1>
        </div>
        <ShopButton to={shopPaths.products()} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Tiếp tục mua sắm
        </ShopButton>
      </div>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Danh sách sản phẩm trong giỏ */}
          <div className="space-y-4 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3.5">
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-zinc-800">
                <input
                  type="checkbox"
                  checked={cartSummary.allSelected}
                  onChange={(e) => toggleSelectAllCart(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-emerald-500"
                />
                <span>
                  Chọn tất cả ({cartItems.length} dòng sản phẩm)
                </span>
              </label>

              {cartSummary.selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmClearSelected(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Xóa mục đã chọn ({cartSummary.selectedItems.length})
                </button>
              )}
            </div>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onToggleSelect={toggleSelectCartItem}
                  onQuantityChange={updateCartQuantity}
                  onRemove={() => setItemToRemove(item)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-zinc-200/70 bg-white px-4 py-3 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>
                Đổi trả dễ dàng trong 30 ngày • Kiểm tra hàng trước khi nhận • Tích lũy Voucher tự động theo đơn hàng.
              </span>
            </div>
          </div>

          {/* Cột tóm tắt đơn hàng */}
          <div className="lg:col-span-4">
            <CartSummary
              summary={cartSummary}
              vouchers={vouchers}
              catalogVouchers={catalogVouchers}
              usedVoucherCodes={usedVoucherCodes}
              appliedVoucherCode={appliedVoucherCode}
              onApplyVoucher={applyVoucher}
              onProceedCheckout={() => {
                if (!isAuthenticated) {
                  toast.warning('Vui lòng đăng nhập để tiến hành thanh toán!');
                  navigate('/login', { state: { from: { pathname: shopPaths.checkout() } } });
                  return;
                }
                navigate(shopPaths.checkout());
              }}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        title="Xóa sản phẩm khỏi giỏ hàng"
        description={
          itemToRemove
            ? `Bạn có chắc muốn xóa "${itemToRemove.name}" (Size ${itemToRemove.size}, Màu ${itemToRemove.color}) khỏi giỏ hàng?`
            : ''
        }
        confirmLabel="Xóa khỏi giỏ"
        onConfirm={() => itemToRemove && removeCartItem(itemToRemove.id)}
        onClose={() => setItemToRemove(null)}
      />

      <ConfirmDialog
        open={confirmClearSelected}
        title="Xóa các sản phẩm đã chọn"
        description={`Bạn có chắc muốn xóa ${cartSummary.selectedItems.length} sản phẩm đang chọn khỏi giỏ hàng?`}
        confirmLabel="Xóa đã chọn"
        onConfirm={clearSelectedCartItems}
        onClose={() => setConfirmClearSelected(false)}
      />
    </div>
  );
}
