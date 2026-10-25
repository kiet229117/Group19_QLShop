import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, Download, Plus, Bell, MessageSquare, LogOut, User, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { toast } from '../common/Toast';

export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.info('Bạn đã đăng xuất khỏi hệ thống thành công!');
    navigate('/login');
  };

  const displayName = user?.fullname;
  const roleName = (user?.role || '').toUpperCase();
  const displayRole =
    roleName === 'ADMIN'
      ? 'Quản trị viên'
      : roleName === 'STAFF'
      ? 'Nhân viên'
      : user?.role
      ? `Quyền: ${user.role}`
      : 'Trưởng ca CSKH';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'AD';

  let breadcrumb = {
    group: 'Sản phẩm & Kho',
    page: 'Danh sách sản phẩm & biến thể',
    searchPlaceholder: 'Tìm theo Tên, SKU, Barcode, S... [⌘K]',
    addBtnLabel: 'Thêm sản phẩm mới',
  };

  if (location.pathname.includes('/categories')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Danh mục (Category)',
      searchPlaceholder: 'Tìm kiếm nhanh tên, slug hoặc... [⌘K]',
      addBtnLabel: 'Thêm danh mục',
    };
  } else if (location.pathname.includes('/brands')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Thương hiệu (Brand)',
      searchPlaceholder: 'Tìm kiếm nhanh tên thương hiệu, mã Brand... [⌘K]',
      addBtnLabel: 'Thêm mới',
    };
  } else if (location.pathname.includes('/goods-receipts')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Nhập kho (Goods Receipt)',
      searchPlaceholder: 'Tìm kiếm mã phiếu nhập, NCC (FPT, DGW...)... [⌘K]',
      addBtnLabel: 'Tạo Phiếu Nhập',
    };
  } else if (location.pathname.includes('/suppliers')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Nhà cung cấp (Supplier)',
      searchPlaceholder: 'Tìm kiếm nhà cung cấp, mã số thuế... [⌘K]',
      addBtnLabel: 'Thêm Nhà Cung Cấp',
    };
  } else if (location.pathname.includes('/users')) {
    breadcrumb = {
      group: 'Khách hàng & Marketing',
      page: 'Quản lý Khách hàng (User Management)',
      searchPlaceholder: 'Tìm kiếm tên, email, SĐT, mã user... [⌘K]',
      addBtnLabel: 'Thêm khách hàng',
    };
  } else if (location.pathname.includes('/chats')) {
    breadcrumb = {
      group: 'Khách hàng & Marketing',
      page: 'Hộp thư CSKH (Omnichannel)',
      searchPlaceholder: 'Tìm kiếm mã đơn #ORD, khách hàng, số điện thoại... [⌘K]',
      addBtnLabel: 'Tạo hội thoại',
    };
  } else if (location.pathname.includes('/comments')) {
    breadcrumb = {
      group: 'Khách hàng & Marketing',
      page: 'Đánh giá & Bình luận (Reviews & Comments)',
      searchPlaceholder: 'Tìm kiếm đánh giá, người mua, sản phẩm, từ khóa... [⌘K]',
      addBtnLabel: 'Kiểm duyệt nhanh',
    };
  } else if (location.pathname.includes('/banners')) {
    breadcrumb = {
      group: 'Khách hàng & Marketing',
      page: 'Quản lý Banner & Chiến dịch',
      searchPlaceholder: 'Tìm kiếm tên banner, mã UTM, vị trí hiển thị... [⌘K]',
      addBtnLabel: 'Tạo Banner mới',
    };
  } else if (location.pathname.includes('/dashboard')) {
    breadcrumb = {
      group: 'Phân hệ Quản trị',
      page: 'Tổng quan Dashboard',
      searchPlaceholder: 'Tìm kiếm mã đơn #ORD, khách hàng... [⌘K]',
      addBtnLabel: 'Tạo nhanh',
    };
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* 1. Breadcrumb bên trái */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500 font-medium">{breadcrumb.group}</span>
        <span className="text-gray-300">/</span>
        <span className="font-bold text-gray-900">{breadcrumb.page}</span>
      </div>

      {/* 2. Ô tìm kiếm + Nút hành động */}
      <div className="flex items-center gap-2.5">
        {/* Ô tìm kiếm */}
        <div className="relative w-64 md:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={breadcrumb.searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Nút Xuất file */}
        <button
          type="button"
          onClick={() => toast.success('Đang khởi tạo tệp báo cáo Excel, dữ liệu sẽ tự động tải xuống...', 'Xuất dữ liệu')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition active:scale-95 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
          <span>Xuất dữ liệu</span>
        </button>

        {/* Nút Thêm mới */}
        <button
          type="button"
          
          onClick={() => toast.info(`Mở cửa sổ thêm mới ${breadcrumb.title.toLowerCase()}`, 'Thao tác nhanh')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-xs font-bold text-white transition active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{breadcrumb.addBtnLabel}</span>
        </button>

        {/* Thông báo chuông + Chat */}
        <div className="flex items-center gap-1 text-gray-500 ml-1">
          <button 
            type="button"
            onClick={() => toast.info('Hệ thống hoạt động ổn định. Không có cảnh báo khẩn cấp mới.', 'Trung tâm thông báo')}
            className="p-1.5 hover:text-gray-800 rounded-md hover:bg-gray-100 relative"
            title="Xem thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
          </button>
          <button 
            type="button"
            onClick={() => toast.info('Đang đồng bộ tin nhắn khách hàng thời gian thực...', 'Hộp thoại chat')}
            className="p-1.5 hover:text-gray-800 rounded-md hover:bg-gray-100"
            title="Hộp thoại tin nhắn"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Đường kẻ phân cách */}
        <div className="h-5 w-px bg-gray-200 mx-1"></div>

        {/* Profile Admin Dropdown & Logout */}
        <div className="relative pl-1 select-none" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition focus:outline-hidden"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover border border-emerald-300"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center border border-emerald-200">
                {initials}
              </div>
            )}
            <div className="text-left hidden xl:block leading-tight">
              <p className="text-xs font-bold text-gray-800 truncate max-w-[120px]">{displayName}</p>
              <p className="text-[10px] text-gray-400 font-medium">{displayRole}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:block" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-gray-100">
                <div className="font-bold text-slate-900 truncate">{displayName}</div>
                <div className="text-[11px] text-gray-400 truncate">{user?.email || 'admin@novacommerce.vn'}</div>
                {user?.role && (
                  <span className="inline-block mt-1 px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Vai trò: {user.role}
                  </span>
                )}
              </div>

              <div className="py-1">
                <Link
                  to="/admin/users"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Hồ sơ người dùng</span>
                </Link>
                <Link
                  to="/admin/settings/general"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Cài đặt hệ thống</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition font-bold"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Đăng xuất (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
