import { useState, useEffect, useCallback, useMemo } from 'react';
import orderService from '../services/orderService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';
import { STATUS_CONFIG } from '../../data/admin/admin-order';

export default function useOrders(initialPageSize = 10) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalElements, setTotalElements] = useState(0);

  // Modal Chi Tiết Đơn Hàng
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // 1. Tải danh sách đơn hàng từ Backend (GET /api/orders)
  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await orderService.getAllOrders(currentPage - 1, pageSize);
      const content = res?.content || (Array.isArray(res) ? res : []);
      setOrders(content);
      setTotalElements(res?.totalElements || content.length);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể tải danh sách đơn hàng'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 2. Cập nhật trạng thái đơn hàng (PUT /api/orders/{id}/status)
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatusId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Đã cập nhật trạng thái đơn #${orderId} sang "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể cập nhật trạng thái đơn hàng'));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // 3. Duyệt yêu cầu hủy đơn hàng (PUT /api/orders/{id}/cancel-approve)
  const handleApproveCancel = async (orderId) => {
    if (!window.confirm(`Xác nhận duyệt hủy đơn hàng #${orderId}? Sau khi duyệt, tồn kho sẽ được hoàn lại và mã voucher của khách sẽ được khôi phục.`)) {
      return;
    }
    setUpdatingStatusId(orderId);
    try {
      await orderService.approveCancelOrder(orderId);
      toast.success(`Đã duyệt hủy thành công đơn hàng #${orderId}! Tồn kho và mã voucher đã được hoàn lại.`);
      await fetchOrders(true);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: 'CANCELLED' }));
      }
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể duyệt hủy đơn hàng này'));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // 4. Từ chối yêu cầu hủy đơn hàng (PUT /api/orders/{id}/cancel-reject)
  const handleRejectCancel = async (orderId, reason) => {
    const rejectReason = prompt('Nhập lý do từ chối yêu cầu hủy đơn (tùy chọn):', 'Shop đã đóng gói và chuẩn bị giao hàng');
    if (rejectReason === null) return; // Khách bấm Hủy bỏ prompt

    setUpdatingStatusId(orderId);
    try {
      await orderService.rejectCancelOrder(orderId, rejectReason);
      toast.success(`Đã từ chối yêu cầu hủy đơn hàng #${orderId}! Đơn hàng tiếp tục được xử lý.`);
      await fetchOrders(true);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: 'PENDING' }));
      }
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể từ chối hủy đơn hàng'));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // 4b. Duyệt tất cả đơn hàng chờ xác nhận hàng loạt (Bulk Confirm)
  const handleConfirmAllPending = async () => {
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    if (pendingCount === 0) {
      toast.info('Hiện không có đơn hàng nào ở trạng thái Chờ xác nhận.');
      return;
    }
    if (!window.confirm(`Xác nhận duyệt tất cả ${pendingCount} đơn hàng đang chờ xác nhận sang trạng thái "Đã xác nhận"?`)) {
      return;
    }
    try {
      const res = await orderService.confirmAllPendingOrders();
      const count = res?.confirmedCount ?? pendingCount;
      toast.success(`Đã duyệt thành công ${count} đơn hàng sang trạng thái "Đã xác nhận"!`);
      await fetchOrders(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể duyệt hàng loạt đơn hàng'));
    }
  };

  // 5. Hủy đơn hàng trực tiếp bởi Admin (PUT /api/orders/{id}/cancel)
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId}? Hệ thống sẽ hoàn lại số lượng tồn kho và voucher cho khách hàng.`)) return;
    setUpdatingStatusId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      toast.success(`Đã hủy thành công đơn hàng #${orderId}!`);
      await fetchOrders(true);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: 'CANCELLED' }));
      }
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể hủy đơn hàng này'));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // 6. Xóa đơn hàng (DELETE /api/orders/{id})
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Hành động này sẽ xóa hoàn toàn đơn hàng #${orderId} khỏi cơ sở dữ liệu. Bạn có chắc không?`)) return;
    try {
      await orderService.deleteOrder(orderId);
      toast.success(`Đã xóa vĩnh viễn đơn hàng #${orderId}!`);
      if (selectedOrder?.id === orderId) setIsDetailModalOpen(false);
      fetchOrders(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể xóa đơn hàng'));
    }
  };

  // 7. Lọc & Tìm kiếm danh sách
  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
        if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        const idMatch = String(o.id).includes(term) || `ord-${o.id}`.includes(term);
        const nameMatch = (o.receiverName || '').toLowerCase().includes(term);
        const phoneMatch = (o.receiverPhone || '').includes(term);
        const addressMatch = (o.shippingAddress || '').toLowerCase().includes(term);
        return idMatch || nameMatch || phoneMatch || addressMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'OLDEST') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'HIGHEST_AMOUNT') return (b.totalAmount || 0) - (a.totalAmount || 0);
        return 0;
      });
  }, [orders, statusFilter, searchTerm, sortBy]);

  // 8. Thống kê nhanh
  const stats = useMemo(() => {
    const total = orders.length;
    const cancelRequested = orders.filter(o => o.status === 'CANCEL_REQUESTED').length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const shipping = orders.filter(o => o.status === 'SHIPPING').length;
    const completed = orders.filter(o => o.status === 'COMPLETED').length;
    const revenue = orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { total, cancelRequested, pending, shipping, completed, revenue };
  }, [orders]);

  const totalPages = Math.ceil(totalElements / pageSize) || 1;

  return {
    orders,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalElements,
    totalPages,
    selectedOrder,
    setSelectedOrder,
    isDetailModalOpen,
    setIsDetailModalOpen,
    updatingStatusId,
    fetchOrders,
    handleUpdateStatus,
    handleConfirmAllPending,
    handleApproveCancel,
    handleRejectCancel,
    handleCancelOrder,
    handleDeleteOrder,
    filteredOrders,
    stats
  };
}
