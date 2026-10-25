import api from '../../../../services/api';

/**
 * Service kết nối API Mã giảm giá (Vouchers) cho Client Shop.
 */
export const getAvailableVouchers = async (signal) => {
  const res = await api.get('/vouchers/available', { signal });
  return res.data || res;
};

export const applyVoucher = async ({ code, orderAmount }, signal) => {
  const res = await api.post('/vouchers/apply', { code, orderAmount }, { signal });
  return res.data || res;
};

export const shopVoucherService = {
  getAvailableVouchers,
  applyVoucher,
};

export default shopVoucherService;

