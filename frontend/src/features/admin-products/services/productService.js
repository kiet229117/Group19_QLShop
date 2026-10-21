import api from '../../../services/api';

const unwrap = (res) => res.data;

// Bỏ các tham số rỗng / false để query string gọn và khớp logic backend
// (backend chỉ xử lý inStock/hasSale/isHot khi = true).
function cleanParams(params = {}) {
  const out = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) return;
    out[key] = value;
  });
  return out;
}

/**
 * Lọc + tìm kiếm + phân trang sản phẩm.
 * GET /api/products/filter
 * params: keyword, brandId, categoryId, minPrice, maxPrice, shirtSize, color,
 *         inStock, hasSale, isHot, sortBy, page, pageSize
 * Trả về Spring Page: { content, totalElements, totalPages, number, size, ... }
 */
export const getProducts = (params, config = {}) =>
  api.get('/products/filter', { params: cleanParams(params), ...config }).then(unwrap);

// GET /api/categories?page=0&size=100  -> trả về mảng category
export const getCategories = (config = {}) =>
  api
    .get('/categories', { params: { page: 0, size: 100 }, ...config })
    .then((res) => res.data?.content ?? []);

// GET /api/brands?page=0&size=100  -> trả về mảng brand
export const getBrands = (config = {}) =>
  api
    .get('/brands', { params: { page: 0, size: 100 }, ...config })
    .then((res) => res.data?.content ?? []);

// GET /api/products/slug/{slug}
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`).then(unwrap);

// ---------------------------------------------------------------------------
// Các API ghi (cần đăng nhập ADMIN/STAFF – xóa chỉ ADMIN)
// ---------------------------------------------------------------------------

/**
 * Body product: { name, price, description, rating, slug, brandId, categoryId,
 *                 hot, variants: [{ color, size, stockQuantity, costPrice }] }
 * Lưu ý: field boolean `isHot` của backend được Jackson map thành `hot`.
 */
function buildMultipart(product, images) {
  const form = new FormData();
  // Phần "product" phải là JSON part để @RequestPart đọc được
  form.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  (images || []).forEach((file) => form.append('images', file));
  return form;
}

// POST /api/products  (JSON nếu không có ảnh, multipart nếu có ảnh)
export const createProduct = (product, images = []) => {
  if (images && images.length > 0) {
    return api.post('/products', buildMultipart(product, images)).then(unwrap);
  }
  return api.post('/products', product).then(unwrap);
};

// PUT /api/products/{id}  (backend chỉ nhận multipart/form-data)
export const updateProduct = (id, product, images = []) =>
  api.put(`/products/${id}`, buildMultipart(product, images)).then(unwrap);

// DELETE /api/products/{id}  (chỉ ADMIN)
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(unwrap);

// PUT /api/product-prices/products/{productId}  body: { salePrice }
export const setSalePrice = (productId, salePrice) =>
  api.put(`/product-prices/products/${productId}`, { salePrice }).then(unwrap);

// DELETE /api/product-prices/products/{productId}
export const removeSalePrice = (productId) =>
  api.delete(`/product-prices/products/${productId}`).then(unwrap);
