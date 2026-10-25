import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import authService from '../services/authService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // 1: Nhập email nhận mã, 2: Nhập mã Token & mật khẩu mới, 3: Hoàn tất
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Tính độ mạnh mật khẩu mới
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: 'Chưa nhập', score: 0, color: 'bg-gray-200', text: 'text-gray-400' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Yếu', score: 25, color: 'bg-rose-500', text: 'text-rose-600' };
    if (score === 2) return { label: 'Trung bình', score: 50, color: 'bg-amber-500', text: 'text-amber-600' };
    if (score === 3) return { label: 'Khá mạnh', score: 75, color: 'bg-emerald-500', text: 'text-emerald-600' };
    return { label: 'Mạnh (Rất an toàn)', score: 100, color: 'bg-emerald-600', text: 'text-emerald-700 font-bold' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  // Bước 1: Gọi POST /api/auth/forgot-password
  const handleSendToken = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ Email đã đăng ký tài khoản.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Địa chỉ Email không đúng định dạng.');
      return;
    }

    setIsLoading(true);
    try {
      const resMsg = await authService.forgotPassword(cleanEmail);
      const msg =
        typeof resMsg === 'string' && resMsg
          ? resMsg
          : 'Mã xác nhận (Token) đã được gửi đến Email của bạn!';
      setSuccessMessage(msg);
      toast.success(msg);
      setStep(2);
    } catch (err) {
      console.error('Forgot password error:', err);
      const friendlyMsg = getFriendlyErrorMessage(
        err,
        'Không tìm thấy tài khoản với địa chỉ Email này hoặc không thể gửi mã xác nhận.'
      );
      setErrorMessage(friendlyMsg);
      toast.error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi lại mã xác nhận ở Bước 2
  const handleResendToken = async () => {
    if (!email.trim()) {
      setStep(1);
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    setResending(true);
    try {
      await authService.forgotPassword(email.trim());
      const msg = `Đã gửi lại mã xác nhận mới tới ${email.trim()}!`;
      setSuccessMessage(msg);
      toast.success(msg);
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(
        err,
        'Không thể gửi lại mã xác nhận. Vui lòng kiểm tra lại Email!'
      );
      setErrorMessage(friendlyMsg);
      toast.error(friendlyMsg);
    } finally {
      setResending(false);
    }
  };

  // Bước 2: Gọi POST /api/auth/reset-password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanToken = token.trim().toUpperCase();
    if (!cleanToken) {
      setErrorMessage('Vui lòng nhập mã xác nhận (Token) đã nhận qua Email.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setIsLoading(true);
    try {
      const resMsg = await authService.resetPassword({
        token: cleanToken,
        newPassword,
      });
      const msg =
        typeof resMsg === 'string' && resMsg
          ? resMsg
          : 'Đặt lại mật khẩu thành công!';
      setSuccessMessage(msg);
      toast.success(msg);
      setStep(3);
    } catch (err) {
      console.error('Reset password error:', err);
      const friendlyMsg = getFriendlyErrorMessage(
        err,
        'Mã xác nhận không hợp lệ hoặc đã hết hạn (hiệu lực 15 phút). Vui lòng thử lại!'
      );
      setErrorMessage(friendlyMsg);
      toast.error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7] flex flex-col justify-between text-slate-800">
      {/* Top Header Bar */}
      <header className="px-6 py-3.5 bg-white border-b border-gray-200/80 flex items-center justify-between">
        <Link to="/shop" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
            QL
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-base">NovaCommerce</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-1.5 py-0.2 rounded ml-2 uppercase">
              Fashion IAM Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <Link to="/login" className="hover:text-emerald-700 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Đăng nhập</span>
          </Link>
          <span className="text-gray-300">|</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>OTP Recovery Active</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* =========================================================================
              LEFT COLUMN: SECURITY & RECOVERY GUIDE (lg:col-span-5)
              ========================================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c2e1f] via-[#092217] to-[#04120c] text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>KHÔI PHỤC TÀI KHOẢN AN TOÀN</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white tracking-tight">
                  Cấp lại mật khẩu qua xác thực Email OTP
                </h2>
                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">
                  Hệ thống bảo mật QLShop sử dụng mã xác nhận Token 6 ký tự có hiệu lực trong 15 phút gửi trực tiếp đến hộp thư đã đăng ký của bạn.
                </p>
              </div>

              {/* 3 Bước hướng dẫn */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Nhập Email đã đăng ký</div>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                      Hệ thống kiểm tra tài khoản và gửi mã xác nhận gồm 6 ký tự về Email của bạn.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Xác thực mã Token (15 phút)</div>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                      Kiểm tra hộp thư đến (hoặc mục Spam) để lấy mã Token và nhập mật khẩu mới.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Đăng nhập bằng mật khẩu mới</div>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                      Mật khẩu được mã hóa BCrypt an toàn và có hiệu lực ngay lập tức.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hiệu lực Token: 15 phút</span>
              </span>
              <span className="font-bold text-emerald-300">Bảo mật BCrypt</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: FORGOT & RESET PASSWORD FORM (lg:col-span-7)
              ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                      Khôi phục mật khẩu
                    </h1>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {step === 1 && 'BƯỚC 1/2: XÁC THỰC ĐỊA CHỈ EMAIL'}
                      {step === 2 && 'BƯỚC 2/2: NHẬP MÃ TOKEN & ĐẶT MẬT KHẨU MỚI'}
                      {step === 3 && 'HOÀN TẤT KHÔI PHỤC MẬT KHẨU'}
                    </span>
                  </div>
                </div>

                {/* Thanh tiến trình bước */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-6 rounded-full transition ${
                      step >= 1 ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  />
                  <span
                    className={`h-2 w-6 rounded-full transition ${
                      step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  />
                  <span
                    className={`h-2 w-6 rounded-full transition ${
                      step >= 3 ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              </div>

              {/* Tab Switch */}
              <div className="mt-5 flex border-b border-gray-200">
                <Link
                  to="/login"
                  className="pb-2.5 px-4 font-semibold text-xs text-gray-500 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
                <button
                  type="button"
                  className="pb-2.5 px-4 font-bold text-xs text-emerald-700 border-b-2 border-emerald-600 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Quên mật khẩu</span>
                </button>
              </div>

              {/* Thông báo lỗi / thành công */}
              {errorMessage && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ==================== BƯỚC 1: NHẬP EMAIL ==================== */}
              {step === 1 && (
                <form onSubmit={handleSendToken} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      ĐỊA CHỈ EMAIL TÀI KHOẢN ĐÃ ĐĂNG KÝ *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Nhập email của bạn (VD: alex.nguyen@gmail.com)..."
                        className="w-full text-xs pl-9 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800 shadow-2xs"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                      Chúng tôi sẽ gửi một mã xác nhận gồm <strong>6 ký tự</strong> tới địa chỉ Email này để xác minh chủ sở hữu tài khoản.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs tracking-wide uppercase transition shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang gửi mã xác nhận qua Email...</span>
                      </>
                    ) : (
                      <>
                        <span>Gửi mã xác nhận (OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setSuccessMessage('');
                        setStep(2);
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Đã có mã Token xác nhận? Nhập mã đặt lại mật khẩu ngay &rarr;
                    </button>
                  </div>
                </form>
              )}

              {/* ==================== BƯỚC 2: NHẬP TOKEN & MẬT KHẨU MỚI ==================== */}
              {step === 2 && (
                <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
                  {/* Mã Token */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        MÃ XÁC NHẬN (TOKEN 6 KÝ TỰ TRONG EMAIL) *
                      </label>
                      <button
                        type="button"
                        onClick={handleResendToken}
                        disabled={resending}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-50 flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                        <span>{resending ? 'Đang gửi lại...' : 'Gửi lại mã'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={token}
                        onChange={(e) => {
                          setToken(e.target.value.toUpperCase());
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Nhập mã 6 ký tự (VD: A1B2C3)..."
                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-emerald-600 font-bold font-mono tracking-widest uppercase text-slate-900 shadow-2xs"
                      />
                      <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Mật khẩu mới */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      MẬT KHẨU MỚI * (TỐI THIỂU 6 KÝ TỰ)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Nhập mật khẩu mới..."
                        className="w-full text-xs pl-9 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800 shadow-2xs"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {newPassword && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Độ mạnh mật khẩu:</span>
                          <span className={pwdStrength.text}>{pwdStrength.label}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                            style={{ width: `${pwdStrength.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      XÁC NHẬN MẬT KHẨU MỚI *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Nhập lại mật khẩu mới..."
                        className="w-full text-xs pl-9 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800 shadow-2xs"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nút điều hướng & xác nhận */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setStep(1);
                      }}
                      className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 transition flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Đổi Email</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs tracking-wide uppercase transition shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang cập nhật mật khẩu...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Xác nhận đặt lại mật khẩu</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ==================== BƯỚC 3: HOÀN TẤT ==================== */}
              {step === 3 && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">
                      Mật khẩu của bạn đã được khôi phục!
                    </h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                      Tài khoản của bạn đã được cập nhật mật khẩu mới thành công. Bây giờ bạn có thể đăng nhập lại vào hệ thống QLShop.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/login', { replace: true })}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-md transition"
                    >
                      <span>Đến trang Đăng nhập ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Links */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
              <div>
                Nhớ lại mật khẩu?{' '}
                <Link to="/login" className="text-emerald-700 font-bold hover:underline">
                  Đăng nhập ngay &rarr;
                </Link>
              </div>
              <div>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-emerald-700 font-bold hover:underline">
                  Đăng ký mới
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 bg-white border-t border-gray-200 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          NovaCommerce © 2026. Cửa hàng Thời trang QLShop Enterprise Identity &amp; Access Management.
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-500">
          <Link to="/shop" className="hover:text-emerald-700">TRANG CHỦ SHOP</Link>
          <Link to="/login" className="hover:text-emerald-700">ĐĂNG NHẬP</Link>
          <Link to="/register" className="hover:text-emerald-700">ĐĂNG KÝ</Link>
        </div>
      </footer>
    </div>
  );
}

