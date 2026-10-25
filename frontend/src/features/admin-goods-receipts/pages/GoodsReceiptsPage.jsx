import React, { useState, useEffect, useCallback } from 'react';
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
  X,
  Loader2,
  Shirt,
  Check,
  Ban,
  Trash2
} from 'lucide-react';
import useGoodsReceipts from '../hooks/useGoodsReceipts';
import { toast } from '../../../components/common/Toast';





export default function GoodsReceiptsPage() {
  const [activeTab, setActiveTab] = useState('receipts');
  const {
    receipts,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    expandedReceiptId,
    toggleExpand,
    isModalOpen,
    setIsModalOpen,
    suppliers,
    products,
    submitting,
    newReceiptForm,
    setNewReceiptForm,
    fetchReceipts,
    handleOpenCreateModal,
    handleAddItemRow,
    handleRemoveItemRow,
    handleItemChange,
    handleCreateReceipt,
    handleCompleteReceipt,
    handleCancelReceipt,
    filteredReceipts,
    totalPages,
    currentItems,
    stats
  } = useGoodsReceipts();
  const { totalImportVal, pendingCount, completedCount } = stats;
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt; <span className="text-gray-800 font-semibold">Nhập kho Thời Trang (Goods Receipts)</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Shirt className="w-6 h-6 text-emerald-800" />
              <span>Quản lý Nhập kho &amp; Lô hàng Áo (Goods Receipts &amp; Suppliers)</span>
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Realtime Stock Synced
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Theo dõi tiếp nhận các lô hàng áo thun, polo, sơ mi, áo khoác theo kích cỡ (Size S/M/L/XL), màu sắc, giá nhập và cập nhật tự động tồn kho thực tế.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchReceipts(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Đồng bộ API</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info('Báo cáo nhập kho đang được tải xuống dạng Excel...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Xuất Excel</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Tạo Phiếu Nhập Kho Mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ CHỈ SỐ THỐNG KÊ (STAT CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng giá trị nhập kho */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng giá trị hàng nhập
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {totalImportVal.toLocaleString('vi-VN')} đ
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +18.5%
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
              Phiếu nhập đang chờ duyệt
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5 flex items-center gap-2">
              <span>{pendingCount} phiếu</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                  Cần kiểm hàng QC
                </span>
              )}
            </div>
            <div className="mt-1 text-[10px] text-gray-400 font-medium">
              Đã hoàn tất nhập kho: <strong className="text-emerald-700">{completedCount} phiếu</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Nhà cung cấp xưởng may */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Xưởng may &amp; Nhà vải
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              12 xưởng đối tác
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              Công nợ nhập áo: <strong className="text-gray-900">42.500.000 đ</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Cảnh báo sai lệch QC */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Kiểm định chất lượng (QC)
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5 flex items-center gap-2">
              <span>99.2%</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Đạt chuẩn
              </span>
            </div>
            <div className="mt-1 text-[11px] text-gray-400 truncate max-w-[200px]">
              Tỷ lệ lỗi đường may &lt; 0.8%
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH TAB ĐIỀU HƯỚNG CHỨC NĂNG
          ========================================================================= */}
      <div className="border-b border-gray-200 flex flex-wrap items-center gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('receipts')}
          className={`pb-2.5 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'receipts'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Phiếu nhập kho áo (Goods Receipts)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {filteredReceipts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('suppliers')}
          className={`pb-2.5 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'suppliers'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Xưởng may &amp; Nhà cung cấp vải</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('batches')}
          className={`pb-2.5 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'batches'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Lô áo &amp; Tiêu chuẩn vải</span>
        </button>
      </div>

      {/* =========================================================================
          4. THANH BỘ LỌC TÌM KIẾM
          ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[280px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Tìm mã phiếu (PNK...), tên xưởng may, ghi chú..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium text-xs focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái ({receipts.length})</option>
              <option value="COMPLETED">Đã nhập kho (COMPLETED)</option>
              <option value="DRAFT">Bản nháp / Đang chờ (DRAFT)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>Tháng 10/2026</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setCurrentPage(1); }}
          className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* =========================================================================
          5. BẢNG DỮ LIỆU PHIẾU NHẬP & BẢNG CON CHI TIẾT MẶT HÀNG
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
            <span className="font-medium text-sm">Đang tải dữ liệu phiếu nhập kho áo...</span>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Shirt className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-sm">Không tìm thấy phiếu nhập kho nào phù hợp</p>
            <p className="text-gray-400 text-xs mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Tạo Phiếu Nhập Kho Mới&quot;</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="w-10 py-2.5 px-3 text-center">XEM</th>
                  <th className="py-2.5 px-3">MÃ PHIẾU &amp; GHI CHÚ</th>
                  <th className="py-2.5 px-3">XƯỞNG MAY / NHÀ CUNG CẤP</th>
                  <th className="py-2.5 px-3">KHO TIẾP NHẬN</th>
                  <th className="py-2.5 px-3">NGÀY LẬP &amp; NGƯỜI TẠO</th>
                  <th className="py-2.5 px-3 text-center">SỐ LƯỢNG ÁO</th>
                  <th className="py-2.5 px-3">TỔNG TIỀN HÀNG</th>
                  <th className="py-2.5 px-3 text-center">TRẠNG THÁI</th>
                  <th className="py-2.5 px-3 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {currentItems.map((r) => {
                  const isExpanded = expandedReceiptId === r.id;
                  const totalQty = (r.items || []).reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
                  const isCompleted = r.status === 'COMPLETED';
                  const isDraft = r.status === 'DRAFT' || r.status === 'PENDING';
                  const isCancelled = r.status === 'CANCELLED';

                  return (
                    <React.Fragment key={r.id}>
                      {/* Dòng cha Phiếu nhập */}
                      <tr className={`hover:bg-gray-50/80 transition-colors ${isExpanded ? 'bg-emerald-50/20' : ''}`}>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleExpand(r.id)}
                            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
                            title={isExpanded ? 'Thu gọn' : 'Xem các mẫu áo trong phiếu'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-emerald-800 font-bold" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Mã phiếu */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span className="font-mono text-emerald-900 font-extrabold">{r.receiptCode || `PNK-${r.id}`}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-mono">#{r.id}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 max-w-[260px]">
                            {r.note || 'Lô hàng áo thời trang'}
                          </div>
                        </td>

                        {/* Nhà cung cấp / Xưởng may */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              {r.supplierName ? r.supplierName.charAt(0).toUpperCase() : 'X'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800">{r.supplierName || 'Xưởng May Gia Công Áo'}</div>
                              <div className="text-[10px] text-gray-400">
                                Đối tác thời trang • NCC ID: #{r.supplierId || '1'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Kho tiếp nhận */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-gray-800 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-gray-400" />
                            <span>{r.warehouse || 'Kho Tổng Áo TP.HCM'}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">Khu vực phân loại Size &amp; Màu</div>
                        </td>

                        {/* Ngày lập & Người tạo */}
                        <td className="py-3 px-3">
                          <div className="font-medium text-gray-800">
                            {r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : '22/10/2026'}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            Bởi: {r.importedByName || 'Quản lý kho'}
                          </div>
                        </td>

                        {/* Số lượng áo */}
                        <td className="py-3 px-3 text-center">
                          <div className="font-bold text-gray-900">{totalQty} áo</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{(r.items || []).length} mẫu biến thể</div>
                        </td>

                        {/* Tổng tiền */}
                        <td className="py-3 px-3">
                          <div className="font-black text-gray-900">
                            {(Number(r.totalAmount) || 0).toLocaleString('vi-VN')} đ
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Giá vốn chuẩn</div>
                        </td>

                        {/* Trạng thái kho */}
                        <td className="py-3 px-3 text-center">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Đã nhập kho
                            </span>
                          ) : isDraft ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-800 border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Chờ duyệt (Draft)
                            </span>
                          ) : isCancelled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-rose-50 text-rose-800 border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Đã hủy
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-gray-50 text-gray-700 border-gray-200">
                              {r.status}
                            </span>
                          )}
                        </td>

                        {/* Thao tác */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-500">
                            {isDraft && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleCompleteReceipt(r.id)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold transition shadow-2xs"
                                  title="Duyệt và cộng dồn tồn kho trong cơ sở dữ liệu"
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>Duyệt nhập</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCancelReceipt(r.id)}
                                  className="p-1 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                                  title="Hủy phiếu này"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => toast.info(`In phiếu nhập kho #${r.receiptCode || r.id}`)}
                              className="p-1 hover:text-gray-800 transition"
                              title="In phiếu nhập kho"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleExpand(r.id)}
                              className="p-1 hover:text-emerald-700 transition"
                              title="Xem chi tiết các mặt hàng"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* =========================================================
                          SUB-TABLE: CHI TIẾT CÁC MẶT HÀNG THỜI TRANG THỰC NHẬP (EXPANDED)
                          ========================================================= */}
                      {isExpanded && (
                        <tr className="bg-[#f8faf9] border-y border-emerald-100">
                          <td colSpan="9" className="p-4 pl-10 pr-6">
                            <div className="bg-white rounded-lg border border-emerald-200/80 shadow-2xs overflow-hidden">
                              {/* Tiêu đề sub-table */}
                              <div className="p-2.5 px-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Shirt className="w-4 h-4 text-emerald-800" />
                                  <span className="font-bold text-gray-800 text-xs">
                                    Chi tiết các mẫu áo thực nhập của phiếu #{r.receiptCode || r.id}
                                  </span>
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded">
                                    {(r.items || []).length} biến thể áo
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toast.info('Đang kết nối đầu đọc mã vạch không dây...')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 transition shadow-2xs"
                                  >
                                    <ScanLine className="w-3 h-3 text-emerald-700" />
                                    <span>Quét Barcode kiểm áo</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toast.info('Đã tải mã vạch nhãn tem mác size áo!')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-700 text-[11px] font-semibold hover:bg-gray-50 transition shadow-2xs"
                                  >
                                    <Barcode className="w-3 h-3 text-gray-500" />
                                    <span>In tem mác cổ áo</span>
                                  </button>
                                </div>
                              </div>

                              {/* Bảng chi tiết từng sản phẩm nhập */}
                              <table className="w-full text-left text-[11px]">
                                <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                                  <tr>
                                    <th className="py-2.5 px-3 text-center w-8">STT</th>
                                    <th className="py-2.5 px-3">MẪU ÁO THỜI TRANG</th>
                                    <th className="py-2.5 px-3">BIẾN THỂ (MÀU SẮC &amp; SIZE)</th>
                                    <th className="py-2.5 px-3">TIÊU CHUẨN VẢI &amp; MÃ LÔ</th>
                                    <th className="py-2.5 px-3 text-center">SL NHẬP</th>
                                    <th className="py-2.5 px-3 text-right">GIÁ VỐN NHẬP</th>
                                    <th className="py-2.5 px-3 text-right">THÀNH TIỀN</th>
                                    <th className="py-2.5 px-3 text-center">KIỂM PHẨM QC</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {(r.items || []).map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-gray-50/80 transition">
                                      <td className="py-2.5 px-3 text-center text-gray-400 font-medium">{String(idx + 1).padStart(2, '0')}</td>
                                      <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 font-bold">
                                            👕
                                          </div>
                                          <div>
                                            <div className="font-bold text-gray-800">{item.productName || 'Áo Thun Thời Trang'}</div>
                                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                              SP ID: #{item.productId || '1'} • Biến thể #{item.variantId || '1'}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-bold text-gray-800">Màu: {item.variantColor || 'Đen'}</span>
                                          <span>•</span>
                                          <span className="px-1.5 py-0.2 rounded bg-gray-100 font-bold text-gray-700 text-[10px]">
                                            Size {item.variantSize || 'L'}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-3">
                                        <div className="font-bold text-gray-700">{item.batchCode || 'LÔ-MAY-2026-X1'}</div>
                                        <div className="text-[10px] text-gray-400">{item.warranty || 'Độ bền sợi cotton 100%'}</div>
                                      </td>
                                      <td className="py-2.5 px-3 text-center font-bold text-emerald-800">
                                        {item.quantity} áo
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-medium text-gray-600">
                                        {(Number(item.importPrice) || 0).toLocaleString('vi-VN')} đ
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-black text-gray-900">
                                        {((Number(item.importPrice) || 0) * (Number(item.quantity) || 0)).toLocaleString('vi-VN')} đ
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                          {item.qcStatus || 'Đạt chuẩn đóng gói'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              {/* Dòng tổng kết con */}
                              <div className="p-2.5 px-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-800">
                                <span>Tổng cộng các mẫu áo trong phiếu nhập:</span>
                                <div className="flex items-center gap-8">
                                  <span>{totalQty} sản phẩm áo</span>
                                  <div>
                                    <span className="text-gray-500 font-medium mr-1.5">Cộng tiền vốn:</span>
                                    <span className="text-emerald-800 font-black">
                                      {(Number(r.totalAmount) || 0).toLocaleString('vi-VN')} đ
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================================================================
            6. PHÂN TRANG GỌN GÀNG (PAGINATION)
            ========================================================================= */}
        <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Đang hiển thị <strong className="text-gray-800">{currentItems.length}</strong> trong tổng số <strong className="text-gray-800">{filteredReceipts.length}</strong> phiếu nhập
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Kho áo thời trang đã đồng bộ
            </span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-gray-600">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-[10px]"
            >
              |&lt;
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-[10px]"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 rounded transition ${
                  currentPage === page
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'border border-gray-200 bg-white hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-[10px]"
            >
              &gt;
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-[10px]"
            >
              &gt;|
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: TẠO PHIẾU NHẬP KHO THỜI TRANG MỚI (REAL BACKEND API)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Lập Phiếu Nhập Kho Áo Mới</h3>
                  <p className="text-xs text-emerald-100/80">Nhập các kiện áo từ xưởng may vào kho lưu trữ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateReceipt} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chọn Nhà cung cấp */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Xưởng May / Nhà Cung Cấp Vải <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newReceiptForm.supplierId}
                    onChange={(e) => setNewReceiptForm(prev => ({ ...prev, supplierId: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  >
                    <option value="">-- Chọn xưởng may gia công áo --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code || `ID: #${s.id}`})
                      </option>
                    ))}
                    {suppliers.length === 0 && (
                      <>
                        <option value="1">Xưởng May Dệt Kim Hà Nội (NCC-HN-001)</option>
                        <option value="2">Công ty Cổ phần Dệt May Phong Phú</option>
                        <option value="3">Tổng Công ty May 10 - CTCP</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Ghi chú lô hàng */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ghi chú lô hàng áo
                  </label>
                  <input
                    type="text"
                    value={newReceiptForm.note}
                    onChange={(e) => setNewReceiptForm(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="VD: Nhập bổ sung áo thun & polo đợt hè 2026"
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Danh sách các sản phẩm áo cần nhập */}
              <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Danh sách mẫu áo &amp; biến thể nhập kho</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-emerald-800 text-[11px] font-bold shadow-2xs transition"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Thêm mẫu áo</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {newReceiptForm.items.map((item, index) => {
                    const selProd = products.find(p => String(p.id) === String(item.productId));
                    const variants = selProd?.variants || [];

                    return (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                        {/* Chọn Mẫu áo */}
                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Sản phẩm áo</label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                            required
                          >
                            <option value="">-- Chọn áo --</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                            {products.length === 0 && (
                              <>
                                <option value="1">Áo Thun Cotton Compact Coolmate Basic</option>
                                <option value="2">Áo Polo Dri-FIT Nike Club Tennis</option>
                                <option value="3">Áo Sơ Mi Oxford Dài Tay Routine</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* Chọn Biến thể (Size / Màu) */}
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Size &amp; Màu</label>
                          <select
                            value={item.variantId}
                            onChange={(e) => handleItemChange(index, 'variantId', e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                            required
                          >
                            <option value="">-- Biến thể --</option>
                            {variants.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.color || 'Màu'} - Size {v.size || 'M'} (Kho: {v.stockQuantity ?? 0})
                              </option>
                            ))}
                            {variants.length === 0 && (
                              <>
                                <option value="1">Trắng - Size M</option>
                                <option value="2">Trắng - Size L</option>
                                <option value="3">Đen - Size XL</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* Số lượng */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Số lượng</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-xs text-center font-bold focus:outline-none focus:border-emerald-600"
                            required
                          />
                        </div>

                        {/* Đơn giá nhập */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Giá vốn (đ)</label>
                          <input
                            type="number"
                            min="1000"
                            step="1000"
                            value={item.importPrice}
                            onChange={(e) => handleItemChange(index, 'importPrice', e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-xs text-right font-medium focus:outline-none focus:border-emerald-600"
                            required
                          />
                        </div>

                        {/* Nút xóa dòng */}
                        <div className="sm:col-span-1 flex justify-center pt-3 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(index)}
                            disabled={newReceiptForm.items.length <= 1}
                            className="p-1 rounded text-gray-400 hover:text-rose-600 disabled:opacity-30 transition"
                            title="Xóa mẫu áo này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tính toán tổng tạm tính */}
                <div className="p-2.5 bg-white rounded-lg border border-gray-200 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">
                    Tổng số lượng dự kiến: {newReceiptForm.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)} áo
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 font-medium">Tổng tiền phiếu:</span>
                    <span className="text-emerald-800 text-sm font-black">
                      {newReceiptForm.items.reduce((sum, it) => sum + ((Number(it.quantity) || 0) * (Number(it.importPrice) || 0)), 0).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu phiếu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Tạo Phiếu Nhập Kho (Draft)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
