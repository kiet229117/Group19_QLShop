import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Plus,
  RotateCcw,
  Search,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Trash2,
  Edit,
  Truck,
  Shirt,
  Sparkles,
  X,
  Check
} from 'lucide-react';
import supplierService from '../services/supplierService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

// Danh sách xưởng may & NCC vải thời trang mẫu sẵn sàng khởi tạo
const DEFAULT_APPAREL_SUPPLIERS = [
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

export default function SupplierPage() {
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

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Sản phẩm &amp; Kho &gt;{' '}
            <span className="text-gray-800 font-semibold">Nhà Cung Cấp &amp; Xưởng May</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            <span>Đối Tác Cung Ứng &amp; Xưởng May Áo Thời Trang</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Quản lý thông tin pháp nhân, đầu mối kỹ thuật, xưởng sản xuất vải cotton/nỉ/oxford và điều phối nguồn hàng may mặc vào kho.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {suppliers.length === 0 && !loading && (
            <button
              type="button"
              onClick={handleSeedSuppliers}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition active:scale-95 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Khởi tạo 4 xưởng may mẫu</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fetchSuppliers(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Làm mới DB</span>
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Thêm nhà cung cấp mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ THỐNG KÊ (STAT CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng đối tác cung ứng
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? '...' : suppliers.length} <span className="text-xs text-gray-400 font-medium">doanh nghiệp</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              ✓ Xưởng dệt may &amp; Nhà vải
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Đang hợp tác tích cực
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">
              {suppliers.filter((s) => s.active !== false).length} <span className="text-xs text-gray-400 font-medium">đối tác</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Sẵn sàng xuất kho đơn hàng
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Khu vực gia công
            </span>
            <div className="text-base font-black text-gray-900 mt-0.5">
              Hà Nội, Nam Định &amp; TP.HCM
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Hệ thống xưởng dệt 3 miền
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Chất lượng sợi vải
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">
              100% <span className="text-xs text-gray-400 font-medium">Standard</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Kiểm định OEKO-TEX Standard 100
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Shirt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN: DANH SÁCH & CHI TIẾT ĐỐI TÁC
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): BẢNG NHÀ CUNG CẤP */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 px-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-gray-900">Danh mục Xưởng may &amp; Nhà cung cấp</h2>
                <span className="text-[10px] font-mono text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded">
                  {suppliers.length} đối tác
                </span>
              </div>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm xưởng may..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">TÊN ĐỐI TÁC &amp; MÃ NCC</th>
                    <th className="py-2.5 px-3">NGƯỜI ĐẠI DIỆN</th>
                    <th className="py-2.5 px-3">ĐIỆN THOẠI</th>
                    <th className="py-2.5 px-3 text-center">TRẠNG THÁI</th>
                    <th className="py-2.5 px-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
                        <span>Đang đồng bộ nhà cung cấp từ Database...</span>
                      </td>
                    </tr>
                  ) : filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-400">
                        Chưa có nhà cung cấp nào. Bấm "Thêm nhà cung cấp mới" hoặc "Khởi tạo 4 xưởng may mẫu".
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((s) => {
                      const isSelected = selectedSupplier?.id === s.id;

                      return (
                        <tr
                          key={s.id}
                          onClick={() => setSelectedSupplier(s)}
                          className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-emerald-50/30 font-medium' : 'bg-white'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{s.name}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {s.code || `#SUP-${s.id}`}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-gray-700">
                            {s.contactPerson || 'Chưa cập nhật'}
                          </td>

                          <td className="py-2.5 px-3 font-mono text-gray-700">
                            {s.phone || 'Chưa có SĐT'}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                                s.active !== false
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              {s.active !== false ? 'Đang hợp tác' : 'Tạm dừng'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(s)}
                                title="Sửa thông tin"
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition shadow-2xs"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSupplier(s.id, s.name)}
                                title="Xóa nhà cung cấp"
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (5/12): HỒ SƠ CHI TIẾT NHÀ CUNG CẤP */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
          {selectedSupplier ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs">{selectedSupplier.name}</h3>
                    <p className="text-[11px] text-gray-500 font-mono">{selectedSupplier.code || `#SUP-${selectedSupplier.id}`}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Đối tác Cung ứng
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">Người liên hệ / Đầu mối kỹ thuật</div>
                    <div className="font-bold text-gray-800">{selectedSupplier.contactPerson || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">Hotline / Số điện thoại</div>
                    <div className="font-mono font-bold text-emerald-800">{selectedSupplier.phone || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">Hòm thư điện tử (Email)</div>
                    <div className="font-mono text-gray-700">{selectedSupplier.email || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">Địa chỉ trụ sở / Xưởng dệt may</div>
                    <div className="text-gray-800 leading-relaxed">{selectedSupplier.address || 'Chưa cập nhật địa chỉ'}</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] leading-relaxed">
                💡 <strong>Ghi chú vận hành:</strong> Nhà cung cấp này được đồng bộ để phục vụ lập <strong>Phiếu nhập kho (Goods Receipts)</strong> tại phân hệ Kho Hàng.
              </div>

              {/* Thao tác Sửa & Xóa trực tiếp trong Hồ sơ */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedSupplier)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Sửa thông tin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSupplier(selectedSupplier.id, selectedSupplier.name)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Xóa nhà cung cấp</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400">
              Chọn một nhà cung cấp ở danh sách để xem hồ sơ chi tiết.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          4. MODAL TẠO NHÀ CUNG CẤP MỚI (POST /api/suppliers)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight">Thêm nhà cung cấp mới</h3>
                  <p className="text-[11px] text-gray-500">Khởi tạo thông tin xưởng may vào Database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Mã nhà cung cấp (Code) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: NCC-DETMAY-05"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tên nhà cung cấp / Xưởng may <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công ty Cổ phần May Xuất khẩu Hà Nội"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Người đại diện / Đầu mối liên hệ</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Văn Nam"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="0988.123.456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@maymac.vn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Địa chỉ xưởng may / Trụ sở</label>
                <textarea
                  rows={2}
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{creating ? 'Đang tạo...' : 'Lưu nhà cung cấp'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =========================================================================
          5. MODAL CHỈNH SỬA NHÀ CUNG CẤP (PUT /api/suppliers/{id})
          ========================================================================= */}
      {isEditModalOpen && editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight">Sửa thông tin nhà cung cấp</h3>
                  <p className="text-[11px] text-gray-500">Cập nhật thông tin đối tác xưởng may</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSupplier} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Mã nhà cung cấp (Code) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.code}
                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tên nhà cung cấp / Xưởng may <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Người đại diện / Đầu mối liên hệ</label>
                <input
                  type="text"
                  value={editFormData.contactPerson}
                  onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Địa chỉ xưởng may / Trụ sở</label>
                <textarea
                  rows={2}
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.active}
                    onChange={(e) => setEditFormData({ ...editFormData, active: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-gray-700">Đang hợp tác cung ứng</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
