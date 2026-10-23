import { useState, useEffect } from 'react';
import api from '../../../services/api';
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
  MoreVertical,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw
} from 'lucide-react';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('Tháng này');
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard/summary')
      .then((res) => {
        setSummary(res.data || res);
      })
      .catch((err) => {
        console.warn('Dashboard summary error:', err);
      })
      .finally(() => {
        setLoadingSummary(false);
      });
  }, []);

  // Dữ liệu mockup đơn hàng mới nhất
  const recentOrders = [
    {
      id: '#ORD-9821',
      customer: {
        name: 'Nguyễn Tuấn Kiệt',
        email: 'kiet.nguyen@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      },
      product: 'iPhone 15 Pro Max',
      variant: 'Titan Tự Nhiên / 256GB',
      total: '29.990.000 đ',
      voucher: 'NOVA500K',
      voucherType: 'active',
      status: 'Chờ xử lý',
      statusClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: '#ORD-9820',
      customer: {
        name: 'Trần Phương Mai',
        email: 'mai.tp@outlook.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      },
      product: 'Tai nghe Sony WH-1000XM5',
      variant: 'Bạc Silver / ANC Pro',
      total: '7.490.000 đ',
      voucher: 'Không dùng',
      voucherType: 'none',
      status: 'Đang giao',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: '#ORD-9819',
      customer: {
        name: 'Hoàng Gia Bảo',
        email: 'bao.hg@fpt.vn',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      },
      product: 'Đồng hồ Samsung Galaxy Watch 6',
      variant: 'Đen Graphite / LTE 44mm',
      total: '6.120.000 đ',
      voucher: 'FREESHIP',
      voucherType: 'freeship',
      status: 'Đã hoàn thành',
      statusClass: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      id: '#ORD-9818',
      customer: {
        name: 'Vũ Thùy Linh',
        email: 'linh.vt@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80',
      },
      product: 'Củ sạc nhanh Anker GaNPrime 65W',
      variant: '3 Cổng USB-C / Màu Trắng',
      total: '890.000 đ',
      voucher: 'Không dùng',
      voucherType: 'none',
      status: 'Đã huỷ',
      statusClass: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  // Dữ liệu mockup tồn kho thấp (Low stock)
  const lowStockItems = [
    {
      name: 'MacBook Air M2 13-inch',
      sku: 'SKU: MBA-M2-STG-256',
      stock: 2,
      unit: 'máy',
    },
    {
      name: 'iPad Pro 11 M4 Wifi',
      sku: 'SKU: IPP-11-M4-BLK',
      stock: 4,
      unit: 'máy',
    },
    {
      name: 'Bàn phím cơ Keychron K2',
      sku: 'SKU: KC-K2-V2-RGB-RED',
      stock: 1,
      unit: 'chiếc',
    },
  ];

  // Dữ liệu mockup CSKH gần đây
  const conversations = [
    {
      name: 'Đặng Thảo Vy',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
      message: 'Shop cho mình hỏi đơn #ORD-9821 đã gửi bên bưu cục chưa...',
      time: '2 phút',
    },
    {
      name: 'Phạm Quốc Hùng',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      message: 'Voucher NOVA500K còn lượt dùng cho đơn tai nghe không bạn ơi?',
      time: '18 phút',
    },
    {
      name: 'Bùi Minh Trang',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80',
      message: 'Mình muốn đổi trả biến thể màu Titan Tự Nhiên sang Titan Đen...',
      time: '1 giờ',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + BỘ LỌC THỜI GIAN
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Chào mừng quay trở lại, Ban Quản Trị 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Toàn bộ chỉ số hiệu năng thương mại và tình trạng tồn kho biến thể được cập nhật theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-gray-100/80 p-1 rounded-lg border border-gray-200/60 text-xs font-medium text-gray-600">
            {['Hôm nay', '7 ngày qua', 'Tháng này', 'Năm 2024'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-white text-emerald-800 font-semibold shadow-2xs'
                    : 'hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 shadow-2xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-gray-500" />
            <span>Xuất Excel/PDF</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ CHỈ SỐ THỐNG KÊ (STAT CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng doanh thu */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>TỔNG DOANH THU (THÁNG NÀY)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {summary?.totalRevenue != null
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(summary.totalRevenue)
              : (loadingSummary ? 'Đang tải...' : '0 đ')}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.5% so với tháng trước
            </span>
            <span className="text-gray-400">Target: 95%</span>
          </div>
        </div>

        {/* Card 2: Đơn hàng mới */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>ĐƠN HÀNG MỚI (ORDERS)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {summary?.totalOrders != null ? `${summary.totalOrders} đơn` : (loadingSummary ? 'Đang tải...' : '0 đơn')}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-emerald-600 font-semibold">+8.2%</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
              {summary?.pendingOrders || 0} chờ duyệt
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
              {summary?.shippingOrders || 0} đang giao
            </span>
          </div>
        </div>

        {/* Card 3: Tồn kho & biến thể thấp */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>TỒN KHO & BIẾN THỂ (LOW STOCK)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 tracking-tight">
            18 mặt hàng
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
              Cần nhập hàng gấp
            </span>
            <Link to="/admin/goods-receipts" className="text-blue-600 hover:underline font-medium text-xs">
              Tạo phiếu nhập &gt;
            </Link>
          </div>
        </div>

        {/* Card 4: Khách hàng & CSKH */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>KHÁCH HÀNG & CSKH</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            {summary?.totalUsers != null ? `${summary.totalUsers} Người dùng` : (loadingSummary ? 'Đang tải...' : '0 Người dùng')}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {summary?.totalConversations || 0} hội thoại CSKH
            </span>
            <Link to="/admin/chats" className="text-emerald-700 hover:underline font-medium text-xs">
              Mở chat &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. KHỐI GIỮA: BIỂU ĐỒ DOANH SỐ VS CHI PHÍ + CƠ CẤU NGÀNH HÀNG
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái 2/3: Biểu đồ doanh số và giá vốn */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Doanh số bán hàng vs Chi phí nhập kho (Goods Receipt)
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Phân tích chênh lệch biên lợi nhuận ròng qua 12 chu kỳ thanh toán gần nhất
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#4f46e5]"></span>
                  <span>Doanh số (Orders)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]"></span>
                  <span>Giá vốn (GoodsReceipt)</span>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 rounded bg-gray-50 border border-gray-200 text-gray-700 text-xs">
                  <span>Năm 2024</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Khung vẽ Chart SVG tinh gọn, phản ánh đường cong mượt mà theo ảnh mẫu */}
            <div className="w-full h-56 pt-6 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Đường lưới ngang nhạt */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Vùng đổ màu gradient của doanh số */}
                <path
                  d="M 10,120 Q 60,105 110,80 T 210,100 T 310,75 T 410,95 T 510,40 T 590,20 L 590,150 L 10,150 Z"
                  fill="url(#revenueGradient)"
                />
                {/* Đường Line chính của Doanh số (Màu tím/indigo) */}
                <path
                  d="M 10,120 Q 60,105 110,80 T 210,100 T 310,75 T 410,95 T 510,40 T 590,20"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Đường Line phụ của Chi phí/Giá vốn (Màu xanh ngọc/teal) */}
                <path
                  d="M 10,135 Q 60,125 110,110 T 210,118 T 310,100 T 410,110 T 510,70 T 590,55"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />

                {/* Điểm nút nổi bật trên biểu đồ */}
                <circle cx="110" cy="80" r="3.5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
                <circle cx="310" cy="75" r="3.5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
                <circle cx="510" cy="40" r="4" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
                <circle cx="590" cy="20" r="4.5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              </svg>

              {/* Trục hoành tháng T1 -> T12 */}
              <div className="flex justify-between text-[11px] text-gray-400 mt-2 px-1 font-medium">
                <span>T1</span>
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>T8</span>
                <span>T9</span>
                <span>T10</span>
                <span>T11</span>
                <span className="text-emerald-700 font-bold">T12 (Hiện tại)</span>
              </div>
            </div>
          </div>

          {/* Footer dưới biểu đồ */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-700 font-medium">
              Tỷ suất lợi nhuận gộp trung bình: <strong className="text-emerald-700 font-bold">34.8%</strong>
            </span>
            <Link to="/admin/reports" className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1">
              <span>Xem chi tiết báo cáo kiểm kê</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Cột phải 1/3: Cơ cấu ngành hàng (Category breakdown) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Cơ cấu ngành hàng (Category)</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Các thanh tỷ trọng */}
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1.5 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Điện thoại & Tablet (Apple, Samsung)
                  </span>
                  <span className="font-bold text-gray-900">46% (657.1M)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '46%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Phụ kiện & Âm thanh (Sony, JBL)
                  </span>
                  <span className="font-bold text-gray-900">24% (342.8M)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Thời trang & Đồng hồ (Casio, Nike)
                  </span>
                  <span className="font-bold text-gray-900">18% (257.1M)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Gia dụng thông minh & Khác
                  </span>
                  <span className="font-bold text-gray-900">12% (171.4M)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Thương hiệu dẫn đầu */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Thương hiệu dẫn đầu (Brand): <strong className="text-gray-900">Apple Inc. (Doanh số 412M)</strong>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Apple', 'Samsung', 'Sony', 'Anker'].map((b) => (
                <span key={b} className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200/80 text-[11px] font-medium text-gray-700 transition cursor-pointer">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. KHỐI DƯỚI: ĐƠN HÀNG MỚI NHẤT + TỒN KHO THẤP & CSKH
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái 2/3: Bảng đơn hàng mới nhất */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Đơn hàng mới nhất (Recent Orders)</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quản lý duyệt đơn, kiểm tra voucher giảm giá và điều phối vận chuyển
                </p>
              </div>
              <Link to="/admin/orders" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                <span>Xem tất cả đơn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bảng dữ liệu đơn hàng */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">MÃ ĐƠN</th>
                    <th className="py-3 px-4">KHÁCH HÀNG (USER)</th>
                    <th className="py-3 px-4">SẢN PHẨM & BIẾN THỂ</th>
                    <th className="py-3 px-4">TỔNG THANH TOÁN</th>
                    <th className="py-3 px-4">VOUCHER</th>
                    <th className="py-3 px-4">TRẠNG THÁI</th>
                    <th className="py-3 px-4 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {ord.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={ord.customer.avatar}
                            alt={ord.customer.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                          />
                          <div>
                            <div className="font-semibold text-gray-800">{ord.customer.name}</div>
                            <div className="text-[10px] text-gray-400">{ord.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-800">{ord.product}</div>
                        <div className="text-[10px] text-gray-500">{ord.variant}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {ord.total}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.voucherType === 'active' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            {ord.voucher}
                          </span>
                        )}
                        {ord.voucherType === 'freeship' && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                            {ord.voucher}
                          </span>
                        )}
                        {ord.voucherType === 'none' && (
                          <span className="text-gray-400 text-[11px] italic">
                            Không dùng
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${ord.statusClass}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                          <button className="p-1 hover:text-emerald-600 transition" title="Duyệt đơn">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-gray-700 transition" title="Xem chi tiết">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân trang dưới bảng */}
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
            <div>Hiển thị {recentOrders.length} trong tổng số {summary?.totalOrders || recentOrders.length} đơn hàng (Order)</div>
            <div className="flex items-center gap-1 font-medium">
              <button className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">
                Trang trước
              </button>
              <button className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold">1</button>
              <button className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">2</button>
              <button className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">
                Tiếp theo
              </button>
            </div>
          </div>
        </div>

        {/* Cột phải 1/3: 2 Thẻ Tồn kho thấp & CSKH */}
        <div className="space-y-6">
          {/* Box 1: Tồn kho biến thể thấp */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Tồn kho biến thể thấp</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                18 SKU
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {item.sku} | <span className="text-rose-600 font-bold">Còn lại: {item.stock} {item.unit}</span>
                    </p>
                  </div>
                  <Link
                    to="/admin/goods-receipts"
                    className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition"
                  >
                    Nhập kho
                  </Link>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 text-right">
              <Link to="/admin/goods-receipts" className="text-xs text-gray-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1">
                <span>Xem toàn bộ danh mục cần lập GoodsReceipt</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Box 2: CSKH gần đây (Conversation) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>CSKH gần đây (Conversation)</span>
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="mt-3 space-y-3.5">
              {conversations.map((c, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-gray-200 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">{c.name}</span>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {c.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 text-center">
              <Link to="/admin/chats" className="text-xs text-emerald-700 hover:underline font-semibold inline-flex items-center gap-1">
                <span>Mở hộp thư CSKH tổng thể</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

