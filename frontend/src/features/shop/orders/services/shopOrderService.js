import api from '../../../../services/api';

/**
 * Service kết nối API Đơn hàng (Orders) cho Client Shop.
 */
export const createOrder = async (orderData, signal) => {
  const res = await api.post('/orders', orderData, { signal });
  return res.data || res;
};

export const getOrderById = async (id, signal) => {
  const res = await api.get(`/orders/${id}`, { signal });
  return res.data || res;
};

export const getOrdersByUserId = async (userId, page = 0, size = 10, signal) => {
  const res = await api.get(`/orders/user/${userId}?page=${page}&size=${size}`, { signal });
  return res.data || res;
};

export const updatePaymentStatus = async (id, paymentStatus = 'PAID', signal) => {
  const res = await api.put(`/orders/${id}/payment-status`, { paymentStatus }, { signal });
  return res.data || res;
};

export const requestCancelOrder = async (id, reason, signal) => {
  const res = await api.put(`/orders/${id}/cancel-request`, { reason }, { signal });
  return res.data || res;
};

export const cancelOrder = async (id, signal) => {
  const res = await api.put(`/orders/${id}/cancel`, {}, { signal });
  return res.data || res;
};

export const shopOrderService = {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  updatePaymentStatus,
  requestCancelOrder,
  cancelOrder,
};

export default shopOrderService;
