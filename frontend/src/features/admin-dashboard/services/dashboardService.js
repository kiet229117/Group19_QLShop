import api from '../../../services/api';

export const dashboardService = {
  // Lấy thống kê tổng quan (Doanh thu, đơn hàng, khách hàng, sản phẩm)
  getSummary: async () => {
    const res = await api.get('/admin/dashboard/summary');
    return res.data || res;
  },

  // Biểu đồ doanh thu theo ngày
  getRevenueChart: async (days = 7) => {
    const res = await api.get(`/admin/dashboard/revenue-chart?days=${days}`);
    return res.data || res;
  },

  // Top mẫu áo bán chạy nhất
  getTopProducts: async (limit = 5) => {
    const res = await api.get(`/admin/dashboard/top-products?limit=${limit}`);
    return res.data || res;
  },

  // Phân bổ trạng thái đơn hàng
  getOrderStatusDistribution: async () => {
    const res = await api.get('/admin/dashboard/order-status');
    return res.data || res;
  }
};

export default dashboardService;

