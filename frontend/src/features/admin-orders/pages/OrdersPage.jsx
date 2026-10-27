import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Printer,
  Calendar,
  User,
  Phone,
  MapPin,
  Tag,
  DollarSign,
  Shirt,
  X,
  Check,
  Send,
  ArrowUpDown,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import useOrders from '../hooks/useOrders';
import { toast } from '../../../components/common/Toast';
import { STATUS_CONFIG } from '../../data/admin/admin-order';

export default function OrdersPage() {
  const {
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
  } = useOrders();

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto text-xs pb-10">
      {/* =========================================================================
          1. HEADER BAR CHUẨN GIAO DIỆN ADMIN
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white px-5 py-3.5 rounded-2xl border border-gray-200/80 shadow-2xs gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-xs">
            <ShoppingBag className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-gray-900 tracking-tight">
                Quản Lý Đơn Hàng Áo Thời Trang
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Đồng bộ realtime
              </span>
            </div>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Theo dõi luồng xử lý đơn hàng, đóng gói kiện áo và giao hàng toàn quốc
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchOrders(false)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition shadow-2xs"
            title="Làm mới danh sách đơn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : 'text-gray-500'}`} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={() => toast.info('Đang kết xuất danh sách đơn hàng sang Excel...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. THỐNG KÊ NHANH (METRIC CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="font-semibold text-[11px]">Tổng Đơn Hàng</span>
            <ShoppingBag className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-black text-gray-900">{stats.total}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Tất cả đơn trong hệ thống</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="font-semibold text-[11px]">Chờ Xác Nhận</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-700">{stats.pending}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Tự động duyệt sau 15p</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="font-semibold text-[11px]">Đang Vận Chuyển</span>
            <Truck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-indigo-700">{stats.shipping}</div>
          <div className="text-[10px] text-indigo-600/80 mt-0.5">Shipper đang giao áo</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="font-semibold text-[11px]">Giao Thành Công</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-800">{stats.completed}</div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5">Đã thu tiền & đối soát</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="font-semibold text-[11px]">Doanh Thu Thực Thu</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-lg font-black text-emerald-800 truncate">
            {stats.revenue.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Từ đơn đã giao thành công</div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH TÌM KIẾM & BỘ LỌC TRẠNG THÁI
          ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Tabs Trạng thái */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'CANCEL_REQUESTED', label: 'Chờ duyệt hủy', count: stats.cancelRequested },
            { id: 'PENDING', label: 'Chờ xác nhận', count: stats.pending },
            { id: 'CONFIRMED', label: 'Đã xác nhận' },
            { id: 'SHIPPING', label: 'Đang giao', count: stats.shipping },
            { id: 'COMPLETED', label: 'Hoàn tất' },
            { id: 'CANCELLED', label: 'Đã hủy' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  statusFilter === tab.id ? 'bg-white text-emerald-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}

          {stats.pending > 0 && (
            <button
              type="button"
              onClick={handleConfirmAllPending}
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition shrink-0"
              title="Duyệt tất cả các đơn hàng đang chờ xác nhận ngay lập tức mà không cần chờ 15 phút"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Duyệt tất cả ({stats.pending})</span>
            </button>
          )}
        </div>

        {/* Ô tìm kiếm & Sắp xếp */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn, người nhận, SĐT..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50/50 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="NEWEST">Mới nhất</option>
              <option value="OLDEST">Cũ nhất</option>
              <option value="HIGHEST_AMOUNT">Giá trị cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BẢNG DỮ LIỆU ĐƠN HÀNG (ORDERS TABLE)
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
            <RefreshCw className="w-7 h-7 animate-spin text-emerald-700" />
            <p className="font-semibold text-xs">Đang tải danh sách đơn hàng áo từ cơ sở dữ liệu...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="font-bold text-gray-700 text-sm">Chưa có đơn hàng nào phù hợp</p>
            <p className="text-gray-400 text-xs mt-1">Hãy thử đổi từ khóa tìm kiếm hoặc chuyển tab trạng thái khác</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200/70">
                <tr>
                  <th className="py-3 px-3.5">MÃ ĐƠN HÀNG</th>
                  <th className="py-3 px-3.5">KHÁCH HÀNG &amp; ĐỊA CHỈ NHẬN</th>
                  <th className="py-3 px-3.5">KIỆN ÁO ĐẶT MUA</th>
                  <th className="py-3 px-3.5 text-right">TỔNG TIỀN</th>
                  <th className="py-3 px-3.5 text-center">TRẠNG THÁI</th>
                  <th className="py-3 px-3.5 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || {
                    label: order.status,
                    color: 'bg-gray-100 text-gray-700 border-gray-200',
                    dot: 'bg-gray-400'
                  };
                  const StatusIcon = statusInfo.icon || Clock;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition">
                      {/* Mã đơn */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            #ORD-{order.id}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>
                            {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                          </span>
                        </div>
                      </td>

                      {/* Khách hàng & Địa chỉ */}
                      <td className="py-3 px-3.5 align-top max-w-[280px]">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{order.receiverName || order.userName || 'Khách vãng lai'}</span>
                          <span className="text-gray-400 font-normal">•</span>
                          <span className="text-gray-600 font-mono text-[11px]">{order.receiverPhone}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 line-clamp-2 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                          <span title={order.shippingAddress}>{order.shippingAddress}</span>
                        </div>
                        {order.note && (
                          <div className="mt-1 px-2 py-0.5 bg-amber-50 rounded text-[10px] text-amber-800 border border-amber-200/60 italic">
                            &quot;{order.note}&quot;
                          </div>
                        )}
                      </td>

                      {/* Kiện áo đặt mua */}
                      <td className="py-3 px-3.5 align-top max-w-[280px]">
                        <div className="space-y-1">
                          {(order.items || []).slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[9px] shrink-0">
                                👕
                              </span>
                              <span className="font-semibold text-gray-800 truncate">
                                {item.productName || 'Áo thời trang'}
                              </span>
                              <span className="text-gray-500 font-bold shrink-0">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                          {(order.items || []).length > 2 && (
                            <span className="text-[10px] font-bold text-emerald-700 cursor-pointer hover:underline">
                              + {(order.items || []).length - 2} mẫu áo khác...
                            </span>
                          )}
                          {(!order.items || order.items.length === 0) && (
                            <span className="text-gray-400 italic">Kiện hàng tiêu chuẩn</span>
                          )}
                        </div>
                      </td>

                      {/* Tổng tiền & Voucher */}
                      <td className="py-3 px-3.5 align-top text-right whitespace-nowrap">
                        <div className="text-sm font-black text-emerald-900">
                          {Number(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                        </div>
                        {order.voucherCode ? (
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="px-1.5 py-0.2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                              🎟️ {order.voucherCode}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400">Không voucher</span>
                        )}
                      </td>

                      {/* Trạng thái đơn với dropdown chuyển nhanh */}
                      <td className="py-3 px-3.5 align-top text-center whitespace-nowrap">
                        <div className="inline-block relative">
                          <select
                            value={order.status}
                            disabled={order.status === 'COMPLETED' || order.status === 'CANCELLED' || updatingStatusId === order.id}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer disabled:cursor-not-allowed ${statusInfo.color} focus:outline-none`}
                          >
                            <option value="CANCEL_REQUESTED">Chờ duyệt hủy</option>
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="SHIPPING">Đang vận chuyển</option>
                            <option value="COMPLETED">Giao thành công</option>
                            <option value="CANCELLED">Đã hủy đơn</option>
                          </select>
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-3.5 align-top text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold transition shadow-2xs"
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toast.info(`Đang in phiếu gửi đơn hàng #ORD-${order.id}...`)}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold transition shadow-2xs"
                            title="In phiếu đóng gói & tem vận chuyển"
                          >
                            <Printer className="w-3.5 h-3.5 text-gray-600" />
                          </button>

                          {order.status === 'CANCEL_REQUESTED' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveCancel(order.id)}
                                className="px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-2xs transition"
                                title="Duyệt hủy đơn này (hoàn kho & voucher)"
                              >
                                Duyệt hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectCancel(order.id)}
                                className="px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-[10px] font-bold shadow-2xs transition"
                                title="Từ chối yêu cầu hủy đơn"
                              >
                                Từ chối
                              </button>
                            </>
                          ) : (
                            order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(order.id)}
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-rose-50 text-rose-600 transition shadow-2xs"
                                title="Hủy đơn hàng này"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition shadow-2xs"
                            title="Xóa vĩnh viễn đơn hàng"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <span>
            Đang hiển thị <strong className="text-gray-800">{filteredOrders.length}</strong> / tổng số <strong className="text-gray-800">{totalElements}</strong> đơn hàng áo
          </span>

          <div className="flex items-center gap-1 font-semibold">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-[10px]"
            >
              &lt; Trước
            </button>
            <span className="px-2.5 py-1 text-gray-700 font-bold">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-[10px]"
            >
              Sau &gt;
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. MODAL: CHI TIẾT ĐƠN HÀNG (ORDER DETAIL MODAL)
          ========================================================================= */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Chi Tiết Đơn Hàng #ORD-{selectedOrder.id}
                  </h3>
                  <p className="text-xs text-emerald-100/80">
                    Đặt lúc: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {selectedOrder.status === 'CANCEL_REQUESTED' && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="font-black text-orange-950 text-xs uppercase tracking-wide">Khách hàng đang yêu cầu hủy đơn hàng này</div>
                    <div className="text-orange-900 text-xs">
                      <span className="font-bold">Lý do khách cung cấp:</span> {selectedOrder.cancelReason || 'Khách hàng yêu cầu hủy đơn'}
                    </div>
                    <div className="text-orange-800 text-[11px]">
                      Khi bấm <strong>Duyệt hủy đơn</strong>: Hệ thống sẽ hủy đơn, hoàn lại số lượng sản phẩm vào kho và hoàn lại mã voucher cho khách hàng.
                    </div>
                  </div>
                </div>
              )}
              {/* Tiến trình đơn hàng (Stepper) */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <div className="text-[11px] font-bold text-gray-700 mb-2">Tiến trình xử lý đơn hàng</div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  {[
                    { key: 'PENDING', label: '1. Chờ duyệt' },
                    { key: 'CONFIRMED', label: '2. Đã xác nhận' },
                    { key: 'SHIPPING', label: '3. Đang giao' },
                    { key: 'COMPLETED', label: '4. Thành công' }
                  ].map((step, idx) => {
                    const orderStatus = selectedOrder.status;
                    const statusOrder = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED'];
                    const currentIdx = statusOrder.indexOf(orderStatus);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = orderStatus === step.key;

                    return (
                      <div
                        key={step.key}
                        className={`p-2 rounded-lg border transition ${
                          isCurrent
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs font-bold'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        {step.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thông tin người nhận */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
                <div>
                  <div className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Người nhận hàng</span>
                  </div>
                  <div className="text-gray-900 font-semibold">{selectedOrder.receiverName || selectedOrder.userName}</div>
                  <div className="text-gray-500 font-mono mt-0.5">{selectedOrder.receiverPhone}</div>
                </div>

                <div>
                  <div className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Địa chỉ giao hàng</span>
                  </div>
                  <div className="text-gray-700">{selectedOrder.shippingAddress}</div>
                  {selectedOrder.note && (
                    <div className="text-amber-700 italic text-[11px] mt-1 bg-amber-50 p-1.5 rounded">
                      Ghi chú: {selectedOrder.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách sản phẩm áo */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-2.5 bg-gray-50 font-bold text-gray-700 border-b border-gray-200 flex items-center justify-between">
                  <span>Mẫu áo trong kiện hàng</span>
                  <span>{(selectedOrder.items || []).length} mẫu áo</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/50 text-gray-500 font-bold text-[10px] border-b border-gray-100">
                    <tr>
                      <th className="py-2 px-3">MẪU ÁO</th>
                      <th className="py-2 px-3 text-center">SL</th>
                      <th className="py-2 px-3 text-right">ĐƠN GIÁ</th>
                      <th className="py-2 px-3 text-right">THÀNH TIỀN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(selectedOrder.items || []).map((it, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-gray-900">{it.productName || 'Áo thời trang cao cấp'}</div>
                          <div className="text-[10px] text-gray-400 font-mono">Mã SP: #{it.productId || '1'}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-gray-800">
                          {it.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-600 font-mono">
                          {Number(it.price || 0).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-gray-900 font-mono">
                          {Number(it.total || (it.price * it.quantity) || 0).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chi tiết thanh toán */}
              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính tiền hàng:</span>
                  <span className="font-semibold">
                    {Number(selectedOrder.totalAmount + (selectedOrder.discountAmount || 0)).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                {selectedOrder.voucherCode && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Mã voucher giảm giá ({selectedOrder.voucherCode}):</span>
                    <span>- {Number(selectedOrder.discountAmount || 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển toàn quốc:</span>
                  <span className="text-emerald-700 font-semibold">Miễn phí (Freeship)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-black text-emerald-950">
                  <span>Tổng tiền thanh toán (COD):</span>
                  <span className="text-base text-emerald-800 font-black">
                    {Number(selectedOrder.totalAmount || 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 px-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toast.info(`Đang in hóa đơn bán hàng cho đơn #${selectedOrder.id}...`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs transition"
              >
                <Printer className="w-3.5 h-3.5 text-gray-600" />
                <span>In Hóa Đơn</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedOrder.status === 'CANCEL_REQUESTED' && (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        await handleRejectCancel(selectedOrder.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition"
                    >
                      <XCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Từ chối hủy</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await handleApproveCancel(selectedOrder.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Duyệt hủy đơn</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

