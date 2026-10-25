import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ProductFilter from '../../../../components/shop/common/ProductFilter';
import ProductSort from '../../../../components/shop/common/ProductSort';
import ProductSearch from '../../../../components/shop/common/ProductSearch';
import ProductGrid, { ProductGridSkeleton } from '../../../../components/shop/common/ProductGrid';
import ProductList from '../../../../components/shop/common/ProductList';
import Pagination from '../../../../components/shop/common/Pagination';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopErrorState from '../../../../components/shop/common/ShopErrorState';
import ShopButton from '../../../../components/shop/common/ShopButton';
import ShopModal from '../../../../components/shop/common/ShopModal';
import useShopQuery from '../../shared/hooks/useShopQuery';
import { normalizePage } from '../../shared/utils/pageUtils';
import { formatCurrency } from '../../shared/utils/formatters';
import useShopCategories from '../../categories/hooks/useShopCategories';
import useShopBrands from '../../brands/hooks/useShopBrands';
import shopProductService from '../services/shopProductService';

const DEFAULT_PAGE_SIZE = 12;

/** Đọc bộ lọc từ URL query params để có thể chia sẻ link / back-forward trình duyệt. */
function parseFiltersFromSearchParams(searchParams) {
  const pageRaw = Number.parseInt(searchParams.get('page') || '0', 10);
  return {
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    shirtSize: searchParams.get('shirtSize') || '',
    color: searchParams.get('color') || '',
    inStock: searchParams.get('inStock') === 'true',
    hasSale: searchParams.get('hasSale') === 'true',
    isHot: searchParams.get('isHot') === 'true',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: Number.isFinite(pageRaw) && pageRaw >= 0 ? pageRaw : 0,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

function buildSearchParams(filters) {
  const params = new URLSearchParams();
  if (filters.keyword) params.set('keyword', filters.keyword);
  if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
  if (filters.brandId) params.set('brandId', String(filters.brandId));
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.shirtSize) params.set('shirtSize', filters.shirtSize);
  if (filters.color) params.set('color', filters.color);
  if (filters.inStock) params.set('inStock', 'true');
  if (filters.hasSale) params.set('hasSale', 'true');
  if (filters.isHot) params.set('isHot', 'true');
  if (filters.sortBy && filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
  if (filters.page > 0) params.set('page', String(filters.page));
  return params;
}

/**
 * Trang Danh sách + Tìm kiếm + Lọc sản phẩm (`/shop/products`).
 * Gọi trực tiếp `GET /api/products/filter` với các tham số đã xác minh trong `ProductFilterRequest`.
 */
export default function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filters = parseFiltersFromSearchParams(searchParams);
  const queryKey = searchParams.toString();

  const { categories, categoryMap } = useShopCategories();
  const { brands, brandMap } = useShopBrands();

  const productsQuery = useShopQuery(
    (signal) => shopProductService.filterProducts(filters, signal),
    `catalog::${queryKey}`
  );

  const pageData = normalizePage(productsQuery.data);
  const products = pageData.items;

  const updateFilters = (nextFilters) => {
    setSearchParams(buildSearchParams(nextFilters));
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Tạo danh sách chip hiển thị các điều kiện lọc đang bật
  const activeChips = [];
  if (filters.keyword) {
    activeChips.push({
      key: 'keyword',
      label: `Từ khóa: "${filters.keyword}"`,
      onRemove: () => updateFilters({ ...filters, keyword: '', page: 0 }),
    });
  }
  if (filters.categoryId) {
    const cat = categoryMap.get(String(filters.categoryId));
    activeChips.push({
      key: 'categoryId',
      label: `Danh mục: ${cat?.name || `#${filters.categoryId}`}`,
      onRemove: () => updateFilters({ ...filters, categoryId: '', page: 0 }),
    });
  }
  if (filters.brandId) {
    const brand = brandMap.get(String(filters.brandId));
    activeChips.push({
      key: 'brandId',
      label: `Thương hiệu: ${brand?.name || `#${filters.brandId}`}`,
      onRemove: () => updateFilters({ ...filters, brandId: '', page: 0 }),
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    const minLabel = filters.minPrice ? formatCurrency(filters.minPrice) : '0₫';
    const maxLabel = filters.maxPrice ? formatCurrency(filters.maxPrice) : 'trở lên';
    activeChips.push({
      key: 'price',
      label: `Giá: ${minLabel} – ${maxLabel}`,
      onRemove: () => updateFilters({ ...filters, minPrice: '', maxPrice: '', page: 0 }),
    });
  }
  if (filters.shirtSize) {
    activeChips.push({
      key: 'shirtSize',
      label: `Size: ${filters.shirtSize.toUpperCase()}`,
      onRemove: () => updateFilters({ ...filters, shirtSize: '', page: 0 }),
    });
  }
  if (filters.color) {
    activeChips.push({
      key: 'color',
      label: `Màu: ${filters.color}`,
      onRemove: () => updateFilters({ ...filters, color: '', page: 0 }),
    });
  }
  if (filters.inStock) {
    activeChips.push({
      key: 'inStock',
      label: 'Còn hàng',
      onRemove: () => updateFilters({ ...filters, inStock: false, page: 0 }),
    });
  }
  if (filters.hasSale) {
    activeChips.push({
      key: 'hasSale',
      label: 'Đang giảm giá',
      onRemove: () => updateFilters({ ...filters, hasSale: false, page: 0 }),
    });
  }
  if (filters.isHot) {
    activeChips.push({
      key: 'isHot',
      label: 'Sản phẩm Hot',
      onRemove: () => updateFilters({ ...filters, isHot: false, page: 0 }),
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Sản phẩm' }]} className="mb-6" />

      {/* Tiêu đề & thanh tìm kiếm trang danh sách */}
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
            Tất cả sản phẩm
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {pageData.totalElements !== null
              ? `Tìm thấy ${pageData.totalElements} sản phẩm phù hợp`
              : 'Khám phá toàn bộ sản phẩm hiện có tại cửa hàng'}
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          <ProductSearch
            defaultValue={filters.keyword}
            onSubmit={(kw) => updateFilters({ ...filters, keyword: kw, page: 0 })}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar lọc trên desktop */}
        <div className="hidden lg:block">
          <ProductFilter
            filters={filters}
            categories={categories}
            brands={brands}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Khu vực kết quả */}
        <div className="space-y-6">
          {/* Thanh công cụ sắp xếp & chế độ hiển thị */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <ShopButton
                variant="outline"
                size="sm"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Bộ lọc
                {activeChips.length > 0 && (
                  <span className="rounded-full bg-zinc-900 px-1.5 py-0.2 text-[11px] text-white">
                    {activeChips.length}
                  </span>
                )}
              </ShopButton>

              {pageData.totalElements !== null && (
                <span className="text-xs font-semibold text-zinc-500">
                  Trang {pageData.page + 1}
                  {pageData.totalPages ? ` / ${pageData.totalPages}` : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ProductSort
                value={filters.sortBy}
                onChange={(sortBy) => updateFilters({ ...filters, sortBy, page: 0 })}
              />

              <div className="hidden items-center rounded-full border border-zinc-200 p-0.5 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Xem dạng lưới"
                  className={`rounded-full p-2 transition ${
                    viewMode === 'grid' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="Xem dạng danh sách"
                  className={`rounded-full p-2 transition ${
                    viewMode === 'list' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Chip điều kiện đang lọc */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={`Bỏ lọc ${chip.label}`}
                    className="rounded-full p-0.5 hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          {productsQuery.loading ? (
            <ProductGridSkeleton count={9} columns={3} />
          ) : productsQuery.error ? (
            <ShopErrorState error={productsQuery.error} onRetry={productsQuery.refetch} />
          ) : products.length === 0 ? (
            <ShopEmptyState
              title="Không tìm thấy sản phẩm phù hợp"
              description="Hãy thử thay đổi từ khóa hoặc xóa bớt các điều kiện lọc để xem nhiều sản phẩm hơn."
              action={
                activeChips.length > 0 ? (
                  <ShopButton variant="outline" size="sm" onClick={resetFilters}>
                    Xóa toàn bộ bộ lọc
                  </ShopButton>
                ) : null
              }
            />
          ) : viewMode === 'list' ? (
            <ProductList products={products} categoryMap={categoryMap} brandMap={brandMap} />
          ) : (
            <ProductGrid
              products={products}
              categoryMap={categoryMap}
              brandMap={brandMap}
              columns={3}
            />
          )}

          <Pagination
            page={pageData.page}
            totalPages={pageData.totalPages}
            disabled={productsQuery.loading}
            onPageChange={(nextPage) => {
              updateFilters({ ...filters, page: nextPage });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="pt-4"
          />
        </div>
      </div>

      {/* Modal lọc trên mobile */}
      <ShopModal
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Bộ lọc sản phẩm"
      >
        <ProductFilter
          filters={filters}
          categories={categories}
          brands={brands}
          onChange={(next) => {
            updateFilters(next);
            setMobileFilterOpen(false);
          }}
          onReset={() => {
            resetFilters();
            setMobileFilterOpen(false);
          }}
          className="border-0 p-0"
        />
      </ShopModal>
    </div>
  );
}
