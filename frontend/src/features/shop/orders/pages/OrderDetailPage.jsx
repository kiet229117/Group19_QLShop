import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  User,
  XCircle,
} from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ProductImage from '../../../../components/shop/common/ProductImage';
import ShopButton from '../../../../components/shop/common/ShopButton';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ConfirmDialog from '../../../../components/shop/common/ConfirmDialog';
import { useShopState } from '../../shared/context/ShopStateContext';
import { formatCurrency } from '../../shared/utils/formatters';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';
import OrderStatus from '../components/OrderStatus';
import OrderTimeline from '../components/OrderTimeline';

/**
 * Trang Chi tiết đơn hàng (`/shop/orders/:id`).
 * Hiển thị đầy đủ mã đơn, ngày đặt, trạng thái, người nhận, địa chỉ, danh sách sản phẩm,
 * tiến trình vận chuyển và thao tác hủy đơn / mua lại mô phỏng trên giao diện.
 */
export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, cancelOrderSimulated, reorderToCart } = useShopState();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [actionBanner, setActionBanner] = useState('');

  const order = orders.find(
    (o) => String(o.id) === String(id) || String(o.code) === String(id)
  );

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6">
        <ShopEmptyState
          title="Không tìm thấy đơn hàng"
          description="Mã đơn hàng bạn tra cứu không có trong danh sách hiện tại."
          action={
            <ShopButton to={shopPaths.orders()} variant="primary" size="sm">
              Quay lại danh sách đơn hàng
            </ShopButton>
          }
        />
      </div>
    );
  }

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  const handleReorder = () => {
    reorderToCart(order);
    navigate(shopPaths.cart());
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb
        items={[
          { label: 'Đơn hàng của tôi', to: shopPaths.orders() },
          { label: `#${order.code || order.id}` },
        ]}
      />

      {/* Thông báo mô phỏng sau khi hủy đơn */}
      {actionBanner && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>{actionBanner}</span>
        </div>
      )}

      {/* Khối tiêu đề đơn hàng */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
              Đơn hàng #{order.code || order.id}
            </h1>
            <OrderStatus status={order.status} />
          </div>
          <p className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Calendar className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            Ngày đặt hàng: <strong className="text-zinc-800">{order.createdAt}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ShopButton to={shopPaths.orders()} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Danh sách đơn hàng
          </ShopButton>

          {canCancel && (
            <ShopButton
              variant="outline"
              size="sm"
              onClick={() => setConfirmCancel(true)}
              className="border-rose-200 text-rose-600 hover:border-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Hủy đơn hàng
            </ShopButton>
          )}

          <ShopButton variant="primary" size="sm" onClick={handleReorder}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Mua lại đơn này
          </ShopButton>
        </div>
      </div>

      {/* Tiến trình đơn hàng */}
      <OrderTimeline timeline={order.timeline} status={order.status} />

      {/* Thông tin người nhận & Thanh toán */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
            Thông tin người nhận
          </h2>
          <div className="space-y-3 text-sm text-zinc-600">
            <p className="flex items-center gap-2.5">
              <User className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span className="font-bold text-zinc-900">{order.recipientName}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{order.recipientPhone}</span>
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{order.shippingAddress}</span>
            </p>
            {order.note && (
              <p className="rounded-xl bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-600">
                <strong className="text-zinc-800">Ghi chú giao hàng:</strong> {order.note}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
            Thanh toán & Vận chuyển
          </h2>
          <div className="space-y-3 text-sm text-zinc-600">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Phương thức thanh toán
              </span>
              <span className="font-semibold text-zinc-900">{order.paymentMethodLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Trạng thái thanh toán</span>
              <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-bold text-zinc-800">
                {order.paymentStatusLabel}
              </span>
            </div>
            {order.voucherCode && (
              <div className="flex items-center justify-between">
                <span>Mã giảm giá áp dụng</span>
                <span className="rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {order.voucherCode}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm trong đơn & Tổng kết tiền */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
            Sản phẩm trong đơn ({order.items?.length || 0})
          </h2>
        </div>

        <div className="divide-y divide-zinc-100 px-6">
          {(order.items || []).map((item) => {
            const lineTotal = (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1);
            const productUrl = item.slug
              ? shopPaths.productDetail(item.slug)
              : shopPaths.products();

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <Link
                    to={productUrl}
                    className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-100"
                  >
                    <ProductImage
                      src={resolveShopImageUrl(item.image)}
                      alt={item.name}
                      aspect="aspect-[3/4]"
                    />
                  </Link>
                  <div>
                    <Link
                      to={productUrl}
                      className="text-base font-bold text-zinc-900 hover:text-emerald-700"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-500">
                      Phân loại: <strong className="text-zinc-700">{item.size}</strong> •{' '}
                      <strong className="text-zinc-700">{item.color}</strong>
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Đơn giá: {formatCurrency(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-zinc-900">
                    {formatCurrency(lineTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bảng tổng tiền */}
        <div className="border-t border-zinc-100 bg-zinc-50/60 px-6 py-5">
          <dl className="ml-auto max-w-sm space-y-2.5 text-sm">
            <div className="flex justify-between text-zinc-600">
              <dt>Tạm tính</dt>
              <dd className="font-semibold text-zinc-900">{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-zinc-600">
              <dt>Phí vận chuyển</dt>
              <dd className="font-semibold text-zinc-900">
                {order.shippingFee === 0 ? 'Miễn phí' : formatCurrency(order.shippingFee)}
              </dd>
            </div>
            <div className="flex justify-between text-zinc-600">
              <dt>Giảm giá</dt>
              <dd className="font-semibold text-emerald-600">
                {order.discount > 0 ? `-${formatCurrency(order.discount)}` : '0 ₫'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-zinc-200 pt-3">
              <dt className="text-base font-bold text-zinc-900">Tổng thanh toán</dt>
              <dd className="text-2xl font-black text-rose-600">
                {formatCurrency(order.totalAmount)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Điều hướng cuối trang */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ShopButton to={shopPaths.orders()} variant="outline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Quay lại danh sách đơn hàng
        </ShopButton>
        <ShopButton to={shopPaths.products()} variant="primary">
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Tiếp tục mua sắm
        </ShopButton>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Hủy đơn hàng (Mô phỏng giao diện)"
        description={`Bạn có chắc muốn chuyển trạng thái đơn hàng #${order.code || order.id} sang "Đã hủy" trên giao diện?`}
        confirmLabel="Xác nhận hủy đơn"
        onConfirm={() => {
          cancelOrderSimulated(order.id);
          setActionBanner(
            `Đơn hàng #${order.code || order.id} đã được chuyển sang trạng thái Đã hủy (trạng thái mô phỏng trên giao diện).`
          );
        }}
        onClose={() => setConfirmCancel(false)}
      />
    </div>
  );
}
