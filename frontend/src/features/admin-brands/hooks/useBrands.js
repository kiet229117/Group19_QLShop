import { useState, useEffect, useCallback } from 'react';
import brandService from '../services/brandService';
import productService from '../../admin-products/services/productService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function useBrands() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // New Brand Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newBrandData, setNewBrandData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
  });

  // Tải thương hiệu từ API (GET /api/brands)
  const fetchBrands = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [brandRes, prodRes] = await Promise.all([
        brandService.getAllBrands(0, 100),
        productService.getAllProducts(0, 100).catch(() => ({ content: [] })),
      ]);

      const brandList = brandRes?.content || (Array.isArray(brandRes) ? brandRes : []);
      const prodList = prodRes?.content || (Array.isArray(prodRes) ? prodRes : []);

      setBrands(brandList);
      setProducts(prodList);

      if (brandList.length > 0) {
        setSelectedBrand((prev) => {
          if (!prev) return brandList[0];
          const found = brandList.find((b) => b.id === prev.id);
          return found || brandList[0];
        });
      } else {
        setSelectedBrand(null);
      }
    } catch (err) {
      console.error('Lỗi khi tải thương hiệu từ backend:', err);
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi tải danh sách thương hiệu'));
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands(false);
  }, [fetchBrands]);

  // Cập nhật editFormData khi selectedBrand thay đổi
  useEffect(() => {
    if (selectedBrand) {
      setEditFormData({
        name: selectedBrand.name || '',
        slug: selectedBrand.slug || '',
        description: selectedBrand.description || '',
        logo: selectedBrand.logo || '',
      });
    }
  }, [selectedBrand]);

  // Tự động tạo slug khi nhập tên
  const handleNameChange = (name, isNew = false) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    if (isNew) {
      setNewBrandData((prev) => ({ ...prev, name, slug }));
    } else {
      setEditFormData((prev) => ({ ...prev, name, slug }));
    }
  };

  // Lưu chỉnh sửa thương hiệu (PUT /api/brands/{id})
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedBrand || !editFormData.name.trim()) return;

    setSavingEdit(true);
    try {
      await brandService.updateBrand(selectedBrand.id, {
        name: editFormData.name.trim(),
        slug: editFormData.slug.trim(),
        description: editFormData.description.trim(),
        logo: editFormData.logo.trim(),
      });

      toast.success(`Đã cập nhật thương hiệu "${editFormData.name}" thành công!`);
      await fetchBrands(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi cập nhật thương hiệu'));
    } finally {
      setSavingEdit(false);
    }
  };

  // Tạo mới thương hiệu (POST /api/brands)
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!newBrandData.name.trim()) {
      toast.warning('Vui lòng nhập tên thương hiệu thời trang!');
      return;
    }

    setCreating(true);
    try {
      await brandService.addBrand({
        name: newBrandData.name.trim(),
        slug: newBrandData.slug.trim(),
        description: newBrandData.description.trim(),
        logo: newBrandData.logo.trim(),
      });

      toast.success(`Đã thêm thương hiệu "${newBrandData.name}" thành công!`);
      setIsNewModalOpen(false);
      setNewBrandData({
        name: '',
        slug: '',
        description: '',
        logo: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      });
      await fetchBrands(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi tạo mới thương hiệu'));
    } finally {
      setCreating(false);
    }
  };

  // Xóa thương hiệu (DELETE /api/brands/{id})
  const handleDeleteBrand = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${name}" (ID #${id}) khỏi hệ thống?`)) {
      return;
    }

    try {
      await brandService.deleteBrand(id);
      toast.success(`Đã xóa thương hiệu "${name}" thành công!`);
      await fetchBrands(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể xóa thương hiệu này'));
    }
  };

  // Đếm số lượng sản phẩm áo thuộc thương hiệu
  const getProductCountForBrand = (brandId) => {
    return products.filter((p) => String(p.brandId) === String(brandId)).length;
  };

  const filteredBrands = brands.filter((b) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (b.name || '').toLowerCase().includes(term) || (b.slug || '').toLowerCase().includes(term);
  });

  return {
    brands,
    products,
    loading,
    selectedBrand,
    setSelectedBrand,
    searchTerm,
    setSearchTerm,
    editFormData,
    setEditFormData,
    savingEdit,
    isNewModalOpen,
    setIsNewModalOpen,
    creating,
    newBrandData,
    setNewBrandData,
    fetchBrands,
    handleNameChange,
    handleSaveEdit,
    handleCreateBrand,
    handleDeleteBrand,
    getProductCountForBrand,
    filteredBrands
  };
}

