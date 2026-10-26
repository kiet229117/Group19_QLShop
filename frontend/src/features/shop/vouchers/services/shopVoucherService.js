import api from '../../../../services/api';

/**
 * Service kết nối API Mã giảm giá (Vouchers) chuẩn từ Backend.
 */
export const getAvailableVouchers = async (userId, signal) => {
  const params = userId ? { userId } : {};
  const res = await api.get('/vouchers/available', { params, signal });
  return res.data || res;
};

export const getCatalogVouchers = async (signal) => {
  const res = await api.get('/vouchers/catalog', { signal });
  return res.data || res;
};

export const applyVoucher = async ({ code, orderAmount, userId }, signal) => {
  const res = await api.post('/vouchers/apply', { code, orderAmount, userId }, { signal });
  return res.data || res;
};

export const shopVoucherService = {
  getAvailableVouchers,
  getCatalogVouchers,
  applyVoucher,
};

export default shopVoucherService;
