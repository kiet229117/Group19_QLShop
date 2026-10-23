import api from '../../../services/api';

export const bannerService = {
  // Lấy tất cả banner (phân trang)
  getAllBanners: async (page = 0, size = 10) => {
    try {
      const res = await api.get(`/banners?page=${page}&size=${size}`);
      return res.data || res;
    } catch (err) {
      console.warn('Backend banners API unavailable, using local data', err);
      return null;
    }
  },

  // Lấy banner đang kích hoạt theo vị trí
  getActiveBanners: async (position = 'HOME_SLIDER') => {
    try {
      const res = await api.get(`/banners/active?position=${position}`);
      return res.data || res;
    } catch (err) {
      console.warn('Backend active banners API unavailable', err);
      return null;
    }
  },

  // Chi tiết banner
  getBannerById: async (id) => {
    const res = await api.get(`/banners/${id}`);
    return res.data || res;
  },

  // Tạo banner mới
  createBanner: async (data) => {
    const res = await api.post('/banners', data);
    return res.data || res;
  },

  // Cập nhật banner
  updateBanner: async (id, data) => {
    const res = await api.put(`/banners/${id}`, data);
    return res.data || res;
  },

  // Toggle active
  toggleActive: async (id) => {
    const res = await api.patch(`/banners/${id}/toggle`);
    return res.data || res;
  },

  // Xóa banner
  deleteBanner: async (id) => {
    const res = await api.delete(`/banners/${id}`);
    return res.data || res;
  },
};

export default bannerService;

