import api from '../../../../services/api';

// 1. Lấy tất cả sản phẩm (phân trang) - GET /api/products
export const getAllProducts = async (page = 0, size = 10, signal) => {
  const res = await api.get(`/products?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

// 2. Lấy chi tiết sản phẩm theo slug - GET /api/products/slug/{slug}
export const getBySlug = async (slug, signal) => {
  const res = await api.get(`/products/slug/${encodeURIComponent(slug)}`, { signal });
  return res.data || res;
};

// 3. Lấy sản phẩm mới nhất - GET /api/products/newest
export const getNewest = async ({ page = 0, size = 8 } = {}, signal) => {
  const res = await api.get(`/products/newest?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

// 4. Lấy sản phẩm nổi bật (Hot / Xem nhiều) - GET /api/products/hot
export const getHot = async ({ page = 0, size = 8 } = {}, signal) => {
  const res = await api.get(`/products/hot?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

// 5. Lấy sản phẩm đang giảm giá (Flash Sale) - GET /api/products/sale
export const getSale = async ({ page = 0, size = 8 } = {}, signal) => {
  const res = await api.get(`/products/sale?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

// 6. Lọc nâng cao đa điều kiện cho Client Shop - GET /api/products/filter
export const filterProducts = async (filterParams = {}, signal) => {
  const cleanParams = {};
  Object.entries(filterParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== false) {
      cleanParams[key] = val;
    }
  });
  const res = await api.get('/products/filter', { params: cleanParams, signal });
  return res.data || res;
};

// Alias tương thích filterAdvanced
export const filterAdvanced = async (filterParams = {}, signal) => {
  return filterProducts(filterParams, signal);
};

// 7. Gợi ý tìm kiếm (Autocomplete) - GET /api/products/suggestions
export const getSuggestions = async (keyword = '', limit = 5, signal) => {
  const clean = String(keyword || '').trim();
  const res = await api.get('/products/suggestions', {
    params: { keyword: clean, limit },
    signal,
  });
  return res.data || res;
};

// 8. Tìm kiếm sản phẩm theo từ khóa - GET /api/products/search
export const searchProducts = async (keyword, page = 0, size = 10, signal) => {
  const res = await api.get(
    `/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    { signal }
  );
  return res.data || res;
};

// 9. Lọc theo danh mục - GET /api/products/filter/category
export const filterByCategory = async (categoryId, page = 0, size = 10, signal) => {
  const res = await api.get(
    `/products/filter/category?categoryId=${categoryId}&page=${page}&size=${size}`,
    { signal }
  );
  return res.data || res;
};

// 10. Lọc theo thương hiệu - GET /api/products/filter/brand
export const filterByBrand = async (brandId, page = 0, size = 10, signal) => {
  const res = await api.get(
    `/products/filter/brand?brandId=${brandId}&page=${page}&size=${size}`,
    { signal }
  );
  return res.data || res;
};

export const shopProductService = {
  getAllProducts,
  getBySlug,
  getNewest,
  getHot,
  getSale,
  filterProducts,
  filterAdvanced,
  getSuggestions,
  searchProducts,
  filterByCategory,
  filterByBrand,
};

export default shopProductService;
