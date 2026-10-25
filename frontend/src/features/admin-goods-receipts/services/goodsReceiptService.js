import api from '../../../services/api';

export const goodsReceiptService = {
  // Lấy toàn bộ danh sách phiếu nhập (GET /api/goods-receipts)
  getAllReceipts: async () => {
    const res = await api.get('/goods-receipts');
    return res.data || res;
  },

  // Lấy chi tiết phiếu nhập (GET /api/goods-receipts/{id})
  getReceiptById: async (id) => {
    const res = await api.get(`/goods-receipts/${id}`);
    return res.data || res;
  },

  // Tạo phiếu nhập mới (POST /api/goods-receipts)
  createReceipt: async (receiptData) => {
    const res = await api.post('/goods-receipts', receiptData);
    return res.data || res;
  },

  // Hoàn tất nhập kho (POST /api/goods-receipts/{id}/complete)
  completeReceipt: async (id) => {
    const res = await api.post(`/goods-receipts/${id}/complete`);
    return res.data || res;
  },

  // Hủy phiếu nhập (POST /api/goods-receipts/{id}/cancel)
  cancelReceipt: async (id) => {
    const res = await api.post(`/goods-receipts/${id}/cancel`);
    return res.data || res;
  },
};

export default goodsReceiptService;
