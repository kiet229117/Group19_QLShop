import api from '../../../services/api';

export const brandService = {
  // Lấy tất cả thương hiệu (phân trang)
  getAllBrands: async (page = 0, size = 50) => {
    const res = await api.get(`/brands?page=${page}&size=${size}`);
    return res.data || res;
  },

  // Thêm thương hiệu mới (POST /api/brands)
  addBrand: async (brandData) => {
    const res = await api.post('/brands', brandData);
    return res.data || res;
  },

  // Sửa thương hiệu (PUT /api/brands/{id})
  updateBrand: async (id, brandData) => {
    const res = await api.put(`/brands/${id}`, brandData);
    return res.data || res;
  },

  // Xóa thương hiệu (DELETE /api/brands/{id})
  deleteBrand: async (id) => {
    const res = await api.delete(`/brands/${id}`);
    return res.data || res;
  },
};

export default brandService;

