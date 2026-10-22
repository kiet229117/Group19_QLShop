import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  Users,
  Settings,
  FileCode,
  LifeBuoy,
  Plus,
} from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  const [openInventory, setOpenInventory] = useState(true);
  const [openSales, setOpenSales] = useState(true);
  const [openMarketing, setOpenMarketing] = useState(true);
  const [openSettings, setOpenSettings] = useState(() => location.pathname.startsWith('/admin/settings'));

  const isProductsActive = location.pathname.includes('/admin/products');
  const isDashboardActive = location.pathname === '/admin' || location.pathname === '/admin/dashboard';
  const salesItems = [
    { to: '/admin/orders', label: 'Đơn hàng (Order)', badge: '1,248' },
    { to: '/admin/vouchers', label: 'Voucher & Giảm giá (Voucher)', badge: '18' },
    { to: '/admin/returns', label: 'Đổi trả & Hoàn tiền' }
  ];
  const marketingItems = [
    { to: '/admin/users', label: 'Khách hàng (User)', badge: '3,890' },
    { to: '/admin/chats', label: 'Tin nhắn CSKH (Conversation & Message)', badge: '24 mới', isNew: true },
    { to: '/admin/comments', label: 'Đánh giá & Bình luận (Comment)' },
    { to: '/admin/banners', label: 'Banner & Chiến dịch (Banner)' }
  ];

  return (
    <aside className="w-60 bg-[#0d1612] text-gray-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-[#192b22] select-none text-xs no-scrollbar">
      {/* 1. Logo Brand */}
      <div className="p-4 flex items-center gap-3 border-b border-[#16271f]">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-white text-sm tracking-tight leading-none">NovaCommerce</div>
          <p className="text-[10px] text-emerald-400/80 font-semibold tracking-wider uppercase mt-1">ENTERPRISE ADMIN</p>
        </div>
      </div>

      {/* 2. Nút tạo sản phẩm nhanh: + New Product */}
      <div className="p-3">
        <Link
          to="/admin/products?new=1"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition active:scale-98 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Product</span>
        </Link>
      </div>

      {/* 3. Danh sách Menu gọn gàng (Accordion / Nhóm phân hệ) */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase px-2 py-1">
          PHÂN HỆ QUẢN TRỊ
        </div>

        {/* Menu: Dashboard */}
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
            isDashboardActive
              ? 'bg-[#153424] text-white font-semibold border border-emerald-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#12221a]'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 ${isDashboardActive ? 'text-emerald-400' : 'text-gray-400'}`} />
          <span>Dashboard</span>
        </Link>

        {/* Nhóm: Sản phẩm & Kho */}
        <div>
          <button
            onClick={() => setOpenInventory(!openInventory)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-gray-300 hover:bg-[#12221a] transition"
          >
            <div className="flex items-center gap-2.5">
              <Box className="w-4 h-4 text-emerald-500" />
              <span>Sản phẩm & Kho</span>
            </div>
            {openInventory ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>

          {openInventory && (
            <div className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              <Link
                to="/admin/products"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition ${
                  isProductsActive
                    ? 'bg-[#153424] text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#13241b]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Sản phẩm & Biến thể</span>
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#13241b] transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                <span>Danh mục (Category)</span>
              </Link>
              <Link
                to="/admin/brands"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#13241b] transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                <span>Thương hiệu (Brand)</span>
              </Link>
              <Link
                to="/admin/goods-receipts"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#13241b] transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                <span>Nhập kho (Goods Receipt)</span>
              </Link>
              <Link
                to="/admin/suppliers"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#13241b] transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                <span>Nhà cung cấp</span>
              </Link>
            </div>
          )}
        </div>

        {/* Nhóm: Bán hàng (Sales) */}
        <div>
          <button
            onClick={() => setOpenSales(!openSales)}
            aria-expanded={openSales}
            aria-controls="admin-sales-menu"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-gray-400 hover:text-gray-200 hover:bg-[#12221a] transition"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <span>Bán hàng (Sales)</span>
            </div>
            {openSales ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {openSales && (
            <div id="admin-sales-menu" className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              {salesItems.map(({ to, label, badge }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-[#153424] text-emerald-300 font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#13241b]'
                    }`}
                  >
                    <span className="flex min-w-0 items-start gap-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                      <span>{label}</span>
                    </span>
                    {badge && (
                      <span className="shrink-0 rounded-sm bg-[#263a31] px-1 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Nhóm: Khách hàng & Marketing */}
        <div>
          <button
            onClick={() => setOpenMarketing(!openMarketing)}
            aria-expanded={openMarketing}
            aria-controls="admin-marketing-menu"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-gray-400 hover:text-gray-200 hover:bg-[#12221a] transition"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-gray-400" />
              <span>Khách hàng & Marketing</span>
            </div>
            {openMarketing ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {openMarketing && (
            <div id="admin-marketing-menu" className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              {marketingItems.map(({ to, label, badge, isNew }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-[#153424] text-emerald-300 font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#13241b]'
                    }`}
                  >
                    <span className="flex min-w-0 items-start gap-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                      <span>{label}</span>
                    </span>
                    {badge && (
                      <span
                        className={`shrink-0 rounded-sm px-1 py-0.5 text-[10px] font-semibold ${
                          isNew ? 'bg-emerald-700 text-emerald-100' : 'bg-[#263a31] text-emerald-400'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Nhóm: Cấu hình Hệ thống */}
        <div>
          <button
            onClick={() => setOpenSettings(!openSettings)}
            aria-expanded={openSettings}
            aria-controls="admin-settings-menu"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-gray-400 hover:text-gray-200 hover:bg-[#12221a] transition"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Cấu hình Hệ thống</span>
            </div>
            {openSettings ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {openSettings && (
            <div id="admin-settings-menu" className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              {[
                { to: '/admin/settings/general', label: 'Cấu hình Chung' },
                { to: '/admin/settings/access', label: 'Phân quyền & Tài khoản' },
                { to: '/admin/settings/payments', label: 'Thanh toán & Tiền tệ' },
                { to: '/admin/settings/shipping', label: 'Vận chuyển & Kho hàng' },
                { to: '/admin/settings/notifications', label: 'Email & Thông báo' },
                { to: '/admin/settings/integrations', label: 'API & Tích hợp' }
              ].map(({ to, label }) => {
                const isActive = location.pathname === to || (to.endsWith('/general') && location.pathname === '/admin/settings');
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-[#153424] text-emerald-300 font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#13241b]'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer Sidebar */}
      <div className="p-3 border-t border-[#16271f] space-y-1.5 text-[11px] text-gray-400">
        <Link to="/admin/docs" className="flex items-center gap-2 px-2 py-1 rounded hover:text-white transition">
          <FileCode className="w-3.5 h-3.5 text-gray-500" />
          <span>Docs & API</span>
        </Link>
        <Link to="/admin/support" className="flex items-center gap-2 px-2 py-1 rounded hover:text-white transition">
          <LifeBuoy className="w-3.5 h-3.5 text-gray-500" />
          <span>Trung tâm hỗ trợ</span>
        </Link>
        <div className="pt-2 border-t border-[#16271f] flex items-center justify-between px-2 text-[10px] text-gray-500">
          <span>v2.4.8 Enterprise</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Đồng bộ
          </span>
        </div>
      </div>
    </aside>
  );
}
