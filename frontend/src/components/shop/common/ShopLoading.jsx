import { Loader2 } from 'lucide-react';

/**
 * Trạng thái đang tải trung tính (không chứa dữ liệu nghiệp vụ).
 * - variant="inline": spinner nhỏ kèm nhãn.
 * - variant="block": khối căn giữa dùng cho cả trang / section.
 */
export default function ShopLoading({ label = 'Đang tải dữ liệu...', variant = 'block', className = '' }) {
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-2 text-sm text-zinc-500 ${className}`} role="status">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        {label}
      </span>
    );
  }

  return (
    <div
      className={`flex min-h-[240px] flex-col items-center justify-center gap-3 text-zinc-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-zinc-900" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
