import { useState, useEffect, useCallback, useMemo } from 'react';
import dashboardService from '../services/dashboardService';
import orderService from '../../admin-orders/services/orderService';
import productService from '../../admin-products/services/productService';
import chatService from '../../admin-chats/services/chatService';

export default function useDashboard() {
  const [timeRange, setTimeRange] = useState('Tháng này');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockVariants, setLowStockVariants] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);

  // Tải dữ liệu Dashboard đồng bộ từ Backend APIs
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, ordersRes, prodsRes, chatsRes] = await Promise.allSettled([
        dashboardService.getSummary(),
        orderService.getAllOrders(0, 5),
        productService.getAllProducts(0, 20),
        chatService.getConversations()
      ]);

      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      }

      if (ordersRes.status === 'fulfilled') {
        const orderList = ordersRes.value?.content || (Array.isArray(ordersRes.value) ? ordersRes.value : []);
        setRecentOrders(orderList.slice(0, 5));
      }

      if (prodsRes.status === 'fulfilled') {
        const prodList = prodsRes.value?.content || (Array.isArray(prodsRes.value) ? prodsRes.value : []);
        // Lấy các biến thể áo có tồn kho thấp (<= 60 chiếc)
        const lowStock = [];
        prodList.forEach(p => {
          (p.variants || []).forEach(v => {
            if ((v.stockQuantity ?? 0) <= 60) {
              lowStock.push({
                productName: p.name,
                productId: p.id,
                variantName: `${v.color || 'Màu'} - Size ${v.size || 'M'}`,
                stock: v.stockQuantity ?? 0
              });
            }
          });
        });
        setLowStockVariants(lowStock.slice(0, 4));
      }

      if (chatsRes.status === 'fulfilled' && Array.isArray(chatsRes.value)) {
        setRecentConversations(chatsRes.value.slice(0, 3));
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Tự động làm mới khi người dùng chuyển lại tab Dashboard
    const onFocus = () => fetchDashboardData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchDashboardData, timeRange]);

  // Doanh thu tương ứng theo khung thời gian đã chọn
  const displayRevenue = useMemo(() => {
    if (!summary) return 0;
    if (timeRange === 'Hôm nay') {
      return summary.todayRevenue ?? 0;
    }
    if (timeRange === 'Tháng này') {
      return summary.thisMonthRevenue ?? summary.totalRevenue ?? 0;
    }
    return summary.totalRevenue || 0;
  }, [summary, timeRange]);

  return {
    timeRange,
    setTimeRange,
    summary,
    loading,
    recentOrders,
    lowStockVariants,
    recentConversations,
    fetchDashboardData,
    displayRevenue
  };
}

