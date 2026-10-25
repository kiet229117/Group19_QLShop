import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, User, LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';

export default function ClientLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.fullname || user?.name || user?.username || 'Khách hàng';

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Client Header */}
      <header className="h-16 border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">QL</span>
            <span>QLShop Fashion</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-emerald-600 transition">Trang chủ</Link>
            <Link to="/products" className="hover:text-emerald-600 transition">Bộ sưu tập áo</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>{displayName}</span>
                {user?.role && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-200 text-emerald-800 rounded font-bold">
                    {user.role}
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5 text-gray-500" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-gray-100 font-bold transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Nút chuyển nhanh vào trang Admin */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vào Trang Admin</span>
          </Link>
        </div>
      </header>

      {/* Nội dung trang con */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Client Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-500 bg-gray-50">
        © 2026 QLShop Fashion e-commerce. All rights reserved.
      </footer>
    </div>
  );
}
