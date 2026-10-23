import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
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

  // Nhóm 1: Sản phẩm & Kho
  const inventoryItems = [
    { to: '/admin/products', label: 'Sản phẩm & Biến thể' },
    { to: '/admin/categories', label: 'Danh mục (Category)' },
    { to: '/admin/brands', label: 'Thương hiệu (Brand)' },
    { to: '/admin/goods-receipts', label: 'Nhập kho (Goods Receipt)' },
    { to: '/admin/suppliers', label: 'Nhà cung cấp (Supplier)' }
  ];

  // Nhóm 2: Bán hàng (Sales)
  const salesItems = [
    { to: '/admin/orders', label: 'Đơn hàng (Order)' },
    { to: '/admin/vouchers', label: 'Voucher & Giảm giá' },
    { to: '/admin/returns', label: 'Đổi trả & Hoàn tiền' }
  ];

  // Nhóm 3: Khách hàng & Marketing
  const marketingItems = [
    { to: '/admin/users', label: 'Khách hàng (User)' },
    { to: '/admin/chats', label: 'Tin nhắn CSKH (Chat)' },
    { to: '/admin/comments', label: 'Đánh giá & Bình luận' },
    { to: '/admin/banners', label: 'Banner & Chiến dịch' }
  ];

  // Nhóm 4: Cấu hình Hệ thống
  const settingsItems = [
    { to: '/admin/settings/general', label: 'Cấu hình Chung' },
    { to: '/admin/settings/access', label: 'Phân quyền & Tài khoản' },
    { to: '/admin/settings/payments', label: 'Thanh toán & Tiền tệ' },
    { to: '/admin/settings/shipping', label: 'Vận chuyển & Kho hàng' },
    { to: '/admin/settings/notifications', label: 'Email & Thông báo' },
    { to: '/admin/settings/integrations', label: 'API & Tích hợp' }
  ];

  // Kiểm tra active chính xác theo URL hiện tại
  const isDashboardActive = location.pathname === '/admin' || location.pathname === '/admin/dashboard';
  const isInventoryActive = inventoryItems.some(i => location.pathname === i.to || location.pathname.startsWith(i.to + '/'));
  const isSalesActive = salesItems.some(i => location.pathname === i.to || location.pathname.startsWith(i.to + '/'));
  const isMarketingActive = marketingItems.some(i => location.pathname === i.to || location.pathname.startsWith(i.to + '/'));
  const isSettingsActive = location.pathname.startsWith('/admin/settings');

  // Trạng thái mở accordion
  const [openInventory, setOpenInventory] = useState(true);
  const [openSales, setOpenSales] = useState(true);
  const [openMarketing, setOpenMarketing] = useState(true);
  const [openSettings, setOpenSettings] = useState(() => isSettingsActive);

  // Số liệu badge chuẩn đồng bộ thời gian thực từ Database
  const [stats, setStats] = useState({
    orders: 0,
    users: 0,
    chats: 0,
    comments: 0,
    banners: 0,
  });

  useEffect(() => {
    let isMounted = true;
    api.get('/admin/dashboard/summary')
      .then((res) => {
        if (!isMounted) return;
        const d = res.data || res;
        setStats({
          orders: d.totalOrders || 0,
          users: d.totalUsers || 0,
          chats: d.totalConversations || 0,
          comments: d.totalComments || 0,
          banners: d.totalBanners || 0,
        });
      })
      .catch((err) => {
        console.warn('Sidebar stats error:', err);
      });
    return () => { isMounted = false; };
  }, [location.pathname]);

  // Tự động mở accordion khi điều hướng vào nhóm tương ứng
  useEffect(() => {
    if (isInventoryActive) setOpenInventory(true);
    if (isSalesActive) setOpenSales(true);
    if (isMarketingActive) setOpenMarketing(true);
    if (isSettingsActive) setOpenSettings(true);
  }, [location.pathname, isInventoryActive, isSalesActive, isMarketingActive, isSettingsActive]);

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
          <div className="font-bold text-white text-sm tracking-tight leading-none">SHOP3AE</div>
          <p className="text-[10px] text-emerald-400/80 font-semibold tracking-wider uppercase mt-1">ENTERPRISE ADMIN</p>
        </div>
      </div>

      {/* 2. Nút tạo sản phẩm nhanh: + New Product */}
      <div className="p-3">
        <Link
          to="/admin/products"
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
              ? 'bg-[#153424] text-emerald-300 font-semibold border border-emerald-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#12221a]'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 ${isDashboardActive ? 'text-emerald-400' : 'text-gray-400'}`} />
          <span>Dashboard</span>
        </Link>

        {/* Nhóm 1: Sản phẩm & Kho */}
        <div>
          <button
            type="button"
            onClick={() => setOpenInventory(!openInventory)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              isInventoryActive ? 'text-white font-semibold bg-[#12221a]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#12221a]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Box className={`w-4 h-4 ${isInventoryActive ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span>Sản phẩm & Kho</span>
            </div>
            {openInventory ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>

          {openInventory && (
            <div className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              {inventoryItems.map(({ to, label }) => {
                const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-[#153424] text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-gray-400 hover:text-emerald-200 hover:bg-[#13241b]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : 'bg-gray-500'
                      }`}
                    ></span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Nhóm 2: Bán hàng (Sales) */}
        <div>
          <button
            type="button"
            onClick={() => setOpenSales(!openSales)}
            aria-expanded={openSales}
            aria-controls="admin-sales-menu"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              isSalesActive ? 'text-white font-semibold bg-[#12221a]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#12221a]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className={`w-4 h-4 ${isSalesActive ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span>Bán hàng (Sales)</span>
            </div>
            {openSales ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {openSales && (
            <div id="admin-sales-menu" className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              {salesItems.map(({ to, label }) => {
                const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                const badge = to === '/admin/orders' && stats.orders > 0 ? String(stats.orders) : null;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-[#153424] text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-gray-400 hover:text-emerald-200 hover:bg-[#13241b]'
                    }`}
                  >
                    <span className="flex min-w-0 items-start gap-2">
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                          isActive
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : 'bg-gray-500'
                        }`}
                      />
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

        {/* Nhóm 3: Khách hàng & Marketing */}
        <div>
          <button
            type="button"
            onClick={() => setOpenMarketing(!openMarketing)}
            aria-expanded={openMarketing}
            aria-controls="admin-marketing-menu"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              isMarketingActive ? 'text-white font-semibold bg-[#12221a]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#12221a]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${isMarketingActive ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span>Khách hàng & Marketing</span>
            </div>
            {openMarketing ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {openMarketing && (
            <div id="admin-marketing-menu" className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              {marketingItems.map(({ to, label }) => {
                const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                let badge = null;
                let isNew = false;
                if (to === '/admin/users' && stats.users > 0) badge = String(stats.users);
                if (to === '/admin/chats' && stats.chats > 0) {
                  badge = `${stats.chats} phiên`;
                  isNew = true;
                }
                if (to === '/admin/comments' && stats.comments > 0) badge = String(stats.comments);
                if (to === '/admin/banners' && stats.banners > 0) badge = String(stats.banners);

                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-[#153424] text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-gray-400 hover:text-emerald-200 hover:bg-[#13241b]'
                    }`}
                  >
                    <span className="flex min-w-0 items-start gap-2">
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                          isActive
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : 'bg-gray-500'
                        }`}
                      />
                      <span>{label}</span>
                    </span>
                    {badge && (
                      <span
                        className={`shrink-0 rounded-sm px-1 py-0.5 text-[10px] font-semibold ${
                          isNew
                            ? 'bg-emerald-700 text-emerald-100'
                            : 'bg-[#263a31] text-emerald-400'
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

        {/* Nhóm 4: Cấu hình Hệ thống */}
        <div>
          <button
            type="button"
            onClick={() => setOpenSettings(!openSettings)}
            aria-expanded={openSettings}
            aria-controls="admin-settings-menu"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              isSettingsActive ? 'text-white font-semibold bg-[#12221a]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#12221a]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4 h-4 ${isSettingsActive ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span>Cấu hình Hệ thống</span>
            </div>
            {openSettings ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          {openSettings && (
            <div id="admin-settings-menu" className="mt-1 ml-4 pl-3 border-l border-[#1c3327] space-y-0.5">
              {settingsItems.map(({ to, label }) => {
                const isActive = location.pathname === to || (to.endsWith('/general') && location.pathname === '/admin/settings');
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-[#153424] text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-gray-400 hover:text-emerald-200 hover:bg-[#13241b]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                        isActive
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : 'bg-gray-500'
                      }`}
                    />
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
        <Link to="/admin/docs" className="flex items-center gap-2 px-2 py-1 rounded hover:text-emerald-300 hover:bg-[#13241b] transition">
          <FileCode className="w-3.5 h-3.5 text-gray-500" />
          <span>Docs & API</span>
        </Link>
        <Link to="/admin/support" className="flex items-center gap-2 px-2 py-1 rounded hover:text-emerald-300 hover:bg-[#13241b] transition">
          <LifeBuoy className="w-3.5 h-3.5 text-gray-500" />
          <span>Trung tâm hỗ trợ</span>
        </Link>
        <div className="pt-2 border-t border-[#16271f] flex items-center justify-between px-2 text-[10px] text-gray-500">
          <span>v2.4.8 Enterprise</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Đồng bộ DB
          </span>
        </div>
      </div>
    </aside>
  );
}
