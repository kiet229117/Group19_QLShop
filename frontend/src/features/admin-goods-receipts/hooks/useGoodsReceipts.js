import { useState, useEffect, useCallback, useMemo } from 'react';
import goodsReceiptService from '../services/goodsReceiptService';
import supplierService from '../../admin-suppliers/services/supplierService';
import productService from '../../admin-products/services/productService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function useGoodsReceipts(itemsPerPage = 6) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReceiptId, setExpandedReceiptId] = useState(null);

  // Metadata cho tạo phiếu nhập mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form tạo phiếu
  const [newReceiptForm, setNewReceiptForm] = useState({
    supplierId: '',
    note: '',
    items: [
      { productId: '', variantId: '', quantity: 50, importPrice: 120000 }
    ]
  });

  // 1. Tải danh sách phiếu nhập kho từ API (100% Backend Data)
  const fetchReceipts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const data = await goodsReceiptService.getAllReceipts();
      const apiList = Array.isArray(data) ? data : (data.content || []);
      setReceipts(apiList);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phiếu nhập kho từ API:', err);
      toast.error(getFriendlyErrorMessage(err, 'Không thể tải danh sách phiếu nhập kho'));
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // 2. Mở Modal tạo phiếu & tải suppliers + products
  const handleOpenCreateModal = async () => {
    setIsModalOpen(true);
    try {
      const [supRes, prodRes] = await Promise.all([
        supplierService.getAllSuppliers().catch(() => []),
        productService.getAllProducts(0, 50).catch(() => ({ content: [] }))
      ]);

      const supList = Array.isArray(supRes) ? supRes : (supRes.content || []);
      const prodList = prodRes.content || (Array.isArray(prodRes) ? prodRes : []);

      setSuppliers(supList);
      setProducts(prodList);

      if (supList.length > 0 && !newReceiptForm.supplierId) {
        const firstProd = prodList.length > 0 ? prodList[0] : null;
        const firstVariant = firstProd?.variants?.[0] || null;

        setNewReceiptForm(prev => ({
          ...prev,
          supplierId: supList[0].id,
          items: [
            {
              productId: firstProd ? firstProd.id : '',
              variantId: firstVariant ? firstVariant.id : '',
              quantity: 50,
              importPrice: firstVariant?.costPrice || 120000
            }
          ]
        }));
      }
    } catch (err) {
      console.error('Error loading metadata for receipt:', err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedReceiptId(prev => (prev === id ? null : id));
  };

  // Thêm dòng sản phẩm
  const handleAddItemRow = () => {
    const firstProd = products.length > 0 ? products[0] : null;
    const firstVariant = firstProd?.variants?.[0] || null;

    setNewReceiptForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: firstProd ? firstProd.id : '',
          variantId: firstVariant ? firstVariant.id : '',
          quantity: 20,
          importPrice: firstVariant?.costPrice || 100000
        }
      ]
    }));
  };

  // Xóa dòng sản phẩm
  const handleRemoveItemRow = (index) => {
    if (newReceiptForm.items.length <= 1) return;
    setNewReceiptForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Sửa thuộc tính 1 dòng
  const handleItemChange = (index, field, value) => {
    setNewReceiptForm(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };

      if (field === 'productId') {
        const selProd = products.find(p => String(p.id) === String(value));
        const firstVar = selProd?.variants?.[0];
        updated[index].variantId = firstVar ? firstVar.id : '';
        if (firstVar?.costPrice) {
          updated[index].importPrice = firstVar.costPrice;
        }
      } else if (field === 'variantId') {
        const selProd = products.find(p => String(p.id) === String(updated[index].productId));
        const selVar = selProd?.variants?.find(v => String(v.id) === String(value));
        if (selVar?.costPrice) {
          updated[index].importPrice = selVar.costPrice;
        }
      }

      return { ...prev, items: updated };
    });
  };

  // Submit tạo phiếu nhập mới
  const handleCreateReceipt = async (e) => {
    e.preventDefault();
    if (!newReceiptForm.supplierId) {
      toast.error('Vui lòng chọn Nhà cung cấp xưởng may!');
      return;
    }

    setSubmitting(true);
    try {
      const itemDetails = newReceiptForm.items.map(it => ({
        productId: Number(it.productId) || 1,
        variantId: it.variantId ? Number(it.variantId) : null,
        quantity: Number(it.quantity) || 1,
        importPrice: Number(it.importPrice) || 100000
      }));

      const payload = {
        supplierId: Number(newReceiptForm.supplierId),
        note: newReceiptForm.note || 'Nhập lô hàng áo mới',
        items: itemDetails,
        details: itemDetails
      };

      await goodsReceiptService.createReceipt(payload);
      toast.success('Đã tạo thành công phiếu nhập kho mới (DRAFT)!');
      setIsModalOpen(false);
      fetchReceipts(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể tạo phiếu nhập kho'));
    } finally {
      setSubmitting(false);
    }
  };

  // Hoàn tất nhập kho (cộng dồn tồn kho DB)
  const handleCompleteReceipt = async (receiptId) => {
    try {
      await goodsReceiptService.completeReceipt(receiptId);
      toast.success(`Đã hoàn tất nhập kho phiếu #${receiptId}! Tồn kho các mẫu áo đã được cộng dồn.`);
      fetchReceipts(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể duyệt hoàn tất phiếu nhập'));
    }
  };

  // Hủy phiếu nhập kho
  const handleCancelReceipt = async (receiptId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy phiếu nhập kho #${receiptId}?`)) return;
    try {
      await goodsReceiptService.cancelReceipt(receiptId);
      toast.success(`Đã hủy phiếu nhập kho #${receiptId}!`);
      fetchReceipts(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể hủy phiếu nhập'));
    }
  };

  // Lọc danh sách
  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      const codeMatch = (r.receiptCode || `PNK-${r.id}`).toLowerCase().includes(searchTerm.toLowerCase());
      const supMatch = (r.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const noteMatch = (r.note || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = codeMatch || supMatch || noteMatch;

      if (statusFilter === 'ALL') return matchesSearch;
      return matchesSearch && r.status === statusFilter;
    });
  }, [receipts, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    return filteredReceipts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredReceipts, currentPage, itemsPerPage]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const totalImportVal = receipts.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
    const pendingCount = receipts.filter(r => r.status === 'DRAFT' || r.status === 'PENDING').length;
    const completedCount = receipts.filter(r => r.status === 'COMPLETED').length;
    return { totalImportVal, pendingCount, completedCount };
  }, [receipts]);

  return {
    receipts,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    expandedReceiptId,
    setExpandedReceiptId,
    toggleExpand,
    isModalOpen,
    setIsModalOpen,
    suppliers,
    products,
    submitting,
    newReceiptForm,
    setNewReceiptForm,
    fetchReceipts,
    handleOpenCreateModal,
    handleAddItemRow,
    handleRemoveItemRow,
    handleItemChange,
    handleCreateReceipt,
    handleCompleteReceipt,
    handleCancelReceipt,
    filteredReceipts,
    totalPages,
    currentItems,
    stats
  };
}

