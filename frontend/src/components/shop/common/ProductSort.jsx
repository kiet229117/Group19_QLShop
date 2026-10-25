import { ArrowUpDown } from 'lucide-react';

/**
 * Các tiêu chí sắp xếp ĐÃ XÁC MINH trong `ProductService.filterProducts` (dòng 319-327):
 *  - newest     -> Sort.by("id").descending() (mặc định)
 *  - popular    -> Sort.by("views").descending()
 *  - rating     -> Sort.by("rating").descending()
 *  - price_asc  -> Sort.by("price").ascending()
 *  - price_desc -> Sort.by("price").descending()
 */
const VERIFIED_SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'popular', label: 'Xem nhiều nhất' },
  { value: 'rating', label: 'Đánh giá cao' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
];

export default function ProductSort({ value = 'newest', onChange, className = '' }) {
  const current = VERIFIED_SORT_OPTIONS.some((o) => o.value === value) ? value : 'newest';

  return (
    <label className={`inline-flex items-center gap-2 text-sm text-zinc-600 ${className}`}>
      <ArrowUpDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
      <span className="hidden sm:inline">Sắp xếp:</span>
      <select
        value={current}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 rounded-full border border-zinc-200 bg-white px-3.5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 focus:border-zinc-900 focus:outline-none"
      >
        {VERIFIED_SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
