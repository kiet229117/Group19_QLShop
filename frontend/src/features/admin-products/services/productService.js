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
<<<<<<< HEAD
// Khai báo rõ multipart để axios không chuyển FormData thành JSON (trình duyệt tự thêm boundary)
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

=======
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
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
<<<<<<< HEAD
    return api.post('/products', buildMultipart(product, images), MULTIPART).then(unwrap);
=======
    return api.post('/products', buildMultipart(product, images)).then(unwrap);
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
  }
  return api.post('/products', product).then(unwrap);
};

// PUT /api/products/{id}  (backend chỉ nhận multipart/form-data)
export const updateProduct = (id, product, images = []) =>
<<<<<<< HEAD
  api.put(`/products/${id}`, buildMultipart(product, images), MULTIPART).then(unwrap);
=======
  api.put(`/products/${id}`, buildMultipart(product, images)).then(unwrap);
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3

// DELETE /api/products/{id}  (chỉ ADMIN)
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(unwrap);

// PUT /api/product-prices/products/{productId}  body: { salePrice }
export const setSalePrice = (productId, salePrice) =>
  api.put(`/product-prices/products/${productId}`, { salePrice }).then(unwrap);

// DELETE /api/product-prices/products/{productId}
export const removeSalePrice = (productId) =>
  api.delete(`/product-prices/products/${productId}`).then(unwrap);
