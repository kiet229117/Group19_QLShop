import { useState, useEffect, useCallback, useMemo } from 'react';
import voucherService from '../services/voucherService';
import productService from '../../admin-products/services/productService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

const initialFormData = {
  code: '',
  name: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: 10,
  maxDiscountAmount: 50000,
  minOrderValue: 200000,
  startDate: new Date().toISOString().slice(0, 16),
  endDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 16),
  usageLimit: 100,
  active: true,
  productId: '',
};

export default function useVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, PERCENTAGE, FIXED_AMOUNT
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, EXPIRED

  // Modal Tạo Voucher Mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // 1. Tải danh sách Voucher từ Backend (GET /api/vouchers)
  const fetchVouchers = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await voucherService.getAllVouchers(0, 100);
      const list = res?.content || (Array.isArray(res) ? res : []);
      setVouchers(list);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể tải danh sách voucher'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
    productService.getAllProducts(0, 100)
      .then((res) => {
        const list = res?.content || (Array.isArray(res) ? res : []);
        setProducts(list);
      })
      .catch(() => {});
  }, [fetchVouchers]);

  // 2. Submit Tạo Voucher mới (POST /api/vouchers)
  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã Voucher!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim() || 'Ưu đãi mua sắm thời trang',
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscountAmount: formData.discountType === 'PERCENTAGE' && formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        minOrderValue: Number(formData.minOrderValue) || 0,
        startDate: formData.startDate ? `${formData.startDate}:00` : new Date().toISOString(),
        endDate: formData.endDate ? `${formData.endDate}:00` : new Date().toISOString(),
        usageLimit: Number(formData.usageLimit) || 100,
        active: Boolean(formData.active),
        productId: formData.productId ? Number(formData.productId) : null
      };

      await voucherService.createVoucher(payload);
      toast.success(`Đã phát hành mã giảm giá ${payload.code} thành công!`);
      setIsModalOpen(false);
      fetchVouchers(true);
      setFormData(initialFormData);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể tạo mã voucher mới'));
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Xóa Voucher (DELETE /api/vouchers/{id})
  const handleDeleteVoucher = async (voucherId, code) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mã giảm giá "${code}"?`)) return;
    try {
      await voucherService.deleteVoucher(voucherId);
      toast.success(`Đã xóa voucher "${code}"!`);
      setVouchers(prev => prev.filter(v => v.id !== voucherId));
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể xóa voucher'));
    }
  };

  // 4. Sao chép mã
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã "${code}" vào bộ nhớ tạm!`);
  };

  // 5. Lọc danh sách Voucher
  const filteredVouchers = useMemo(() => {
    const now = new Date();
    return vouchers.filter(v => {
      if (typeFilter !== 'ALL' && v.discountType !== typeFilter) return false;
      if (statusFilter === 'ACTIVE') {
        const isExpired = v.endDate && new Date(v.endDate) < now;
        if (!v.active || isExpired) return false;
      }
      if (statusFilter === 'EXPIRED') {
        const isExpired = v.endDate && new Date(v.endDate) < now;
        if (v.active && !isExpired) return false;
      }
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const codeMatch = (v.code || '').toLowerCase().includes(term);
      const nameMatch = (v.name || '').toLowerCase().includes(term);
      return codeMatch || nameMatch;
    });
  }, [vouchers, typeFilter, statusFilter, searchTerm]);

  // 6. Thống kê nhanh
  const stats = useMemo(() => {
    const total = vouchers.length;
    const now = new Date();
    const active = vouchers.filter(v => v.active && (!v.endDate || new Date(v.endDate) >= now)).length;
    const totalUsed = vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0);
    const percentageCount = vouchers.filter(v => v.discountType === 'PERCENTAGE').length;
    return { total, active, totalUsed, percentageCount };
  }, [vouchers]);

  return {
    vouchers,
    loading,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    setIsModalOpen,
    submitting,
    formData,
    setFormData,
    fetchVouchers,
    handleCreateVoucher,
    handleDeleteVoucher,
    handleCopyCode,
    filteredVouchers,
    stats,
    products
  };
}

