import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, User } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { useShopState } from '../../shared/context/ShopStateContext';
import { shopPaths } from '../../shopPaths';
import OrderCard from '../components/OrderCard';

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả đơn' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

/**
 * Trang Danh sách đơn hàng (`/shop/orders`).
 * Cho phép lọc theo trạng thái và bấm vào xem chi tiết từng đơn hàng.
 */
export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, reorderToCart } = useShopState();
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredOrders =
    activeTab === 'ALL'
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const handleReorder = (order) => {
    reorderToCart(order);
    navigate(shopPaths.cart());
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Đơn hàng của tôi' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Lịch sử mua sắm
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
            Đơn hàng của tôi ({orders.length})
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Theo dõi tiến trình vận chuyển và xem chi tiết các đơn hàng trên giao diện.
          </p>
        </div>

        <ShopButton to={shopPaths.profile()} variant="outline" size="sm">
          <User className="h-4 w-4" aria-hidden="true" />
          Hồ sơ cá nhân
        </ShopButton>
      </div>

      {/* Bộ lọc trạng thái đơn hàng */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const active = activeTab === tab.key;
          const count =
            tab.key === 'ALL'
              ? orders.length
              : orders.filter((o) => o.status === tab.key).length;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-xs font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Danh sách đơn */}
      {filteredOrders.length === 0 ? (
        <ShopEmptyState
          icon={PackageSearch}
          title="Chưa có đơn hàng ở trạng thái này"
          description="Hãy chọn trạng thái khác hoặc tiếp tục khám phá sản phẩm mới tại cửa hàng."
          action={
            <ShopButton to={shopPaths.products()} variant="primary" size="sm">
              Mua sắm ngay
            </ShopButton>
          }
        />
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onReorder={handleReorder} />
          ))}
        </div>
      )}
    </div>
  );
}
