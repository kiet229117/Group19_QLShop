import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Gift,
  Coins,
  Crown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Tag,
  Check,
  Sparkles,
  Shirt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../../../components/common/Toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form states matching backend RegisterRequest DTO exactly:
  // username, email, password, fullname, phone
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    voucherCode: 'QLFASHION500K',
  });

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [receiveNews, setReceiveNews] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: 'Chưa nhập', score: 0, color: 'bg-gray-200', text: 'text-gray-400' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Yếu', score: 25, color: 'bg-rose-500', text: 'text-rose-600' };
    if (score === 2) return { label: 'Trung bình', score: 50, color: 'bg-amber-500', text: 'text-amber-600' };
    if (score === 3) return { label: 'Khá mạnh', score: 75, color: 'bg-emerald-500', text: 'text-emerald-600' };
    return { label: 'Mạnh (Rất an toàn)', score: 100, color: 'bg-emerald-600', text: 'text-emerald-700 font-bold' };
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Client-side validations
    if (!formData.username.trim()) {
      setErrorMessage('Tên đăng nhập không được để trống.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email không được để trống.');
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 8 ký tự.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp với mật khẩu đã nhập.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        fullname: formData.fullname.trim(),
        phone: formData.phone.trim(),
      });

      setSuccessMessage('Đăng ký tài khoản thành công! Đang kích hoạt gói quà 500.000đ...');
      toast.success('Đăng ký tài khoản thành công! Chào mừng bạn gia nhập hệ thống.');
      setTimeout(() => {
        navigate('/shop', { replace: true });
      }, 800);
    } catch (err) {
      console.error('Registration error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Đăng ký tài khoản không thành công. Tên đăng nhập hoặc email có thể đã tồn tại.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Đăng ký thất bại. Vui lòng kiểm tra lại!');
      toast.error(err, 'Đăng ký không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7] flex flex-col justify-between text-slate-800">
      {/* Top Header Bar */}
      <header className="px-6 py-3.5 bg-white border-b border-gray-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
            QL
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-base">NovaCommerce</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-1.5 py-0.2 rounded ml-2 uppercase">
              Fashion IAM Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <a href="#" className="hover:text-emerald-700 transition flex items-center gap-1">
            <span>🎧 Hỗ trợ 24/7: 1900 8888</span>
          </a>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 text-slate-700">
            <span>🇻🇳 VIE</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>256-bit SSL</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* =========================================================================
              LEFT COLUMN: MEMBERSHIP BENEFITS & REWARDS (lg:col-span-5)
              ========================================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#eef9f3] via-[#e3f4ec] to-[#d5eee2] p-8 flex flex-col justify-between border-r border-emerald-100/80 relative">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>ĐẶC QUYỀN THÀNH VIÊN MỚI</span>
              </div>

              {/* Title & Sub */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Gia nhập hệ sinh thái thời trang thông minh
                </h2>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Khai mở toàn bộ ưu đãi mua sắm thời trang nam nữ cao cấp, tích điểm thành viên tự động và tối ưu hóa giải pháp bán lẻ thời trang cùng QLShop Fashion.
                </p>
              </div>

              {/* Benefit Card 1: Voucher 500K */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      VOUCHER FASHION PACKAGE
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Mới
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mt-0.5">
                    Gói quà chào mừng 500.000đ
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Kích hoạt ngay khi tạo tài khoản thành công. Áp dụng giảm giá trực tiếp cho đơn hàng Áo, Quần thời trang đầu tiên và miễn cước vận chuyển toàn quốc.
                  </p>
                </div>
              </div>

              {/* Benefit Card 2: Ví tích điểm NovaReward */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      TÍCH LŨY LINH HOẠT
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      +2.5% hoàn tiền
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mt-0.5">
                    Ví tích điểm QL-Reward
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Tự động hoàn điểm thưởng trên mỗi đơn hàng thời trang, đổi quà tặng độc quyền hoặc nâng cấp hạng VIP trọn đời.
                  </p>
                </div>
              </div>

              {/* Membership Tiers (4 cấp độ) */}
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-600 uppercase tracking-wider text-[10px]">
                    PHÂN HẠNG HỘI VIÊN (USER TIERS)
                  </span>
                  <span className="font-bold text-emerald-700">4 Cấp độ</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] font-black text-amber-700">Đồng</div>
                    <div className="text-[9px] text-gray-400">Level 1</div>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] font-black text-slate-600">Bạc</div>
                    <div className="text-[9px] text-gray-400">Level 2</div>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] font-black text-amber-500">Vàng</div>
                    <div className="text-[9px] text-gray-400">Level 3</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300">
                    <div className="text-[10px] font-black text-emerald-700">Kim Cương</div>
                    <div className="text-[9px] text-emerald-600 font-bold">VIP Elite</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Shirt className="w-3.5 h-3.5 text-emerald-600" />
                <span>CSKH trực tuyến 24/7 chuyên nghiệp</span>
              </span>
              <span className="font-bold text-emerald-800">Hotline 1900 8888</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: REGISTER FORM (lg:col-span-7)
              ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Tạo tài khoản SHOP3AE
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bắt đầu trải nghiệm mua sắm thời trang và quản lý thương mại số
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>eKYC sẵn sàng</span>
                </span>
              </div>

              {/* Tab Switch */}
              <div className="mt-4 flex border-b border-gray-200">
                <Link
                  to="/login"
                  className="pb-2.5 px-4 font-semibold text-xs text-gray-500 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
                <button
                  type="button"
                  className="pb-2.5 px-4 font-bold text-xs text-emerald-700 border-b-2 border-emerald-600 flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Đăng ký tài khoản</span>
                </button>
              </div>

              {/* Alerts */}
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

              {/* Registration Form matching Backend RegisterRequest DTO */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
                {/* 1. Họ và tên (fullname) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">
                    HỌ VÀ TÊN *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* 2. Grid: Username & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Tên đăng nhập (username) */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">
                      TÊN ĐĂNG NHẬP (USERNAME) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="VD: alexnguyen"
                        className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800 font-mono"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Địa chỉ Email (email) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                        ĐỊA CHỈ EMAIL *
                      </label>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Email khả dụng
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex.nguyen@novacommerce.vn"
                        className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* 3. Số điện thoại nhận hàng (phone) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">
                    SỐ ĐIỆN THOẠI NHẬN HÀNG *
                  </label>
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500">
                    <span className="bg-gray-50 px-3 py-2 text-gray-600 border-r border-gray-300 font-bold text-xs flex items-center gap-1 select-none">
                      <span>🇻🇳 VN</span>
                      <span className="text-gray-400">+84</span>
                    </span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0901 234 567"
                      className="flex-1 text-xs px-3 py-2 focus:outline-hidden font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* 4. Mật khẩu (password) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">
                    MẬT KHẨU * (Tối thiểu 8 ký tự)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Nhập mật khẩu an toàn..."
                      className="w-full text-xs pl-9 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
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

                {/* 5. Xác nhận mật khẩu (confirmPassword) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">
                    XÁC NHẬN MẬT KHẨU *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      placeholder="Nhập lại mật khẩu để xác nhận..."
                      className="w-full text-xs pl-9 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 6. Mã ưu đãi / Voucher giới thiệu */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                      MÃ GIỚI THIỆU / VOUCHER CHÀO MỪNG
                    </label>
                    <span className="text-[10px] text-gray-400 font-semibold">Tùy chọn</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.voucherCode}
                        onChange={(e) =>
                          setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() })
                        }
                        className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-emerald-600 font-bold font-mono text-emerald-800 uppercase"
                      />
                      <Tag className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Mã ưu đãi QLFASHION500K hợp lệ! Giảm 500.000đ cho đơn đầu tiên.')}
                      className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-xs transition border border-gray-200"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* 7. Checkboxes */}
                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-gray-600">
                      Tôi đồng ý với{' '}
                      <a href="#" className="text-emerald-700 font-bold hover:underline">
                        Điều khoản dịch vụ
                      </a>{' '}
                      và{' '}
                      <a href="#" className="text-emerald-700 font-bold hover:underline">
                        Chính sách bảo mật
                      </a>{' '}
                      của QLShop Fashion.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={receiveNews}
                      onChange={(e) => setReceiveNews(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-gray-600">
                      Nhận thông báo ưu đãi Bộ sưu tập thời trang mới và voucher độc quyền qua Email/Zalo.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs tracking-wide uppercase transition shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng ký tài khoản mới</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Login Redirect */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              Đã có tài khoản QLShop?{' '}
              <Link to="/login" className="text-emerald-700 font-bold hover:underline">
                Đăng nhập ngay &rarr;
              </Link>
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
          <a href="#" className="hover:text-emerald-700">Security Architecture</a>
          <a href="#" className="hover:text-emerald-700">SOC2 Compliance</a>
          <a href="#" className="hover:text-emerald-700">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-700">Enterprise Terms</a>
        </div>
      </footer>
    </div>
  );
}

