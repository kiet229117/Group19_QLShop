import useShopHome from '../hooks/useShopHome';
import HomeBanner from '../components/HomeBanner';
import CategorySection from '../components/CategorySection';
import ProductShowcaseSection from '../components/ProductShowcaseSection';
import BrandStrip from '../components/BrandStrip';
import { shopPaths } from '../../shopPaths';

/**
 * Trang chủ Client Shop (Kết nối 100% API Backend: Banners, Categories, Brands, Newest, Hot, Sale).
 */
export default function ShopHomePage() {
  const {
    categories,
    categoryMap,
    categoriesLoading,
    brands,
    brandMap,
    brandsLoading,
    banners,
    bannersLoading,
    newestProducts,
    newestLoading,
    newestError,
    refetchNewest,
    hotProducts,
    hotLoading,
    hotError,
    refetchHot,
    saleProducts,
    saleLoading,
    saleError,
    refetchSale,
  } = useShopHome();

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 sm:py-10">
      {/* 1. Banner trang chủ */}
      <HomeBanner banners={banners} loading={bannersLoading} />

      {/* 2. Danh mục nổi bật */}
      <CategorySection categories={categories} loading={categoriesLoading} />

      {/* 3. Khối Sản phẩm đang giảm giá (SALE) */}
      {(saleLoading || saleError || saleProducts.length > 0) && (
        <ProductShowcaseSection
          eyebrow="Ưu đãi trực tiếp"
          title="Sản phẩm đang giảm giá"
          viewAllTo={shopPaths.products({ hasSale: 'true' })}
          products={saleProducts}
          loading={saleLoading}
          error={saleError}
          onRetry={refetchSale}
          categoryMap={categoryMap}
          brandMap={brandMap}
          emptyTitle="Hiện chưa có chương trình giảm giá nào."
        />
      )}

      {/* 4. Khối Sản phẩm mới nhất (NEW) */}
      <ProductShowcaseSection
        eyebrow="Hàng mới về"
        title="Sản phẩm mới nhất"
        viewAllTo={shopPaths.products({ sortBy: 'newest' })}
        products={newestProducts}
        loading={newestLoading}
        error={newestError}
        onRetry={refetchNewest}
        categoryMap={categoryMap}
        brandMap={brandMap}
        emptyTitle="Chưa có sản phẩm nào trong hệ thống."
      />

      {/* 5. Khối Sản phẩm nổi bật (HOT) */}
      <ProductShowcaseSection
        eyebrow="Xu hướng"
        title="Được quan tâm nhiều nhất"
        viewAllTo={shopPaths.products({ sortBy: 'popular' })}
        products={hotProducts}
        loading={hotLoading}
        error={hotError}
        onRetry={refetchHot}
        categoryMap={categoryMap}
        brandMap={brandMap}
        emptyTitle="Chưa có dữ liệu sản phẩm nổi bật."
      />

      {/* 6. Dải đối tác thương hiệu */}
      <BrandStrip brands={brands} loading={brandsLoading} />
    </div>
  );
}
