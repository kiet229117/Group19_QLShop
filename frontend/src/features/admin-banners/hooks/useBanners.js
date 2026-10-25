import { useState, useEffect, useCallback } from 'react';
import bannerService from '../services/bannerService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function useBanners() {
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

  return {
    banners,
    selectedBanner,
    setSelectedBanner,
    formData,
    setFormData,
    loading,
    isSaving,
    saveSuccess,
    errorMessage,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    devicePreview,
    setDevicePreview,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    isNewBannerModalOpen,
    setIsNewBannerModalOpen,
    newBannerData,
    setNewBannerData,
    fetchBanners,
    filteredBanners,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    endIndex,
    paginatedBanners,
    handleSave,
    handleToggleStatus,
    handleDelete,
    handleCreateBanner,
    activeCount,
    heroCount,
    categoryCount,
    popupCount
  };
}

