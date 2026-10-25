import { useEffect, useState } from 'react';
import useShopCategories from '../../categories/hooks/useShopCategories';
import useShopBrands from '../../brands/hooks/useShopBrands';
import BrandStrip from '../components/BrandStrip';
import { getActiveBanners } from '../services/shopBannerService';
import { getNewest, getHot, getSale } from '../../products/services/shopProductService';
import HomeBanner from '../components/HomeBanner';
import CategorySection from '../components/CategorySection';
import ProductShowcaseSection from '../components/ProductShowcaseSection';

import { shopPaths } from '../../shopPaths';

const HOME_PAGE_SIZE = 8;

/**
 * Trang chủ Client Shop.
 * Kết nối các API thực tế:
 *  - GET /api/banners/active?position=HOME_SLIDER
 *  - GET /api/products/newest?page=0&size=8
 *  - GET /api/products/hot?page=0&size=8
 *  - GET /api/products/sale?page=0&size=8
 */
export default function ShopHomePage() {
  const { categories, categoryMap, loading: categoriesLoading } = useShopCategories();
  const { brands, brandMap, loading: brandsLoading } = useShopBrands();

  // 0. State Banner trang chủ (HOME_SLIDER)
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(false);

  // 1. State Sản phẩm mới nhất (NEW)
  const [newestProducts, setNewestProducts] = useState([]);
  const [newestLoading, setNewestLoading] = useState(false);
  const [newestError, setNewestError] = useState('');
  const [newestReload, setNewestReload] = useState(0);

  // 2. State Sản phẩm nổi bật (HOT)
  const [hotProducts, setHotProducts] = useState([]);
  const [hotLoading, setHotLoading] = useState(false);
  const [hotError, setHotError] = useState('');
  const [hotReload, setHotReload] = useState(0);

  // 3. State Sản phẩm đang giảm giá (SALE)
  const [saleProducts, setSaleProducts] = useState([]);
  const [saleLoading, setSaleLoading] = useState(false);
  const [saleError, setSaleError] = useState('');
  const [saleReload, setSaleReload] = useState(0);

  // 0. Gọi API Banner đang hoạt động (GET /api/banners/active)
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannersLoading(true);
        const res = await getActiveBanners();
        console.log('Banners: ', res);
        setBanners(Array.isArray(res) ? res : res.content || res.data || []);
      } catch (err) {
        console.error('Lỗi tải banner:', err.response?.data?.message || err.message);
        setBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // 1. Gọi API Sản phẩm mới nhất (GET /api/products/newest)
  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
        setNewestLoading(true);
        setNewestError('');
        const res = await getNewest({
          page: 0,
          size: HOME_PAGE_SIZE,
        });
        console.log('Newest Products: ', res);
        setNewestProducts(res.content || res.data || []);
      } catch (err) {
        setNewestError(err.response?.data?.message || err.message);
      } finally {
        setNewestLoading(false);
      }
    };
    fetchNewestProducts();
  }, [newestReload]);

  // 2. Gọi API Sản phẩm nổi bật (GET /api/products/hot)
  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        setHotLoading(true);
        setHotError('');
        const res = await getHot({
          page: 0,
          size: HOME_PAGE_SIZE,
        });
        console.log('Hot Products: ', res);
        setHotProducts(res.content || res.data || []);
      } catch (err) {
        setHotError(err.response?.data?.message || err.message);
      } finally {
        setHotLoading(false);
      }
    };
    fetchHotProducts();
  }, [hotReload]);

  // 3. Gọi API Sản phẩm đang giảm giá (GET /api/products/sale)
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setSaleLoading(true);
        setSaleError('');
        const res = await getSale({
          page: 0,
          size: HOME_PAGE_SIZE,
        });
        console.log('Sale Products: ', res);
        setSaleProducts(res.content || res.data || []);
      } catch (err) {
        setSaleError(err.response?.data?.message || err.message);
      } finally {
        setSaleLoading(false);
      }
    };
    fetchSaleProducts();
  }, [saleReload]);

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 sm:py-10">
      <HomeBanner banners={banners} loading={bannersLoading} />

      <CategorySection categories={categories} loading={categoriesLoading} />

      {/* Khối Sản phẩm đang giảm giá (SALE) */}
      {(saleLoading || saleError || saleProducts.length > 0) && (
        <ProductShowcaseSection
          eyebrow="Ưu đãi trực tiếp"
          title="Sản phẩm đang giảm giá"
          viewAllTo={shopPaths.products({ hasSale: 'true' })}
          products={saleProducts}
          loading={saleLoading}
          error={saleError}
          onRetry={() => setSaleReload((prev) => prev + 1)}
          categoryMap={categoryMap}
          brandMap={brandMap}
          emptyTitle="Hiện chưa có chương trình giảm giá nào."
        />
      )}

      {/* Khối Sản phẩm mới nhất (NEW) */}
      <ProductShowcaseSection
        eyebrow="Hàng mới về"
        title="Sản phẩm mới nhất"
        viewAllTo={shopPaths.products({ sortBy: 'newest' })}
        products={newestProducts}
        loading={newestLoading}
        error={newestError}
        onRetry={() => setNewestReload((prev) => prev + 1)}
        categoryMap={categoryMap}
        brandMap={brandMap}
        emptyTitle="Chưa có sản phẩm nào trong hệ thống."
      />

      {/* Khối Sản phẩm nổi bật (HOT) */}
      <ProductShowcaseSection
        eyebrow="Xu hướng"
        title="Được quan tâm nhiều nhất"
        viewAllTo={shopPaths.products({ sortBy: 'popular' })}
        products={hotProducts}
        loading={hotLoading}
        error={hotError}
        onRetry={() => setHotReload((prev) => prev + 1)}
        categoryMap={categoryMap}
        brandMap={brandMap}
        emptyTitle="Chưa có dữ liệu sản phẩm nổi bật."
      />

      <BrandStrip brands={brands} loading={brandsLoading} />
    </div>
  );
}
