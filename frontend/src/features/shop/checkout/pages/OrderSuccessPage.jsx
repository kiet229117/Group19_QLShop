import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, FileText, ShoppingBag, Sparkles } from 'lucide-react';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { useShopState } from '../../shared/context/ShopStateContext';
import { formatCurrency } from '../../shared/utils/formatters';
import { shopPaths } from '../../shopPaths';
import VietQRPaymentCard from '../components/VietQRPaymentCard';

/**
 * Trang Xác nhận đặt hàng thành công (`/shop/checkout/success`).
 */
export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders } = useShopState();

  const order =
    orders.find((o) => String(o.id) === String(orderId) || String(o.code) === String(orderId)) || orders[0] || null;

  const isBankTransfer =
    order?.paymentMethod === 'BANK_TRANSFER' ||
    sessionStorage.getItem('last_payment_method') === 'BANK_TRANSFER';

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Đơn hàng đã được xác nhận thành công
        </span>

        <h1 className="mt-4 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
          Cảm ơn bạn đã đặt hàng!
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-zinc-500">
          Đơn hàng của bạn đã được ghi nhận vào hệ thống QLShop. Chúng tôi sẽ nhanh chóng chuẩn bị hàng và giao đến bạn.
        </p>

        {order && (
          <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 text-left text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-400">Mã đơn hàng</p>
                <p className="font-black text-zinc-900">#{order.code || order.id}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Thời gian tạo</p>
                <p className="font-semibold text-zinc-800">{order.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Người nhận</p>
                <p className="font-semibold text-zinc-800">
                  {order.recipientName} ({order.recipientPhone})
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Tổng thanh toán</p>
                <p className="font-black text-rose-600">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
            <div className="mt-3 border-t border-zinc-200/70 pt-3 text-xs text-zinc-600">
              <strong className="text-zinc-800">Địa chỉ giao hàng:</strong> {order.shippingAddress}
            </div>
          </div>
        )}

        {/* Khung hướng dẫn quét mã VietQR nếu chọn chuyển khoản ngân hàng */}
        {order && isBankTransfer && (
          <div className="mt-6">
            <VietQRPaymentCard order={order} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {order && (
            <ShopButton to={shopPaths.orderDetail(order.id)} variant="primary" size="lg">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Xem chi tiết đơn hàng
            </ShopButton>
          )}
          <ShopButton to={shopPaths.orders()} variant="outline" size="lg">
            Danh sách đơn hàng
          </ShopButton>
          <ShopButton to={shopPaths.products()} variant="ghost" size="lg">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Tiếp tục mua sắm
          </ShopButton>
        </div>
      </div>
    </div>
  );
}
