import { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

export default function ProductsPage() {
  const [expandedId, setExpandedId] = useState('1'); // ID sản phẩm 1 mở mặc định như ảnh
  const [selectedProduct, setSelectedProduct] = useState(true);

  // Danh sách sản phẩm mockup
  const products = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max Titanium',
      code: 'MÃ SP: APL-IP15PM',
      category: 'Điện thoại',
      brand: 'Apple',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&auto=format&fit=crop&q=80',
      skusCount: '3 SKUs',
      variantsSummary: '3 Phiên bản SKUs',
      variantsDetail: 'Titan Tự Nhiên / Đen / Xanh',
      price: '29.490.000đ – 41.990.000đ',
      originalPrice: '34.990.000đ – 46.990.000đ',
      stock: '42 chiếc',
      stockSub: '3 kho khả dụng',
      status: 'Đang bán',
      statusType: 'active',
      variants: [
        {
          no: 1,
          sku: 'IP15PM-256-NAT',
          color: 'Titan Tự Nhiên (Natural)',
          colorDot: 'bg-[#a39382]',
          spec: '256 GB',
          cost: '26.100.000đ',
          price: '29.490.000đ',
          stock: '18 chiếc',
          warning: null,
        },
        {
          no: 2,
          sku: 'IP15PM-512-BLK',
          color: 'Titan Đen (Black Titanium)',
          colorDot: 'bg-[#2b2b2b]',
          spec: '512 GB',
          cost: '30.800.000đ',
          price: '34.990.000đ',
          stock: '20 chiếc',
          warning: null,
        },
        {
          no: 3,
          sku: 'IP15PM-1TB-BLU',
          color: 'Titan Xanh (Blue Titanium)',
          colorDot: 'bg-[#2f3846]',
          spec: '1 TB',
          cost: '37.200.000đ',
          price: '41.990.000đ',
          stock: 'Chỉ còn 4 chiếc',
          warning: 'Chỉ còn 4 chiếc',
        },
      ],
    },
    {
      id: '2',
      name: 'Tai nghe Sony WH-1000XM5 Chống Ồn',
      code: 'MÃ SP: SNY-WH1000M5',
      category: 'Âm thanh',
      brand: 'Sony',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80',
      skusCount: '2 SKUs',
      variantsSummary: '2 Phiên bản',
      variantsDetail: 'Đen Nhám (Black) / Bạc (Silver)',
      price: '8.790.000đ',
      originalPrice: '9.490.000đ',
      stock: '54 chiếc',
      stockSub: 'Kho tổng HN & HCM',
      status: 'Đang bán',
      statusType: 'active',
    },
    {
      id: '3',
      name: 'Samsung Galaxy S24 Ultra 5G AI',
      code: 'MÃ SP: SS-S24U-AI',
      category: 'Điện thoại',
      brand: 'Samsung',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&auto=format&fit=crop&q=80',
      skusCount: '4 SKUs',
      variantsSummary: '4 Phiên bản SKUs',
      variantsDetail: 'Xám Titan / Tím / Đen / Vàng',
      price: '27.990.000đ – 38.490.000đ',
      originalPrice: '31.990.000đ – 44.490.000đ',
      stock: '8 chiếc (Sắp hết)',
      stockSub: 'Dưới ngưỡng định biên',
      status: 'Sắp hết hàng',
      statusType: 'warning',
    },
    {
      id: '4',
      name: 'Pin Dự Phòng Anker 737 GaNPrime 140W',
      code: 'MÃ SP: ANK-737-140W',
      category: 'Phụ kiện',
      brand: 'Anker',
      image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=100&auto=format&fit=crop&q=80',
      skusCount: '1 SKU',
      variantsSummary: 'Đơn biến thể (1 SKU)',
      variantsDetail: '24.000mAh 140W Smart Display',
      price: '2.350.000đ',
      originalPrice: '2.990.000đ',
      stock: '0 chiếc (Hết hàng)',
      stockSub: 'Chờ container cảng Cát Lái',
      status: 'Tạm hết hàng',
      statusType: 'danger',
    },
    {
      id: '5',
      name: 'Laptop ASUS ROG Zephyrus G16 OLED 2024',
      code: 'MÃ SP: ASUS-G16-2024',
      category: 'Laptop',
      brand: 'Asus ROG',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&auto=format&fit=crop&q=80',
      skusCount: '2 SKUs',
      variantsSummary: '2 Cấu hình CPU/GPU',
      variantsDetail: 'Core Ultra 9 / RTX 4070 - 4080',
      price: '58.990.000đ – 72.490.000đ',
      originalPrice: 'Chờ duyệt giá bán lẻ',
      stock: '12 máy',
      stockSub: 'Đã nhập kho bảo thuế',
      status: 'Đơn nhập / Chưa mở bán',
      statusType: 'draft',
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-10">
      {/* =========================================================================
          1. HÀNG 4 THẺ THỐNG KÊ GỌN GÀNG (TOP CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số sản phẩm */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số sản phẩm
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">1,840</div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +6.2%
              </span>
              <span className="text-gray-400">| Đang kinh doanh hoạt động</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Tổng biến thể (SKUs) */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng biến thể (SKUs)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">6,420</div>
            <div className="mt-1 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-700">TB 3.5 biến thể / SP</span> | Size, Color, Dung lượng
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Cảnh báo sắp hết hàng */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo sắp hết hàng
            </span>
            <div className="text-2xl font-black text-amber-700 mt-1">28 <span className="text-sm font-semibold">SKU cần nhập</span></div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-rose-600 font-bold">8 SKU đã hết tồn kho</span>
              <a href="#receipt" className="text-emerald-700 hover:underline font-semibold ml-1">Lập phiếu nhập &rarr;</a>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Ngừng bán / Chờ duyệt */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Ngừng bán / Chờ duyệt
            </span>
            <div className="text-2xl font-black text-gray-800 mt-1">14 <span className="text-sm font-semibold">sản phẩm</span></div>
            <div className="mt-1 text-[11px] text-gray-400">
              5 chờ cập nhật giá & kiểm duyệt
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 border border-gray-200 flex items-center justify-center shrink-0">
            <Settings2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. THANH BỘ LỌC TÌM KIẾM & BỘ LỌC ĐANG ÁP DỤNG
          ========================================================================= */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
        {/* Hàng 1: Các dropdown lọc + nút thao tác */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition">
              <span>Tất cả Danh mục</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition">
              <span>Tất cả Thương hiệu</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition">
              <span>Tình trạng tồn kho</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium transition">
              <span>Khoảng giá</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-600/30 bg-emerald-50/60 text-emerald-800 font-semibold hover:bg-emerald-100 transition">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Bộ lọc nâng cao</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
            </button>

            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-gray-500 hover:text-gray-800 transition font-medium">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-[11px]">Đã chọn: <strong className="text-gray-900">1 SP</strong></span>
            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hàng 2: Các tag bộ lọc đang áp dụng */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-[11px]">
          <span className="text-gray-400 font-medium">Đang áp dụng:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium border border-gray-200">
            Danh mục: <strong>Điện thoại</strong>
            <X className="w-3 h-3 cursor-pointer hover:text-gray-900" />
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium border border-gray-200">
            Thương hiệu: <strong>Apple, Sony</strong>
            <X className="w-3 h-3 cursor-pointer hover:text-gray-900" />
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium border border-gray-200">
            Trạng thái: <strong>Đang bán</strong>
            <X className="w-3 h-3 cursor-pointer hover:text-gray-900" />
          </span>
          <button className="text-emerald-700 hover:underline font-semibold ml-1">
            Xóa tất cả bộ lọc
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. BẢNG DỮ LIỆU SẢN PHẨM & MA TRẬN BIẾN THỂ (PRODUCT MATRIX TABLE)
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header Bảng */}
            <thead className="bg-[#fcfdfd] text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="w-10 py-3 px-3 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </th>
                <th className="py-3 px-3 text-center w-16">HÌNH ẢNH</th>
                <th className="py-3 px-4">SẢN PHẨM & DANH MỤC</th>
                <th className="py-3 px-4">BIẾN THỂ (VARIANTS)</th>
                <th className="py-3 px-4">GIÁ NIÊM YẾT / BÁN</th>
                <th className="py-3 px-4">TỒN KHO KHẢ DỤNG</th>
                <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
              </tr>
            </thead>

            {/* Dòng dữ liệu sản phẩm */}
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const isExpanded = expandedId === p.id;
                return (
                  <div key={p.id} style={{ display: 'contents' }}>
                    {/* Hàng sản phẩm cha */}
                    <tr className={`hover:bg-gray-50/70 transition-colors ${isExpanded ? 'bg-emerald-50/20' : ''}`}>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            checked={p.id === '1' ? selectedProduct : false}
                            onChange={() => p.id === '1' && setSelectedProduct(!selectedProduct)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => toggleExpand(p.id)}
                            className="p-0.5 text-gray-400 hover:text-gray-700 transition"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Hình ảnh + badge số lượng SKU */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="relative inline-block">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-2xs"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-gray-900/90 text-white text-[9px] font-bold px-1 rounded">
                            {p.skusCount}
                          </span>
                        </div>
                      </td>

                      {/* Thông tin sản phẩm & danh mục */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 hover:text-emerald-700 cursor-pointer">{p.name}</span>
                          <Info className="w-3 h-3 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                          <span className="font-medium text-gray-500">{p.code}</span>
                          <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium">
                            {p.category}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium">
                            {p.brand}
                          </span>
                        </div>
                      </td>

                      {/* Biến thể tóm tắt */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-800">{p.variantsSummary}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{p.variantsDetail}</div>
                      </td>

                      {/* Giá */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-gray-900">{p.price}</div>
                        <div className="text-[11px] text-gray-400 line-through mt-0.5">{p.originalPrice}</div>
                      </td>

                      {/* Tồn kho */}
                      <td className="py-3.5 px-4">
                        <div className={`font-bold ${p.statusType === 'danger' ? 'text-rose-600' : p.statusType === 'warning' ? 'text-amber-700' : 'text-gray-900'}`}>
                          {p.stock}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{p.stockSub}</div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center">
                        {p.statusType === 'active' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {p.status}
                          </span>
                        )}
                        {p.statusType === 'warning' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {p.status}
                          </span>
                        )}
                        {p.statusType === 'danger' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            {p.status}
                          </span>
                        )}
                        {p.statusType === 'draft' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            {p.status}
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* =========================================================
                        MA TRẬN BIẾN THỂ CON (EXPANDED NESTED SUB-TABLE)
                        ========================================================= */}
                    {isExpanded && p.variants && (
                      <tr className="bg-[#f8faf9] border-y border-emerald-100">
                        <td colSpan="7" className="p-4 pl-12 pr-6">
                          <div className="bg-white rounded-lg border border-emerald-200/80 shadow-2xs overflow-hidden">
                            {/* Tiêu đề sub-table */}
                            <div className="p-2.5 px-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                                  Danh sách Biến thể (ProductVariants Matrix)
                                </span>
                                <span className="text-[10px] bg-emerald-100/80 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                                  {p.variants.length} cấu hình đang sẵn sàng
                                </span>
                              </div>
                            </div>

                            {/* Bảng chi tiết biến thể */}
                            <table className="w-full text-left text-[11px]">
                              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                                <tr>
                                  <th className="py-2.5 px-3 text-center w-8">#</th>
                                  <th className="py-2.5 px-3">MÃ SKU</th>
                                  <th className="py-2.5 px-3">Màu sắc / Chất liệu</th>
                                  <th className="py-2.5 px-3">Dung lượng/ROM</th>
                                  <th className="py-2.5 px-3">Giá vốn (Cost)</th>
                                  <th className="py-2.5 px-3">Giá bán (ProductPrice)</th>
                                  <th className="py-2.5 px-3">Tồn kho / Cảnh báo</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {p.variants.map((v) => (
                                  <tr key={v.sku} className="hover:bg-gray-50/80 transition">
                                    <td className="py-2.5 px-3 text-center text-gray-400 font-medium">{v.no}</td>
                                    <td className="py-2.5 px-3 font-bold text-gray-800">{v.sku}</td>
                                    <td className="py-2.5 px-3">
                                      <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${v.colorDot} border border-gray-300 shadow-2xs`}></span>
                                        <span className="font-medium text-gray-700">{v.color}</span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 font-semibold text-gray-700">{v.spec}</td>
                                    <td className="py-2.5 px-3 text-gray-500">{v.cost}</td>
                                    <td className="py-2.5 px-3 font-bold text-emerald-800">{v.price}</td>
                                    <td className="py-2.5 px-3">
                                      {v.warning ? (
                                        <span className="text-amber-700 font-bold flex items-center gap-1">
                                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                                          {v.warning}
                                        </span>
                                      ) : (
                                        <span className="text-gray-700 font-medium flex items-center gap-1">
                                          📦 {v.stock}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
            4. PHÂN TRANG GỌN GÀNG (PAGINATION)
            ========================================================================= */}
        <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div>
            Hiển thị <strong className="text-gray-800">1 – 5</strong> trong tổng số <strong className="text-gray-800">1,840</strong> sản phẩm
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Số dòng:</span>
              <select className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 font-semibold focus:outline-none">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1 font-semibold text-gray-600">
              <button className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
                |&lt;
              </button>
              <button className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
                &lt;
              </button>
              <button className="px-2.5 py-1 rounded bg-emerald-700 text-white font-bold">1</button>
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

      {/* =========================================================================
          5. BANNER THÔNG BÁO ĐỒNG BỘ ĐA KÊNH (OMNICHANNEL SYNC)
          ========================================================================= */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black">
            ⇄
          </div>
          <div>
            <div className="font-bold text-emerald-900">Tự động đồng bộ đa kênh (Omnichannel Sync Active)</div>
            <div className="text-[11px] text-emerald-700/90 mt-0.5">
              Dữ liệu biến thể SKU và giá bán đang được đồng bộ tự động với TikTok Shop, Shopee Mall, Lazada và Hệ thống 42 Chi nhánh Offline mỗi 60 giây.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Webhook 20...</span>
        </div>
      </div>
    </div>
  );
}
