import { useState } from 'react';
import {
  FileText,
  Clock,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  Search,
  RotateCcw,
  Plus,
  Download,
  Upload,
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  Eye,
  Barcode,
  ScanLine,
  CheckCircle2,
  Truck,
  Box,
  X
} from 'lucide-react';

export default function GoodsReceiptsPage() {
  const [activeTab, setActiveTab] = useState('receipts');
  const [expandedReceiptId, setExpandedReceiptId] = useState('GR-2024-102');

  const toggleExpand = (id) => {
    setExpandedReceiptId(expandedReceiptId === id ? null : id);
  };

  // Dữ liệu mockup danh sách phiếu nhập kho
  const receipts = [
    {
      id: 'GR-2024-102',
      lotCode: 'Lô: PO-SYNNEX-OCT-05',
      supplier: {
        name: 'Synnex FPT Distribution',
        code: 'Mã: NCC-FPT-01',
        tax: 'MST: 0101719163',
        logoText: 'FPT',
        logoBg: 'bg-emerald-600 text-white',
      },
      warehouse: {
        name: 'Kho Tổng Tân Bình',
        location: 'Kệ A3 - Line 12',
      },
      creator: {
        date: '24/10/2024 08:30',
        name: 'Bởi: Lê Quốc Tuấn (QC Lead)',
      },
      quantity: {
        items: '150 sản phẩm',
        skus: '2 danh mục (SKU)',
      },
      total: {
        amount: '1.328.000.000 đ',
        vat: 'VAT 10%: 132.800.000 đ',
      },
      payment: {
        status: 'Nợ: 628.000.000 đ',
        sub: '(Đã cọc 50%)',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      },
      status: {
        label: 'Đã nhập kho',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
      },
      items: [
        {
          stt: '01',
          name: 'iPhone 15 Pro Max Titanium Tự Nhiên (256GB)',
          sku: 'SKU: IP15PM-256-NAT • Màu: Titan Tự Nhiên',
          icon: '📱',
          batchCode: 'BATCH-2024-A1',
          warranty: 'Bảo hành 12 tháng Apple VN',
          requestedQty: '50 chiếc',
          actualQty: '50 chiếc',
          unitPrice: '26.100.000 đ',
          totalPrice: '1.224.000.000 đ',
          qcStatus: 'Đạt 100% tem seal',
          qcClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          stt: '02',
          name: 'Tai nghe Sony WH-1000XM5 Chống Ồn (Đen)',
          sku: 'SKU: SNY-WH1000M5-BLK • Model: WH-1000XM5/BM',
          icon: '🎧',
          batchCode: 'SNY-OCT-24-08',
          warranty: 'Xuất xứ: Malaysia',
          requestedQty: '20 chiếc',
          actualQty: '20 chiếc',
          unitPrice: '5.200.000 đ',
          totalPrice: '104.000.000 đ',
          qcStatus: 'Đạt chuẩn',
          qcClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
      ],
      itemsTotalQty: '70 sản phẩm',
      itemsTotalPrice: '1.328.000.000 đ',
    },
    {
      id: 'GR-2024-101',
      lotCode: 'Lô: PO-DGW-OCT-18',
      supplier: {
        name: 'Digiworld Corporation',
        code: 'Mã: NCC-DGW-03',
        tax: 'MST: 0302861742',
        logoText: 'DGW',
        logoBg: 'bg-blue-600 text-white',
      },
      warehouse: {
        name: 'Kho Long Biên',
        location: 'Kệ C2 - Ô 04',
      },
      creator: {
        date: '23/10/2024 14:20',
        name: 'Bởi: Phạm Thùy Linh',
      },
      quantity: {
        items: '90 sp',
        skus: '3 danh mục (SKU)',
      },
      total: {
        amount: '420.000.000 đ',
        vat: 'VAT: 42.000.000 đ',
      },
      payment: {
        status: 'Đã thanh toán 100%',
        sub: '',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      },
      status: {
        label: 'Đã nhập kho',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
      },
    },
    {
      id: 'GR-2024-100',
      lotCode: 'Lô: PO-PSD-OCT-11',
      supplier: {
        name: 'Petrosetco PSD',
        code: 'Mã: NCC-PSD-04',
        tax: 'MST: 0304910214',
        logoText: 'PSD',
        logoBg: 'bg-amber-600 text-white',
      },
      warehouse: {
        name: 'Kho Tổng Tân Bình',
        location: 'Khu vực kiểm định QC',
      },
      creator: {
        date: '22/10/2024 12:15',
        name: 'Bởi: Trần Hoàng Nam',
      },
      quantity: {
        items: '200 sp',
        skus: '6 danh mục (SKU)',
      },
      total: {
        amount: '680.000.000 đ',
        vat: 'Chờ đối soát',
      },
      payment: {
        status: 'Chưa thanh toán',
        sub: '',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
      },
      status: {
        label: 'Chờ kiểm QC',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
      },
    },
    {
      id: 'GR-2024-099',
      lotCode: 'Lô: PO-VTL-OCT-08',
      supplier: {
        name: 'Viettel Commerce',
        code: 'Mã: NCC-VTL-07',
        tax: 'MST: 0102148291',
        logoText: 'VTL',
        logoBg: 'bg-rose-600 text-white',
      },
      warehouse: {
        name: 'Kho Đà Nẵng',
        location: 'Dự kiến đến: 25/10',
      },
      creator: {
        date: '20/10/2024 16:00',
        name: 'Bởi: Nguyễn Minh Khôi',
      },
      quantity: {
        items: '45 sp',
        skus: '2 danh mục (SKU)',
      },
      total: {
        amount: '185.000.000 đ',
        vat: 'VAT: 18.500.000 đ',
      },
      payment: {
        status: 'Đã cọc 30%',
        sub: '',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
      },
      status: {
        label: 'Đang vận chuyển',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-500',
      },
    },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt; <span className="text-gray-800 font-semibold">Nhập kho (Goods Receipt)</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quản lý Nhập kho &amp; Lô hàng (Goods Receipts &amp; Suppliers)
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ERP Synced V5.2
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Theo dõi tiếp nhận hàng hóa (GoodsReceipt), chi tiết kiện hàng theo lô &amp; hạn dùng (GoodsReceiptItem), công nợ nhà cung cấp (Supplier).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition">
            <Plus className="w-3.5 h-3.5 text-gray-500" />
            <span>Thêm Nhà cung cấp</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition">
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Nhập file Excel</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition">
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Xuất báo cáo</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Tạo Phiếu Nhập Kho</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ CHỈ SỐ THỐNG KÊ (STAT CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng giá trị nhập kho (Tháng này) */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng giá trị nhập kho (Tháng này)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              845.200.000 đ
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +14.2%
              </span>
              <span className="text-gray-400">so với tháng trước</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Phiếu nhập đang xử lý */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex-1 mr-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Phiếu nhập đang xử lý
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5 flex items-center gap-2">
              <span>8 phiếu</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                Cần kiểm duyệt
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
              <span className="text-amber-700">3 Chờ kiểm hàng</span>
              <span>•</span>
              <span className="text-blue-600">5 Đang vận chuyển</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Nhà cung cấp đối tác */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Nhà cung cấp đối tác
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              24 đối tác
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              Công nợ hiện tại: <strong className="text-gray-900">312.000.000 đ</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Cảnh báo sai lệch / Lỗi */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo sai lệch / Lỗi
            </span>
            <div className="text-2xl font-black text-rose-600 mt-0.5 flex items-center gap-2">
              <span>2 lô hàng</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                Cần hoàn trả
              </span>
            </div>
            <div className="mt-1 text-[11px] text-gray-400 truncate max-w-[200px]">
              Móp vỏ hộp &amp; Thiếu tem chứng nhận FPT
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH TAB ĐIỀU HƯỚNG CHỨC NĂNG
          ========================================================================= */}
      <div className="border-b border-gray-200 flex flex-wrap items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-2.5 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'receipts'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Phiếu nhập kho (Goods Receipts)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            128
          </span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-2.5 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'suppliers'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Danh bạ Nhà cung cấp (Suppliers)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600 text-[10px]">
            24
          </span>
        </button>

        <button
          onClick={() => setActiveTab('debts')}
          className="pb-2.5 flex items-center gap-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition"
        >
          <FileText className="w-4 h-4" />
          <span>Báo cáo công nợ &amp; Lịch sử chi trả</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className="pb-2.5 flex items-center gap-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition"
        >
          <Box className="w-4 h-4" />
          <span>Lô hàng &amp; Quản lý Hạn sử dụng</span>
          <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 text-[10px]">
            Chế độ xem
          </span>
        </button>
      </div>

      {/* =========================================================================
          4. THANH BỘ LỌC TÌM KIẾM
          ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Mã phiếu, NCC (FPT, DGW...)"
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold border border-gray-200 text-xs">
            Synnex FPT Distribution
            <X className="w-3 h-3 text-gray-400 hover:text-gray-700 cursor-pointer" />
          </span>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            <span>Tất cả trạng thái phiếu</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            <span>Tất cả kho lưu trữ</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>01/10/2024 - 31/10/2024</span>
          </div>
        </div>

        <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* =========================================================================
          5. BẢNG DỮ LIỆU PHIẾU NHẬP & BẢNG CON CHI TIẾT MẶT HÀNG
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="w-10 py-2.5 px-3 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </th>
                <th className="py-2.5 px-3">MÃ PHIẾU</th>
                <th className="py-2.5 px-3">NHÀ CUNG CẤP (SUPPLIER)</th>
                <th className="py-2.5 px-3">KHO TIẾP NHẬN</th>
                <th className="py-2.5 px-3">NGÀY LẬP &amp; NGƯỜI TẠO</th>
                <th className="py-2.5 px-3 text-center">SL NHẬP</th>
                <th className="py-2.5 px-3">TỔNG TIỀN PHIẾU</th>
                <th className="py-2.5 px-3 text-center">THANH TOÁN</th>
                <th className="py-2.5 px-3 text-center">TRẠNG THÁI KHO</th>
                <th className="py-2.5 px-3 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {receipts.map((r) => {
                const isExpanded = expandedReceiptId === r.id;
                return (
                  <div key={r.id} style={{ display: 'contents' }}>
                    {/* Dòng cha Phiếu nhập */}
                    <tr className={`hover:bg-gray-50/80 transition-colors ${isExpanded ? 'bg-emerald-50/20' : ''}`}>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input type="checkbox" checked={isExpanded} readOnly className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                          <button
                            onClick={() => toggleExpand(r.id)}
                            className="p-0.5 text-gray-400 hover:text-gray-700 transition"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Mã phiếu */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900 flex items-center gap-1">
                          <span>{r.id}</span>
                          <span className="text-gray-400 text-[10px]">ⓘ</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{r.lotCode}</div>
                      </td>

                      {/* Nhà cung cấp */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded flex items-center justify-center font-black text-[10px] shrink-0 ${r.supplier.logoBg}`}>
                            {r.supplier.logoText}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{r.supplier.name}</div>
                            <div className="text-[10px] text-gray-400">
                              {r.supplier.code} • {r.supplier.tax}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kho tiếp nhận */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-gray-800 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-gray-400" />
                          <span>{r.warehouse.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{r.warehouse.location}</div>
                      </td>

                      {/* Ngày lập & Người tạo */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-800">{r.creator.date}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{r.creator.name}</div>
                      </td>

                      {/* Số lượng nhập */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-bold text-gray-900">{r.quantity.items}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{r.quantity.skus}</div>
                      </td>

                      {/* Tổng tiền */}
                      <td className="py-3 px-3">
                        <div className="font-black text-gray-900">{r.total.amount}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{r.total.vat}</div>
                      </td>

                      {/* Thanh toán */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${r.payment.badgeClass}`}>
                          {r.payment.status}
                        </span>
                        {r.payment.sub && (
                          <div className="text-[9px] text-gray-400 mt-0.5">{r.payment.sub}</div>
                        )}
                      </td>

                      {/* Trạng thái kho */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${r.status.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${r.status.dotColor}`}></span>
                          {r.status.label}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-400">
                          <button className="p-1 hover:text-gray-800 transition" title="In phiếu nhập">
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-emerald-700 transition" title="Xem chi tiết">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* =========================================================
                        SUB-TABLE: CHI TIẾT CÁC MẶT HÀNG THỰC NHẬP (EXPANDED)
                        ========================================================= */}
                    {isExpanded && r.items && (
                      <tr className="bg-[#f8faf9] border-y border-emerald-100">
                        <td colSpan="10" className="p-4 pl-10 pr-6">
                          <div className="bg-white rounded-lg border border-emerald-200/80 shadow-2xs overflow-hidden">
                            {/* Tiêu đề sub-table */}
                            <div className="p-2.5 px-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 text-xs">
                                  Chi tiết các mặt hàng thực nhập (GoodsReceiptItems) của phiếu #{r.id}
                                </span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded">
                                  {r.items.length} biến thể sản phẩm
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 transition shadow-2xs">
                                  <ScanLine className="w-3 h-3 text-emerald-700" />
                                  <span>Quét mã vạch kiểm hàng</span>
                                </button>
                                <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 transition shadow-2xs">
                                  <Barcode className="w-3 h-3 text-gray-500" />
                                  <span>Tải barcode lô hàng</span>
                                </button>
                              </div>
                            </div>

                            {/* Bảng chi tiết từng sản phẩm nhập */}
                            <table className="w-full text-left text-[11px]">
                              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                                <tr>
                                  <th className="py-2.5 px-3 text-center w-8">STT</th>
                                  <th className="py-2.5 px-3">MẶT HÀNG &amp; MÃ BIẾN THỂ SKU</th>
                                  <th className="py-2.5 px-3">MÃ LÔ &amp; HẠN DÙNG</th>
                                  <th className="py-2.5 px-3 text-center">SL YÊU CẦU</th>
                                  <th className="py-2.5 px-3 text-center">SL THỰC NHẬP</th>
                                  <th className="py-2.5 px-3 text-right">ĐƠN GIÁ NHẬP</th>
                                  <th className="py-2.5 px-3 text-right">THÀNH TIỀN</th>
                                  <th className="py-2.5 px-3 text-center">KẾT QUẢ QC</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {r.items.map((item) => (
                                  <tr key={item.stt} className="hover:bg-gray-50/80 transition">
                                    <td className="py-2.5 px-3 text-center text-gray-400 font-medium">{item.stt}</td>
                                    <td className="py-2.5 px-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-base shrink-0">
                                          {item.icon}
                                        </div>
                                        <div>
                                          <div className="font-bold text-gray-800">{item.name}</div>
                                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.sku}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <div className="font-bold text-gray-700">{item.batchCode}</div>
                                      <div className="text-[10px] text-gray-400">{item.warranty}</div>
                                    </td>
                                    <td className="py-2.5 px-3 text-center font-medium text-gray-600">{item.requestedQty}</td>
                                    <td className="py-2.5 px-3 text-center font-bold text-emerald-800">{item.actualQty}</td>
                                    <td className="py-2.5 px-3 text-right font-medium text-gray-600">{item.unitPrice}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-gray-900">{item.totalPrice}</td>
                                    <td className="py-2.5 px-3 text-center">
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${item.qcClass}`}>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        {item.qcStatus}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Dòng tổng kết con */}
                            <div className="p-2.5 px-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-800">
                              <span>Tổng cộng các mục trong phiếu nhập:</span>
                              <div className="flex items-center gap-8">
                                <span>{r.itemsTotalQty}</span>
                                <div>
                                  <span className="text-gray-500 font-medium mr-1.5">Cộng tiền hàng:</span>
                                  <span className="text-emerald-800 font-black">{r.itemsTotalPrice}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            6. PHÂN TRANG GỌN GÀNG (PAGINATION)
            ========================================================================= */}
        <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span>Đang hiển thị <strong className="text-gray-800">4</strong> trong tổng số <strong className="text-gray-800">128</strong> phiếu nhập</span>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>Số dòng / trang:</span>
              <select className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 font-semibold focus:outline-none">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Realtime Sync: OK
            </span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-gray-600">
            <button className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
              |&lt;
            </button>
            <button className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
              &lt;
            </button>
            <button className="px-2.5 py-1 rounded bg-emerald-700 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">2</button>
            <button className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">8</button>
            <button className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
              &gt;
            </button>
            <button className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
              &gt;|
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
