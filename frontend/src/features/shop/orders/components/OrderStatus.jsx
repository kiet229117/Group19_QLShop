import { CheckCircle2, Clock, PackageCheck, Truck, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ xác nhận',
    badgeClass: 'bg-amber-50 text-amber-800 ring-amber-200',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    badgeClass: 'bg-sky-50 text-sky-800 ring-sky-200',
    icon: PackageCheck,
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    badgeClass: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
    icon: Truck,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    badgeClass: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Đã hủy',
    badgeClass: 'bg-rose-50 text-rose-700 ring-rose-200',
    icon: XCircle,
  },
};

/**
 * Badge hiển thị trạng thái đơn hàng.
 */
export default function OrderStatus({ status = 'PENDING', className = '' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${cfg.badgeClass} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
