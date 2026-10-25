import { useEffect, useState } from 'react';
import shopProductService from '../services/shopProductService';

const DEFAULT_PAGE_SIZE = 12;

/**
 * Hook lấy danh sách sản phẩm có lọc, tìm kiếm, sắp xếp & phân trang
 */
export function useShopProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await shopProductService.filterProducts({
          page: 0,
          pageSize: DEFAULT_PAGE_SIZE,
          ...filters,
        });
        console.log('Products: ', res); // Xem cấu trúc Page<ProductReponse> từ Backend

        setProducts(res.content || []);
        setPagination({
          page: res.number ?? filters.page ?? 0,
          pageSize: res.size ?? filters.pageSize ?? DEFAULT_PAGE_SIZE,
          totalElements: res.totalElements ?? 0,
          totalPages: res.totalPages ?? 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Không thể tải danh sách sản phẩm');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, reloadKey]);

  const refetch = () => setReloadKey((prev) => prev + 1);

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook lấy chi tiết 1 sản phẩm theo slug
 */
export function useShopProductDetail(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await shopProductService.getBySlug(slug);
        console.log('Product Detail: ', res);
        setProduct(res);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Không tìm thấy sản phẩm');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug, reloadKey]);

  const refetch = () => setReloadKey((prev) => prev + 1);

  return {
    product,
    loading,
    error,
    refetch,
  };
}

export default useShopProducts;
