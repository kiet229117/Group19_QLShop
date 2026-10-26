import { useState, useEffect, useCallback, useMemo } from 'react';
import productService from '../services/productService';
import categoryService from '../../admin-categories/services/categoryService';
import brandService from '../../admin-brands/services/brandService';
import goodsReceiptService from '../../admin-goods-receipts/services/goodsReceiptService';
import supplierService from '../../admin-suppliers/services/supplierService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded Product ID for variants accordion
  const [expandedId, setExpandedId] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  const [priceFilter, setPriceFilter] = useState('ALL'); // ALL, UNDER_300K, 300K_700K, OVER_700K

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importingProduct, setImportingProduct] = useState(null);
  const [importForm, setImportForm] = useState({
    supplierId: '',
    note: '',
    items: [],
  });
  const [submitting, setSubmitting] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    costPrice: '',
    description: '',
    categoryId: '',
    brandId: '',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    isHot: false,
    initialVariants: [
      { color: 'Trắng', size: 'M', stockQuantity: 50, costPrice: 120000 },
      { color: 'Trắng', size: 'L', stockQuantity: 50, costPrice: 120000 },
      { color: 'Đen', size: 'M', stockQuantity: 50, costPrice: 120000 },
      { color: 'Đen', size: 'L', stockQuantity: 50, costPrice: 120000 },
    ]
  });

  // Tải danh mục, thương hiệu và nhà cung cấp
  const fetchMetadata = useCallback(async () => {
    try {
      const [catsRes, brandsRes, supRes] = await Promise.all([
        categoryService.getAllCategories(0, 100).catch(() => ({ content: [] })),
        brandService.getAllBrands(0, 100).catch(() => ({ content: [] })),
        supplierService.getAllSuppliers().catch(() => []),
      ]);
      const catList = catsRes?.content || (Array.isArray(catsRes) ? catsRes : []);
      const brandList = brandsRes?.content || (Array.isArray(brandsRes) ? brandsRes : []);
      const supList = Array.isArray(supRes) ? supRes : (supRes?.content || []);
      setCategories(catList);
      setBrands(brandList);
      setSuppliers(supList);
    } catch (err) {
      console.warn('Lỗi tải danh mục / thương hiệu:', err);
    }
  }, []);

  // Tải danh sách sản phẩm từ backend API (GET /api/products)
  const fetchProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await productService.getAllProducts(0, 100);
      const rawList = res?.content || (Array.isArray(res) ? res : []);
      setProducts(rawList);
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm từ API:', err);
      toast.error(getFriendlyErrorMessage(err, 'Không thể tải danh sách sản phẩm từ máy chủ'));
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    fetchProducts(false);
  }, [fetchMetadata, fetchProducts]);

  // Tạo map tra cứu nhanh danh mục và thương hiệu
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => { map[c.id] = c.name; });
    return map;
  }, [categories]);

  const brandMap = useMemo(() => {
    const map = {};
    brands.forEach((b) => { map[b.id] = b.name; });
    return map;
  }, [brands]);

  // Thống kê động từ cơ sở dữ liệu thật (Tính cả sản phẩm hết sạch 0 chiếc và sản phẩm có phân loại Size/Màu bị tạm hết hàng)
  const stats = useMemo(() => {
    let totalSkus = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let partialOutOfStockCount = 0;

    products.forEach((p) => {
      const variants = p.variants || [];
      totalSkus += variants.length;
      const totalStock = variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
      const hasZeroSku = variants.some((v) => (Number(v.stockQuantity) || 0) <= 0);

      if (totalStock <= 0) {
        outOfStockCount++;
      } else {
        if (hasZeroSku) partialOutOfStockCount++;
        if (totalStock < 20 || hasZeroSku) lowStockCount++;
      }
    });

    return {
      totalProducts: products.length,
      totalSkus,
      lowStockCount,
      outOfStockCount,
      partialOutOfStockCount,
      avgVariantsPerProduct: products.length > 0 ? (totalSkus / products.length).toFixed(1) : 0,
    };
  }, [products]);

  // Bộ lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Tìm kiếm theo tên hoặc slug
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(term);
        const matchSlug = (p.slug || '').toLowerCase().includes(term);
        if (!matchName && !matchSlug) return false;
      }

      // Lọc danh mục
      if (categoryFilter !== 'ALL' && String(p.categoryId) !== String(categoryFilter)) {
        return false;
      }

      // Lọc thương hiệu
      if (brandFilter !== 'ALL' && String(p.brandId) !== String(brandFilter)) {
        return false;
      }

      // Lọc tồn kho (Khớp chính xác với trạng thái hiển thị ở Client)
      const variants = p.variants || [];
      const totalStock = variants.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
      const hasZeroSku = variants.some((v) => (Number(v.stockQuantity) || 0) <= 0);

      if (stockFilter === 'IN_STOCK' && (totalStock <= 0 || hasZeroSku)) return false;
      if (stockFilter === 'LOW_STOCK' && (totalStock <= 0 || (totalStock >= 20 && !hasZeroSku))) return false;
      if (stockFilter === 'OUT_OF_STOCK' && totalStock > 0 && !hasZeroSku) return false;

      // Lọc khoảng giá
      const price = p.productPrice?.salePrice || p.price || 0;
      if (priceFilter === 'UNDER_300K' && price >= 300000) return false;
      if (priceFilter === '300K_700K' && (price < 300000 || price > 700000)) return false;
      if (priceFilter === 'OVER_700K' && price <= 700000) return false;

      return true;
    });
  }, [products, searchTerm, categoryFilter, brandFilter, stockFilter, priceFilter]);

  // Reset về trang 1 khi lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, brandFilter, stockFilter, priceFilter, pageSize]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Format tiền tệ VNĐ
  const formatMoney = (amount) => {
    if (!amount && amount !== 0) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Xác định màu sắc chấm biểu tượng theo tên màu áo
  const getColorDotClass = (colorName) => {
    const c = (colorName || '').toLowerCase();
    if (c.includes('trắng') || c.includes('white')) return 'bg-white border-gray-300';
    if (c.includes('đen') || c.includes('black')) return 'bg-black border-black';
    if (c.includes('navy') || c.includes('xanh đen')) return 'bg-[#1b2a47] border-[#1b2a47]';
    if (c.includes('xanh') || c.includes('blue')) return 'bg-blue-600 border-blue-600';
    if (c.includes('đỏ') || c.includes('red')) return 'bg-rose-600 border-rose-600';
    if (c.includes('xám') || c.includes('gray') || c.includes('grey')) return 'bg-gray-500 border-gray-500';
    if (c.includes('be') || c.includes('beige') || c.includes('kem')) return 'bg-[#e8dec8] border-[#d8ceb8]';
    if (c.includes('vàng') || c.includes('yellow')) return 'bg-amber-400 border-amber-400';
    if (c.includes('hồng') || c.includes('pink')) return 'bg-pink-400 border-pink-400';
    if (c.includes('rêu') || c.includes('olive') || c.includes('green')) return 'bg-emerald-700 border-emerald-700';
    return 'bg-emerald-500 border-emerald-500';
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm áo "${name}" (ID #${id}) khỏi hệ thống?`)) {
      return;
    }
    try {
      await productService.deleteProduct(id);
      toast.success(`Đã xóa thành công sản phẩm "${name}"!`);
      await fetchProducts(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi xóa sản phẩm áo'));
    }
  };

  // Mở modal sửa sản phẩm (Bao gồm cả danh sách phân loại Size / Màu & Số lượng tồn kho)
  const handleOpenEdit = (p) => {
    const currentVariants =
      Array.isArray(p.variants) && p.variants.length > 0
        ? p.variants.map((v) => ({
            id: v.id,
            color: v.color || 'Đen',
            size: v.size || 'L',
            stockQuantity: Number(v.stockQuantity) || 0,
            costPrice: Number(v.costPrice ?? p.costPrice ?? (p.price || 0) * 0.6),
          }))
        : [
            { color: 'Trắng', size: 'M', stockQuantity: 50, costPrice: Number(p.costPrice) || 120000 },
            { color: 'Trắng', size: 'L', stockQuantity: 50, costPrice: Number(p.costPrice) || 120000 },
            { color: 'Đen', size: 'M', stockQuantity: 50, costPrice: Number(p.costPrice) || 120000 },
            { color: 'Đen', size: 'L', stockQuantity: 50, costPrice: Number(p.costPrice) || 120000 },
          ];

    setEditingProduct({
      id: p.id,
      slug: p.slug || '',
      rating: p.rating ?? 4.8,
      name: p.name || '',
      price: p.price || 0,
      costPrice: p.costPrice || 0,
      description: p.description || '',
      categoryId: p.categoryId || (categories[0]?.id || 1),
      brandId: p.brandId || (brands[0]?.id || 1),
      image: p.image || p.primaryImage || '',
      isHot: p.hot || false,
      variants: currentVariants,
    });
    setIsEditModalOpen(true);
  };

  // Mở Modal Nhập Kho (Goods Receipt) cho sản phẩm hoặc biến thể cụ thể
  const handleOpenImportModal = async (product, targetVariant = null) => {
    if (!product) return;
    setImportingProduct(product);

    let supList = suppliers;
    if (!supList || supList.length === 0) {
      try {
        const res = await supplierService.getAllSuppliers();
        supList = Array.isArray(res) ? res : (res?.content || []);
        setSuppliers(supList);
      } catch {
        supList = [];
      }
    }

    const defaultSupplierId = supList[0]?.id || 1;
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const hasAnyZero = variants.some((v) => (Number(v.stockQuantity) || 0) <= 0);

    const items = variants.map((v) => {
      const currentStock = Number(v.stockQuantity) || 0;
      const isTarget = targetVariant && String(v.id) === String(targetVariant.id);
      const shouldPreFill = isTarget || (!targetVariant && (hasAnyZero ? currentStock <= 0 : true));
      return {
        variantId: v.id,
        color: v.color || 'Tiêu chuẩn',
        size: v.size || 'FreeSize',
        currentStock,
        quantity: shouldPreFill ? 50 : 0,
        importPrice: Number(v.costPrice ?? product.costPrice ?? (product.price || 0) * 0.6) || 120000,
      };
    });

    setImportForm({
      supplierId: defaultSupplierId,
      note: targetVariant
        ? `Nhập kho bổ sung ${product.name} (${targetVariant.color} - Size ${targetVariant.size})`
        : `Nhập kho bổ sung ${product.name}`,
      items,
    });
    setIsImportModalOpen(true);
  };

  // Xác nhận lập phiếu nhập kho (POST /api/goods-receipts + POST /api/goods-receipts/{id}/complete)
  const handleConfirmImportReceipt = async (e, autoComplete = true) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!importingProduct) return;

    const validItems = (importForm.items || []).filter((it) => (Number(it.quantity) || 0) > 0);
    if (validItems.length === 0) {
      toast.warning('Vui lòng nhập số lượng (> 0) cho ít nhất 1 phân loại Màu/Size cần nhập kho!');
      return;
    }

    setSubmitting(true);
    try {
      const itemDetails = validItems.map((it) => ({
        productId: Number(importingProduct.id),
        variantId: it.variantId ? Number(it.variantId) : null,
        quantity: Number(it.quantity),
        importPrice: Number(it.importPrice) || 100000,
      }));

      const payload = {
        supplierId: Number(importForm.supplierId) || 1,
        note: importForm.note || `Nhập kho bổ sung sản phẩm ${importingProduct.name}`,
        items: itemDetails,
        details: itemDetails,
      };

      const createdReceipt = await goodsReceiptService.createReceipt(payload);
      if (autoComplete && createdReceipt?.id) {
        await goodsReceiptService.completeReceipt(createdReceipt.id);
        const totalAdded = validItems.reduce((sum, it) => sum + Number(it.quantity), 0);
        toast.success(
          `Đã nhập kho thành công (+${totalAdded} chiếc) qua phiếu ${createdReceipt.receiptCode || `#${createdReceipt.id}`}!`
        );
      } else {
        toast.success(
          `Đã tạo phiếu nhập kho nháp ${createdReceipt?.receiptCode || ''} (Chờ duyệt tại mục Nhập kho)!`
        );
      }

      setIsImportModalOpen(false);
      setImportingProduct(null);
      await fetchProducts(true);
      window.dispatchEvent(
        new CustomEvent('qlshop:products-updated', { detail: { productId: importingProduct.id } })
      );
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể thực hiện nhập kho cho sản phẩm'));
    } finally {
      setSubmitting(false);
    }
  };

  // Lưu sửa sản phẩm kèm số lượng tồn kho các biến thể (PUT /api/products/{id})
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmitting(true);
    try {
      const payload = {
        name: editingProduct.name,
        slug: editingProduct.slug,
        rating: editingProduct.rating ?? 4.8,
        price: parseFloat(editingProduct.price) || 0,
        costPrice: parseFloat(editingProduct.costPrice) || 0,
        description: editingProduct.description,
        categoryId: parseInt(editingProduct.categoryId) || categories[0]?.id || 1,
        brandId: parseInt(editingProduct.brandId) || brands[0]?.id || 1,
        isHot: editingProduct.isHot,
        image: editingProduct.image,
        variants: (editingProduct.variants || []).map((v) => ({
          id: v.id || null,
          color: (v.color || 'Đen').trim(),
          size: (v.size || 'L').trim(),
          stockQuantity: Math.max(0, parseInt(v.stockQuantity, 10) || 0),
          costPrice: parseFloat(v.costPrice) || parseFloat(editingProduct.costPrice) || 0,
        })),
      };

      await productService.updateProduct(editingProduct.id, payload);
      toast.success(`Đã cập nhật sản phẩm "${editingProduct.name}" và số lượng tồn kho thành công!`);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      await fetchProducts(true);
      window.dispatchEvent(
        new CustomEvent('qlshop:products-updated', { detail: { productId: editingProduct.id } })
      );
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi cập nhật sản phẩm'));
    } finally {
      setSubmitting(false);
    }
  };

  // Tạo sản phẩm mới (POST /api/products)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.warning('Vui lòng nhập tên áo và giá bán niêm yết!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: newProduct.name,
        price: parseFloat(newProduct.price) || 0,
        costPrice: parseFloat(newProduct.costPrice) || 0,
        description: newProduct.description,
        categoryId: parseInt(newProduct.categoryId) || (categories[0]?.id || 1),
        brandId: parseInt(newProduct.brandId) || (brands[0]?.id || 1),
        image: newProduct.image,
        isHot: newProduct.isHot,
        variants: newProduct.initialVariants.map(v => ({
          color: v.color,
          size: v.size,
          stockQuantity: parseInt(v.stockQuantity) || 0,
          costPrice: parseFloat(v.costPrice) || 0
        }))
      };

      await productService.addProduct(payload);
      toast.success(`Đã thêm mới thành công sản phẩm áo "${newProduct.name}"!`);
      setIsCreateModalOpen(false);
      setNewProduct({
        name: '',
        price: '',
        costPrice: '',
        description: '',
        categoryId: categories[0]?.id || 1,
        brandId: brands[0]?.id || 1,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
        isHot: false,
        initialVariants: [
          { color: 'Trắng', size: 'M', stockQuantity: 50, costPrice: 120000 },
          { color: 'Trắng', size: 'L', stockQuantity: 50, costPrice: 120000 },
          { color: 'Đen', size: 'M', stockQuantity: 50, costPrice: 120000 },
          { color: 'Đen', size: 'L', stockQuantity: 50, costPrice: 120000 },
        ]
      });
      await fetchProducts(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi thêm mới sản phẩm'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    products,
    categories,
    brands,
    loading,
    expandedId,
    setExpandedId,
    toggleExpand,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    stockFilter,
    setStockFilter,
    priceFilter,
    setPriceFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editingProduct,
    setEditingProduct,
    submitting,
    newProduct,
    setNewProduct,
    fetchProducts,
    fetchMetadata,
    categoryMap,
    brandMap,
    stats,
    filteredProducts,
    totalPages,
    startIndex,
    endIndex,
    paginatedProducts,
    formatMoney,
    getColorDotClass,
    handleDeleteProduct,
    handleOpenEdit,
    handleSaveEdit,
    handleCreateProduct,
    suppliers,
    isImportModalOpen,
    setIsImportModalOpen,
    importingProduct,
    setImportingProduct,
    importForm,
    setImportForm,
    handleOpenImportModal,
    handleConfirmImportReceipt,
  };
}

