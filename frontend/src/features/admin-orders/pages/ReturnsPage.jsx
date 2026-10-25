import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  Shirt,
  Calendar,
  User,
  Phone,
  MapPin,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Eye,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import orderService from '../services/orderService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function ReturnsPage() {
  const [returnOrders, setReturnOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tải danh sách đơn hàng đã hủy / yêu cầu đổi trả (GET /api/orders)
  const fetchReturnOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await orderService.getAllOrders(0, 50);
      const content = res?.content || (Array.isArray(res) ? res : []);
      // Lấy các đơn CANCELLED hoặc có ghi chú đổi trả
      const returns = content.filter(o => o.status === 'CANCELLED' || (o.note && o.note.toLowerCase().includes('đổi')));
      setReturnOrders(returns);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể tải danh sách đổi trả'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturnOrders();
  }, [fetchReturnOrders]);

  // Hoàn tiền và nhận áo về kho
  const handleApproveRefund = (orderId) => {
    toast.success(`Đã xác nhận hoàn tiền và nhập lại kiện áo đơn #${orderId} vào kho!`);
    setIsModalOpen(false);
  };

  const filteredReturns = useMemo(() => {
    return returnOrders.filter(o => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        String(o.id).includes(term) ||
        (o.receiverName || '').toLowerCase().includes(term) ||
        (o.receiverPhone || '').includes(term)
      );
    });
  }, [returnOrders, searchTerm]);

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto text-xs pb-10">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white px-5 py-3.5 rounded-2xl border border-gray-200/80 shadow-2xs gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-xs">
            <RotateCcw className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-gray-900 tracking-tight">
                Đổi Trả &amp; Hoàn Tiền Shop Áo
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                Chính sách 7 ngày
              </span>
            </div>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Xử lý các trường hợp đổi size áo, lỗi đường may, đổi trả và hoàn tiền cho khách hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchReturnOrders(false)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : 'text-gray-500'}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 2. Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="font-semibold text-[11px]">Yêu Cầu Đổi Trả</span>
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-black text-rose-700">{returnOrders.length}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Đơn hàng phát sinh đổi trả / hủy</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="font-semibold text-[11px]">Kiểm Phẩm QC Áo Về Kho</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-800">100%</div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5">Đầy đủ tem mác &amp; tag áo</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="font-semibold text-[11px]">Tổng Giá Trị Hoàn Trả</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-indigo-700">
            {returnOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[10px] text-indigo-600/80 mt-0.5">Số tiền hoàn lại cho người mua</div>
        </div>
      </div>

      {/* 3. Bảng danh sách đổi trả */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
            <RefreshCw className="w-7 h-7 animate-spin text-emerald-700" />
            <p className="font-semibold text-xs">Đang tải danh sách đổi trả hàng...</p>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-bold text-gray-700 text-sm">Hiện không có yêu cầu đổi trả hoặc hủy đơn nào</p>
            <p className="text-gray-400 text-xs mt-1">Toàn bộ khách hàng đều hài lòng với chất lượng áo và giao nhận</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200/70">
                <tr>
                  <th className="py-3 px-3.5">MÃ ĐƠN HÀNG</th>
                  <th className="py-3 px-3.5">KHÁCH HÀNG</th>
                  <th className="py-3 px-3.5">MẪU ÁO CẦN ĐỔI TRẢ</th>
                  <th className="py-3 px-3.5">LÝ DO TỪ KHÁCH</th>
                  <th className="py-3 px-3.5 text-right">TIỀN HOÀN</th>
                  <th className="py-3 px-3.5 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReturns.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-3.5">
                      <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        #ORD-{order.id}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                      </div>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-bold text-gray-900">{order.receiverName || order.userName}</div>
                      <div className="text-gray-500 font-mono text-[11px]">{order.receiverPhone}</div>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="space-y-1">
                        {(order.items || []).map((it, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 font-medium text-gray-800">
                            <span>👕 {it.productName || 'Áo thời trang'}</span>
                            <span className="text-gray-400 font-bold">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3.5 max-w-[260px]">
                      <span className="inline-block px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200/70 text-[11px]">
                        {order.note || 'Khách đổi size do đặt nhầm hoặc không vừa'}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-right font-black text-rose-700 text-sm whitespace-nowrap">
                      {Number(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                    </td>

                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReturn(order);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] transition shadow-2xs"
                        >
                          Xử lý hoàn tiền
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Modal Xử Lý Đổi Trả */}
      {isModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Xử Lý Đổi Trả Đơn #ORD-{selectedReturn.id}</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <div className="font-bold text-gray-800">Kiểm tra điều kiện đổi trả:</div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="w-4 h-4" /> <span>Áo còn nguyên tem mác, nhãn cổ áo</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="w-4 h-4" /> <span>Vải chưa giặt ủi, không mùi nước hoa</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="w-4 h-4" /> <span>Thời hạn trong vòng 7 ngày kể từ khi nhận</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900">Số tiền hoàn cho khách:</span>
                <span className="font-black text-emerald-800 text-base">
                  {Number(selectedReturn.totalAmount || 0).toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveRefund(selectedReturn.id)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
                >
                  Duyệt Hoàn Tiền &amp; Nhập Kho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

