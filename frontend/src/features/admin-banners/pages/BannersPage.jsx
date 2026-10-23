import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  Layers,
  TrendingUp,
  DollarSign,
  Filter,
  ArrowUpDown,
  Calendar,
  Plus,
  Edit2,
  Clock,
  Laptop,
  Smartphone,
  ExternalLink,
  Link2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Check,
  Trash2,
  X,
  ChevronDown,
  Sparkles,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import bannerService from '../services/bannerService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';
import ImagePicker, { getFullImageUrl } from '../../../components/common/ImagePicker';

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tabs & Preview
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, HERO, CATEGORY, POPUP
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, INACTIVE
  const [devicePreview, setDevicePreview] = useState('desktop');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isNewBannerModalOpen, setIsNewBannerModalOpen] = useState(false);
  const [newBannerData, setNewBannerData] = useState({
    title: '',
    image: '',
    linkUrl: 'https://novacommerce.vn/',
    position: 'HERO',
    displayOrder: 1,
    active: true,
    description: 'Ưu đãi thời trang mới'
  });

  // Tải danh sách Banner từ Database (GET /api/banners)
  const fetchBanners = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setErrorMessage('');
    try {
      const res = await bannerService.getAllBanners(0, 100);
      const rawList = res?.content || (Array.isArray(res) ? res : []);
      
      const mapped = rawList.map((b) => ({
        id: `BNR-${b.id}`,
        backendId: b.id,
        title: b.title || 'Banner không tên',
        tagline: b.description || 'CHIẾN DỊCH TIẾP THỊ',
        altText: b.title || '',
        location:
          b.position === 'HERO' || b.position === 'HOME_SLIDER'
            ? 'Hero Slider Trang chủ'
            : b.position === 'CATEGORY'
            ? 'Banner Danh mục & Ngành hàng'
            : b.position === 'POPUP'
            ? 'Pop-up Toàn sàn'
            : (b.position || 'Hero Slider Trang chủ'),
        locationKey:
          b.position === 'HOME_SLIDER' ? 'HERO' : (b.position || 'HERO'),
        locationPath: b.linkUrl || '/',
        subPosition: `Thứ tự #${b.displayOrder || 1}`,
        dateRange: 'Đang áp dụng',
        targetUrl: b.linkUrl || '',
        utmTracking: `utm_source=banner&utm_medium=${(b.position || 'hero').toLowerCase()}&utm_campaign=banner_${b.id}`,
        priority: String(b.displayOrder || 1),
        targetWindow: '_self',
        status: b.active ? 'ACTIVE' : 'INACTIVE',
        statusLabel: b.active ? 'Đang phát sóng (Active)' : 'Tạm dừng',
        priorityLabel: `Ưu tiên #${b.displayOrder || 1}`,
        dimensions:
          b.position === 'CATEGORY' ? '1200 x 400' : b.position === 'POPUP' ? '600 x 750' : '1920 x 600',
        badgeCategory: b.position || 'Hero Slider',
        image: b.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Khám phá ngay'
      }));

      setBanners(mapped);
      if (mapped.length > 0) {
        setSelectedBanner((prev) => {
          if (!prev) return mapped[0];
          const found = mapped.find((item) => item.backendId === prev.backendId);
          return found || mapped[0];
        });
      } else {
        setSelectedBanner(null);
        setFormData(null);
      }
    } catch (err) {
      console.error('Lỗi khi tải banners từ backend:', err);
      setErrorMessage('Không thể kết nối đến API /api/banners. Vui lòng kiểm tra backend.');
      setBanners([]);
      setSelectedBanner(null);
      setFormData(null);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners(false);
  }, [fetchBanners]);

  useEffect(() => {
    if (selectedBanner) {
      setFormData({ ...selectedBanner });
    }
  }, [selectedBanner]);

  // Bộ lọc Tab
  const filteredBanners = banners.filter((b) => {
    if (activeTab === 'HERO' && b.locationKey !== 'HERO') return false;
    if (activeTab === 'CATEGORY' && b.locationKey !== 'CATEGORY') return false;
    if (activeTab === 'POPUP' && b.locationKey !== 'POPUP') return false;
    if (statusFilter === 'ACTIVE' && b.status !== 'ACTIVE') return false;
    if (statusFilter === 'INACTIVE' && b.status !== 'INACTIVE') return false;
    return true;
  });

  // Phân trang Banner
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, statusFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredBanners.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredBanners.length);
  const paginatedBanners = filteredBanners.slice(startIndex, endIndex);

  // Lưu cập nhật (PUT /api/banners/{id})
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData?.backendId) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await bannerService.updateBanner(formData.backendId, {
        title: formData.title,
        image: formData.image,
        linkUrl: formData.targetUrl,
        position: formData.locationKey,
        displayOrder: parseInt(formData.priority) || 1,
        active: formData.status === 'ACTIVE',
        description: formData.tagline || ''
      });

      setSaveSuccess(true);
      toast.success(`Đã cập nhật banner "${formData.title}" thành công!`);
      await fetchBanners(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi cập nhật banner'));
    } finally {
      setIsSaving(false);
    }
  };

  // Bật / tắt nhanh hiển thị banner (PATCH /api/banners/{id}/toggle)
  const handleToggleStatus = async () => {
    if (!formData?.backendId) return;
    try {
      await bannerService.toggleActive(formData.backendId);
      toast.info('Đã chuyển đổi trạng thái hiển thị của banner!');
      await fetchBanners(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi thay đổi trạng thái banner'));
    }
  };

  // Xóa banner (DELETE /api/banners/{id})
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này khỏi hệ thống?')) return;
    try {
      await bannerService.deleteBanner(id);
      toast.success('Đã xóa banner khỏi hệ thống thành công!');
      await fetchBanners(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi xóa banner'));
    }
  };

  // Tạo mới banner (POST /api/banners)
  const handleCreateBanner = async (e) => {
    e.preventDefault();
    try {
      await bannerService.createBanner({
        title: newBannerData.title,
        image: newBannerData.image,
        linkUrl: newBannerData.linkUrl,
        position: newBannerData.position,
        displayOrder: parseInt(newBannerData.displayOrder) || 1,
        active: newBannerData.active,
        description: newBannerData.description
      });

      toast.success(`Đã tạo banner "${newBannerData.title}" thành công!`);
      setIsNewBannerModalOpen(false);
      setNewBannerData({
        title: '',
        image: '',
        linkUrl: 'https://novacommerce.vn/',
        position: 'HERO',
        displayOrder: 1,
        active: true,
        description: 'Ưu đãi thời trang mới'
      });
      await fetchBanners(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi tạo banner'));
    }
  };

  // Thống kê động từ cơ sở dữ liệu thật
  const activeCount = banners.filter((b) => b.status === 'ACTIVE').length;
  const heroCount = banners.filter((b) => b.locationKey === 'HERO').length;
  const categoryCount = banners.filter((b) => b.locationKey === 'CATEGORY').length;
  const popupCount = banners.filter((b) => b.locationKey === 'POPUP').length;

  return (
    <div className="p-6 bg-[#f4f6f8] min-h-screen text-slate-800 space-y-6">
      {/* =========================================================================
          1. HEADER & ACTIONS
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Phân hệ Quản trị</span>
            <span>&gt;</span>
            <span>Khách hàng &amp; Marketing</span>
            <span>&gt;</span>
            <span className="text-emerald-700 font-semibold">Quản lý Banner &amp; Chiến dịch</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Quản lý Banner &amp; Chiến dịch Tiếp thị (Banner &amp; Marketing Campaigns)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              API Database Live
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1 max-w-3xl">
            Quản trị slider trang chủ storefront, banner danh mục ngành hàng, pop-up ưu đãi thời gian thực,
            kết nối trực tiếp cơ sở dữ liệu MySQL qua API backend.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchBanners}
            title="Làm mới dữ liệu từ Database"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 font-semibold text-xs transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ DB</span>
          </button>

          <button
            onClick={() => setIsNewBannerModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo Banner mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. TOP 4 STAT CARDS (TÍNH TỪ DATA DATABASE THẬT)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              TỔNG SỐ BANNER ĐANG CHẠY
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{activeCount} Banner</span>
            <span className="text-xs font-semibold text-emerald-600">đang hiển thị</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            {heroCount} Slider Hero • {categoryCount} Danh mục • {popupCount} Pop-up
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              TỔNG SỐ BẢN GHI (DATABASE)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{banners.length}</span>
            <span className="text-xs font-medium text-gray-500">chiến dịch</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            {banners.length - activeCount} banner đang tạm dừng lưu trữ
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              TỶ LỆ KÍCH HOẠT HIỆN HÀNH
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">
              {banners.length > 0 ? Math.round((activeCount / banners.length) * 100) : 0}%
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Hoạt động
            </span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            Được phân phối qua CDN Cloudflare
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              TRẠNG THÁI BACKEND API
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">200 OK</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            Đồng bộ thời gian thực từ /api/banners
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. TABS & FILTER BAR
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Tất cả vị trí ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('HERO')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'HERO'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Hero Slider Trang chủ ({heroCount})
          </button>
          <button
            onClick={() => setActiveTab('CATEGORY')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'CATEGORY'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Banner Danh mục ({categoryCount})
          </button>
          <button
            onClick={() => setActiveTab('POPUP')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'POPUP'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Pop-up ({popupCount})
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 font-medium focus:outline-emerald-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Chỉ xem Đang hoạt động</option>
            <option value="INACTIVE">Chỉ xem Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
          4. MAIN 2-COLUMN SECTION: LIST (LEFT) & QUICK EDIT (RIGHT)
          ========================================================================= */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <div className="font-bold text-gray-800 text-sm">Đang tải dữ liệu Banner từ cơ sở dữ liệu...</div>
          <div className="text-xs text-gray-400 mt-1">Kết nối API: GET /api/banners</div>
        </div>
      ) : banners.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 space-y-3">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="font-black text-gray-900 text-base">Cơ sở dữ liệu chưa có Banner nào</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Hệ thống đã kết nối thành công đến API backend. Hãy nhấn nút bên dưới để tạo banner đầu tiên lưu trực tiếp vào cơ sở dữ liệu!
          </p>
          <button
            onClick={() => setIsNewBannerModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            + Tạo Banner đầu tiên ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (7/12): DANH SÁCH BANNER THẬT TỪ DATABASE */}
          <div className="lg:col-span-7 space-y-4">
            {paginatedBanners.map((b) => {
              const isSelected = selectedBanner?.backendId === b.backendId;
              return (
                <div
                  key={b.backendId}
                  onClick={() => setSelectedBanner(b)}
                  className={`bg-white rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-gray-200/90 hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600" />
                  )}

                  <div className="p-4 pl-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-white">
                          {b.priorityLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {b.location}
                        </span>
                        {b.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Đang phát sóng (Active)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">
                            Tạm dừng
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBanner(b);
                          }}
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2.5 py-1 rounded-md hover:bg-emerald-50 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(b.backendId);
                          }}
                          className="text-gray-400 hover:text-rose-600 p-1 rounded transition"
                          title="Xóa banner khỏi DB"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image Thumbnail */}
                    <div className="relative rounded-lg overflow-hidden h-36 bg-slate-900 border border-gray-100">
                      <img
                        src={getFullImageUrl(b.image)}
                        alt={b.title}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-gray-200">
                        {b.dimensions}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 text-white">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                          {b.tagline}
                        </div>
                        <div className="text-sm font-extrabold line-clamp-1">{b.title}</div>
                      </div>
                    </div>

                    {/* Sub Details */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{b.title}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 font-mono text-[11px]">vị trí: {b.locationPath}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Mã ID DB: #{b.backendId} • Thứ tự ưu tiên: {b.priority}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Phân trang Banners */}
            <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
              <div className="flex items-center gap-2">
                <span>Hiển thị</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 font-semibold focus:outline-none"
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
                <span>
                  từ <strong className="text-gray-800">{filteredBanners.length > 0 ? startIndex + 1 : 0}</strong> -{' '}
                  <strong className="text-gray-800">{endIndex}</strong> trên tổng số{' '}
                  <strong className="text-gray-800">{filteredBanners.length}</strong> banner
                </span>
              </div>

              <div className="flex items-center gap-1 font-semibold text-gray-600">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  |&lt;
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-0.5 rounded transition ${
                      currentPage === page
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'border border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  &gt;
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  &gt;|
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (5/12): CẤU HÌNH & CHỈNH SỬA REAL-TIME */}
          {formData && (
            <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/90 shadow-2xs p-5 sticky top-20">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Cấu hình &amp; Chỉnh sửa Banner nhanh
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                  ID: #{formData.backendId}
                </span>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                {/* Live Preview Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      MÔ PHỎNG HIỂN THỊ STOREFRONT
                    </span>
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setDevicePreview('desktop')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
                          devicePreview === 'desktop'
                            ? 'bg-white text-emerald-800 shadow-2xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDevicePreview('mobile')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
                          devicePreview === 'mobile'
                            ? 'bg-white text-emerald-800 shadow-2xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className={`mx-auto rounded-xl border border-gray-300 overflow-hidden bg-slate-900 shadow-sm transition-all duration-300 ${
                      devicePreview === 'mobile' ? 'max-w-[280px]' : 'w-full'
                    }`}
                  >
                    <div className="bg-slate-800 px-3 py-1.5 flex items-center gap-2 border-b border-slate-700">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-[10px] font-mono text-gray-400">
                          qlshop.vn ({formData.location})
                        </span>
                      </div>
                    </div>

                    <div className="relative h-44 overflow-hidden group">
                      <img
                        src={getFullImageUrl(formData.image)}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex flex-col justify-center p-4 text-white">
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-black uppercase w-max tracking-wide mb-1">
                          {formData.tagline || 'HOT DEAL'}
                        </span>
                        <h3 className="text-sm font-black leading-tight line-clamp-2 max-w-[80%]">
                          {formData.title}
                        </h3>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition shadow flex items-center gap-1"
                          >
                            <span>Khám phá ngay</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tiêu đề Banner &amp; Chiến dịch *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-emerald-600 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <ImagePicker
                    label="Hình ảnh Banner quảng cáo *"
                    value={formData.image}
                    onChange={(val) => setFormData({ ...formData, image: val })}
                    folder="banners"
                    previewHeight="h-36"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Đường dẫn liên kết (Target URL)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.targetUrl}
                      onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                      className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-emerald-600 font-mono text-slate-800"
                    />
                    <Link2 className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Vị trí phát sóng
                    </label>
                    <select
                      value={formData.locationKey}
                      onChange={(e) => setFormData({ ...formData, locationKey: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-emerald-600 font-medium text-slate-800 bg-white"
                    >
                      <option value="HERO">Hero Slider Trang chủ</option>
                      <option value="CATEGORY">Banner Danh mục</option>
                      <option value="POPUP">Pop-up Toàn sàn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Thứ tự hiển thị (Order)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-emerald-600 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Instant Live Toggle */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Kích hoạt hiển thị tức thì
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Bật để banner xuất hiện ngay lập tức trên storefront khách hàng
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      formData.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        formData.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">Cập nhật vào cơ sở dữ liệu thành công!</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className="flex-1 py-2 px-3 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs transition text-center"
                  >
                    {formData.status === 'ACTIVE' ? 'Tạm dừng chiến dịch' : 'Kích hoạt chiến dịch'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu vào DB...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Lưu cập nhật</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          5. MODAL: TẠO BANNER MỚI VÀO DATABASE THẬT
          ========================================================================= */}
      {isNewBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">
                  Thêm mới Banner Tiếp thị (Lưu vào DB)
                </h3>
              </div>
              <button
                onClick={() => setIsNewBannerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tiêu đề Banner &amp; Chiến dịch *
                </label>
                <input
                  type="text"
                  required
                  value={newBannerData.title}
                  onChange={(e) =>
                    setNewBannerData({ ...newBannerData, title: e.target.value })
                  }
                  placeholder="VD: BST Áo Sơ Mi Thu Đông 2026"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Vị trí hiển thị
                  </label>
                  <select
                    value={newBannerData.position}
                    onChange={(e) =>
                      setNewBannerData({ ...newBannerData, position: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white"
                  >
                    <option value="HERO">Hero Slider Trang chủ</option>
                    <option value="CATEGORY">Banner Danh mục / Ngành hàng</option>
                    <option value="POPUP">Pop-up Khuyến mãi Toàn sàn</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Thứ tự hiển thị (Order)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newBannerData.displayOrder}
                    onChange={(e) =>
                      setNewBannerData({ ...newBannerData, displayOrder: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <ImagePicker
                  label="Hình ảnh Banner quảng cáo *"
                  value={newBannerData.image}
                  onChange={(val) => setNewBannerData({ ...newBannerData, image: val })}
                  folder="banners"
                  previewHeight="h-36"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Đường dẫn liên kết (Target URL)
                </label>
                <input
                  type="text"
                  value={newBannerData.linkUrl}
                  onChange={(e) =>
                    setNewBannerData({ ...newBannerData, linkUrl: e.target.value })
                  }
                  placeholder="https://novacommerce.vn/sale"
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Mô tả / Tagline
                </label>
                <input
                  type="text"
                  value={newBannerData.description}
                  onChange={(e) =>
                    setNewBannerData({ ...newBannerData, description: e.target.value })
                  }
                  placeholder="VD: HOT DEAL GIẢM 50%"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsNewBannerModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-bold text-xs text-white"
                >
                  Lưu vào Cơ sở Dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
