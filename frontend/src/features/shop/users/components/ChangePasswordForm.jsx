import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import ShopButton from '../../../../components/shop/common/ShopButton';
import shopUserService from '../services/shopUserService';
import ForgotPasswordModal from '../../../auth/components/ForgotPasswordModal';
import { toast } from '../../../../components/common/Toast';

/**
 * Giao diện và xử lý API Đổi mật khẩu tài khoản (POST /api/auth/change-password).
 */
export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);

  const toggleShow = (field) => {
    setShowPwd((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Kiểm tra điều kiện mật khẩu trực quan
  const hasMinLength = formData.newPassword.length >= 6;
  const isDifferentFromOld =
    Boolean(formData.newPassword) &&
    formData.newPassword !== formData.oldPassword;
  const isConfirmMatched =
    Boolean(formData.confirmPassword) &&
    formData.newPassword === formData.confirmPassword;

  const handleResetForm = () => {
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.oldPassword.trim()) {
      setError('Vui lòng nhập mật khẩu hiện tại của bạn.');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (formData.newPassword === formData.oldPassword) {
      setError('Mật khẩu mới phải khác với mật khẩu hiện tại.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setLoading(true);
    try {
      const responseMsg = await shopUserService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      const msg =
        typeof responseMsg === 'string' && responseMsg
          ? responseMsg
          : 'Đổi mật khẩu tài khoản thành công!';
      setSuccess(msg);
      toast.success(msg);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      const rawMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? err.response.data : '') ||
        'Mật khẩu hiện tại không chính xác hoặc phiên đăng nhập đã hết hạn.';
      setError(rawMsg);
      toast.error(rawMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-zinc-900">
              Đổi mật khẩu tài khoản
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Cập nhật mật khẩu định kỳ để bảo vệ tài khoản và lịch sử đơn hàng của bạn.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setForgotOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Quên mật khẩu hiện tại?
        </button>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Thông báo thành công */}
      {success && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Đổi mật khẩu */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* 1. Mật khẩu hiện tại */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
            Mật khẩu hiện tại (*)
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPwd.old ? 'text' : 'password'}
              value={formData.oldPassword}
              onChange={(e) => handleChange('oldPassword', e.target.value)}
              placeholder="Nhập mật khẩu đang sử dụng..."
              autoComplete="current-password"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
            <button
              type="button"
              onClick={() => toggleShow('old')}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
              aria-label={showPwd.old ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPwd.old ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Mật khẩu mới & Xác nhận mật khẩu mới */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Mật khẩu mới (*)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPwd.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                placeholder="Tối thiểu 6 ký tự..."
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <button
                type="button"
                onClick={() => toggleShow('new')}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label={showPwd.new ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPwd.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Xác nhận mật khẩu mới (*)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPwd.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <button
                type="button"
                onClick={() => toggleShow('confirm')}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label={showPwd.confirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPwd.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Checklist điều kiện bảo mật mật khẩu */}
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Yêu cầu bảo mật mật khẩu
          </p>
          <ul className="grid gap-2 text-xs sm:grid-cols-3">
            <li
              className={`flex items-center gap-2 font-medium ${
                hasMinLength ? 'text-emerald-700' : 'text-zinc-500'
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  hasMinLength ? 'text-emerald-600' : 'text-zinc-300'
                }`}
              />
              <span>Tối thiểu 6 ký tự</span>
            </li>
            <li
              className={`flex items-center gap-2 font-medium ${
                isDifferentFromOld ? 'text-emerald-700' : 'text-zinc-500'
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  isDifferentFromOld ? 'text-emerald-600' : 'text-zinc-300'
                }`}
              />
              <span>Khác mật khẩu hiện tại</span>
            </li>
            <li
              className={`flex items-center gap-2 font-medium ${
                isConfirmMatched ? 'text-emerald-700' : 'text-zinc-500'
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  isConfirmMatched ? 'text-emerald-600' : 'text-zinc-300'
                }`}
              />
              <span>Khớp mật khẩu xác nhận</span>
            </li>
          </ul>
        </div>

        {/* Nút thao tác */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 pt-4">
          <ShopButton
            type="button"
            variant="outline"
            onClick={handleResetForm}
            disabled={loading}
          >
            Nhập lại
          </ShopButton>

          <ShopButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Lưu mật khẩu mới</span>
              </>
            )}
          </ShopButton>
        </div>
      </form>

      {/* Modal Quên mật khẩu (gửi OTP qua Email) */}
      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  );
}

