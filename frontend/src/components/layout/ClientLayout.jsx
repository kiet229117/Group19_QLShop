import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Client Header */}
      <header className="h-16 border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">QL</span>
            <span>QLShop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-emerald-600 transition">Trang chủ</Link>
            <Link to="/products" className="hover:text-emerald-600 transition">Sản phẩm</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
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
        © 2026 QLShop e-commerce. All rights reserved.
      </footer>
    </div>
  );
}

