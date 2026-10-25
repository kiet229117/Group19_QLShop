import { PackageOpen } from 'lucide-react';

/**
 * Trạng thái không có dữ liệu. `action` là node tùy chọn (VD: nút xóa bộ lọc).
 */
export default function ShopEmptyState({
  icon: Icon = PackageOpen,
  title = 'Chưa có dữ liệu',
  description,
  action,
  compact = false,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/60 text-center ${
        compact ? 'px-6 py-10' : 'px-6 py-16'
      } ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm ring-1 ring-zinc-100">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-zinc-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
