import { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  LayoutGrid,
  TrendingUp,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Archive,
  ArrowUpDown,
  History,
  Plus,
  CheckCircle2,
  ExternalLink,
  Upload,
  Trash2,
  ChevronDown
} from 'lucide-react';

export default function BrandsPage() {
  const [selectedBrandId, setSelectedBrandId] = useState('BRD-APL-001');

  // Dữ liệu mockup danh sách thương hiệu
  const brands = [
    {
      id: 'BRD-APL-001',
      code: '#BRD-APL-001',
      name: 'Apple Inc.',
      officialName: 'Apple Inc. (Apple Việt Nam)',
      verified: true,
      logoText: '',
      logoBg: 'bg-black text-white',
      badge: 'Chính hãng (AAR Cấp 1)',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      origin: 'Hoa Kỳ',
      originCode: 'US',
      categories: ['Điện thoại', 'Tablet +2'],
      skuCount: 620,
      monthlyRevenue: '480.000.000đ',
      slug: 'apple',
      status: 'Đang hoạt động',
      lastUpdated: 'Hôm nay, 10:45 bởi Admin',
      bannerImage: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'BRD-SMS-002',
      code: '#BRD-SMS-002',
      name: 'Samsung Electronics',
      officialName: 'Samsung Vina Electronics Co.',
      verified: true,
      logoText: 'SAM',
      logoBg: 'bg-blue-600 text-white',
      badge: 'Chính hãng (Official Store)',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      origin: 'Hàn Quốc',
      originCode: 'KR',
      categories: ['Smartphone', 'Màn hình'],
      skuCount: 380,
      monthlyRevenue: '320.000.000đ',
      slug: 'samsung',
      status: 'Đang hoạt động',
      lastUpdated: 'Hôm qua bởi Admin',
      bannerImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'BRD-SNY-003',
      code: '#BRD-SNY-003',
      name: 'Sony Corporation',
      officialName: 'Sony Electronics Vietnam',
      verified: true,
      logoText: 'SONY',
      logoBg: 'bg-zinc-800 text-white',
      badge: 'Đại lý Cấp 1',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
      origin: 'Nhật Bản',
      originCode: 'JP',
      categories: ['Âm thanh', 'Máy ảnh'],
      skuCount: 180,
      monthlyRevenue: '145.000.000đ',
      slug: 'sony',
      status: 'Đang hoạt động',
      lastUpdated: '3 ngày trước',
      bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'BRD-ANK-004',
      code: '#BRD-ANK-004',
      name: 'Anker Innovations',
      officialName: 'Anker Innovations Ltd.',
      verified: false,
      logoText: 'ANK',
      logoBg: 'bg-sky-600 text-white',
      badge: 'Chính hãng (Official)',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      origin: 'Trung Quốc',
      originCode: 'CN',
      categories: ['Phụ kiện sạc', 'Cáp kết nối'],
      skuCount: 120,
      monthlyRevenue: '88.500.000đ',
      slug: 'anker',
      status: 'Đang hoạt động',
      lastUpdated: '5 ngày trước',
      bannerImage: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'BRD-DYS-005',
      code: '#BRD-DYS-005',
      name: 'Dyson Appliances',
      officialName: 'Dyson Direct Inc.',
      verified: false,
      logoText: 'DYS',
      logoBg: 'bg-purple-900 text-white',
      badge: 'Chính hãng (Flagship)',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      origin: 'Vương Quốc Anh',
      originCode: 'GB',
      categories: ['Gia dụng thông minh', 'Chăm sóc tóc'],
      skuCount: 65,
      monthlyRevenue: '112.000.000đ',
      slug: 'dyson',
      status: 'Đang hoạt động',
      lastUpdated: '1 tuần trước',
      bannerImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt; <span className="text-gray-800 font-semibold">Thương hiệu (Brand)</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quản lý Thương hiệu Đối tác (Brand Management)
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Storefront Verified Brands
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Quản lý danh mục nhãn hàng đối tác, logo vector, chứng nhận phân phối chính hãng (Official Store), xuất xứ thương hiệu và liên kết danh mục sản phẩm.
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
            <span>Thêm thương hiệu gốc</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ THỐNG KÊ (TOP CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số thương hiệu */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số thương hiệu
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              68 <span className="text-xs text-emerald-700 font-bold ml-1">↗ +5 quý này</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Đang hoạt động trên sàn đa kênh</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Chính hãng (Official) */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Chính hãng (Official)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              42 <span className="text-xs text-gray-500 font-normal ml-1">61.7% tổng số</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Chứng nhận Authorised Reseller (AAR)</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Sản phẩm liên kết */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Sản phẩm liên kết
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              1,840 <span className="text-xs text-emerald-700 font-bold ml-1">98.6% toàn sàn</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">SKU đã định danh thương hiệu rõ ràng</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Top Brand GMV Tháng */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Top Brand GMV Tháng
            </span>
            <div className="text-lg font-black text-gray-900 mt-0.5">
              Apple Inc. <span className="text-xs text-amber-700 font-semibold ml-1">34.2% GMV</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Đạt 480.000.000 đ doanh thu tháng</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH BỘ LỌC TÌM KIẾM THƯƠNG HIỆU
          ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            <span>Tất cả trạng thái</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            <span>Quốc gia xuất xứ</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            Danh mục phân phối
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. MAIN 2 CỘT: BẢNG BÊN TRÁI + FORM CHI TIẾT BÊN PHẢI
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): BẢNG DANH SÁCH THƯƠNG HIỆU */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 px-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-[11px]">
              <div>
                Hiển thị <strong className="text-gray-800">6</strong> trong tổng số <strong className="text-gray-800">68</strong> thương hiệu • <span className="text-emerald-700 font-semibold">1 đã chọn</span>
              </div>
              <button className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium">
                <Archive className="w-3 h-3 text-gray-400" />
                <span>Lưu trữ đã chọn</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="w-8 py-2.5 px-3 text-center">
                      <input type="checkbox" checked readOnly className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </th>
                    <th className="py-2.5 px-3">LOGO &amp; THƯƠNG HIỆU</th>
                    <th className="py-2.5 px-3">CHỨNG NHẬN</th>
                    <th className="py-2.5 px-3">XUẤT XỨ</th>
                    <th className="py-2.5 px-3">DANH MỤC CHÍNH</th>
                    <th className="py-2.5 px-3 text-center">SKU</th>
                    <th className="py-2.5 px-3 text-right">DOANH THU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {brands.map((b) => {
                    const isSelected = selectedBrandId === b.id;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBrandId(b.id)}
                        className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-emerald-50/30 border-l-4 border-l-emerald-600' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelectedBrandId(b.id)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${b.logoBg}`}>
                              {b.logoText}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1">
                                <span>{b.name}</span>
                                {b.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono">{b.code}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${b.badgeClass}`}>
                            {b.badge}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-medium text-gray-700">
                            <span className="font-mono text-gray-400 text-[10px] mr-1 uppercase">{b.originCode}</span>
                            {b.origin}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {b.categories.map((c, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-gray-800">
                          {b.skuCount}
                        </td>

                        <td className="py-3 px-3 text-right font-bold text-gray-900">
                          {b.monthlyRevenue}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (5/12): FORM CHI TIẾT & CHỈNH SỬA THƯƠNG HIỆU */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
          {/* Header Panel */}
          <div className="flex items-start justify-between pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">
                  Chi tiết Thương hiệu: {selectedBrand.name}
                </h2>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                  {selectedBrand.code.replace('#', '')}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Cập nhật lần cuối: {selectedBrand.lastUpdated}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              {selectedBrand.status}
            </span>
          </div>

          {/* Hình ảnh nhận diện Storefront */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Hình ảnh nhận diện Storefront
            </label>

            {/* Banner preview */}
            <div className="relative rounded-lg overflow-hidden border border-gray-200 h-28 bg-gray-100 mb-2">
              <img
                src={selectedBrand.bannerImage}
                alt={selectedBrand.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                1200 x 300 px
              </span>
            </div>

            {/* Logo upload block */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-dashed border-gray-200 bg-gray-50/60">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl shrink-0 shadow-xs ${selectedBrand.logoBg}`}>
                {selectedBrand.logoText}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <button className="text-xs font-bold text-emerald-800 hover:underline">
                    Tải logo mới (1:1)
                  </button>
                  <button className="text-xs text-rose-600 hover:underline">
                    Xóa
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Khuyến nghị: SVG vector hoặc PNG trong suốt tối thiểu 400×400px.
                </p>
              </div>
            </div>
          </div>

          {/* Form input fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Tên thương hiệu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={selectedBrand.officialName}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Đường dẫn SEO Slug <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
                <span className="bg-gray-100 px-2.5 py-1.5 text-gray-400 font-mono border-r border-gray-200 select-none">
                  novacommerce.vn/thuong-hieu/
                </span>
                <input
                  type="text"
                  defaultValue={selectedBrand.slug}
                  className="flex-1 px-2.5 py-1.5 focus:outline-none text-gray-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Quốc gia đăng ký sở hữu
              </label>
              <div className="relative">
                <select className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 appearance-none font-medium focus:outline-none">
                  <option>{selectedBrand.originCode.toLowerCase()} {selectedBrand.origin} (Default)</option>
                  <option>us Hoa Kỳ (United States)</option>
                  <option>kr Hàn Quốc (South Korea)</option>
                  <option>jp Nhật Bản (Japan)</option>
                  <option>gb Vương Quốc Anh (United Kingdom)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Loại chứng nhận phân phối
              </label>
              <div className="relative">
                <select className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 appearance-none font-medium focus:outline-none">
                  <option>{selectedBrand.badge}</option>
                  <option>Apple Authorised Reseller (AAR Cấp 1)</option>
                  <option>Official Store Flagship</option>
                  <option>Đại lý Uỷ Quyền Cấp 1</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">
              Hủy
            </button>
            <button className="px-4 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
