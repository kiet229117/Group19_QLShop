import React from 'react';
import {
  ShieldCheck,
  LayoutGrid,
  TrendingUp,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  Loader2,
  Tag,
  Sparkles,
  Shirt,
  Building2,
  Search
} from 'lucide-react';
import useBrands from '../hooks/useBrands';
import ImagePicker, { getFullImageUrl } from '../../../components/common/ImagePicker';

export default function BrandsPage() {
  const {
    brands,
    products,
    loading,
    selectedBrand,
    setSelectedBrand,
    searchTerm,
    setSearchTerm,
    editFormData,
    setEditFormData,
    savingEdit,
    isNewModalOpen,
    setIsNewModalOpen,
    creating,
    newBrandData,
    setNewBrandData,
    fetchBrands,
    handleNameChange,
    handleSaveEdit,
    handleCreateBrand,
    handleDeleteBrand,
    getProductCountForBrand,
    filteredBrands
  } = useBrands();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + NÚT THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt;{' '}
            <span className="text-gray-800 font-semibold">Thương hiệu Thời trang (Brands)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-700" />
            <span>Quản lý Thương hiệu &amp; Nhãn hàng Đối tác</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Tổng hợp các thương hiệu áo thời trang đối tác: Coolmate, Routine, Uniqlo, Levents, DirtyCoins, Nike, Adidas... trực tiếp từ cơ sở dữ liệu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchBrands(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Làm mới DB</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Thêm thương hiệu mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ THỐNG KÊ (STAT CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số thương hiệu
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? '...' : brands.length} <span className="text-xs text-gray-400 font-medium">brand</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              ✓ Đối tác chính hãng &amp; Local Brand
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Sản phẩm liên kết
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? '...' : products.length} <span className="text-xs text-gray-400 font-medium">mẫu áo</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Được phân phối tại Shop
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Shirt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Thương hiệu bán chạy
            </span>
            <div className="text-base font-black text-gray-900 mt-0.5">
              Coolmate &amp; Nike
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Dẫn đầu lượt mua &amp; đánh giá
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Xác thực pháp lý
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">
              100% <span className="text-xs text-gray-400 font-medium">Verified</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Hợp đồng nhãn quyền hợp lệ
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN 2 CỘT: DANH SÁCH BRAND (TRÁI) & CHI TIẾT (PHẢI)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): BẢNG THƯƠNG HIỆU */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 px-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-gray-900">Danh mục Nhãn hàng Thời trang</h2>
                <span className="text-[10px] font-mono text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded">
                  {brands.length} thương hiệu
                </span>
              </div>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">THƯƠNG HIỆU &amp; SLUG</th>
                    <th className="py-2.5 px-3 text-center">SẢN PHẨM ÁO</th>
                    <th className="py-2.5 px-3">MÔ TẢ ĐẶC TRƯNG</th>
                    <th className="py-2.5 px-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
                        <span>Đang đồng bộ thương hiệu từ Database...</span>
                      </td>
                    </tr>
                  ) : filteredBrands.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-400">
                        Không tìm thấy thương hiệu phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredBrands.map((b) => {
                      const isSelected = selectedBrand?.id === b.id;
                      const productCount = getProductCountForBrand(b.id);

                      return (
                        <tr
                          key={b.id}
                          onClick={() => setSelectedBrand(b)}
                          className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-emerald-50/30 font-medium' : 'bg-white'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              {b.logo ? (
                                <img
                                  src={getFullImageUrl(b.logo)}
                                  alt={b.name}
                                  className="w-8 h-8 rounded-lg object-contain p-0.5 border border-gray-200 bg-white shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                                  {b.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                  <span>{b.name}</span>
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                  /{b.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {productCount} mẫu áo
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-gray-600 max-w-[200px] truncate">
                            {b.description || 'Chưa cập nhật mô tả'}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-400">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBrand(b);
                                }}
                                className="p-1 hover:text-emerald-700"
                                title="Xem & chỉnh sửa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBrand(b.id, b.name);
                                }}
                                className="p-1 hover:text-rose-600"
                                title="Xóa thương hiệu"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
          </div>
        </div>

        {/* CỘT PHẢI (5/12): CHI TIẾT & CHỈNH SỬA BRAND */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
          {selectedBrand ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs">Cấu hình Thương hiệu #{selectedBrand.id}</h3>
                    <p className="text-[11px] text-gray-500">Cập nhật logo và mô tả định vị nhãn hàng</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteBrand(selectedBrand.id, selectedBrand.name)}
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                  title="Xóa thương hiệu này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Tên thương hiệu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => handleNameChange(e.target.value, false)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Đường dẫn Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.slug}
                    onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mô tả đặc trưng &amp; Xuất xứ</label>
                  <textarea
                    rows={2}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                    placeholder="Định vị phong cách, xuất xứ, công nghệ sợi..."
                  />
                </div>

                <div>
                  <ImagePicker
                    label="Logo nhãn hàng"
                    value={editFormData.logo}
                    onChange={(val) => setEditFormData({ ...editFormData, logo: val })}
                    folder="brands"
                    previewHeight="h-28"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    {savingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{savingEdit ? 'Đang lưu vào DB...' : 'Lưu cập nhật thương hiệu'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400">
              Chọn một thương hiệu ở cột bên trái để xem và sửa chi tiết.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          4. MODAL THÊM THƯƠNG HIỆU MỚI (POST /api/brands)
          ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight">Thêm thương hiệu mới</h3>
                  <p className="text-[11px] text-gray-500">Khởi tạo nhãn hàng vào Database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tên thương hiệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Biluxury, Aristino, Canifa..."
                  value={newBrandData.name}
                  onChange={(e) => handleNameChange(e.target.value, true)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Đường dẫn Slug (URL)</label>
                <input
                  type="text"
                  required
                  placeholder="biluxury"
                  value={newBrandData.slug}
                  onChange={(e) => setNewBrandData({ ...newBrandData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mô tả đặc trưng &amp; Xuất xứ</label>
                <textarea
                  rows={2}
                  placeholder="Thời trang công sở nam cao cấp, chất liệu sợi tre Bamboo..."
                  value={newBrandData.description}
                  onChange={(e) => setNewBrandData({ ...newBrandData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <ImagePicker
                  label="Logo nhãn hàng"
                  value={newBrandData.logo}
                  onChange={(val) => setNewBrandData({ ...newBrandData, logo: val })}
                  folder="brands"
                  previewHeight="h-28"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{creating ? 'Đang tạo...' : 'Tạo thương hiệu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
