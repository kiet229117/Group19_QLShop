import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, isStaffOrAdmin } from '../context/AuthContext';
import { RefreshCw, ShieldAlert, LogOut } from 'lucide-react';

export default function ProtectedRoute({ requireAdmin = true, children }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const location = useLocation();

  // 1. Đang kiểm tra token / cookie từ backend
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1612] text-white select-none">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
        <div className="text-sm font-bold text-gray-200">Đang xác thực quyền truy cập NovaCommerce...</div>
        <div className="text-xs text-emerald-400/80 mt-1">Hệ thống quản trị bảo mật QLShop</div>
      </div>
    );
  }

  // 2. Chưa đăng nhập: Chuyển hướng bắt buộc về /login và lưu lại trang đang muốn vào
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra quyền Quản trị viên (Khớp chuẩn backend: Role.admin hoặc Role.staff)
  if (requireAdmin && !isStaffOrAdmin(user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center select-none">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Từ chối truy cập (403 Forbidden)</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Tài khoản <span className="font-bold text-slate-800">{user?.email || user?.username}</span> có quyền <span className="font-bold text-rose-600 uppercase">[{user?.role || 'USER'}]</span> (Khách hàng) và không có quyền truy cập vào Phân hệ Quản trị.
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Yêu cầu quyền hạn: <span className="font-bold text-slate-700">ADMIN</span> hoặc <span className="font-bold text-slate-700">STAFF</span>.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <a
              href="/"
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              Về Trang mua sắm
            </a>
            <button
              onClick={async () => {
                await logout();
                window.location.href = '/login';
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-xs flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng nhập Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Đã xác thực thành công: Hiển thị giao diện
  return children ? children : <Outlet />;
}
