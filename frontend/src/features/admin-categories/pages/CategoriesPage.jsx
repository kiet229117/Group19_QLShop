import { useState } from 'react';
import {
  FolderTree,
  Eye,
  Package,
  TrendingUp,
  History,
  ArrowUpDown,
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  PlusCircle,
  Edit2,
  Trash2,
  Upload,
  Smartphone,
  Headphones,
  Laptop,
  Check,
  ExternalLink
} from 'lucide-react';

export default function CategoriesPage() {
  const [selectedCatId, setSelectedCatId] = useState('CAT-01-1');
  const [openRoots, setOpenRoots] = useState({ 'CAT-01': true, 'CAT-02': true });

  const toggleRoot = (id) => {
    setOpenRoots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Cấu trúc cây danh mục đa cấp mockup
  const categories = [
    {
      id: 'CAT-01',
      name: 'Điện thoại & Máy tính bảng',
      slug: 'dien-thoai-tablet',
      isRoot: true,
      icon: Smartphone,
      iconBg: 'bg-emerald-50 text-emerald-700',
      skuCount: '620 SKU',
      order: '#01',
      enabled: true,
      children: [
        {
          id: 'CAT-01-1',
          code: 'CAT-MDB-01',
          name: 'Điện thoại thông minh',
          officialName: 'Điện thoại thông minh (Smartphones)',
          slug: 'dien-thoai-thong-minh',
          icon: Smartphone,
          skuCount: '450 SKU',
          order: '1.1',
          enabled: true,
          parent: 'Điện thoại & Máy tính bảng (Root)',
          bannerImage: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
          brands: ['Apple', 'Samsung', 'Xiaomi'],
        },
        {
          id: 'CAT-01-2',
          code: 'CAT-MDB-02',
          name: 'Máy tính bảng (Tablets)',
          officialName: 'Máy tính bảng (iPads & Android Tablets)',
          slug: 'may-tinh-bang',
          icon: Laptop,
          skuCount: '170 SKU',
          order: '1.2',
          enabled: true,
          parent: 'Điện thoại & Máy tính bảng (Root)',
          bannerImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
          brands: ['Apple iPad', 'Samsung Tab'],
        },
      ],
    },
    {
      id: 'CAT-02',
      name: 'Phụ kiện & Âm thanh',
      slug: 'phu-kien-am-thanh',
      isRoot: true,
      icon: Headphones,
      iconBg: 'bg-emerald-50 text-emerald-700',
      skuCount: '480 SKU',
      order: '#02',
      enabled: true,
      children: [
        {
          id: 'CAT-02-1',
          code: 'CAT-PK-01',
          name: 'Tai nghe Bluetooth',
          officialName: 'Tai nghe Bluetooth True Wireless & Over-ear',
          slug: 'tai-nghe-bluetooth',
          icon: Headphones,
          skuCount: '220 SKU',
          order: '2.1',
          enabled: true,
          parent: 'Phụ kiện & Âm thanh (Root)',
          bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          brands: ['Sony', 'Apple', 'JBL'],
        },
        {
          id: 'CAT-02-2',
          code: 'CAT-PK-02',
          name: 'Củ sạc & Cáp sạc nhanh',
          officialName: 'Củ sạc GaN & Cáp sạc nhanh USB-C / Lightning',
          slug: 'cu-sac-cap-sac',
          icon: Smartphone,
          skuCount: '160 SKU',
          order: '2.2',
          enabled: true,
          parent: 'Phụ kiện & Âm thanh (Root)',
          bannerImage: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&auto=format&fit=crop&q=80',
          brands: ['Anker', 'Baseus', 'Ugreen'],
        },
        {
          id: 'CAT-02-3',
          code: 'CAT-PK-03',
          name: 'Pin sạc dự phòng',
          officialName: 'Pin sạc dự phòng PowerBank',
          slug: 'pin-sac-du-phong',
          icon: Smartphone,
          skuCount: '100 SKU',
          order: '2.3',
          enabled: true,
          parent: 'Phụ kiện & Âm thanh (Root)',
          bannerImage: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&auto=format&fit=crop&q=80',
          brands: ['Anker', 'Xiaomi'],
        },
      ],
    },
  ];

  // Tìm danh mục đang chọn để hiển thị form
  let selectedCategory = null;
  for (const root of categories) {
    if (root.id === selectedCatId) selectedCategory = root;
    for (const child of root.children) {
      if (child.id === selectedCatId) selectedCategory = child;
    }
  }
  if (!selectedCategory) selectedCategory = categories[0].children[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt; <span className="text-gray-800 font-semibold">Danh mục (Category)</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quản lý Danh mục Sản phẩm (Category Management)
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Storefront V4.2 Sync
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Quản trị cây danh mục đa cấp (Category Hierarchy), liên kết icon/banner đại diện, gán thuộc tính đặc trưng và tối ưu SEO danh mục.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition">
            <History className="w-3.5 h-3.5 text-gray-500" />
            <span>Lịch sử thay đổi</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span>Sắp xếp thứ tự</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Thêm danh mục gốc</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ CHỈ SỐ THỐNG KÊ (TOP CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số danh mục */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số danh mục
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              42 <span className="text-xs text-gray-500 font-medium">danh mục</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              8 gốc • 34 danh mục con | <span className="text-emerald-700 font-bold">↗ +3 tháng này</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <FolderTree className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Danh mục hoạt động */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Danh mục hoạt động
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              39 <span className="text-xs text-emerald-700 font-bold">hiển thị Online</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5">
              <span>3 danh mục tạm ẩn</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium">
                Theo mùa vụ
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Sản phẩm đã phân loại */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex-1 mr-3">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Sản phẩm đã phân loại
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              1,840 <span className="text-xs text-gray-400 font-medium">/ 1,866 SKU</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '98.6%' }}></div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 shrink-0">98.6%</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Doanh thu cao nhất */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Doanh thu cao nhất
            </span>
            <div className="text-base font-black text-gray-900 mt-0.5">
              Điện thoại &amp; Tablet
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Tỷ trọng GMV: <strong className="text-emerald-700">46.2% toàn sàn</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN 2 CỘT: CÂY PHÂN CẤP (BÊN TRÁI) + FORM CHI TIẾT (BÊN PHẢI)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): CÂY PHÂN CẤP DANH MỤC */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header cột trái */}
            <div className="p-3 px-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-gray-900">Cây Phân Cấp Danh Mục</h2>
                <span className="text-[10px] font-mono text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded">
                  Hierarchy Tree
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <button className="hover:text-gray-900 transition font-medium flex items-center gap-1">
                  <span>↕ Mở rộng tất cả</span>
                </button>
                <div className="flex items-center gap-1">
                  <span>Tất cả trạng thái</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Bảng danh sách cây danh mục */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">TÊN DANH MỤC &amp; ĐƯỜNG DẪN (SLUG)</th>
                    <th className="py-2.5 px-3 text-center">SẢN PHẨM</th>
                    <th className="py-2.5 px-3 text-center">THỨ TỰ</th>
                    <th className="py-2.5 px-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {categories.map((root) => {
                    const isOpen = openRoots[root.id];
                    const IconComponent = root.icon;
                    return (
                      <div key={root.id} style={{ display: 'contents' }}>
                        {/* Hàng Danh mục Gốc (Root) */}
                        <tr className="hover:bg-gray-50/80 transition-colors bg-white font-medium">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab" />
                              <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                              <button
                                onClick={() => toggleRoot(root.id)}
                                className="p-0.5 text-gray-400 hover:text-gray-700"
                              >
                                {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>
                              <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                  <span>{root.name}</span>
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-100/60 text-emerald-800 text-[9px] font-bold">
                                    Root
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">/{root.slug}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-center font-bold text-gray-800">
                            {root.skuCount}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-mono text-gray-500 text-[11px]">{root.order}</span>
                              <div className="w-7 h-4 bg-emerald-700 rounded-full relative cursor-pointer">
                                <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-400">
                              <button className="p-1 hover:text-emerald-700" title="Thêm danh mục con">
                                <PlusCircle className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1 hover:text-gray-700" title="Chỉnh sửa">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1 hover:text-rose-600" title="Xóa">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Các Hàng Danh mục Con (Children) */}
                        {isOpen &&
                          root.children.map((child) => {
                            const isSelected = selectedCatId === child.id;
                            const ChildIcon = child.icon;
                            return (
                              <tr
                                key={child.id}
                                onClick={() => setSelectedCatId(child.id)}
                                className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                                  isSelected ? 'bg-emerald-50/40 border-l-4 border-l-emerald-600' : ''
                                }`}
                              >
                                <td className="py-2.5 px-3 pl-8">
                                  <div className="flex items-center gap-2">
                                    <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab" />
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => setSelectedCatId(child.id)}
                                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-gray-300">—</span>
                                    <div className="w-5 h-5 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                                      <ChildIcon className="w-3 h-3 text-gray-600" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                                        <span>{child.name}</span>
                                        {isSelected && (
                                          <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                                            Đang sửa
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-gray-400 font-mono">/{child.slug}</div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-2.5 px-3 text-center text-gray-600 font-medium">
                                  {child.skuCount}
                                </td>

                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="font-mono text-gray-500 text-[11px]">{child.order}</span>
                                    <div className="w-7 h-4 bg-emerald-700 rounded-full relative cursor-pointer">
                                      <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1 text-gray-400">
                                    <button className="p-1 hover:text-gray-700" title="Chỉnh sửa">
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 hover:text-rose-600" title="Xóa">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </div>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (5/12): FORM CHI TIẾT & CHỈNH SỬA DANH MỤC */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
          {/* Header Panel */}
          <div className="flex items-start justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h2 className="text-sm font-bold text-gray-900">
                Chi tiết Danh mục: {selectedCategory.name}
              </h2>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-semibold">
              {selectedCategory.code || 'CAT-ROOT'}
            </span>
          </div>

          {/* Hình ảnh & Banner đại diện Storefront */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Hình ảnh &amp; Banner Đại diện Storefront
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Icon upload */}
              <div className="col-span-1 border border-dashed border-gray-200 rounded-lg p-2.5 flex flex-col items-center justify-center text-center bg-gray-50/50">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-emerald-700 shadow-2xs mb-1">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-700">Icon 1:1</span>
                <span className="text-[9px] text-gray-400">PNG/SVG 120×120</span>
              </div>

              {/* Banner preview */}
              <div className="col-span-2 relative rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                <img
                  src={selectedCategory.bannerImage || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80'}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-mono px-1 rounded">
                  1200x400
                </span>
              </div>
            </div>
          </div>

          {/* Form input fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Tên danh mục <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={selectedCategory.officialName || selectedCategory.name}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Đường dẫn chuẩn SEO (Slug) <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
                <span className="bg-gray-100 px-2.5 py-1.5 text-gray-400 font-mono border-r border-gray-200 select-none">
                  novacommerce.vn/
                </span>
                <input
                  type="text"
                  defaultValue={selectedCategory.slug}
                  className="flex-1 px-2.5 py-1.5 focus:outline-none text-gray-800 font-medium font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Danh mục cấp cha
              </label>
              <div className="relative">
                <select className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 appearance-none font-medium focus:outline-none">
                  <option>{selectedCategory.parent || 'Không có (Đây là danh mục gốc)'}</option>
                  <option>Điện thoại &amp; Máy tính bảng (Root)</option>
                  <option>Phụ kiện &amp; Âm thanh (Root)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-gray-700">
                  Thương hiệu gắn sẵn (Suggested Brands)
                </label>
                <button className="text-[10px] font-bold text-emerald-800 hover:underline">
                  + Gán thêm brand
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-gray-50 border border-gray-200">
                {(selectedCategory.brands || ['Apple', 'Samsung', 'Sony']).map((b) => (
                  <span key={b} className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 text-[10px] font-medium shadow-2xs">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">
              Hủy
            </button>
            <button className="px-4 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm">
              Lưu cập nhật danh mục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

