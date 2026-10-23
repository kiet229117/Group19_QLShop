import api from '../../../services/api';

export const categoryService = {
  // Lấy tất cả danh mục (phân trang)
  getAllCategories: async (page = 0, size = 50) => {
    const res = await api.get(`/categories?page=${page}&size=${size}`);
    return res.data || res;
  },

  // Thêm danh mục mới (POST /api/categories)
  addCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return res.data || res;
  },

  // Sửa danh mục (PUT /api/categories/{id})
  updateCategory: async (id, categoryData) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    return res.data || res;
  },

  // Xóa danh mục (DELETE /api/categories/{id})
  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data || res;
  },
};

export default categoryService;

