import ProductCard from './ProductCard';

const COLUMN_CLASSES = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

/** Skeleton trung tính (không chứa chữ hoặc dữ liệu giả) khi đang tải danh sách sản phẩm. */
export function ProductGridSkeleton({ count = 8, columns = 4 }) {
  const colClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[4];
  return (
    <div className={`grid gap-4 sm:gap-6 ${colClass}`} aria-hidden="true">
      {Array.from({ length: count }, (_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white"
        >
          <div className="aspect-[3/4] animate-pulse bg-zinc-100" />
          <div className="space-y-2.5 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Hiển thị danh sách sản phẩm dạng lưới, tái sử dụng `ProductCard`.
 * @param {Array} products
 * @param {Map<string, any>} categoryMap
 * @param {Map<string, any>} brandMap
 */
export default function ProductGrid({
  products = [],
  categoryMap,
  brandMap,
  columns = 4,
  className = '',
}) {
  const colClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[4];

  return (
    <div className={`grid gap-4 sm:gap-6 ${colClass} ${className}`}>
      {products.map((product) => {
        const category =
          categoryMap && product?.categoryId != null
            ? categoryMap.get(String(product.categoryId))
            : null;
        const brand =
          brandMap && product?.brandId != null
            ? brandMap.get(String(product.brandId))
            : null;

        return (
          <ProductCard
            key={product.id ?? product.slug}
            product={product}
            categoryName={category?.name}
            brandName={brand?.name}
          />
        );
      })}
    </div>
  );
}
