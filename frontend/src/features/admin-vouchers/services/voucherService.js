import api from '../../../services/api';

export const voucherService = {
  // Lấy tất cả voucher hệ thống (phân trang)
  getAllVouchers: async (page = 0, size = 50) => {
    const res = await api.get(`/vouchers?page=${page}&size=${size}`);
    return res.data || res;
  },

  // Lấy các voucher đang khả dụng (Public)
  getAvailableVouchers: async () => {
    const res = await api.get('/vouchers/available');
    return res.data || res;
  },

  // Tạo voucher mới
  createVoucher: async (voucherData) => {
    const res = await api.post('/vouchers', voucherData);
    return res.data || res;
  },

  // Áp dụng thử mã giảm giá
  applyVoucher: async (code, orderAmount) => {
    const res = await api.post('/vouchers/apply', { code, orderAmount });
    return res.data || res;
  },

  // Xóa voucher
  deleteVoucher: async (id) => {
    const res = await api.delete(`/vouchers/${id}`);
    return res.data || res;
  }
};

export default voucherService;

