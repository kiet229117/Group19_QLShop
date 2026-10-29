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

  // Cập nhật trạng thái đơn hàng (PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED, CANCEL_REQUESTED)
  updateOrderStatus: async (id, status) => {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data || res;
  },

  // Cập nhật trạng thái thanh toán đơn hàng (PAID, UNPAID)
  updatePaymentStatus: async (id, paymentStatus) => {
    const res = await api.put(`/orders/${id}/payment-status`, { paymentStatus });
    return res.data || res;
  },

  // Duyệt hàng loạt toàn bộ đơn hàng PENDING (Admin Bulk Confirm)
  confirmAllPendingOrders: async () => {
    const res = await api.put('/orders/confirm-all-pending');
    return res.data || res;
  },

  // Kích hoạt tự động duyệt theo ngưỡng phút (Phương án 4: mặc định 15 phút)
  triggerAutoConfirm: async (thresholdMinutes = 15) => {
    const res = await api.put(`/orders/auto-confirm?thresholdMinutes=${thresholdMinutes}`);
    return res.data || res;
  },

  // Duyệt yêu cầu hủy đơn hàng (Admin)
  approveCancelOrder: async (id) => {
    const res = await api.put(`/orders/${id}/cancel-approve`);
    return res.data || res;
  },

  // Từ chối yêu cầu hủy đơn hàng (Admin)
  rejectCancelOrder: async (id, reason) => {
    const res = await api.put(`/orders/${id}/cancel-reject`, { reason });
    return res.data || res;
  },

  // Hủy đơn hàng trực tiếp
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
