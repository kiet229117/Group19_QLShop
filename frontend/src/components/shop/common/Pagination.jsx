import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Tạo dãy số trang rút gọn: 1 … 4 5 6 … 20 (page là 0-based). */
function buildPageItems(page, totalPages) {
  const items = [];
  const window = 1;
  for (let i = 0; i < totalPages; i += 1) {
    const isEdge = i === 0 || i === totalPages - 1;
    const isNear = Math.abs(i - page) <= window;
    if (isEdge || isNear) {
      items.push(i);
    } else if (items[items.length - 1] !== 'gap') {
      items.push('gap');
    }
  }
  return items;
}

/**
 * Điều khiển phân trang dựa hoàn toàn trên metadata thực tế từ API.
 * @param {number} page - Trang hiện tại (0-based, giống Spring Data).
 * @param {number|null} totalPages - Tổng số trang từ API. Không render nếu thiếu hoặc <= 1.
 * @param {(page:number) => void} onPageChange
 */
export default function Pagination({ page, totalPages, onPageChange, disabled = false, className = '' }) {
  if (!Number.isFinite(totalPages) || totalPages <= 1) return null;

  const items = buildPageItems(page, totalPages);
  const baseBtn =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="Phân trang" className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button
        type="button"
        className={`${baseBtn} text-zinc-700 hover:bg-zinc-100`}
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 0}
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {items.map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-zinc-400" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            disabled={disabled}
            aria-current={item === page ? 'page' : undefined}
            className={`${baseBtn} ${
              item === page ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {item + 1}
          </button>
        )
      )}

      <button
        type="button"
        className={`${baseBtn} text-zinc-700 hover:bg-zinc-100`}
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages - 1}
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
