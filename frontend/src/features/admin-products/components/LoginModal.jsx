import { useState } from 'react';
import { Loader2, LogIn, AlertTriangle } from 'lucide-react';
import ModalShell from './ModalShell';
import { login, logout, canWriteProducts } from '../../../services/authService';
import { getApiErrorMessage } from '../utils/apiError';

export default function LoginModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!form.usernameOrEmail.trim() || !form.password) {
      setError('Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(form.usernameOrEmail.trim(), form.password);
      if (!canWriteProducts(res.user)) {
        // Tài khoản khách hàng: hủy phiên để tránh đăng nhập nhầm
        await logout().catch(() => {});
        setError('Tài khoản này không có quyền quản trị (cần vai trò ADMIN hoặc STAFF).');
        return;
      }
      onSuccess(res.user);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Đăng nhập thất bại.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title="Đăng nhập quản trị"
      subtitle="Thêm, sửa, xóa sản phẩm cần tài khoản ADMIN hoặc STAFF."
      size="sm"
      layer={60}
      onClose={onClose}
      disableClose={loading}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="login-form"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
            Đăng nhập
          </button>
        </div>
      }
    >
      <form id="login-form" onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        <label className="block space-y-1">
          <span className="font-semibold text-gray-600">Tên đăng nhập hoặc Email</span>
          <input
            autoFocus
            type="text"
            value={form.usernameOrEmail}
            onChange={(e) => setForm((f) => ({ ...f, usernameOrEmail: e.target.value }))}
            autoComplete="username"
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-semibold text-gray-600">Mật khẩu</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
            className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </label>
      </form>
    </ModalShell>
  );
}
