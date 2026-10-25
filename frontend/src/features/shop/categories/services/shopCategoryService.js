import api from '../../../../services/api';

// 1. Lấy danh sách danh mục có phân trang - GET /api/categories?page=0&size=100
export const getAllCategories = async (page = 0, size = 100, signal) => {
  const res = await api.get(`/categories?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

// Alias tương thích getPage(page, size)
export const getPage = async (page = 0, size = 100, signal) => {
  return getAllCategories(page, size, signal);
};

// 2. Lấy toàn bộ danh mục đang kích hoạt (active !== false)
export const getAllActive = async (signal) => {
  const res = await api.get('/categories?page=0&size=100', { signal });
  const data = res.data || res;
  const list = Array.isArray(data) ? data : data.content || [];
  return list.filter((category) => category?.active !== false && category?.isActive !== false);
};

// 3. Lấy chi tiết danh mục theo ID - GET /api/categories/{id}
export const getCategoryById = async (id, signal) => {
  const res = await api.get(`/categories/${id}`, { signal });
  return res.data || res;
};

// 4. Tìm danh mục theo slug
export const getCategoryBySlug = async (slug, signal) => {
  const list = await getAllActive(signal);
  return list.find((category) => category.slug === slug) || null;
};

export const shopCategoryService = {
  getAllCategories,
  getPage,
  getAllActive,
  getCategoryById,
  getCategoryBySlug,
};

export default shopCategoryService;
