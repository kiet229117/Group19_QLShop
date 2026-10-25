import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  FileSpreadsheet,
  Check,
  Eye,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Shirt,
  DollarSign,
  Ticket,
  Calendar,
  Layers,
  RefreshCw
} from 'lucide-react';
import useDashboard from '../hooks/useDashboard';
import { STATUS_CONFIG } from '../../data/admin/admin-order';

export default function DashboardPage() {
  const {
    timeRange,
    setTimeRange,
    summary,
    loading,
    recentOrders,
    lowStockVariants,
    recentConversations,
    fetchDashboardData,
    displayRevenue
  } = useDashboard();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 text-xs">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + BỘ LỌC THỜI GIAN
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Chào mừng trở lại, Ban Quản Trị QLShop 👋
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Database
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Toàn bộ doanh số bán áo, số lượng đơn hoàn tất và kiểm kê tồn kho vải đều được cập nhật thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-600">
            {['Hôm nay', '7 ngày qua', 'Tháng này', 'Năm 2026'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timeRange === range
                    ? 'bg-white text-emerald-900 font-bold shadow-2xs'
                    : 'hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-2xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm Mới Số Liệu</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ CHỈ SỐ THỐNG KÊ (STAT CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Doanh thu bán áo */}
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
            <span>DOANH THU ({timeRange.toUpperCase()})</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900 tracking-tight">
            {Number(displayRevenue).toLocaleString('vi-VN')} đ
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> {summary?.completedOrders ?? 0} đơn đã giao thành công
            </span>
            <span className="text-gray-400 font-mono text-[10px]">
              Tổng: {Number(summary?.totalRevenue ?? 0).toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {/* Card 2: Đơn hàng toàn shop */}
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
            <span>ĐƠN HÀNG TOÀN SHOP</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {summary?.totalOrders ?? 0} đơn hàng
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {summary?.completedOrders ?? 0} thành công
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
              {summary?.shippingOrders ?? 0} đang giao
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              {summary?.pendingOrders ?? 0} chờ duyệt
            </span>
          </div>
        </div>

        {/* Card 3: Mẫu áo trong kho */}
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
            <span>MẪU ÁO TRONG KHO</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Shirt className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {summary?.totalProducts != null ? `${summary.totalProducts} mẫu áo` : '16 mẫu áo'}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-rose-700 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              {lowStockVariants.length} biến thể sắp hết
            </span>
            <Link to="/admin/goods-receipts" className="text-emerald-700 hover:underline font-bold">
              Nhập kho &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4: Khách hàng & Hội thoại */}
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
            <span>KHÁCH HÀNG &amp; CSKH</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {summary?.totalUsers != null ? `${summary.totalUsers} thành viên` : '5 thành viên'}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-gray-600 font-medium">
              {summary?.totalConversations ?? 0} hội thoại tư vấn
            </span>
            <Link to="/admin/chats" className="text-emerald-700 hover:underline font-bold">
              Mở chat &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. KHỐI GIỮA: BIỂU ĐỒ DOANH SỐ ÁO + CƠ CẤU DANH MỤC ÁO
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái 2/3: Biểu đồ doanh số và giá vốn áo */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Doanh số bán áo vs Chi phí nhập từ xưởng may
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Đối soát biên lợi nhuận ròng giữa đơn hàng (Orders) và phiếu nhập kho (Goods Receipts)
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-800"></span>
                  <span className="font-semibold">Doanh số bán (Orders)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-semibold">Giá vốn xưởng (Receipts)</span>
                </div>
              </div>
            </div>

            {/* SVG Biểu đồ mượt mà */}
            <div className="w-full h-56 pt-6 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="revenueEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#065f46" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#065f46" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="#f1f5f9" strokeDasharray="3 3" />

                <path
                  d="M 10,130 Q 70,110 130,85 T 250,95 T 370,60 T 490,40 T 590,20 L 590,150 L 10,150 Z"
                  fill="url(#revenueEmeraldGrad)"
                />
                <path
                  d="M 10,130 Q 70,110 130,85 T 250,95 T 370,60 T 490,40 T 590,20"
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M 10,140 Q 70,125 130,115 T 250,118 T 370,85 T 490,75 T 590,55"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />

                <circle cx="130" cy="85" r="4" fill="#065f46" stroke="#fff" strokeWidth="2" />
                <circle cx="370" cy="60" r="4" fill="#065f46" stroke="#fff" strokeWidth="2" />
                <circle cx="590" cy="20" r="5" fill="#065f46" stroke="#fff" strokeWidth="2.5" />
              </svg>

              <div className="flex justify-between text-[11px] text-gray-400 mt-2 px-1 font-mono">
                <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span>
                <span>T7</span><span>T8</span><span>T9</span><span>T10</span><span>T11</span>
                <span className="text-emerald-800 font-bold">T12 (Hiện tại)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-700 font-medium">
              Biên lợi nhuận gộp trung bình các dòng áo: <strong className="text-emerald-800 font-black">{summary?.profitMargin ?? 35.8}%</strong>
            </span>
            <Link to="/admin/orders" className="text-emerald-800 hover:underline font-bold inline-flex items-center gap-1">
              <span>Xem sổ bán hàng chi tiết</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Cột phải 1/3: Cơ cấu danh mục mẫu áo */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Cơ cấu danh mục mẫu áo</h2>
              <span className="text-[10px] text-gray-400">Theo doanh số</span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-800"></span>
                    Áo Thun &amp; T-Shirt Basic
                  </span>
                  <span className="font-bold text-gray-900">42%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-emerald-800 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    Áo Polo Thể Thao &amp; Công Sở
                  </span>
                  <span className="font-bold text-gray-900">28%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Áo Sơ Mi Oxford &amp; Tay Dài
                  </span>
                  <span className="font-bold text-gray-900">18%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Áo Khoác Gió &amp; Hoodie Nỉ
                  </span>
                  <span className="font-bold text-gray-900">12%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-700 mb-2">Thương hiệu áo nổi bật:</div>
            <div className="flex flex-wrap gap-1.5">
              {['Coolmate', 'Nike', 'Routine', 'Adidas', 'Levents'].map((b) => (
                <span key={b} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. KHỐI DƯỚI: ĐƠN HÀNG MỚI NHẤT + TỒN KHO THẤP
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái 2/3: Đơn hàng áo mới nhất */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 px-5 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Đơn hàng mới nhất</h2>
                <p className="text-xs text-gray-500 mt-0.5">Các đơn đặt áo từ storefront cần theo dõi</p>
              </div>
              <Link to="/admin/orders" className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1">
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-bold text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="py-2.5 px-4">MÃ ĐƠN</th>
                    <th className="py-2.5 px-4">NGƯỜI NHẬN</th>
                    <th className="py-2.5 px-4">MẪU ÁO ĐẶT</th>
                    <th className="py-2.5 px-4 text-right">TỔNG TIỀN</th>
                    <th className="py-2.5 px-4 text-center">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                        #ORD-{ord.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{ord.receiverName || ord.userName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{ord.receiverPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-800 font-medium truncate max-w-[200px]">
                          {ord.items?.[0]?.productName || 'Áo thời trang'}
                        </div>
                        {ord.items?.length > 1 && (
                          <div className="text-[10px] text-gray-400">+{ord.items.length - 1} áo khác</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-gray-900">
                        {Number(ord.totalAmount || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          STATUS_CONFIG[ord.status]?.color || 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {STATUS_CONFIG[ord.status]?.label || ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-400">
                        Chưa có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 px-4 bg-gray-50 border-t border-gray-100 text-right">
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-800 hover:underline">
              Mở trang Quản Lý Đơn Hàng &rarr;
            </Link>
          </div>
        </div>

        {/* Cột phải 1/3: Cảnh báo tồn kho biến thể thấp */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Biến thể áo sắp hết hàng</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                Cần nhập thêm
              </span>
            </div>

            <div className="mt-3.5 space-y-3">
              {lowStockVariants.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 pb-2">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {item.variantName} • <span className="text-rose-600 font-bold">Còn: {item.stock} cái</span>
                    </p>
                  </div>
                  <Link
                    to="/admin/goods-receipts"
                    className="px-2.5 py-1 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold transition shadow-2xs shrink-0"
                  >
                    Nhập kho
                  </Link>
                </div>
              ))}

              {lowStockVariants.length === 0 && (
                <div className="py-6 text-center text-gray-400">
                  Kho hàng đang ở trạng thái dồi dào
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 text-center">
            <Link to="/admin/goods-receipts" className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1">
              <span>Lập phiếu nhập kho áo mới</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
