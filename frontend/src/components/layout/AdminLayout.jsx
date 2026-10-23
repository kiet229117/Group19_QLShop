import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* 1. Sidebar bên trái cố định */}
      <AdminSidebar />

      {/* 2. Cột nội dung chính bên phải */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        {/* Khu vực render trang con thông qua Outlet */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Footer của trang quản trị */}
        <footer className="px-6 py-4 bg-white border-t border-gray-200/80 text-center text-xs text-gray-500">
          Bản quyền © 2026 SHOP3AE Corp. Thiết kế cho bộ phận vận hành e-commerce.
        </footer>
      </div>
    </div>
  );
}

