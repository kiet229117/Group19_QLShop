import api from '../../../services/api';

export const userService = {
  // Lấy danh sách tất cả user từ backend (GET /api/users)
  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data || res;
  },

  // Lấy chi tiết user theo ID (GET /api/users/{id})
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data || res;
  },

  // Lấy lịch sử đơn hàng của user (GET /api/orders/user/{userId})
  getUserOrders: async (userId, page = 0, size = 10) => {
    try {
      const res = await api.get(`/orders/user/${userId}?page=${page}&size=${size}`);
      return res.data || res;
    } catch {
      return null;
    }
  },

  // Tạo user mới (POST /api/users)
  createUser: async (userData) => {
    const res = await api.post('/users', userData);
    return res.data || res;
  },

  // Cập nhật user (PUT /api/users/{id})
  updateUser: async (id, userData) => {
    const res = await api.put(`/users/${id}`, userData);
    return res.data || res;
  },

  // Xóa user (DELETE /api/users/{id})
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data || res;
  },

  // Tải avatar user (POST /api/users/{id}/avatar)
  uploadAvatar: async (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data || res;
  },
};

export default userService;

