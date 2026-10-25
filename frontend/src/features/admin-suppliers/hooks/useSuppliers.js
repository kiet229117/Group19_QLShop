import { useState, useEffect, useCallback } from 'react';
import supplierService from '../services/supplierService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

// Danh sách xưởng may & NCC vải thời trang mẫu sẵn sàng khởi tạo
export const DEFAULT_APPAREL_SUPPLIERS = [
  {
    code: 'NCC-PHONGPHU-01',
    name: 'Công ty Cổ phần Dệt May Phong Phú',
    contactPerson: 'Trần Minh Đức (Giám đốc Sản xuất)',
    phone: '028.3896.3533',
    email: 'contact@phongphutex.com.vn',
    address: '48 Tăng Nhơn Phú, P. Tăng Nhơn Phú B, TP. Thủ Đức, TP. HCM',
    active: true
  },
  {
    code: 'NCC-MAY10-02',
    name: 'Tổng Công ty May 10 - CTCP',
    contactPerson: 'Nguyễn Thị Bích Ngọc (Trưởng phòng Cung ứng)',
    phone: '024.3827.6923',
    email: 'info@garco10.com.vn',
    address: 'Sài Đồng, Quận Long Biên, Hà Nội',
    active: true
  },
  {
    code: 'NCC-SONGHONG-03',
    name: 'Công ty Cổ phần May Sông Hồng',
    contactPerson: 'Phạm Quang Hiếu (Điều phối đơn hàng)',
    phone: '0228.3649.365',
    email: 'info@songhong.vn',
    address: '105 Nguyễn Đức Thuận, TP. Nam Định, Tỉnh Nam Định',
    active: true
  },
  {
    code: 'NCC-GIADINH-04',
    name: 'Công ty Cổ phần Dệt May Gia Định',
    contactPerson: 'Võ Thành Luân (Phụ trách Xưởng dệt)',
    phone: '028.3844.5388',
    email: 'giadinh@giditex.com.vn',
    address: '10-12-14-16 Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh',
    active: true
  }
];

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal tạo nhà cung cấp
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    active: true,
  });

  // Modal sửa nhà cung cấp
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    code: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    active: true,
  });

  // Tải danh sách nhà cung cấp (GET /api/suppliers)
  const fetchSuppliers = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const data = await supplierService.getAllSuppliers();
      const list = Array.isArray(data) ? data : [];
      setSuppliers(list);
      if (list.length > 0) {
        setSelectedSupplier((prev) => {
          if (!prev) return list[0];
          const found = list.find((s) => s.id === prev.id);
          return found || list[0];
        });
      } else {
        setSelectedSupplier(null);
      }
    } catch (err) {
      console.warn('Lỗi tải nhà cung cấp:', err);
      toast.error(getFriendlyErrorMessage(err, 'Lỗi kết nối API nhà cung cấp'));
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers(false);
  }, [fetchSuppliers]);

  // Tạo mới nhà cung cấp (POST /api/suppliers)
  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Vui lòng nhập tên nhà cung cấp!');
      return;
    }

    setCreating(true);
    try {
      await supplierService.createSupplier(formData);
      toast.success(`Đã thêm nhà cung cấp "${formData.name}" thành công!`);
      setIsModalOpen(false);
      setFormData({
        code: '',
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        active: true,
      });
      await fetchSuppliers(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi tạo nhà cung cấp'));
    } finally {
      setCreating(false);
    }
  };

  // Mở modal sửa nhà cung cấp
  const handleOpenEdit = (supplier) => {
    setEditingSupplier(supplier);
    setEditFormData({
      code: supplier.code || '',
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      active: supplier.active !== false,
    });
    setIsEditModalOpen(true);
  };

  // Cập nhật thông tin nhà cung cấp (PUT /api/suppliers/{id})
  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    if (!editingSupplier) return;
    if (!editFormData.name.trim()) {
      toast.warning('Vui lòng nhập tên nhà cung cấp!');
      return;
    }

    setUpdating(true);
    try {
      await supplierService.updateSupplier(editingSupplier.id, editFormData);
      toast.success(`Đã cập nhật nhà cung cấp "${editFormData.name}" thành công!`);
      setIsEditModalOpen(false);
      setEditingSupplier(null);
      await fetchSuppliers(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi cập nhật nhà cung cấp'));
    } finally {
      setUpdating(false);
    }
  };

  // Xóa nhà cung cấp (DELETE /api/suppliers/{id})
  const handleDeleteSupplier = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${name}" (ID #${id}) khỏi hệ thống?`)) {
      return;
    }
    try {
      await supplierService.deleteSupplier(id);
      toast.success(`Đã xóa nhà cung cấp "${name}" thành công!`);
      if (selectedSupplier?.id === id) {
        setSelectedSupplier(null);
      }
      await fetchSuppliers(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi xóa nhà cung cấp'));
    }
  };

  // Nạp nhanh danh sách đối tác xưởng may mẫu
  const handleSeedSuppliers = async () => {
    setLoading(true);
    try {
      for (const item of DEFAULT_APPAREL_SUPPLIERS) {
        await supplierService.createSupplier(item).catch(() => null);
      }
      toast.success('Đã nạp 4 xưởng may và đối tác cung ứng vải mẫu vào Database thành công!');
      await fetchSuppliers(true);
    } catch (err) {
      toast.error('Lỗi khi nạp dữ liệu nhà cung cấp mẫu');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (s.name || '').toLowerCase().includes(term) ||
      (s.code || '').toLowerCase().includes(term) ||
      (s.contactPerson || '').toLowerCase().includes(term)
    );
  });

  return {
    suppliers,
    loading,
    selectedSupplier,
    setSelectedSupplier,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    creating,
    formData,
    setFormData,
    isEditModalOpen,
    setIsEditModalOpen,
    editingSupplier,
    updating,
    editFormData,
    setEditFormData,
    fetchSuppliers,
    handleCreateSupplier,
    handleOpenEdit,
    handleUpdateSupplier,
    handleDeleteSupplier,
    handleSeedSuppliers,
    filteredSuppliers
  };
}

