import api from '../../../../services/api';

// 1. Lấy danh sách banner đang kích hoạt - GET /api/banners/active
export const getActiveBanners = async (position = '', signal) => {
  const res = await api.get('/banners/active', {
    params: position ? { position } : {},
    signal,
  });
  return res.data || res;
};

// 2. Lấy tất cả banner (phân trang) - GET /api/banners?page=0&size=10
export const getAllBanners = async (page = 0, size = 10, signal) => {
  const res = await api.get(`/banners?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

// 3. Lấy chi tiết banner theo ID - GET /api/banners/{id}
export const getBannerById = async (id, signal) => {
  const res = await api.get(`/banners/${id}`, { signal });
  return res.data || res;
};

export const shopBannerService = {
  getActiveBanners,
  getAllBanners,
  getBannerById,
};

export default shopBannerService;
