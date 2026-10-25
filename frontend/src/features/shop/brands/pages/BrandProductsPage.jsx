import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ProductFilter from '../../../../components/shop/common/ProductFilter';
import ProductSort from '../../../../components/shop/common/ProductSort';
import ProductGrid, { ProductGridSkeleton } from '../../../../components/shop/common/ProductGrid';
import Pagination from '../../../../components/shop/common/Pagination';
import ShopLoading from '../../../../components/shop/common/ShopLoading';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopErrorState from '../../../../components/shop/common/ShopErrorState';
import ShopButton from '../../../../components/shop/common/ShopButton';
import ShopModal from '../../../../components/shop/common/ShopModal';
import useShopQuery from '../../shared/hooks/useShopQuery';
import { normalizePage } from '../../shared/utils/pageUtils';
import useShopCategories from '../../categories/hooks/useShopCategories';
import useShopBrands from '../hooks/useShopBrands';
import shopProductService from '../../products/services/shopProductService';
import { shopPaths } from '../../shopPaths';

const PAGE_SIZE = 12;

/**
 * Trang sản phẩm theo Thương hiệu (`/shop/brands/:slug`).
 * Gọi `GET /api/products/filter?brandId=...` (trả về Page rỗng thay vì 404 khi thương hiệu chưa có sản phẩm).
 */
export default function BrandProductsPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { categories, categoryMap } = useShopCategories();
  const { brands, brandMap, loading: brandsLoading, error: brandsError, refetch: refetchBrands } =
    useShopBrands();

  const brand = brands.find(
    (b) => b.slug === slug || String(b.id) === String(slug)
  );

  const pageRaw = Number.parseInt(searchParams.get('page') || '0', 10);
  const filters = {
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    shirtSize: searchParams.get('shirtSize') || '',
    color: searchParams.get('color') || '',
    inStock: searchParams.get('inStock') === 'true',
    hasSale: searchParams.get('hasSale') === 'true',
    isHot: searchParams.get('isHot') === 'true',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: Number.isFinite(pageRaw) && pageRaw >= 0 ? pageRaw : 0,
    pageSize: PAGE_SIZE,
  };

  const productsQuery = useShopQuery(
    (signal) =>
      shopProductService.filterProducts(
        { ...filters, brandId: brand.id },
        signal
      ),
    `brand-products::${brand?.id || ''}::${searchParams.toString()}`,
    { enabled: Boolean(brand?.id) }
  );

  const updateFilters = (next) => {
    const params = new URLSearchParams();
    if (next.keyword) params.set('keyword', next.keyword);
    if (next.categoryId) params.set('categoryId', String(next.categoryId));
    if (next.minPrice) params.set('minPrice', String(next.minPrice));
    if (next.maxPrice) params.set('maxPrice', String(next.maxPrice));
    if (next.shirtSize) params.set('shirtSize', next.shirtSize);
    if (next.color) params.set('color', next.color);
    if (next.inStock) params.set('inStock', 'true');
    if (next.hasSale) params.set('hasSale', 'true');
    if (next.isHot) params.set('isHot', 'true');
    if (next.sortBy && next.sortBy !== 'newest') params.set('sortBy', next.sortBy);
    if (next.page > 0) params.set('page', String(next.page));
    setSearchParams(params);
  };

  const resetFilters = () => setSearchParams(new URLSearchParams());

  if (brandsLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ShopLoading label="Đang tải thương hiệu..." />
      </div>
    );
  }

  if (brandsError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ShopErrorState error={brandsError} onRetry={refetchBrands} />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ShopEmptyState
          title="Không tìm thấy thương hiệu"
          description="Thương hiệu bạn tìm không tồn tại trong hệ thống."
          action={
            <ShopButton to={shopPaths.brands()} variant="outline" size="sm">
              Xem tất cả thương hiệu
            </ShopButton>
          }
        />
      </div>
    );
  }

  const pageData = normalizePage(productsQuery.data);
  const products = pageData.items;
  const logoUrl = resolveShopImageUrl(brand.logo);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb
        items={[
          { label: 'Thương hiệu', to: shopPaths.brands() },
          { label: brand.name },
        ]}
      />

      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-center gap-5">
          {logoUrl && (
            <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
              <img src={logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Thương hiệu chính hãng
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="mt-1 max-w-2xl text-sm text-zinc-500">{brand.description}</p>
            )}
          </div>
        </div>

        {pageData.totalElements !== null && (
          <div className="shrink-0 rounded-2xl bg-zinc-50 px-4 py-3 text-center">
            <span className="block text-2xl font-black text-zinc-900">
              {pageData.totalElements}
            </span>
            <span className="text-xs font-medium text-zinc-500">sản phẩm</span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <ProductFilter
            filters={filters}
            categories={categories}
            hideBrand
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3">
            <ShopButton
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Bộ lọc
            </ShopButton>
            <div className="ml-auto">
              <ProductSort
                value={filters.sortBy}
                onChange={(sortBy) => updateFilters({ ...filters, sortBy, page: 0 })}
              />
            </div>
          </div>

          {productsQuery.loading ? (
            <ProductGridSkeleton count={9} columns={3} />
          ) : productsQuery.error ? (
            <ShopErrorState error={productsQuery.error} onRetry={productsQuery.refetch} />
          ) : products.length === 0 ? (
            <ShopEmptyState
              title="Chưa có sản phẩm phù hợp của thương hiệu này"
              description="Hãy thử bỏ bớt điều kiện lọc hoặc khám phá thương hiệu khác."
              action={
                <ShopButton variant="outline" size="sm" onClick={resetFilters}>
                  Đặt lại bộ lọc
                </ShopButton>
              }
            />
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
          />
        </div>
      </div>

      <ShopModal
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title={`Lọc sản phẩm ${brand.name}`}
      >
        <ProductFilter
          filters={filters}
          categories={categories}
          hideBrand
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
