import { useState, useEffect, useCallback } from 'react';
import { getActiveBanners } from '../services/shopBannerService';
import { getNewest, getHot, getSale } from '../../products/services/shopProductService';
import useShopCategories from '../../categories/hooks/useShopCategories';
import useShopBrands from '../../brands/hooks/useShopBrands';

const HOME_PAGE_SIZE = 8;

/**
 * Custom Hook tổng hợp toàn bộ dữ liệu Trang chủ Client Shop:
 *  - Banner quảng cáo active
 *  - Danh mục & Thương hiệu
 *  - Sản phẩm Mới nhất (NEW)
 *  - Sản phẩm Nổi bật (HOT)
 *  - Sản phẩm Khuyến mãi (SALE)
 */
export default function useShopHome() {
  const { categories, categoryMap, loading: categoriesLoading } = useShopCategories();
  const { brands, brandMap, loading: brandsLoading } = useShopBrands();

  // Banners
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(false);

  // Newest
  const [newestProducts, setNewestProducts] = useState([]);
  const [newestLoading, setNewestLoading] = useState(false);
  const [newestError, setNewestError] = useState('');

  // Hot
  const [hotProducts, setHotProducts] = useState([]);
  const [hotLoading, setHotLoading] = useState(false);
  const [hotError, setHotError] = useState('');

  // Sale
  const [saleProducts, setSaleProducts] = useState([]);
  const [saleLoading, setSaleLoading] = useState(false);
  const [saleError, setSaleError] = useState('');

  const fetchBanners = useCallback(async () => {
    try {
      setBannersLoading(true);
      const res = await getActiveBanners('HOME_SLIDER');
      setBanners(Array.isArray(res) ? res : res?.content || res?.data || []);
    } catch (err) {
      console.warn('Lỗi tải banner trang chủ:', err);
      setBanners([]);
    } finally {
      setBannersLoading(false);
    }
  }, []);

  const fetchNewest = useCallback(async () => {
    try {
      setNewestLoading(true);
      setNewestError('');
      const res = await getNewest({ page: 0, size: HOME_PAGE_SIZE });
      setNewestProducts(res?.content || res?.data || (Array.isArray(res) ? res : []));
    } catch (err) {
      setNewestError(err.response?.data?.message || err.message || 'Lỗi tải sản phẩm mới');
    } finally {
      setNewestLoading(false);
    }
  }, []);

  const fetchHot = useCallback(async () => {
    try {
      setHotLoading(true);
      setHotError('');
      const res = await getHot({ page: 0, size: HOME_PAGE_SIZE });
      setHotProducts(res?.content || res?.data || (Array.isArray(res) ? res : []));
    } catch (err) {
      setHotError(err.response?.data?.message || err.message || 'Lỗi tải sản phẩm hot');
    } finally {
      setHotLoading(false);
    }
  }, []);

  const fetchSale = useCallback(async () => {
    try {
      setSaleLoading(true);
      setSaleError('');
      const res = await getSale({ page: 0, size: HOME_PAGE_SIZE });
      setSaleProducts(res?.content || res?.data || (Array.isArray(res) ? res : []));
    } catch (err) {
      setSaleError(err.response?.data?.message || err.message || 'Lỗi tải sản phẩm sale');
    } finally {
      setSaleLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    fetchNewest();
    fetchHot();
    fetchSale();
  }, [fetchBanners, fetchNewest, fetchHot, fetchSale]);

  return {
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
    refetchNewest: fetchNewest,
    hotProducts,
    hotLoading,
    hotError,
    refetchHot: fetchHot,
    saleProducts,
    saleLoading,
    saleError,
    refetchSale: fetchSale,
  };
}

