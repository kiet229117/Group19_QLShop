import { Star } from 'lucide-react';

/**
 * Hiển thị điểm đánh giá trung bình (thang 5) lấy từ field `rating` của sản phẩm.
 * Không render nếu chưa có điểm (null / 0) để tránh hiển thị đánh giá không có thật.
 */
export default function ProductRating({ value, size = 'sm', showValue = true, className = '' }) {
  const rating = Number(value);
  if (!Number.isFinite(rating) || rating <= 0) return null;

  const clamped = Math.min(5, Math.max(0, rating));
  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={`Đánh giá ${clamped.toFixed(1)} trên 5`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.min(1, Math.max(0, clamped - i));
          return (
            <span key={i} className={`relative inline-block ${iconSize}`}>
              <Star className={`absolute inset-0 ${iconSize} text-zinc-200`} fill="currentColor" aria-hidden="true" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${iconSize} text-amber-400`} fill="currentColor" aria-hidden="true" />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className={`font-semibold text-zinc-600 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          {clamped.toFixed(1)}
        </span>
      )}
    </div>
  );
}
