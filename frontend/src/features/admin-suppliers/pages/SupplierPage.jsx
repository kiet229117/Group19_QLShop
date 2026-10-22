import { useState } from 'react';
import {
  FileText,
  CreditCard,
  Target,
  Star,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  History,
  Scale,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  ExternalLink,
  Download,
  Upload,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Truck,
  FileCheck
} from 'lucide-react';

export default function SupplierPage() {
  const [selectedSupplierId, setSelectedSupplierId] = useState('SUP-FPT-01');
  const [activeTab, setActiveTab] = useState('all');

  // Danh sách nhà cung cấp mockup
  const suppliers = [
    {
      id: 'SUP-FPT-01',
      code: 'Mã: SUP-FPT-01',
      tax: 'MST: 0101719163',
      name: 'Synnex FPT Distribution',
      officialName: 'Công ty Cổ phần Phân phối Synnex FPT',
      logoText: 'FPT',
      logoBg: 'bg-emerald-600 text-white',
      address: 'Tòa nhà FPT Cầu Giấy, Hà Nội',
      categories: 'Điện thoại, Laptop, Apple',
      brands: 'Apple, ASUS, HP, Dell',
      debt: '625.000.000 đ',
      creditLimit: '3.000.000.000 đ',
      creditAvailable: '2.375.000.000 đ',
      debtUsage: 20.8,
      debtStatusText: '20.8% hạn mức - An toàn',
      tier: 'Hạng A (Tier 1)',
      sla: '99.2%',
      status: 'Đang hợp tác',
      accountManager: 'Trần Đình Hoàng',
      accountRole: 'Chuyên viên Quản lý ngành hàng Apple & Asus',
      hotline: '0918.234.567',
      email: 'hoang.td@synnexfpt.com',
      legalRep: 'Tổng Giám đốc Bùi Ngọc Khánh',
      bankAccount: '0011001245678',
      bankName: 'Vietcombank - CN Thăng Long',
      creditTerm: 'Net 30 ngày (30 days credit)',
      earlyDiscount: '1.5% nếu thanh toán trước 10 ngày',
      paymentMethod: 'Chuyển khoản ngân hàng (Ủy nhiệm chi VAT)',
      totalDeliveries: '48 lô hàng',
      qcPassRate: '99.4%',
      latestReceipt: {
        id: '#GR-2024-102',
        status: 'Đã nhập kho đủ',
        amount: '1.328.000.000 đ',
        date: '24/10/2024',
      },
      documents: [
        {
          name: 'HopDong_KhungPhanPhoi_SynnexFPT_2024-20...',
          info: 'Hiệu lực đến 31/12/2026 • 4.2 MB',
        },
        {
          name: 'GiayChungNhan_Apple_Authorized_Distributor.pdf',
          info: 'Chứng chỉ phân phối chính thức • 1.8 MB',
        },
      ],
    },
    {
      id: 'SUP-DGW-02',
      code: 'Mã: SUP-DGW-02',
      tax: 'MST: 0302861742',
      name: 'CP Thế Giới Số (Digiworld)',
      officialName: 'Công ty Cổ phần Thế Giới Số - Digiworld',
      logoText: 'DGW',
      logoBg: 'bg-blue-600 text-white',
      address: 'Quận 3, TP. Hồ Chí Minh',
      categories: 'Xiaomi, Phụ kiện công nghệ',
      brands: 'Xiaomi, Philips, MSI',
      debt: '185.000.000 đ',
      creditLimit: '2.000.000.000 đ',
      creditAvailable: '1.815.000.000 đ',
      debtUsage: 9.3,
      debtStatusText: '9.3% hạn mức - Rất tốt',
      tier: 'Hạng A (Tier 1)',
      sla: '98.5%',
      status: 'Đang hợp tác',
      accountManager: 'Nguyễn Văn Minh',
      accountRole: 'Trưởng bộ phận khách hàng Enterprise',
      hotline: '0903.888.999',
      email: 'minh.nv@digiworld.com.vn',
      legalRep: 'Chủ tịch Đoàn Hồng Việt',
      bankAccount: '0181003456789',
      bankName: 'Vietcombank - CN Nam Sài Gòn',
      creditTerm: 'Net 45 ngày (45 days credit)',
      earlyDiscount: '2.0% nếu thanh toán trước 15 ngày',
      paymentMethod: 'Chuyển khoản ngân hàng (Ủy nhiệm chi VAT)',
      totalDeliveries: '35 lô hàng',
      qcPassRate: '98.8%',
      latestReceipt: {
        id: '#GR-2024-101',
        status: 'Đã nhập kho đủ',
        amount: '420.000.000 đ',
        date: '23/10/2024',
      },
      documents: [
        {
          name: 'HopDong_ThuongMai_Digiworld_2024.pdf',
          info: 'Hiệu lực đến 30/06/2025 • 3.5 MB',
        },
      ],
    },
    {
      id: 'SUP-SNY-03',
      code: 'Mã: SUP-SNY-03',
      tax: 'MST: 0300645094',
      name: 'Sony Electronics Vietnam Co., Ltd',
      officialName: 'Công ty TNHH Sony Electronics Việt Nam',
      logoText: 'SNY',
      logoBg: 'bg-zinc-800 text-white',
      address: 'Tòa nhà President Place, TP. HCM',
      categories: 'Âm thanh, Máy ảnh, Phụ kiện',
      brands: 'Sony Alpha, Bravia, Tai nghe',
      debt: '310.000.000 đ',
      creditLimit: '1.500.000.000 đ',
      creditAvailable: '1.190.000.000 đ',
      debtUsage: 20.6,
      debtStatusText: 'Đến hạn trong 5 ngày',
      tier: 'Hạng A+',
      sla: '99.8%',
      status: 'Đang hợp tác',
      accountManager: 'Lê Thu Hương',
      accountRole: 'Key Account Manager - Audio & Imaging',
      hotline: '0988.765.432',
      email: 'huong.le@sony.com.vn',
      legalRep: 'Tổng Giám đốc Aoxiao Zhang',
      bankAccount: '0071000987654',
      bankName: 'Citibank - CN TP. Hồ Chí Minh',
      creditTerm: 'Net 30 ngày',
      earlyDiscount: '1.0% nếu thanh toán trước 7 ngày',
      paymentMethod: 'Ủy nhiệm chi ngân hàng',
      totalDeliveries: '29 lô hàng',
      qcPassRate: '99.9%',
      latestReceipt: {
        id: '#GR-2024-098',
        status: 'Đã nhập kho đủ',
        amount: '310.000.000 đ',
        date: '18/10/2024',
      },
      documents: [
        {
          name: 'Sony_Authorized_Partner_Certificate_2024.pdf',
          info: 'Chứng chỉ nhà phân phối chính thức • 2.1 MB',
        },
      ],
    },
    {
      id: 'SUP-ANK-05',
      code: 'Mã: SUP-ANK-05',
      tax: 'MST: 0314890212',
      name: 'Công ty TNHH TMDV Anker Vietnam',
      officialName: 'Công ty TNHH Thương mại Dịch vụ Anker Việt Nam',
      logoText: 'ANK',
      logoBg: 'bg-sky-600 text-white',
      address: 'Tân Bình, TP. Hồ Chí Minh',
      categories: 'Pin sạc, Dây cáp, Củ sạc nhanh',
      brands: 'Anker, Soundcore, Eufy',
      debt: '45.000.000 đ',
      creditLimit: '800.000.000 đ',
      creditAvailable: '755.000.000 đ',
      debtUsage: 5.6,
      debtStatusText: '5.6% hạn mức - Rất an toàn',
      tier: 'Hạng B+',
      sla: '96.2%',
      status: 'Đang hợp tác',
      accountManager: 'Trịnh Quốc Bảo',
      accountRole: 'Phụ trách Kênh Bán Lẻ Phụ Kiện',
      hotline: '0933.112.233',
      email: 'bao.tq@anker.vn',
      legalRep: 'Giám đốc Nguyễn Đức Thắng',
      bankAccount: '19034567890123',
      bankName: 'Techcombank - CN Tân Bình',
      creditTerm: 'Net 30 ngày',
      earlyDiscount: '2.0% thanh toán sớm',
      paymentMethod: 'Chuyển khoản điện tử',
      totalDeliveries: '22 lô hàng',
      qcPassRate: '97.5%',
      latestReceipt: {
        id: '#GR-2024-095',
        status: 'Đã nhập kho đủ',
        amount: '185.000.000 đ',
        date: '15/10/2024',
      },
      documents: [
        {
          name: 'HopDong_PhanPhoi_Anker_2024.pdf',
          info: 'Hiệu lực đến 31/12/2025 • 2.8 MB',
        },
      ],
    },
  ];

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt; <span className="text-gray-800 font-semibold">Nhà cung cấp (Supplier)</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quản lý Nhà cung cấp Đối tác (Supplier Management)
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified Enterprise Partners V5.2
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Quản lý hồ sơ doanh nghiệp cung ứng (Supplier), hạn mức công nợ tín dụng, đánh giá chất lượng giao hàng (SLA &amp; QC) và lịch sử hợp đồng mua sắm.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition">
            <History className="w-3.5 h-3.5 text-gray-500" />
            <span>Lịch sử đánh giá SLA</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition">
            <Scale className="w-3.5 h-3.5 text-gray-500" />
            <span>Đối soát công nợ</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Thêm nhà cung cấp</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ CHỈ SỐ THỐNG KÊ (STAT CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số nhà cung cấp */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              TỔNG SỐ NHÀ CUNG CẤP
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              28 <span className="text-xs text-gray-500 font-medium">đối tác</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center">
                ↗ +2 đối tác trong quý
              </span>
              <span className="text-gray-400">| 24 đang hoạt động</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Tổng công nợ phải trả (AP) */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              TỔNG CÔNG NỢ PHẢI TRẢ (AP)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              1.420.500.000 đ
            </div>
            <div className="mt-1 text-[11px] text-amber-700 font-medium flex items-center gap-1">
              <span>⏱ Đến hạn 15 ngày:</span>
              <strong className="text-gray-900 font-bold">450.000.000 đ</strong>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: SLA Giao hàng & Chuẩn QC */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              SLA GIAO HÀNG &amp; CHUẨN QC
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5 flex items-center gap-2">
              <span>97.8%</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Xuất sắc
              </span>
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              Đạt tiêu chuẩn QC kiểm định | <span className="text-rose-600 font-semibold">0.6% lỗi đợt 1</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Đối tác chiến lược (Tier 1) */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              ĐỐI TÁC CHIẾN LƯỢC (TIER 1)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              8 <span className="text-xs text-gray-500 font-medium">đối tác lớn</span>
            </div>
            <div className="mt-1 text-[11px] text-gray-500 truncate max-w-[200px]">
              Synnex FPT, Digiworld, Petrosetco... &rarr;
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Star className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH TAB LỌC TRẠNG THÁI & BỘ LỌC TÌM KIẾM
          ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
        {/* Hàng 1: Tabs & nút thao tác */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả nhà cung cấp <span className="ml-1 opacity-80">28</span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === 'active'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Đang hợp tác <span className="ml-1 opacity-80">24</span>
            </button>
            <button
              onClick={() => setActiveTab('due')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === 'due'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Có công nợ đến hạn <span className="ml-1 w-2 h-2 rounded-full bg-amber-500 inline-block"></span> 4
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === 'review'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chờ đánh giá lại <span className="ml-1 opacity-80">2</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600 text-xs">
            <button className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
              <RotateCcw className="w-3 h-3" />
              <span>Làm mới</span>
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Cột hiển thị</span>
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 text-rose-600">
              <span>✕ Xóa bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Hàng 2: Các ô input tìm kiếm & dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên NCC, MST, hotline, người đại diện..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            <span>Tất cả trạng thái</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            <span>Phân loại ngành hàng</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700 font-medium">
            <span>Đánh giá tín nhiệm</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. MAIN 2 CỘT: DANH SÁCH BÊN TRÁI + PROFILE CHI TIẾT BÊN PHẢI
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): DANH SÁCH HỒ SƠ NHÀ CUNG CẤP */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 px-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-[11px]">
              <div>
                <strong className="text-gray-900 font-bold">Danh sách Hồ sơ Nhà Cung Cấp</strong>{' '}
                <span className="text-gray-400">(Hiển thị 4 trong số 28 bản ghi)</span>
              </div>
              <button className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium">
                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                <span>Sắp xếp: Công nợ giảm dần</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="w-8 py-2.5 px-3 text-center">
                      <input type="checkbox" checked readOnly className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </th>
                    <th className="py-2.5 px-3">NHÀ CUNG CẤP / MST</th>
                    <th className="py-2.5 px-3">NGÀNH HÀNG CHÍNH</th>
                    <th className="py-2.5 px-3">HẠN MỨC / CÔNG NỢ</th>
                    <th className="py-2.5 px-3 text-center">TÍN NHIỆM &amp; SLA</th>
                    <th className="py-2.5 px-3 text-center">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {suppliers.map((s) => {
                    const isSelected = selectedSupplierId === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSupplierId(s.id)}
                        className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-emerald-50/30 border-l-4 border-l-emerald-600' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelectedSupplierId(s.id)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${s.logoBg}`}>
                              {s.logoText}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{s.name}</div>
                              <div className="text-[10px] text-gray-400">
                                {s.code} • {s.tax}
                              </div>
                              <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                                {s.address}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-gray-800">{s.categories}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{s.brands}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-black text-gray-900">{s.debt}</div>
                          <div className="text-[10px] text-gray-400">Hạn mức: {s.creditLimit}</div>
                          <div className="w-28 bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.debtUsage > 20 ? 'bg-amber-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${Math.min(s.debtUsage * 2, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-[9px] text-gray-500 mt-0.5">{s.debtStatusText}</div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            {s.tier}
                          </span>
                          <div className="text-[10px] text-gray-400 font-semibold mt-0.5">SLA: {s.sla}</div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân trang dưới bảng */}
          <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <div>
              Đang chọn: <strong className="text-gray-900 font-semibold">1 nhà cung cấp</strong> • 28 bản ghi tổng cộng
            </div>
            <div className="flex items-center gap-1 font-semibold text-gray-600">
              <button className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
                &lt;
              </button>
              <button className="px-2 py-0.5 rounded bg-emerald-800 text-white font-bold">1</button>
              <button className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">2</button>
              <button className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 transition">3</button>
              <button className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px]">
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (5/12): HỒ SƠ CHI TIẾT NHÀ CUNG CẤP */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
          {/* Header Panel */}
          <div className="flex items-start justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${selectedSupplier.logoBg}`}>
                {selectedSupplier.logoText}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-gray-900">{selectedSupplier.name}</h2>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  {selectedSupplier.code} | {selectedSupplier.tax}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Đối tác Chiến lược Tier 1
              </span>
              <div className="text-[9px] text-gray-400 mt-0.5">Cập nhật: 12 phút trước</div>
            </div>
          </div>

          {/* Section 1: THÔNG TIN LIÊN HỆ & PHÁP LÝ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>THÔNG TIN LIÊN HỆ &amp; PHÁP LÝ</span>
              <button className="text-[10px] text-emerald-800 hover:underline font-semibold">
                Sửa liên hệ
              </button>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg space-y-2 border border-gray-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Người phụ trách (Account Manager):</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{selectedSupplier.accountManager}</span>
                  <div className="text-[10px] text-gray-400">{selectedSupplier.accountRole}</div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Hotline / Zalo liên hệ:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  {selectedSupplier.hotline}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email trao đổi báo giá:</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  {selectedSupplier.email}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Đại diện pháp luật:</span>
                <span className="font-bold text-gray-800">{selectedSupplier.legalRep}</span>
              </div>

              <div className="flex justify-between pt-1 border-t border-gray-200/60">
                <span className="text-gray-500">Tài khoản ngân hàng:</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900 font-mono">{selectedSupplier.bankAccount}</span>
                  <div className="text-[10px] text-gray-400">{selectedSupplier.bankName}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: HẠN MỨC TÍN DỤNG & ĐIỀU KHOẢN THANH TOÁN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>HẠN MỨC TÍN DỤNG &amp; ĐIỀU KHOẢN</span>
              <span className="text-[10px] font-normal text-gray-500">
                Khả dụng: <strong className="text-emerald-800 font-bold">{selectedSupplier.creditAvailable}</strong>
              </span>
            </div>

            <div className="p-3 bg-gray-50/70 rounded-lg space-y-1.5 border border-gray-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Kỳ hạn công nợ (Credit Term):</span>
                <span className="font-bold text-gray-900 bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                  {selectedSupplier.creditTerm}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Chiết khấu thanh toán sớm:</span>
                <span className="font-semibold text-gray-800">{selectedSupplier.earlyDiscount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Hình thức thanh toán:</span>
                <span className="font-semibold text-gray-800">{selectedSupplier.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Section 3: THỐNG KÊ GIAO NHẬN HÀNG (GOODS RECEIPT) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>THỐNG KÊ GIAO NHẬN HÀNG (GOODS RECEIPT)</span>
              <a href="/admin/goods-receipts" className="text-[10px] text-emerald-800 hover:underline font-semibold flex items-center gap-0.5">
                <span>Lịch sử nhập kho</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400">Tổng số đã giao nhận</span>
                <div className="text-sm font-bold text-gray-900 mt-0.5">{selectedSupplier.totalDeliveries}</div>
                <span className="text-[9px] text-emerald-700 font-semibold">100% hoàn thành</span>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-[10px] text-gray-400">Đạt kiểm định QC lần 1</span>
                <div className="text-sm font-bold text-emerald-800 mt-0.5">{selectedSupplier.qcPassRate}</div>
                <span className="text-[9px] text-gray-400">Mục tiêu ≥ 98%</span>
              </div>
            </div>

            {/* Phiếu nhập gần nhất */}
            <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-gray-500">Phiếu nhập gần nhất:</span>{' '}
                <strong className="text-emerald-900 font-bold">{selectedSupplier.latestReceipt.id}</strong>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Giá trị: <strong>{selectedSupplier.latestReceipt.amount}</strong> • Ngày {selectedSupplier.latestReceipt.date}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                {selectedSupplier.latestReceipt.status}
              </span>
            </div>
          </div>

          {/* Section 4: Action Buttons */}
          <div className="space-y-1.5 pt-1">
            <div className="flex gap-2">
              <a
                href="/admin/goods-receipts"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo phiếu nhập mới (#GR)</span>
              </a>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition">
                <span>▷ Gửi đối soát công nợ</span>
              </button>
            </div>
            <div className="text-center">
              <button className="text-[10px] text-gray-500 hover:text-gray-800 hover:underline font-medium">
                ✎ Chỉnh sửa hồ sơ thông tin nhà cung cấp
              </button>
            </div>
          </div>

          {/* Section 5: Hợp đồng khung & Giấy ủy quyền */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>Hợp đồng khung &amp; Giấy ủy quyền</span>
              <button className="text-[10px] text-emerald-800 hover:underline font-semibold">
                + Tải lên tệp
              </button>
            </div>

            <div className="space-y-1.5">
              {selectedSupplier.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-gray-800 truncate text-[11px]">{doc.name}</div>
                      <div className="text-[10px] text-gray-400">{doc.info}</div>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-700 shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
