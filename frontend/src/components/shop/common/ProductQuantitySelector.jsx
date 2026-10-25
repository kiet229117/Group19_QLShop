import { Minus, Plus } from 'lucide-react';

/**
 * Bộ chọn số lượng sản phẩm dùng chung (Chi tiết sản phẩm & Giỏ hàng).
 */
export default function ProductQuantitySelector({
  value = 1,
  min = 1,
  max = 99,
  size = 'md',
  disabled = false,
  onChange,
  className = '',
}) {
  const current = Math.max(min, Math.min(max, Number(value) || min));
  const isSmall = size === 'sm';

  const handleDecrease = () => {
    if (!disabled && current > min) {
      onChange?.(current - 1);
    }
  };

  const handleIncrease = () => {
    if (!disabled && current < max) {
      onChange?.(current + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border border-zinc-200 bg-white ${
        isSmall ? 'h-9 px-1' : 'h-11 px-1.5'
      } ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || current <= min}
        aria-label="Giảm số lượng"
        className={`inline-flex items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-35 ${
          isSmall ? 'h-7 w-7' : 'h-8 w-8'
        }`}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <span
        className={`select-none text-center font-bold text-zinc-900 ${
          isSmall ? 'min-w-8 text-xs' : 'min-w-10 text-sm'
        }`}
        aria-live="polite"
      >
        {current}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || current >= max}
        aria-label="Tăng số lượng"
        className={`inline-flex items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-35 ${
          isSmall ? 'h-7 w-7' : 'h-8 w-8'
        }`}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
