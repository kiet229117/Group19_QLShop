import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';
import productService from '../../admin-products/services/productService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    active: true,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // New Category Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCatData, setNewCatData] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    active: true,
  });

  // Tải danh mục từ backend API (GET /api/categories)
  const fetchCategories = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        categoryService.getAllCategories(0, 100),
        productService.getAllProducts(0, 100).catch(() => ({ content: [] })),
      ]);

      const catList = catRes?.content || (Array.isArray(catRes) ? catRes : []);
      const prodList = prodRes?.content || (Array.isArray(prodRes) ? prodRes : []);

      setCategories(catList);
      setProducts(prodList);

      if (catList.length > 0) {
        setSelectedCategory((prev) => {
          if (!prev) return catList[0];
          const found = catList.find((c) => c.id === prev.id);
          return found || catList[0];
        });
      } else {
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh mục từ backend:', err);
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi tải danh mục sản phẩm'));
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  // Cập nhật editFormData khi selectedCategory thay đổi
  useEffect(() => {
    if (selectedCategory) {
      setEditFormData({
        name: selectedCategory.name || '',
        slug: selectedCategory.slug || '',
        description: selectedCategory.description || '',
        image: selectedCategory.image || '',
        active: selectedCategory.active !== false,
      });
    }
  }, [selectedCategory]);

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
      setNewCatData((prev) => ({ ...prev, name, slug }));
    } else {
      setEditFormData((prev) => ({ ...prev, name, slug }));
    }
  };

  // Lưu chỉnh sửa danh mục (PUT /api/categories/{id})
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !editFormData.name.trim()) return;

    setSavingEdit(true);
    try {
      await categoryService.updateCategory(selectedCategory.id, {
        name: editFormData.name.trim(),
        slug: editFormData.slug.trim(),
        description: editFormData.description.trim(),
        image: editFormData.image.trim(),
        active: editFormData.active,
      });

      toast.success(`Đã cập nhật danh mục "${editFormData.name}" thành công!`);
      await fetchCategories(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi cập nhật danh mục'));
    } finally {
      setSavingEdit(false);
    }
  };

  // Tạo mới danh mục (POST /api/categories)
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatData.name.trim()) {
      toast.warning('Vui lòng nhập tên danh mục áo!');
      return;
    }

    setCreating(true);
    try {
      await categoryService.addCategory({
        name: newCatData.name.trim(),
        slug: newCatData.slug.trim(),
        description: newCatData.description.trim(),
        image: newCatData.image.trim(),
        active: newCatData.active,
      });

      toast.success(`Đã tạo mới danh mục "${newCatData.name}" thành công!`);
      setIsNewModalOpen(false);
      setNewCatData({
        name: '',
        slug: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
        active: true,
      });
      await fetchCategories(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi tạo mới danh mục'));
    } finally {
      setCreating(false);
    }
  };

  // Xóa danh mục (DELETE /api/categories/{id})
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" (ID #${id}) khỏi hệ thống?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      toast.success(`Đã xóa danh mục "${name}" thành công!`);
      await fetchCategories(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể xóa danh mục áo'));
    }
  };

  // Đếm số lượng sản phẩm áo thuộc từng danh mục
  const getProductCountForCategory = (catId) => {
    return products.filter((p) => String(p.categoryId) === String(catId)).length;
  };

  return {
    categories,
    products,
    loading,
    selectedCategory,
    setSelectedCategory,
    editFormData,
    setEditFormData,
    savingEdit,
    isNewModalOpen,
    setIsNewModalOpen,
    creating,
    newCatData,
    setNewCatData,
    fetchCategories,
    handleNameChange,
    handleSaveEdit,
    handleCreateCategory,
    handleDeleteCategory,
    getProductCountForCategory
  };
}

