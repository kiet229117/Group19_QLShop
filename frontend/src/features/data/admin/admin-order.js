import { Clock, CheckCircle2, Truck, Check, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ xác nhận',
    color: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dot: 'bg-amber-500',
    icon: Clock
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    color: 'bg-blue-50 text-blue-800 border-blue-200/80',
    dot: 'bg-blue-500',
    icon: CheckCircle2
  },
  SHIPPING: {
    label: 'Đang vận chuyển',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
    dot: 'bg-indigo-500',
    icon: Truck
  },
  COMPLETED: {
    label: 'Giao thành công',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dot: 'bg-emerald-500',
    icon: Check
  },
  CANCELLED: {
    label: 'Đã hủy đơn',
    color: 'bg-rose-50 text-rose-800 border-rose-200/80',
    dot: 'bg-rose-500',
    icon: XCircle
  }
};

export const getOrderStatus = (status) => {
  return STATUS_CONFIG[status] || {
    label: status || 'Không xác định',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
    icon: Clock
  };
};

export default STATUS_CONFIG;

