import api from '../../../../services/api';

/**
 * Service kết nối API Thương hiệu thời trang (Brands) cho Client Shop.
 */
export const getAllBrands = async (page = 0, size = 100, signal) => {
  const res = await api.get(`/brands?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

export const getPage = async (page = 0, size = 100, signal) => {
  return getAllBrands(page, size, signal);
};

export const getAll = async (signal) => {
  try {
    const data = await getAllBrands(0, 100, signal);
    return Array.isArray(data) ? data : (data.content || []);
  } catch (err) {
    console.warn('Lỗi khi tải danh sách thương hiệu từ API:', err);
    return [];
  }
};

export const getBrandById = async (id, signal) => {
  const res = await api.get(`/brands/${id}`, { signal });
  return res.data || res;
};

export const getBrandBySlug = async (slug, signal) => {
  const list = await getAll(signal);
  return list.find((b) => b.slug === slug || String(b.id) === String(slug)) || null;
};

export const shopBrandService = {
  getAllBrands,
  getPage,
  getAll,
  getBrandById,
  getBrandBySlug,
};

export default shopBrandService;
