import React from 'react';
import {
  FolderTree,
  Eye,
  Package,
  TrendingUp,
  RotateCcw,
  Plus,
  ChevronDown,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  Loader2,
  Shirt,
  Sparkles,
  Layers
} from 'lucide-react';
import useCategories from '../hooks/useCategories';
import ImagePicker, { getFullImageUrl } from '../../../components/common/ImagePicker';

export default function CategoriesPage() {
  const {
    categories,
    products,
    loading,
    selectedCategory,
    setSelectedCategory,
    editFormData,
    setEditFormData,
    savingEdit,
    isNewModalOpen,
    setIsNewModalOpen,
    creating,
    newCatData,
    setNewCatData,
    fetchCategories,
    handleNameChange,
    handleSaveEdit,
    handleCreateCategory,
    handleDeleteCategory,
    getProductCountForCategory
  } = useCategories();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + NÚT THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt;{' '}
            <span className="text-gray-800 font-semibold">Danh mục Ngành hàng Thời trang</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-emerald-700" />
            <span>Quản lý Danh mục Sản phẩm Áo (Categories)</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Thiết lập danh mục áo thun cổ tròn, áo polo, sơ mi, áo khoác, hoodie... phục vụ cấu trúc cây định vị và điều hướng gian hàng thời trang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchCategories(false)}
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
            <span>Thêm danh mục mới</span>
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
              Tổng số danh mục
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? '...' : categories.length} <span className="text-xs text-gray-400 font-medium">danh mục áo</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              ✓ Hoạt động đồng bộ 100%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Sản phẩm phân loại
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? '...' : products.length} <span className="text-xs text-gray-400 font-medium">mẫu áo</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Đã gán vào cấu trúc cây
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Shirt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Danh mục nổi bật
            </span>
            <div className="text-base font-black text-gray-900 mt-0.5">
              Áo Thun &amp; Áo Polo
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Tỷ trọng doanh số lớn nhất Shop
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tình trạng hiển thị
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">
              {categories.filter((c) => c.active !== false).length} <span className="text-xs text-gray-400 font-medium">đang mở</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Menu điều hướng Storefront
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. NỘI DUNG 2 CỘT: DANH SÁCH (TRÁI) & CHI TIẾT DANH MỤC (PHẢI)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): BẢNG DANH MỤC THỜI TRANG */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 px-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-gray-900">Danh sách Danh mục Ngành hàng</h2>
                <span className="text-[10px] font-mono text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded">
                  {categories.length} bản ghi
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">TÊN DANH MỤC &amp; ĐƯỜNG DẪN (SLUG)</th>
                    <th className="py-2.5 px-3 text-center">SẢN PHẨM</th>
                    <th className="py-2.5 px-3 text-center">TRẠNG THÁI</th>
                    <th className="py-2.5 px-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
                        <span>Đang đồng bộ danh mục từ Database...</span>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-400">
                        Chưa có danh mục nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    categories.map((c) => {
                      const isSelected = selectedCategory?.id === c.id;
                      const productCount = getProductCountForCategory(c.id);

                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedCategory(c)}
                          className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-emerald-50/30 font-medium' : 'bg-white'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={getFullImageUrl(c.image) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518'}
                                alt={c.name}
                                className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518';
                                }}
                              />
                              <div>
                                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                  <span>{c.name}</span>
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                  /{c.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {productCount} mẫu áo
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                                c.active !== false
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              {c.active !== false ? 'Hiển thị' : 'Tạm ẩn'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-400">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCategory(c);
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
                                  handleDeleteCategory(c.id, c.name);
                                }}
                                className="p-1 hover:text-rose-600"
                                title="Xóa danh mục"
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

        {/* CỘT PHẢI (5/12): CHI TIẾT & CHỈNH SỬA DANH MỤC */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
          {selectedCategory ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs">Cấu hình Danh mục #{selectedCategory.id}</h3>
                    <p className="text-[11px] text-gray-500">Chỉnh sửa thông tin và hình ảnh hiển thị</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(selectedCategory.id, selectedCategory.name)}
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                  title="Xóa danh mục này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Tên danh mục <span className="text-rose-500">*</span>
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
                  <label className="block text-gray-700 font-bold mb-1">Mô tả đặc trưng danh mục</label>
                  <textarea
                    rows={2}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                    placeholder="Mô tả chất liệu, phong cách, độ co giãn..."
                  />
                </div>

                <div>
                  <ImagePicker
                    label="Ảnh đại diện danh mục"
                    value={editFormData.image}
                    onChange={(val) => setEditFormData({ ...editFormData, image: val })}
                    folder="categories"
                    previewHeight="h-32"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.active}
                      onChange={(e) => setEditFormData({ ...editFormData, active: e.target.checked })}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-gray-700">Cho phép hiển thị trên Menu Storefront</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    {savingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{savingEdit ? 'Đang lưu vào DB...' : 'Lưu cập nhật danh mục'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400">
              Chọn một danh mục ở cột bên trái để xem và sửa chi tiết.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          4. MODAL TẠO DANH MỤC MỚI (POST /api/categories)
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
                  <h3 className="text-sm font-black text-gray-900 tracking-tight">Thêm danh mục áo mới</h3>
                  <p className="text-[11px] text-gray-500">Khởi tạo danh mục vào Database</p>
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

            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Áo Tanktop &amp; Ba Lỗ"
                  value={newCatData.name}
                  onChange={(e) => handleNameChange(e.target.value, true)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Đường dẫn Slug (URL)</label>
                <input
                  type="text"
                  required
                  placeholder="ao-tanktop-ba-lo"
                  value={newCatData.slug}
                  onChange={(e) => setNewCatData({ ...newCatData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mô tả đặc trưng</label>
                <textarea
                  rows={2}
                  placeholder="Chất liệu thun gân, co giãn 4 chiều, thoáng khí..."
                  value={newCatData.description}
                  onChange={(e) => setNewCatData({ ...newCatData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <ImagePicker
                  label="Ảnh đại diện danh mục"
                  value={newCatData.image}
                  onChange={(val) => setNewCatData({ ...newCatData, image: val })}
                  folder="categories"
                  previewHeight="h-32"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCatData.active}
                    onChange={(e) => setNewCatData({ ...newCatData, active: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-gray-700">Kích hoạt hiển thị ngay</span>
                </label>
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
                  <span>{creating ? 'Đang tạo...' : 'Tạo danh mục'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
