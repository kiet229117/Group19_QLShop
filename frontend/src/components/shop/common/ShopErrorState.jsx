import { AlertTriangle, Lock, SearchX, ShieldAlert, WifiOff, ServerCrash, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShopButton from './ShopButton';
import { getShopErrorInfo } from '../../../features/shop/shared/utils/errorUtils';
import { authPaths } from '../../../features/shop/shopPaths';

const ICONS = {
  network: WifiOff,
  auth: Lock,
  forbidden: ShieldAlert,
  notFound: SearchX,
  server: ServerCrash,
  request: AlertTriangle,
  unknown: AlertTriangle,
};

const TITLES = {
  network: 'Mất kết nối máy chủ',
  auth: 'Yêu cầu đăng nhập',
  forbidden: 'Không có quyền truy cập',
  notFound: 'Không tìm thấy dữ liệu',
  server: 'Máy chủ gặp sự cố',
  request: 'Không thể tải dữ liệu',
  unknown: 'Đã có lỗi xảy ra',
};

/**
 * Hiển thị lỗi API theo loại (mạng, xác thực, quyền, không tìm thấy, máy chủ).
 * Nút "Thử lại" chỉ hiện với lỗi có thể khắc phục bằng cách gọi lại (mạng / máy chủ / không xác định).
 */
export default function ShopErrorState({ error, title, message, onRetry, compact = false, className = '' }) {
  const info = getShopErrorInfo(error);
  const Icon = ICONS[info.type] || AlertTriangle;
  const canRetry = typeof onRetry === 'function' && ['network', 'server', 'unknown', 'request'].includes(info.type);

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-3xl border border-rose-100 bg-rose-50/50 text-center ${
        compact ? 'px-6 py-8' : 'px-6 py-14'
      } ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm ring-1 ring-rose-100">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-zinc-900">{title || TITLES[info.type]}</h3>
      <p className="mt-1.5 max-w-md text-sm text-zinc-600">{message || info.message}</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {canRetry && (
          <ShopButton variant="outline" size="sm" onClick={onRetry}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Thử lại
          </ShopButton>
        )}
        {info.type === 'auth' && (
          <Link
            to={authPaths.login}
            className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        )}
      </div>
    </div>
  );
}
