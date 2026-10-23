import api from '../../../services/api';

export const supplierService = {
  // Lấy tất cả nhà cung cấp (GET /api/suppliers)
  getAllSuppliers: async () => {
    const res = await api.get('/suppliers');
    return res.data || res;
  },

  // Lấy chi tiết nhà cung cấp (GET /api/suppliers/{id})
  getSupplierById: async (id) => {
    const res = await api.get(`/suppliers/${id}`);
    return res.data || res;
  },

  // Tạo nhà cung cấp mới (POST /api/suppliers)
  createSupplier: async (supplierData) => {
    const res = await api.post('/suppliers', supplierData);
    return res.data || res;
  },

  // Cập nhật thông tin nhà cung cấp (PUT /api/suppliers/{id})
  updateSupplier: async (id, supplierData) => {
    const res = await api.put(`/suppliers/${id}`, supplierData);
    return res.data || res;
  },

  // Xóa nhà cung cấp (DELETE /api/suppliers/{id})
  deleteSupplier: async (id) => {
    const res = await api.delete(`/suppliers/${id}`);
    return res.data || res;
  },
};

export default supplierService;
