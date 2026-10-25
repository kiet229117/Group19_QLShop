import { useState } from 'react';
import { Filter, RotateCcw, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import ShopButton from './ShopButton';
import ShopInput from './ShopInput';

/**
 * Bộ lọc sản phẩm chỉ hiển thị đúng các tiêu chí mà `ProductFilterRequest` và `ProductSpecification`
 * trên Backend thực tế xử lý:
 *  - categoryId (Long)
 *  - brandId (Long)
 *  - minPrice, maxPrice (Double)
 *  - shirtSize (String – so sánh bằng không phân biệt hoa thường trên `variants.size`)
 *  - color (String – tìm kiếm LIKE không phân biệt hoa thường trên `variants.color`)
 *  - inStock, hasSale, isHot (Boolean)
 */
export default function ProductFilter({
  filters = {},
  categories = [],
  brands = [],
  hideCategory = false,
  hideBrand = false,
  onChange,
  onReset,
  className = '',
}) {
  // Cho phép gõ khoảng giá/size/màu rồi bấm Áp dụng (đồng bộ từ props khi URL thay đổi bằng key ở form con)
  const priceSizeKey = `${filters.minPrice || ''}|${filters.maxPrice || ''}|${filters.shirtSize || ''}|${filters.color || ''}`;

  const updateImmediate = (patch) => {
    onChange?.({ ...filters, ...patch, page: 0 });
  };

  const hasActiveFilter = Boolean(
    (!hideCategory && filters.categoryId) ||
      (!hideBrand && filters.brandId) ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.shirtSize ||
      filters.color ||
      filters.inStock ||
      filters.hasSale ||
      filters.isHot
  );

  return (
    <aside className={`space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-5 ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900">
          <Filter className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          Bộ lọc sản phẩm
        </div>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Xóa lọc
          </button>
        )}
      </div>

      {/* Tình trạng nhanh (boolean flags trong ProductSpecification) */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Tình trạng</p>
        <div className="flex flex-wrap gap-2">
          <FilterToggleChip
            active={Boolean(filters.inStock)}
            onClick={() => updateImmediate({ inStock: !filters.inStock })}
            icon={CheckCircle2}
            label="Còn hàng"
          />
          <FilterToggleChip
            active={Boolean(filters.hasSale)}
            onClick={() => updateImmediate({ hasSale: !filters.hasSale })}
            icon={Sparkles}
            label="Đang giảm giá"
          />
          <FilterToggleChip
            active={Boolean(filters.isHot)}
            onClick={() => updateImmediate({ isHot: !filters.isHot })}
            icon={Flame}
            label="Sản phẩm Hot"
          />
        </div>
      </div>

      {/* Danh mục từ API thực tế */}
      {!hideCategory && categories.length > 0 && (
        <div className="space-y-2.5 border-t border-zinc-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Danh mục</p>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            <FilterRadioRow
              checked={!filters.categoryId}
              onSelect={() => updateImmediate({ categoryId: '' })}
              label="Tất cả danh mục"
            />
            {categories.map((cat) => (
              <FilterRadioRow
                key={cat.id}
                checked={String(filters.categoryId) === String(cat.id)}
                onSelect={() => updateImmediate({ categoryId: String(cat.id) })}
                label={cat.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Thương hiệu từ API thực tế */}
      {!hideBrand && brands.length > 0 && (
        <div className="space-y-2.5 border-t border-zinc-100 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Thương hiệu</p>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            <FilterRadioRow
              checked={!filters.brandId}
              onSelect={() => updateImmediate({ brandId: '' })}
              label="Tất cả thương hiệu"
            />
            {brands.map((brand) => (
              <FilterRadioRow
                key={brand.id}
                checked={String(filters.brandId) === String(brand.id)}
                onSelect={() => updateImmediate({ brandId: String(brand.id) })}
                label={brand.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Khoảng giá + Size + Màu sắc (gửi khi bấm Áp dụng) */}
      <AttributeFilterForm
        key={priceSizeKey}
        initialFilters={filters}
        onApply={(patch) => updateImmediate(patch)}
      />
    </aside>
  );
}

function FilterToggleChip({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-zinc-900 bg-zinc-900 text-white'
          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300'
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

function FilterRadioRow({ checked, onSelect, label }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
        checked
          ? 'bg-emerald-50 font-semibold text-emerald-800'
          : 'text-zinc-700 hover:bg-zinc-50'
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          checked ? 'bg-emerald-600' : 'bg-transparent'
        }`}
      />
    </button>
  );
}

function AttributeFilterForm({ initialFilters, onApply }) {
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? '');
  const [shirtSize, setShirtSize] = useState(initialFilters.shirtSize ?? '');
  const [color, setColor] = useState(initialFilters.color ?? '');
  const [priceError, setPriceError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const min = minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== '' ? Number(maxPrice) : null;

    if ((min !== null && min < 0) || (max !== null && max < 0)) {
      setPriceError('Giá không được nhỏ hơn 0.');
      return;
    }
    if (min !== null && max !== null && min > max) {
      setPriceError('Giá tối thiểu không được lớn hơn giá tối đa.');
      return;
    }
    setPriceError('');

    onApply({
      minPrice: min !== null ? String(min) : '',
      maxPrice: max !== null ? String(max) : '',
      shirtSize: shirtSize.trim(),
      color: color.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-zinc-100 pt-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Khoảng giá (VND)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <ShopInput
            type="number"
            min="0"
            step="1000"
            placeholder="Từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            aria-label="Giá tối thiểu"
          />
          <ShopInput
            type="number"
            min="0"
            step="1000"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Giá tối đa"
          />
        </div>
        {priceError && <p className="text-xs text-rose-600">{priceError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ShopInput
          label="Kích cỡ"
          placeholder="VD: M, L, XL"
          value={shirtSize}
          onChange={(e) => setShirtSize(e.target.value)}
        />
        <ShopInput
          label="Màu sắc"
          placeholder="VD: Đen, Trắng"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <ShopButton type="submit" variant="primary" size="sm" fullWidth>
        Áp dụng bộ lọc
      </ShopButton>
    </form>
  );
}
