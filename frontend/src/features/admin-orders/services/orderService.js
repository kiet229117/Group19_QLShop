import api from '../../../services/api';

export const orderService = {
  // Lấy tất cả đơn hàng (phân trang)
  getAllOrders: async (page = 0, size = 10) => {
    const res = await api.get(`/orders?page=${page}&size=${size}`);
    return res.data || res;
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data || res;
  },

  // Cập nhật trạng thái đơn hàng (PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED)
  updateOrderStatus: async (id, status) => {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data || res;
  },

  // Hủy đơn hàng
  cancelOrder: async (id) => {
    const res = await api.put(`/orders/${id}/cancel`);
    return res.data || res;
  },

  // Xóa đơn hàng (Admin)
  deleteOrder: async (id) => {
    const res = await api.delete(`/orders/${id}`);
    return res.data || res;
  }
};

export default orderService;

