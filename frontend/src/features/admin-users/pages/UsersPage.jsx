import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Crown,
  DollarSign,
  RotateCcw,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Bell,
  Plus,
  Mail,
  Tag,
  Phone,
  MapPin,
  Calendar,
  Gift,
  Coins,
  MessageSquare,
  Lock,
  Unlock,
  ExternalLink,
  CheckCircle2,
  MoreVertical,
  X,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Loader2,
  Edit2,
  Trash2,
} from 'lucide-react';
import useUser from '../hooks/useUser';
import { useAuth } from '../../auth/context/AuthContext';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';
import { getFullImageUrl } from '../../../components/common/ImagePicker';

export default function UsersPage() {
  // Lấy dữ liệu người dùng render trực tiếp từ database thông qua custom hook useUser
  const {
    users,
    loading,
    error,
    selectedUser,
    selectedUserId,
    setSelectedUserId,
    userOrders,
    loadingOrders,
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
    refetch,
  } = useUser();

  const { user: currentUser } = useAuth();

  // Các bộ lọc UI
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [spendingFilter, setSpendingFilter] = useState('ALL');

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal tạo người dùng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    gender: 'Nam',
    address: '',
    role: 'USER',
  });

  // Modal chỉnh sửa người dùng
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Lọc tìm kiếm Real-time bằng useMemo (Zero-latency)
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Tab filter
      if (activeTab === 'vip' && u.tier !== 'Kim Cương' && u.tier !== 'Hạng Vàng') return false;
      if (activeTab === 'new' && u.ordersCount > 3) return false;
      if (activeTab === 'blocked' && u.statusType !== 'blocked') return false;

      // Text search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = u.name?.toLowerCase().includes(term);
        const matchEmail = u.email?.toLowerCase().includes(term);
        const matchPhone = u.phone?.includes(term);
        const matchCode = u.userCode?.toLowerCase().includes(term);
        if (!matchName && !matchEmail && !matchPhone && !matchCode) return false;
      }

      // Tier filter
      if (tierFilter !== 'ALL' && u.tier !== tierFilter) return false;

      // Status filter
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;

      // Spending filter
      if (spendingFilter === 'HIGH' && u.totalSpent < 20000000) return false;
      if (spendingFilter === 'MID' && (u.totalSpent < 5000000 || u.totalSpent >= 20000000)) return false;
      if (spendingFilter === 'LOW' && u.totalSpent >= 5000000) return false;

      return true;
    });
  }, [users, activeTab, searchTerm, tierFilter, statusFilter, spendingFilter]);

  // Reset về trang 1 khi lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tierFilter, statusFilter, spendingFilter, activeTab, pageSize]);

  // Tính toán dữ liệu cho trang hiện tại
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Xử lý submit form tạo khách hàng vào Database qua hook createUser
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.name) return;
    setCreatingUser(true);
    try {
      await createUser(newUser);
      toast.success(`Đã thêm thành công người dùng "${newUser.name}"!`);
      setIsModalOpen(false);
      setNewUser({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        gender: 'Nam',
        address: '',
        role: 'USER',
      });
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể tạo người dùng mới'));
    } finally {
      setCreatingUser(false);
    }
  };

  // Mở modal sửa thông tin
  const handleOpenEdit = (user) => {
    setEditingUser({
      id: user.id,
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone === 'Chưa cập nhật' ? '' : user.phone,
      gender: user.gender || 'Nam',
      address: user.address === 'Chưa cập nhật địa chỉ' ? '' : user.address,
      role: (user.role || 'USER').toUpperCase(),
      active: user.active !== false,
      password: '',
    });
    setIsEditModalOpen(true);
  };

  // Lưu chỉnh sửa thông tin người dùng
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser || !editingUser.id) return;
    setSavingEdit(true);
    try {
      const payload = {
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone,
        gender: editingUser.gender,
        address: editingUser.address,
        role: editingUser.role.toLowerCase(),
        active: editingUser.active,
      };
      if (editingUser.password && editingUser.password.trim().length >= 8) {
        payload.password = editingUser.password.trim();
      }
      await updateUser(editingUser.id, payload);
      toast.success(`Đã cập nhật thông tin tài khoản "${editingUser.name}"!`);
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Không thể cập nhật người dùng'));
    } finally {
      setSavingEdit(false);
    }
  };

  // Xử lý Xóa người dùng
  const handleDeleteUser = async (id, name) => {
    // Ngăn chặn xóa chính tài khoản đang đăng nhập
    const isSelf =
      (currentUser?.id && String(id) === String(currentUser.id)) ||
      (currentUser?.username && name?.toLowerCase() === currentUser.username.toLowerCase()) ||
      (currentUser?.email && name?.toLowerCase() === currentUser.email.toLowerCase());

    if (isSelf) {
      toast.error('Bạn đang đăng nhập bằng tài khoản này nên không thể tự xóa chính mình!');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}" (ID #${id}) khỏi hệ thống?`)) {
      return;
    }
    try {
      await deleteUser(id);
      toast.success(`Đã xóa tài khoản "${name}" thành công!`);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi xóa người dùng'));
    }
  };

  // Khóa / Mở khóa tài khoản
  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id);
      toast.info('Đã cập nhật trạng thái hoạt động của tài khoản!');
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi cập nhật trạng thái tài khoản'));
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ + THAO TÁC TRÊN ĐẦU
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Khách hàng &amp; Marketing &gt; <span className="text-gray-800 font-semibold">Quản lý Khách hàng (User Management)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1">
            Quản lý Khách hàng &amp; Hồ sơ Người dùng (User Management)
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Theo dõi vòng đời tài khoản người dùng, phân cấp thứ hạng Loyalty/VIP, tổng hợp lịch sử giao dịch đa kênh, và điều phối tài khoản hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Tải lại</span>
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Thêm khách hàng mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. HÀNG 4 THẺ CHỈ SỐ THỐNG KÊ (STAT CARDS) - TÍNH TỪ DATA DATABASE THẬT
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số khách hàng */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              TỔNG SỐ NGƯỜI DÙNG
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? 'Đang tải...' : users.length.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                Live DB
              </span>
              <span className="text-gray-400">tài khoản trong CSDL</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Thành viên Khách hàng */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              KHÁCH HÀNG (CUSTOMER)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? '...' : users.filter((u) => u.role === 'USER').length}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                Tài khoản mua hàng
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Nhân viên & Quản trị */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              QUẢN TRỊ &amp; NHÂN VIÊN
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? '...' : users.filter((u) => u.role === 'ADMIN' || u.role === 'STAFF').length}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-blue-700 font-bold bg-blue-50 px-1 rounded border border-blue-200">
                Admin &amp; Staff
              </span>
              <span className="text-gray-400">quyền quản trị</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Kết nối API Backend */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              TRẠNG THÁI API BACKEND
            </span>
            <div className="text-lg font-black text-emerald-700 mt-0.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {loading ? 'Đang kết nối...' : error ? 'Mất kết nối' : 'Đang hoạt động'}
            </div>
            <div className="mt-1 text-[11px] text-gray-400 font-mono">
              /api/users • Spring Boot
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH TÌM KIẾM, BỘ LỌC TỔNG HỢP & FILTER CHUYÊN SÂU
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-2xs space-y-3">
        {/* Hàng 1: Tabs phân loại */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Tất cả tài khoản ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vip')}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs whitespace-nowrap ${
                activeTab === 'vip'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              👑 Quản trị viên ({users.filter((u) => u.role === 'ADMIN').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              🛡️ Nhân viên ({users.filter((u) => u.role === 'STAFF').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blocked')}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs whitespace-nowrap ${
                activeTab === 'blocked'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Tài khoản tạm khóa ({users.filter((u) => u.active === false).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setTierFilter('ALL');
                setStatusFilter('ALL');
                setSpendingFilter('ALL');
                setActiveTab('all');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-medium transition text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Hàng 2: Ô tìm kiếm và Select bộ lọc */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, email, SĐT, mã user (#USR-0001)..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 font-medium focus:outline-none"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="Quản trị viên">Quản trị viên</option>
            <option value="Nhân viên">Nhân viên</option>
            <option value="Thành viên">Thành viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 font-medium focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm khóa">Tạm khóa</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
          4. MAIN 2 CỘT: BẢNG KHÁCH HÀNG (TRÁI) + HỒ SƠ CHI TIẾT (PHẢI)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): BẢNG DANH SÁCH KHÁCH HÀNG */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 px-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <strong className="text-gray-900 font-bold">Danh sách Người dùng &amp; Khách hàng</strong>
                <span className="text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded text-[10px]">
                  {filteredUsers.length} tài khoản phù hợp
                </span>
              </div>
              <div className="text-gray-500 text-[11px]">
                Trang {currentPage} / {totalPages}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfd] text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="w-8 py-2.5 px-3 text-center">#</th>
                    <th className="py-2.5 px-3">NGƯỜI DÙNG / TÀI KHOẢN</th>
                    <th className="py-2.5 px-3 text-center">VAI TRÒ</th>
                    <th className="py-2.5 px-3">SỐ ĐIỆN THOẠI</th>
                    <th className="py-2.5 px-3">ĐỊA CHỈ</th>
                    <th className="py-2.5 px-3 text-center">TRẠNG THÁI</th>
                    <th className="py-2.5 px-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
                        <span>Đang đồng bộ dữ liệu từ Database (GET /api/users)...</span>
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-400">
                        Không tìm thấy người dùng phù hợp với điều kiện lọc.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u, idx) => {
                      const isSelected = selectedUser?.id === u.id;
                      return (
                        <tr
                          key={u.id}
                          onClick={() => setSelectedUserId(u.id)}
                          className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-emerald-50/30 border-l-4 border-l-emerald-600' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center font-mono text-[10px] text-gray-400">
                            {startIndex + idx + 1}
                          </td>

                          {/* Khách hàng / Mã user */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={getFullImageUrl(u.avatar)}
                                alt={u.name}
                                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';
                                }}
                              />
                              <div>
                                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.role === 'ADMIN' && (
                                    <span className="px-1 py-0.2 rounded bg-black text-white text-[9px] font-bold">
                                      ADMIN
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                  {u.userCode} • {u.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Vai trò */}
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${u.tierClass}`}>
                              <span>{u.tierIcon}</span>
                              <span>{u.tier}</span>
                            </span>
                          </td>

                          {/* Số điện thoại */}
                          <td className="py-3 px-3 font-mono text-gray-700 text-[11px]">
                            {u.phone}
                          </td>

                          {/* Địa chỉ */}
                          <td className="py-3 px-3 text-gray-600 text-[11px] max-w-[150px] truncate">
                            {u.address}
                          </td>

                          {/* Trạng thái */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                                u.active !== false
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>

                          {/* Thao tác SỬA & XÓA */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(u);
                                }}
                                title="Sửa thông tin"
                                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition shadow-2xs"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {((currentUser?.id && String(u.id) === String(currentUser.id)) ||
                                (currentUser?.username && u.username && u.username.toLowerCase() === currentUser.username.toLowerCase()) ||
                                (currentUser?.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase())) ? (
                                <span
                                  className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                                  title="Tài khoản của bạn đang đăng nhập (Không thể tự xóa)"
                                >
                                  (Bạn)
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(u.id, u.name);
                                  }}
                                  title="Xóa tài khoản"
                                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition shadow-2xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
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

          {/* Phân trang dưới bảng với đầy đủ chức năng */}
          <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 font-semibold focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>
                từ <strong className="text-gray-800">{filteredUsers.length > 0 ? startIndex + 1 : 0}</strong> -{' '}
                <strong className="text-gray-800">{endIndex}</strong> trên tổng số{' '}
                <strong className="text-gray-800">{filteredUsers.length}</strong> tài khoản
              </span>
            </div>

            <div className="flex items-center gap-1 font-semibold text-gray-600">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                title="Trang đầu"
              >
                |&lt;
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                title="Trang trước"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, idx, arr) => {
                  const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <span key={page} className="flex items-center gap-1">
                      {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                      <button
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
                    </span>
                  );
                })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                title="Trang sau"
              >
                &gt;
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                title="Trang cuối"
              >
                &gt;|
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (5/12): HỒ SƠ CHI TIẾT KHÁCH HÀNG */}
        {selectedUser ? (
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-4">
            {/* Header hồ sơ */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  HỒ SƠ CHI TIẾT NGƯỜI DÙNG
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(selectedUser)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition text-[11px]"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Sửa hồ sơ</span>
                </button>
              </div>
            </div>

            {/* Profile Avatar & Tên & Mã KH */}
            <div className="flex items-start gap-3 p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <img
                src={getFullImageUrl(selectedUser.avatar)}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 ring-2 ring-emerald-500/20 shadow-xs"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{selectedUser.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${selectedUser.tierClass}`}>
                    <span>{selectedUser.tierIcon}</span>
                    <span>{selectedUser.tier}</span>
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                  MÃ KH: <strong>{selectedUser.userCode}</strong> • @{selectedUser.username}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center gap-1 border ${
                      selectedUser.active !== false
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {selectedUser.status}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px] font-semibold">
                    Quyền: {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ & địa chỉ */}
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  Số điện thoại:
                </span>
                <span className="font-bold text-gray-900 font-mono">{selectedUser.phone}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  Email:
                </span>
                <span className="font-semibold text-gray-800 font-mono">{selectedUser.email}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-gray-100 gap-2">
                <span className="text-gray-500 flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  Địa chỉ nhận hàng:
                </span>
                <span className="font-medium text-gray-800 text-right">{selectedUser.address}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Ngày đăng ký:
                </span>
                <span className="font-medium text-gray-800">{selectedUser.registeredDate}</span>
              </div>
            </div>

            {/* Đơn hàng gần nhất của khách */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                  LỊCH SỬ ĐƠN HÀNG (API THỰC TẾ)
                </span>
                <span className="text-[10px] text-gray-500">
                  {userOrders.length} đơn gần nhất
                </span>
              </div>

              {loadingOrders ? (
                <div className="p-4 text-center text-gray-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto text-emerald-700 mb-1" />
                  Đang tải đơn hàng...
                </div>
              ) : userOrders.length === 0 ? (
                <div className="p-3 text-center text-gray-400 bg-gray-50 rounded-lg text-xs">
                  Khách hàng chưa phát sinh đơn hàng nào trên hệ thống.
                </div>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {userOrders.map((ord, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-gray-200 bg-gray-50/60 flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          <span>{ord.id}</span>
                          <span className="text-gray-400 font-normal">• {ord.date}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[220px]">
                          {ord.product}
                        </div>
                        <div className="font-black text-gray-900 mt-1">{ord.price}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ord.statusClass}`}>
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Các Nút Thao tác Trực tiếp: Sửa, Khóa/Mở khóa, Xóa */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedUser)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Sửa thông tin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if ((currentUser?.id && String(selectedUser.id) === String(currentUser.id)) ||
                      (currentUser?.username && selectedUser.username && selectedUser.username.toLowerCase() === currentUser.username.toLowerCase())) {
                    toast.warning('Bạn không thể tự khóa tài khoản đang đăng nhập của mình!');
                    return;
                  }
                  handleToggleStatus(selectedUser.id);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border font-bold text-xs transition ${
                  ((currentUser?.id && String(selectedUser.id) === String(currentUser.id)) ||
                   (currentUser?.username && selectedUser.username && selectedUser.username.toLowerCase() === currentUser.username.toLowerCase()))
                    ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400'
                    : selectedUser.active === false
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                {selectedUser.active === false ? (
                  <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>{selectedUser.active === false ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</span>
              </button>

              {((currentUser?.id && String(selectedUser.id) === String(currentUser.id)) ||
                (currentUser?.username && selectedUser.username && selectedUser.username.toLowerCase() === currentUser.username.toLowerCase()) ||
                (currentUser?.email && selectedUser.email && selectedUser.email.toLowerCase() === currentUser.email.toLowerCase())) ? (
                <div className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold text-xs text-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tài khoản hiện tại đang đăng nhập (Không thể tự xóa)</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)}
                  className="col-span-2 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Xóa tài khoản này khỏi hệ thống</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 p-8 text-center text-gray-400">
            Chọn một tài khoản ở danh sách bên trái để xem và chỉnh sửa hồ sơ chi tiết.
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG (EDIT USER)
          ========================================================================= */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Chỉnh sửa thông tin tài khoản</h3>
                  <p className="text-[10px] text-gray-400 font-mono">
                    ID #{editingUser.id} • @{editingUser.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingUser.username}
                    className="w-full px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Email liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Phân quyền (Role)</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold focus:outline-none"
                  >
                    <option value="USER">Thành viên (USER)</option>
                    <option value="STAFF">Nhân viên (STAFF)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={editingUser.active ? 'true' : 'false'}
                    onChange={(e) => setEditingUser({ ...editingUser, active: e.target.value === 'true' })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold focus:outline-none"
                  >
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Tạm khóa tài khoản</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Giới tính</label>
                  <select
                    value={editingUser.gender}
                    onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Đặt mật khẩu mới (tùy chọn)
                  </label>
                  <input
                    type="password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Để trống nếu không đổi"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  value={editingUser.address}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  {savingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{savingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: TẠO KHÁCH HÀNG MỚI (CREATE USER)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Thêm người dùng / khách hàng mới</h3>
                  <p className="text-[10px] text-gray-400">Dữ liệu sẽ được lưu trực tiếp vào cơ sở dữ liệu MySQL</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="vana_nguyen"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Email liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="vana@example.com"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Mật khẩu khởi tạo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Vai trò (Role)</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold focus:outline-none"
                  >
                    <option value="USER">Thành viên (USER)</option>
                    <option value="STAFF">Nhân viên (STAFF)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Giới tính</label>
                  <select
                    value={newUser.gender}
                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    placeholder="Số nhà, đường, phường, quận..."
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  {creatingUser ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{creatingUser ? 'Đang lưu...' : 'Lưu khách hàng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
