import React from 'react';
import {
  Package,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Settings2,
  RotateCcw,
  SlidersHorizontal,
  X,
  ExternalLink,
  Info,
  RefreshCw,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  Loader2,
  Shirt,
  Tag,
  Sparkles,
  Eye,
  Sliders
} from 'lucide-react';
import useProducts from '../hooks/useProducts';
import ImagePicker, { getFullImageUrl } from '../../../components/common/ImagePicker';

export default function ProductsPage() {
  const {
    products,
    categories,
    brands,
    loading,
    expandedId,
    toggleExpand,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    stockFilter,
    setStockFilter,
    priceFilter,
    setPriceFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editingProduct,
    setEditingProduct,
    submitting,
    newProduct,
    setNewProduct,
    fetchProducts,
    categoryMap,
    brandMap,
    stats,
    filteredProducts,
    totalPages,
    startIndex,
    endIndex,
    paginatedProducts,
    formatMoney,
    getColorDotClass,
    handleDeleteProduct,
    handleOpenEdit,
    handleSaveEdit,
    handleCreateProduct,
    suppliers,
    isImportModalOpen,
    setIsImportModalOpen,
    importingProduct,
    importForm,
    setImportForm,
    handleOpenImportModal,
    handleConfirmImportReceipt,
  } = useProducts();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + NÚT THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt;{' '}
            <span className="text-gray-800 font-semibold">Sản phẩm &amp; Biến thể SKU Thời trang</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2">
            <Shirt className="w-6 h-6 text-emerald-700" />
            <span>Quản lý Sản phẩm Áo &amp; Ma trận Biến thể SKU</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Quản lý danh mục áo thun, polo, sơ mi, áo khoác; theo dõi phân loại Size/Màu sắc và cập nhật giá vốn, giá niêm yết trực tiếp từ Database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchProducts(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Làm mới DB</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Thêm sản phẩm áo mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ THỐNG KÊ (STAT CARDS) - TÍNH TỪ DATA THỰC TẾ
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số mẫu áo */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số mẫu áo
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {loading ? '...' : stats.totalProducts.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 100%
              </span>
              <span className="text-gray-400">| Đang kinh doanh tại Shop</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Shirt className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Tổng biến thể SKUs */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng biến thể (SKUs)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {loading ? '...' : stats.totalSkus.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-700">TB {stats.avgVariantsPerProduct} SKUs / Mẫu</span> | Phân loại Size &amp; Màu
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Cảnh báo sắp hết tồn kho */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo tồn kho
            </span>
            <div className="text-2xl font-black text-amber-700 mt-1">
              {loading ? '...' : stats.lowStockCount} <span className="text-sm font-semibold">mẫu sắp hết</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-rose-600 font-bold">{stats.outOfStockCount} mẫu hết hàng</span>
              <span className="text-gray-400">| Dưới 20 chiếc</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Danh mục & Thương hiệu liên kết */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Ngành hàng &amp; Brand
            </span>
            <div className="text-2xl font-black text-gray-800 mt-1">
              {categories.length} <span className="text-sm font-semibold">danh mục</span>
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              {brands.length} thương hiệu thời trang đối tác
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH BỘ LỌC TÌM KIẾM ĐA ĐIỀU KIỆN
          ========================================================================= */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Ô tìm kiếm theo tên hoặc mã slug */}
            <div className="relative min-w-[220px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên áo, chất liệu, mã slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Dropdown: Danh mục áo */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả Danh mục Áo</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Dropdown: Thương hiệu áo */}
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả Thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Dropdown: Tình trạng tồn kho */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả Tồn kho</option>
              <option value="IN_STOCK">Còn hàng (Khả dụng)</option>
              <option value="LOW_STOCK">Sắp hết hàng (&lt; 20 cái)</option>
              <option value="OUT_OF_STOCK">Tạm hết hàng (0 cái)</option>
            </select>

            {/* Dropdown: Mức giá */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition focus:outline-none cursor-pointer"
            >
              <option value="ALL">Mọi khoảng giá</option>
              <option value="UNDER_300K">Dưới 300.000 đ</option>
              <option value="300K_700K">300.000 đ – 700.000 đ</option>
              <option value="OVER_700K">Trên 700.000 đ</option>
            </select>

            {/* Nút đặt lại bộ lọc */}
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                setBrandFilter('ALL');
                setStockFilter('ALL');
                setPriceFilter('ALL');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-gray-500 hover:text-gray-800 transition font-medium hover:bg-gray-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-[11px] shrink-0">
            <span>Tìm thấy: <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> mẫu áo</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BẢNG DỮ LIỆU SẢN PHẨM & MA TRẬN BIẾN THỂ SIZE/MÀU THỜI TRANG
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fcfdfd] text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 text-center w-12">CHI TIẾT</th>
                <th className="py-3 px-3 text-center w-16">HÌNH ẢNH</th>
                <th className="py-3 px-4">SẢN PHẨM &amp; THƯƠNG HIỆU</th>
                <th className="py-3 px-4">BIẾN THỂ (SIZE / COLOR)</th>
                <th className="py-3 px-4">GIÁ BÁN NIÊM YẾT</th>
                <th className="py-3 px-4">TỔNG TỒN KHO</th>
                <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-center">THAO TÁC</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
                    <span>Đang đồng bộ dữ liệu sản phẩm từ Database (GET /api/products)...</span>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    Không tìm thấy sản phẩm áo nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isExpanded = expandedId === p.id;
                  const variants = p.variants || [];
                  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
                  const outOfStockVariants = variants.filter((v) => (Number(v.stockQuantity) || 0) <= 0);
                  const hasOutOfStockVariant = outOfStockVariants.length > 0;
                  const categoryName = categoryMap[p.categoryId] || 'Áo thời trang';
                  const brandName = brandMap[p.brandId] || 'Local Brand';
                  const hasDiscount = p.productPrice && p.productPrice.salePrice && p.productPrice.salePrice < p.price;
                  const displayPrice = hasDiscount ? p.productPrice.salePrice : p.price;

                  // Unique colors & sizes
                  const uniqueColors = [...new Set(variants.map(v => v.color).filter(Boolean))];
                  const uniqueSizes = [...new Set(variants.map(v => v.size).filter(Boolean))];

                  return (
                    <React.Fragment key={p.id}>
                      {/* Dòng cha sản phẩm */}
                      <tr className={`hover:bg-gray-50/70 transition-colors ${isExpanded ? 'bg-emerald-50/20' : ''}`}>
                        {/* Nút đóng/mở ma trận biến thể */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleExpand(p.id)}
                            className="p-1 rounded-md text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                            title="Xem ma trận biến thể SKU"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-emerald-600 font-bold" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Hình ảnh sản phẩm */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="relative inline-block">
                            <img
                              src={getFullImageUrl(p.image || p.primaryImage) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518'}
                              alt={p.name}
                              className="w-11 h-11 rounded-lg object-cover border border-gray-200 shadow-2xs"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518';
                              }}
                            />
                            {variants.length > 0 && (
                              <span className="absolute -bottom-1 -right-1 bg-gray-900/90 text-white text-[9px] font-bold px-1 rounded shadow-xs">
                                {variants.length} SKU
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Thông tin sản phẩm, danh mục & thương hiệu */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 hover:text-emerald-700 text-xs cursor-pointer">
                              {p.name}
                            </span>
                            {p.hot && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold">
                                HOT 🔥
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                            <span className="font-mono text-gray-500 font-medium">#{String(p.id).padStart(4, '0')}</span>
                            <span className="text-gray-300">•</span>
                            <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 font-medium">
                              {categoryName}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                              {brandName}
                            </span>
                          </div>
                        </td>

                        {/* Biến thể tóm tắt */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800 flex items-center gap-1">
                            <span>{variants.length} Biến thể SKU</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 flex flex-wrap gap-1">
                            {uniqueSizes.length > 0 && (
                              <span className="text-gray-600">Size: {uniqueSizes.join(', ')}</span>
                            )}
                            {uniqueColors.length > 0 && (
                              <span className="text-gray-400">| {uniqueColors.length} màu</span>
                            )}
                          </div>
                        </td>

                        {/* Giá bán niêm yết */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-emerald-800 text-xs">
                            {formatMoney(displayPrice)}
                          </div>
                          {hasDiscount && (
                            <div className="text-[10px] text-gray-400 line-through mt-0.5">
                              {formatMoney(p.price)} (-{p.productPrice.discountPercent}%)
                            </div>
                          )}
                        </td>

                        {/* Tổng tồn kho */}
                        <td className="py-3.5 px-4">
                          <div className={`font-bold ${totalStock <= 0 ? 'text-rose-600' : (totalStock < 20 || hasOutOfStockVariant) ? 'text-amber-700' : 'text-gray-900'}`}>
                            {totalStock.toLocaleString('vi-VN')} chiếc
                          </div>
                          {hasOutOfStockVariant && totalStock > 0 ? (
                            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                              ⚠️ {outOfStockVariants.length}/{variants.length} phân loại hết hàng (0)
                            </div>
                          ) : (
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {totalStock <= 0 ? 'Hết hàng toàn bộ' : totalStock < 20 ? 'Cần bổ sung tồn kho' : 'Kho khả dụng'}
                            </div>
                          )}
                        </td>

                        {/* Trạng thái kinh doanh (Khớp với trạng thái Client) */}
                        <td className="py-3.5 px-4 text-center">
                          {totalStock <= 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Tạm hết hàng
                            </span>
                          ) : hasOutOfStockVariant ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(p.id)}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition"
                              title="Bấm để mở ma trận SKU và chỉnh lại số lượng phân loại bị hết hàng"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                              Hết {outOfStockVariants.length} Size/Màu
                            </button>
                          ) : totalStock < 20 ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Sắp hết hàng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Còn hàng ({variants.length} SKU)
                            </span>
                          )}
                        </td>

                        {/* Thao tác Nhập kho / Sửa / Xóa */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenImportModal(p)}
                              title="Nhập kho bổ sung số lượng cho sản phẩm này"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] transition shadow-2xs"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                              <span>Nhập kho</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              title="Chỉnh sửa thông tin sản phẩm"
                              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition shadow-2xs"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Xóa sản phẩm"
                              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* =========================================================
                          MA TRẬN BIẾN THỂ CON (EXPANDED NESTED SUB-TABLE)
                          ========================================================= */}
                      {isExpanded && (
                        <tr className="bg-[#f8faf9] border-y border-emerald-100">
                          <td colSpan="8" className="p-4 pl-12 pr-6">
                            <div className="bg-white rounded-lg border border-emerald-200/80 shadow-2xs overflow-hidden">
                              {/* Header của Sub-table ma trận biến thể */}
                              <div className="p-2.5 px-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                                    Ma trận phân loại Size / Màu sắc thực tế ({variants.length} SKUs)
                                  </span>
                                  <span className="text-[10px] bg-emerald-100/80 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                                    {p.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-[11px] text-gray-500">
                                    Tổng tồn kho: <strong className="text-gray-900">{totalStock} cái</strong>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenImportModal(p)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold transition shadow-2xs"
                                  >
                                    <Plus className="w-3 h-3 stroke-[3]" />
                                    <span>Lập phiếu nhập kho sản phẩm này</span>
                                  </button>
                                </div>
                              </div>

                              {/* Bảng chi tiết biến thể */}
                              <table className="w-full text-left text-[11px]">
                                <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                                  <tr>
                                    <th className="py-2.5 px-3 text-center w-8">#</th>
                                    <th className="py-2.5 px-3">MÃ SKU BIẾN THỂ</th>
                                    <th className="py-2.5 px-3">MÀU SẮC</th>
                                    <th className="py-2.5 px-3">KÍCH CỠ (SIZE)</th>
                                    <th className="py-2.5 px-3">GIÁ VỐN NHẬP (COST)</th>
                                    <th className="py-2.5 px-3">GIÁ BÁN LẺ</th>
                                    <th className="py-2.5 px-3">SỐ LƯỢNG TỒN KHO</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {variants.length === 0 ? (
                                    <tr>
                                      <td colSpan="7" className="py-4 text-center text-gray-400 italic">
                                        Sản phẩm này chưa cấu hình biến thể size/màu chi tiết.
                                      </td>
                                    </tr>
                                  ) : (
                                    variants.map((v, vIdx) => {
                                      const skuCode = `SKU-A${p.id}-${(v.color || 'DFT').substring(0, 2).toUpperCase()}-${v.size || 'FS'}`;
                                      const isLow = v.stockQuantity < 10 && v.stockQuantity > 0;
                                      const isOut = v.stockQuantity === 0;

                                      return (
                                        <tr key={v.id || vIdx} className="hover:bg-gray-50/80 transition">
                                          <td className="py-2.5 px-3 text-center text-gray-400 font-medium">{vIdx + 1}</td>
                                          <td className="py-2.5 px-3 font-mono font-bold text-gray-800">{skuCode}</td>
                                          <td className="py-2.5 px-3">
                                            <div className="flex items-center gap-1.5">
                                              <span className={`w-3 h-3 rounded-full border shadow-2xs ${getColorDotClass(v.color)}`} />
                                              <span className="font-semibold text-gray-800">{v.color || 'Tiêu chuẩn'}</span>
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-3">
                                            <span className="px-2 py-0.5 rounded font-black text-xs bg-gray-100 text-gray-800 border border-gray-200">
                                              {v.size || 'FreeSize'}
                                            </span>
                                          </td>
                                          <td className="py-2.5 px-3 text-gray-500 font-mono">
                                            {formatMoney(v.costPrice || p.costPrice || (p.price * 0.6))}
                                          </td>
                                          <td className="py-2.5 px-3 font-bold text-emerald-800 font-mono">
                                            {formatMoney(displayPrice)}
                                          </td>
                                          <td className="py-2.5 px-3">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={`font-extrabold text-xs ${
                                                    isOut
                                                      ? 'text-rose-600'
                                                      : isLow
                                                        ? 'text-amber-700'
                                                        : 'text-gray-900'
                                                  }`}
                                                >
                                                  {v.stockQuantity ?? 0} chiếc
                                                </span>

                                                {isOut ? (
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                                    <X className="w-3 h-3" /> Tạm hết hàng
                                                  </span>
                                                ) : isLow ? (
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                                    <AlertTriangle className="w-3 h-3 text-amber-500" /> Sắp hết
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                                                    Còn hàng
                                                  </span>
                                                )}
                                              </div>

                                              <button
                                                type="button"
                                                onClick={() => handleOpenImportModal(p, v)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[10px] transition ${
                                                  isOut
                                                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
                                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                }`}
                                                title="Lập phiếu nhập kho bổ sung cho phân loại Size/Màu này"
                                              >
                                                <Plus className="w-3 h-3 stroke-[2.5]" />
                                                <span>{isOut ? 'Nhập hàng ngay' : 'Nhập thêm kho'}</span>
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            5. THANH PHÂN TRANG GỌN GÀNG
            ========================================================================= */}
        <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div>
            Hiển thị <strong className="text-gray-800">{filteredProducts.length > 0 ? startIndex + 1 : 0} – {endIndex}</strong> trong tổng số <strong className="text-gray-800">{filteredProducts.length}</strong> sản phẩm áo
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Số dòng:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value) || 10)}
                className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1 font-semibold text-gray-600">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
              >
                |&lt;
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, idx, arr) => {
                  const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1 rounded transition ${
                          currentPage === page
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'border border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
              >
                &gt;
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
              >
                &gt;|
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. MODAL THÊM SẢN PHẨM ÁO MỚI (POST /api/products)
          ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight">Thêm sản phẩm áo mới</h3>
                  <p className="text-[11px] text-gray-500">Khởi tạo sản phẩm thời trang vào Database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tên sản phẩm áo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Áo Thun Cotton Compact Coolmate Basic"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Danh mục áo <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Thương hiệu <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newProduct.brandId}
                    onChange={(e) => setNewProduct({ ...newProduct, brandId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Giá bán niêm yết (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="250000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Giá vốn ước tính (VNĐ)
                  </label>
                  <input
                    type="number"
                    placeholder="120000"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <ImagePicker
                  label="Ảnh sản phẩm áo"
                  value={newProduct.image}
                  onChange={(val) => setNewProduct({ ...newProduct, image: val })}
                  folder="products"
                  previewHeight="h-32"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mô tả chi tiết &amp; Chất liệu vải</label>
                <textarea
                  rows={2}
                  placeholder="Chất liệu 100% Cotton Compact thoáng mát, thấm hút mồ hôi..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Chỉnh sửa số lượng tồn kho từng phân loại (Size / Màu) */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Số lượng tồn kho theo Phân loại (Size / Màu sắc)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        initialVariants: [
                          ...(newProduct.initialVariants || []),
                          {
                            color: 'Đen',
                            size: 'XL',
                            stockQuantity: 30,
                            costPrice: Number(newProduct.costPrice) || 120000,
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm phân loại SKU</span>
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100 bg-gray-50/50">
                  {(newProduct.initialVariants || []).map((v, idx) => (
                    <div key={idx} className="grid grid-cols-12 items-center gap-2 p-2 text-[11px]">
                      <div className="col-span-4">
                        <span className="block text-[10px] text-gray-400">Màu sắc</span>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => {
                            const next = [...newProduct.initialVariants];
                            next[idx] = { ...next[idx], color: e.target.value };
                            setNewProduct({ ...newProduct, initialVariants: next });
                          }}
                          className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-semibold text-gray-800"
                        />
                      </div>
                      <div className="col-span-3">
                        <span className="block text-[10px] text-gray-400">Size</span>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => {
                            const next = [...newProduct.initialVariants];
                            next[idx] = { ...next[idx], size: e.target.value };
                            setNewProduct({ ...newProduct, initialVariants: next });
                          }}
                          className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-bold text-gray-900"
                        />
                      </div>
                      <div className="col-span-4">
                        <span className="block text-[10px] text-gray-400">Số lượng tồn kho</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={v.stockQuantity}
                            onChange={(e) => {
                              const next = [...newProduct.initialVariants];
                              next[idx] = {
                                ...next[idx],
                                stockQuantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                              };
                              setNewProduct({ ...newProduct, initialVariants: next });
                            }}
                            className={`w-full px-2 py-1 bg-white border rounded font-bold ${
                              Number(v.stockQuantity) <= 0
                                ? 'border-rose-300 text-rose-600 bg-rose-50/40'
                                : 'border-gray-200 text-emerald-800'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="col-span-1 pt-3 text-right">
                        {newProduct.initialVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = newProduct.initialVariants.filter((_, i) => i !== idx);
                              setNewProduct({ ...newProduct, initialVariants: next });
                            }}
                            className="p-1 text-gray-400 hover:text-rose-600"
                            title="Xóa phân loại"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isHot}
                    onChange={(e) => setNewProduct({ ...newProduct, isHot: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-gray-700">Đánh dấu là Sản phẩm Nổi bật (HOT 🔥)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{submitting ? 'Đang tạo...' : 'Lưu sản phẩm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL CHỈNH SỬA SẢN PHẨM ÁO (PUT /api/products/{id})
          ========================================================================= */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight">Sửa thông tin sản phẩm áo</h3>
                  <p className="text-[11px] text-gray-500">Mã sản phẩm: #{editingProduct.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tên sản phẩm áo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Danh mục áo</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Thương hiệu</label>
                  <select
                    value={editingProduct.brandId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brandId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Giá bán niêm yết (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Giá vốn (VNĐ)</label>
                  <input
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <ImagePicker
                  label="Ảnh sản phẩm áo"
                  value={editingProduct.image}
                  onChange={(val) => setEditingProduct({ ...editingProduct, image: val })}
                  folder="products"
                  previewHeight="h-32"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Phân loại (Size / Màu) trong Modal Sửa: Tồn kho hiện tại chỉ xem, muốn tăng số lượng thì bấm Nhập kho */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-gray-700 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Phân loại (Size / Màu sắc) &amp; Tồn kho hiện tại</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const prodToImport = editingProduct;
                        setIsEditModalOpen(false);
                        handleOpenImportModal(prodToImport);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] transition shadow-2xs"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Nhập kho bổ sung SL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProduct({
                          ...editingProduct,
                          variants: [
                            ...(editingProduct.variants || []),
                            {
                              id: null,
                              color: 'Đen',
                              size: 'XL',
                              stockQuantity: 0,
                              costPrice: Number(editingProduct.costPrice) || 120000,
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm SKU mới</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500">
                  Số lượng tồn kho được cộng tự động thông qua chức năng <strong>Nhập kho (Goods Receipts)</strong>.
                </p>

                <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100 bg-gray-50/50">
                  {(editingProduct.variants || []).map((v, idx) => (
                    <div key={v.id || idx} className="grid grid-cols-12 items-center gap-2 p-2 text-[11px]">
                      <div className="col-span-4">
                        <span className="block text-[10px] text-gray-400">Màu sắc</span>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => {
                            const next = [...editingProduct.variants];
                            next[idx] = { ...next[idx], color: e.target.value };
                            setEditingProduct({ ...editingProduct, variants: next });
                          }}
                          className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-semibold text-gray-800"
                        />
                      </div>
                      <div className="col-span-3">
                        <span className="block text-[10px] text-gray-400">Size</span>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => {
                            const next = [...editingProduct.variants];
                            next[idx] = { ...next[idx], size: e.target.value };
                            setEditingProduct({ ...editingProduct, variants: next });
                          }}
                          className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-bold text-gray-900"
                        />
                      </div>
                      <div className="col-span-4">
                        <span className="block text-[10px] text-gray-400">Tồn kho (Cộng qua Nhập kho)</span>
                        <div
                          className={`w-full px-2.5 py-1 border rounded font-bold flex items-center justify-between ${
                            Number(v.stockQuantity) <= 0
                              ? 'border-rose-200 text-rose-600 bg-rose-50/60'
                              : 'border-gray-200 text-gray-700 bg-gray-100/80'
                          }`}
                        >
                          <span>{v.stockQuantity ?? 0} chiếc</span>
                          {Number(v.stockQuantity) <= 0 && (
                            <span className="text-[9px] font-extrabold uppercase text-rose-600">Hết hàng</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-1 pt-3 text-right">
                        {editingProduct.variants.length > 1 && !v.id && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = editingProduct.variants.filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, variants: next });
                            }}
                            className="p-1 text-gray-400 hover:text-rose-600"
                            title="Xóa phân loại mới thêm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isHot}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isHot: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-gray-700">Đánh dấu là Sản phẩm Nổi bật (HOT 🔥)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL LẬP PHIẾU NHẬP KHO BỔ SUNG TỒN KHO (POST /api/goods-receipts)
          ========================================================================= */}
      {isImportModalOpen && importingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Lập Phiếu Nhập Kho Bổ Sung Số Lượng</h3>
                  <p className="text-[11px] text-emerald-100/90">
                    Sản phẩm: <strong>{importingProduct.name}</strong> (#{importingProduct.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={(e) => handleConfirmImportReceipt(e, true)} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Xưởng may / Nhà cung cấp <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={importForm.supplierId}
                    onChange={(e) => setImportForm({ ...importForm, supplierId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600"
                    required
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code || `#${s.id}`})
                      </option>
                    ))}
                    {suppliers.length === 0 && (
                      <option value="1">Xưởng May Thời Trang Mặc Định (#1)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ghi chú phiếu nhập kho</label>
                  <input
                    type="text"
                    value={importForm.note}
                    onChange={(e) => setImportForm({ ...importForm, note: e.target.value })}
                    placeholder="VD: Nhập bổ sung các size hết hàng"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Bảng nhập số lượng cho từng biến thể SKU */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-2.5 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <span className="font-bold text-gray-800">
                    Chọn số lượng nhập thêm theo từng phân loại (Màu sắc / Size)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setImportForm((prev) => ({
                        ...prev,
                        items: prev.items.map((it) => ({
                          ...it,
                          quantity: (Number(it.quantity) || 0) + 20,
                        })),
                      }))
                    }
                    className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] transition"
                  >
                    +20 cho tất cả SKU
                  </button>
                </div>

                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {(importForm.items || []).map((item, idx) => {
                    const isZero = item.currentStock <= 0;
                    const nextStock = item.currentStock + (Number(item.quantity) || 0);
                    return (
                      <div
                        key={item.variantId || idx}
                        className={`p-3 grid grid-cols-12 items-center gap-2.5 ${
                          isZero ? 'bg-rose-50/30' : 'bg-white'
                        }`}
                      >
                        <div className="col-span-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full border ${getColorDotClass(item.color)}`} />
                            <span className="font-bold text-gray-900">{item.color}</span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-black text-[10px]">
                              Size {item.size}
                            </span>
                          </div>
                          <div className="text-[10px] mt-0.5">
                            Tồn hiện tại:{' '}
                            <strong className={isZero ? 'text-rose-600' : 'text-gray-700'}>
                              {item.currentStock} chiếc {isZero ? '(Hết hàng)' : ''}
                            </strong>
                          </div>
                        </div>

                        <div className="col-span-4">
                          <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">
                            Số lượng nhập thêm
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                const next = [...importForm.items];
                                next[idx] = { ...next[idx], quantity: val };
                                setImportForm({ ...importForm, items: next });
                              }}
                              className="w-20 px-2 py-1.5 bg-white border border-gray-300 rounded-lg font-extrabold text-emerald-800 text-center focus:outline-none focus:border-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...importForm.items];
                                next[idx] = { ...next[idx], quantity: (Number(item.quantity) || 0) + 20 };
                                setImportForm({ ...importForm, items: next });
                              }}
                              className="px-1.5 py-1 rounded bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold text-[10px]"
                            >
                              +20
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...importForm.items];
                                next[idx] = { ...next[idx], quantity: 0 };
                                setImportForm({ ...importForm, items: next });
                              }}
                              className="px-1.5 py-1 rounded bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 font-semibold text-[10px]"
                            >
                              0
                            </button>
                          </div>
                        </div>

                        <div className="col-span-4">
                          <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">
                            Giá vốn nhập (VNĐ/chiếc)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={item.importPrice}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              const next = [...importForm.items];
                              next[idx] = { ...next[idx], importPrice: val };
                              setImportForm({ ...importForm, items: next });
                            }}
                            className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg font-mono text-gray-800 focus:outline-none focus:border-emerald-600"
                          />
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            Tồn sau nhập: <strong>{nextStock} chiếc</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tổng kết phiếu */}
                <div className="p-3 bg-emerald-50/60 border-t border-emerald-100 flex items-center justify-between font-bold">
                  <span className="text-gray-700">
                    Tổng cộng nhập thêm:{' '}
                    <strong className="text-emerald-800">
                      {(importForm.items || []).reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)} chiếc
                    </strong>
                  </span>
                  <span className="text-gray-700">
                    Tổng tiền phiếu nhập:{' '}
                    <strong className="text-emerald-900 text-sm">
                      {formatMoney(
                        (importForm.items || []).reduce(
                          (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.importPrice) || 0),
                          0
                        )
                      )}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={(e) => handleConfirmImportReceipt(e, false)}
                  className="px-4 py-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition disabled:opacity-50"
                >
                  Lưu Phiếu Nháp (Chờ duyệt)
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{submitting ? 'Đang nhập kho...' : 'Nhập Kho & Cộng Tồn Kho Ngay'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
