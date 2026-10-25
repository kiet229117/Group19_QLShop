import { useState } from 'react';
import { Mail, Lock, KeyRound, X, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import authService from '../services/authService';
import { toast } from '../../../components/common/Toast';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập token & mật khẩu mới
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSendToken = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ Email đã đăng ký.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSuccess('Mã xác nhận (Token) đã được gửi đến Email của bạn. Vui lòng kiểm tra hộp thư!');
      toast.success('Đã gửi mã xác nhận qua Email thành công!');
      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 1000);
    } catch (err) {
      console.error('Lỗi forgot password:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Không thể gửi mã xác nhận. Vui lòng kiểm tra lại Email!';
      setError(typeof msg === 'string' ? msg : 'Lỗi khi gửi yêu cầu quên mật khẩu');
      toast.error('Gửi mã xác nhận thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token.trim()) {
      setError('Vui lòng nhập mã Token xác nhận.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token: token.trim(),
        newPassword,
      });
      setSuccess('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bằng mật khẩu mới.');
      toast.success('Mật khẩu đã được đặt lại thành công!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Lỗi reset password:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Mã xác nhận không đúng hoặc đã hết hạn. Vui lòng thử lại!';
      setError(typeof msg === 'string' ? msg : 'Lỗi khi đặt lại mật khẩu');
      toast.error('Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề modal */}
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-900">Khôi phục mật khẩu</h3>
            <p className="text-xs text-zinc-500">
              {step === 1 ? 'Bước 1: Nhập email để nhận mã xác nhận' : 'Bước 2: Đặt mật khẩu mới'}
            </p>
          </div>
        </div>

        {/* Thông báo lỗi / thành công */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {step === 1 ? (
          /* BƯỚC 1: NHẬP EMAIL */
          <form onSubmit={handleSendToken} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Địa chỉ Email tài khoản *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-zinc-300 py-2.5 pl-9 pr-3 text-xs font-medium text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Hệ thống sẽ gửi một mã Token gồm ký tự xác thực đến Email của bạn để thiết lập mật khẩu mới.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi mã xác nhận</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* BƯỚC 2: NHẬP TOKEN VÀ MẬT KHẨU MỚI */
          <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Mã Token xác nhận (đã nhận qua Email) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Nhập mã token từ email..."
                  className="w-full rounded-xl border border-zinc-300 py-2.5 pl-9 pr-3 text-xs font-medium text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Mật khẩu mới (tối thiểu 6 ký tự) *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full rounded-xl border border-zinc-300 py-2.5 pl-9 pr-3 text-xs font-medium text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Xác nhận lại mật khẩu mới *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full rounded-xl border border-zinc-300 py-2.5 pl-9 pr-3 text-xs font-medium text-zinc-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Lưu mật khẩu mới</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

