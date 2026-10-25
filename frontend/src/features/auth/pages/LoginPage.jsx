import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Shirt,
  Layers,
  Zap,
  KeyRound,
} from 'lucide-react';
import { useAuth, isStaffOrAdmin } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, user: currentLoggedUser } = useAuth();

  // Form states
  const [roleMode, setRoleMode] = useState('CLIENT'); // 'ADMIN' or 'CLIENT'
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [roleWarning, setRoleWarning] = useState('');
  const [roleVerifiedMsg, setRoleVerifiedMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Hàm thực thi đăng nhập dùng chung cho cả Submit Form và khi nhấp trực tiếp vào 2 ô Phân hệ
  const executeLogin = useCallback(
    async (targetMode = roleMode, customIdentifier = usernameOrEmail, customPassword = password) => {
      setErrorMessage('');
      setSuccessMessage('');
      setRoleWarning('');

      const cleanIdentifier = customIdentifier.trim();
      if (!cleanIdentifier) {
        setErrorMessage('Vui lòng nhập Email hoặc Tên đăng nhập');
        return;
      }
      if (!customPassword) {
        setErrorMessage('Vui lòng nhập Mật khẩu truy cập');
        return;
      }

      setIsLoading(true);
      try {
        // Nếu chọn ô Quản trị & Vận hành, kiểm tra nhanh quyền trước khi đăng nhập
        if (targetMode === 'ADMIN') {
          const roleCheck = await authService.checkRole(cleanIdentifier);
          if (roleCheck?.exists && roleCheck.active === false) {
            const lockedMsg = `Tài khoản của bạn đã bị khóa do: ${
              roleCheck.lockReason || 'Vi phạm chính sách hoạt động của hệ thống.'
            }`;
            setErrorMessage(lockedMsg);
            toast.error(lockedMsg);
            setIsLoading(false);
            return;
          }
          if (roleCheck?.exists && !roleCheck.isAdminOrStaff) {
            const denyMsg = `Tài khoản "${
              roleCheck.name || cleanIdentifier
            }" là Khách hàng (USER), không có quyền truy cập vào phân hệ Quản trị & Vận hành (ADMIN / STAFF)!`;
            setRoleWarning(denyMsg);
            setErrorMessage(denyMsg);
            setRoleMode('CLIENT');
            toast.error(denyMsg);
            setIsLoading(false);
            return;
          }
        }

        const result = await login(cleanIdentifier, customPassword, targetMode);
        const loggedInUser = result?.user;

        // Xác thực lại role trả về từ token/user
        if (targetMode === 'ADMIN' && !isStaffOrAdmin(loggedInUser)) {
          await logout();
          const denyMsg =
            'Tài khoản của bạn là Khách hàng (USER), không có quyền truy cập vào phân hệ Quản trị & Vận hành (ADMIN / STAFF)!';
          setRoleWarning(denyMsg);
          setErrorMessage(denyMsg);
          setRoleMode('CLIENT');
          toast.error(denyMsg);
          return;
        }

        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        toast.success(`Chào mừng ${loggedInUser?.name || 'bạn'} đã đăng nhập thành công!`);

        setTimeout(() => {
          if (targetMode === 'ADMIN' && isStaffOrAdmin(loggedInUser)) {
            const fromLocation = location.state?.from;
            const fromPath =
              typeof fromLocation === 'string'
                ? fromLocation
                : fromLocation?.pathname
                ? `${fromLocation.pathname}${fromLocation.search || ''}`
                : '';
            const adminRedirect =
              fromPath && fromPath.startsWith('/admin') ? fromPath : '/admin/products';
            navigate(adminRedirect, { replace: true });
            return;
          }

          // Nếu đăng nhập ở phân hệ Khách hàng (hoặc mặc định), giữ nguyên trang khách đang đứng hoặc về /shop
          const fromLocation = location.state?.from;
          let redirectPath = '/shop';
          if (typeof fromLocation === 'string' && fromLocation.trim()) {
            redirectPath = fromLocation;
          } else if (fromLocation && typeof fromLocation === 'object' && fromLocation.pathname) {
            redirectPath = `${fromLocation.pathname}${fromLocation.search || ''}${
              fromLocation.hash || ''
            }`;
          }
          if (redirectPath === '/login' || redirectPath === '/register') {
            redirectPath = '/shop';
          }
          navigate(redirectPath, { replace: true });
        }, 500);
      } catch (err) {
        console.error('Login error:', err);
        const friendlyMsg = getFriendlyErrorMessage(
          err,
          'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!'
        );
        setErrorMessage(friendlyMsg);
        toast.error(friendlyMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [roleMode, usernameOrEmail, password, login, logout, location.state, navigate]
  );

  // Xử lý ngay lập tức khi người dùng nhấp vào 1 trong 2 ô Phân hệ ("Quản trị & Vận hành" hoặc "Khách hàng / Thành viên")
  const handleSelectRoleBox = async (targetMode) => {
    setErrorMessage('');
    setSuccessMessage('');
    setRoleWarning('');
    setRoleVerifiedMsg('');

    const cleanIdentifier = usernameOrEmail.trim();

    if (targetMode === 'CLIENT') {
      setRoleMode('CLIENT');
      if (cleanIdentifier && password) {
        await executeLogin('CLIENT', cleanIdentifier, password);
      }
      return;
    }

    // Khi người dùng nhấp vào ô "Quản trị & Vận hành" (ADMIN)
    setRoleMode('ADMIN');

    // Trường hợp 1: Đã nhập Email/Username trong ô input -> kiểm tra quyền ngay lập tức
    if (cleanIdentifier) {
      setCheckingRole(true);
      try {
        const info = await authService.checkRole(cleanIdentifier);
        if (!info?.exists) {
          const notFoundMsg = `Không tìm thấy tài khoản "${cleanIdentifier}" trong hệ thống!`;
          setRoleWarning(notFoundMsg);
          toast.error(notFoundMsg);
          return;
        }

        if (info.active === false) {
          const lockedMsg = `Tài khoản của bạn đã bị khóa do: ${
            info.lockReason || 'Vi phạm chính sách hoạt động của hệ thống.'
          }`;
          setRoleWarning(lockedMsg);
          setErrorMessage(lockedMsg);
          toast.error(lockedMsg);
          return;
        }

        if (!info.isAdminOrStaff) {
          // Là tài khoản USER nhưng click qua ô Admin -> Báo ngay lập tức và chuyển về ô Khách hàng!
          const denyMsg = `Tài khoản "${
            info.name || cleanIdentifier
          }" là tài khoản Khách hàng (USER), không có quyền truy cập phân hệ Quản trị & Vận hành (ADMIN / STAFF)!`;
          setRoleWarning(denyMsg);
          setRoleMode('CLIENT');
          toast.error(denyMsg);
          return;
        }

        // Nếu đúng tài khoản ADMIN/STAFF:
        if (password) {
          // Đã nhập cả mật khẩu -> xác thực và cho vào trang Admin ngay lập tức!
          await executeLogin('ADMIN', cleanIdentifier, password);
        } else {
          const okMsg = `Xác thực quyền thành công: Tài khoản "${
            info.name || cleanIdentifier
          }" thuộc nhóm ${info.role}. Vui lòng nhập mật khẩu để vào hệ thống Quản trị!`;
          setRoleVerifiedMsg(okMsg);
          toast.success(`Đã xác nhận tài khoản ${info.role}: ${info.name || cleanIdentifier}`);
        }
      } catch (err) {
        console.warn('Không thể kiểm tra nhanh phân quyền:', err);
      } finally {
        setCheckingRole(false);
      }
      return;
    }

    // Trường hợp 2: Chưa nhập ô input nhưng đang có phiên đăng nhập sẵn trên trình duyệt
    if (currentLoggedUser) {
      if (isStaffOrAdmin(currentLoggedUser)) {
        toast.success(`Xin chào Quản trị viên ${currentLoggedUser.name}! Đang vào trang Quản trị...`);
        navigate('/admin/products', { replace: true });
        return;
      } else {
        const denyCurrentMsg = `Tài khoản đang đăng nhập (${
          currentLoggedUser.name || currentLoggedUser.username
        }) là Khách hàng (USER), không có quyền truy cập phân hệ Quản trị & Vận hành!`;
        setRoleWarning(denyCurrentMsg);
        setRoleMode('CLIENT');
        toast.error(denyCurrentMsg);
        return;
      }
    }
  };

  // Tự động kiểm tra ngay khi người dùng đang chọn ô "Quản trị & Vận hành" và gõ/nhập tài khoản USER vào ô input
  useEffect(() => {
    const cleanIdentifier = usernameOrEmail.trim();
    if (roleMode !== 'ADMIN' || !cleanIdentifier || cleanIdentifier.length < 3) {
      setRoleVerifiedMsg('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const info = await authService.checkRole(cleanIdentifier);
        if (!info?.exists) {
          setRoleVerifiedMsg('');
          return;
        }
        if (info.active === false) {
          const lockedMsg = `Tài khoản của bạn đã bị khóa do: ${
            info.lockReason || 'Vi phạm chính sách hoạt động của hệ thống.'
          }`;
          setRoleWarning(lockedMsg);
          setRoleVerifiedMsg('');
          return;
        }
        if (!info.isAdminOrStaff) {
          const denyMsg = `Tài khoản "${
            info.name || cleanIdentifier
          }" là tài khoản Khách hàng (USER), không có quyền truy cập phân hệ Quản trị & Vận hành (ADMIN / STAFF)!`;
          setRoleWarning(denyMsg);
          setRoleVerifiedMsg('');
          setRoleMode('CLIENT');
          toast.error(denyMsg);
        } else {
          setRoleWarning('');
          setRoleVerifiedMsg(
            `Tài khoản hợp lệ (${info.role}: ${info.name || cleanIdentifier}) — Được phép truy cập Quản trị & Vận hành.`
          );
        }
      } catch {
        // Bỏ qua lỗi mạng tạm thời khi đang gõ
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [usernameOrEmail, roleMode]);

  // Xử lý gửi đăng nhập từ nút Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeLogin(roleMode, usernameOrEmail, password);
  };

  // Nạp nhanh tài khoản demo tiện lợi khi kiểm thử
  const fillQuickDemo = (type) => {
    setErrorMessage('');
    setRoleWarning('');
    setRoleVerifiedMsg('');
    if (type === 'admin') {
      setRoleMode('ADMIN');
      setUsernameOrEmail('admin@novacommerce.vn');
      setPassword('admin123456');
    } else {
      setRoleMode('CLIENT');
      setUsernameOrEmail('alex.nguyen@gmail.com');
      setPassword('user123456');
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
          <a href="#" className="hover:text-emerald-700 transition flex items-center gap-1">
            <span>🎧 Hỗ trợ kỹ thuật</span>
          </a>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 text-slate-700">
            <span>🇻🇳 VN</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>TLS 1.3 MPS Compliant</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* =========================================================================
              LEFT COLUMN: DARK GREEN BRANDING & FEATURES (lg:col-span-5)
              ========================================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c2e1f] via-[#092217] to-[#04120c] text-white p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold">
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-emerald-300">
                  ISO/IEC 27001
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-emerald-300">
                  SOC2 Type II
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  QLShop v2.8
                </span>
              </div>

              {/* Title & Sub */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white tracking-tight">
                  Nền tảng Quản trị &amp; Thời trang Đa kênh Tốc độ cao
                </h2>
                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-normal">
                  Hạ tầng vận hành thương mại điện tử chuyên biệt ngành thời trang: quản lý kho quần áo,
                  đồng bộ tồn size - màu đa kênh Shopee/TikTok/Storefront và bảo mật giao dịch tuyệt đối.
                </p>
              </div>

              {/* 4 Feature Cards (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <Layers className="w-3.5 h-3.5" />
                    <span>OMNICHANNEL SYNC</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    Đồng bộ tồn kho áo đa kênh Shopee, TikTok Shop, POS bán lẻ theo real-time.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <Shirt className="w-3.5 h-3.5" />
                    <span>SMART INVENTORY</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    Dự báo nhu cầu size &amp; mẫu hot, định tuyến kho thông minh giảm 42% tồn kho.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ZERO-TRUST &amp; 2FA</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    Bảo vệ phân quyền tài khoản quản trị, nhân viên kho và dữ liệu khách hàng.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <Zap className="w-3.5 h-3.5" />
                    <span>99.99% UPTIME</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    Cụm máy chủ phân tán đáp ứng lượng truy cập khủng các đợt Siêu Sale Flash.
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <div>
                  <div className="text-xl font-black text-white">10,000,000+</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Giao dịch thời trang an toàn
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-400">&lt; 18ms</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Độ trễ API hệ thống
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="relative z-10 pt-4 mt-6 border-t border-white/10 text-[11px] text-gray-300 italic leading-relaxed">
              "QLShop Fashion giúp chúng tôi mở rộng quy mô bán lẻ quần áo đạt hơn 500.000 đơn/ngày trong các chiến dịch Sale thời trang mà hệ thống vẫn hoàn toàn mượt mà."
              <div className="font-bold text-white not-italic mt-1 text-[10px]">
                — Ban Giám Đốc Vận Hành Thương Mại QLShop
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: LOGIN FORM (lg:col-span-7)
              ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Form Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    QL
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                      SHOP3AE Portal
                    </h1>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      HỆ THỐNG QUẢN TRỊ &amp; THƯƠNG MẠI THỜI TRANG
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  SINGLE SIGN-ON
                </span>
              </div>

              {/* Tab Switch: Đăng nhập vs Đăng ký vs Quên mật khẩu */}
              <div className="mt-6 flex border-b border-gray-200">
                <button
                  type="button"
                  className="pb-2.5 px-4 font-bold text-xs text-emerald-700 border-b-2 border-emerald-600 flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
                <Link
                  to="/register"
                  className="pb-2.5 px-4 font-semibold text-xs text-gray-500 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng ký tài khoản</span>
                </Link>
                <Link
                  to="/forgot-password"
                  className="pb-2.5 px-4 font-semibold text-xs text-gray-500 hover:text-slate-900 transition flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Quên mật khẩu</span>
                </Link>
              </div>

              {/* Sub-Target Selector Tabs (Quản trị & Vận hành vs Khách hàng) */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    PHÂN HỆ TRUY CẬP HỆ THỐNG
                  </span>
                  {checkingRole && (
                    <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Đang kiểm tra phân quyền...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectRoleBox('ADMIN')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      roleMode === 'ADMIN'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className={`w-4 h-4 ${
                          roleMode === 'ADMIN' ? 'text-emerald-700' : 'text-gray-400'
                        }`}
                      />
                      <span className="font-bold text-xs text-slate-900">Quản trị &amp; Vận hành</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      ADMIN, STAFF, THỦ KHO, CSKH
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRoleBox('CLIENT')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      roleMode === 'CLIENT'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag
                        className={`w-4 h-4 ${
                          roleMode === 'CLIENT' ? 'text-emerald-700' : 'text-gray-400'
                        }`}
                      />
                      <span className="font-bold text-xs text-slate-900">Khách hàng / Thành viên</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      Mua sắm thời trang &amp; Tích điểm
                    </div>
                  </button>
                </div>

                {/* Cảnh báo ngay tại chỗ khi tài khoản USER nhấp vào ô Quản trị & Vận hành */}
                {roleWarning && (
                  <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-150">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-bold">Từ chối truy cập Quản trị: </span>
                      <span>{roleWarning}</span>
                    </div>
                  </div>
                )}

                {/* Thông báo xác thực quyền ADMIN/STAFF hợp lệ ngay tại chỗ */}
                {roleVerifiedMsg && !roleWarning && (
                  <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{roleVerifiedMsg}</span>
                  </div>
                )}
              </div>

              {/* Redirect Notice if requested protected page */}
              {location.state?.from && !errorMessage && !roleWarning && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Yêu cầu xác thực:</span> Vui lòng đăng nhập tài khoản để tiếp tục thao tác của bạn.
                  </div>
                </div>
              )}

              {/* Alert Notifications */}
              {errorMessage && !roleWarning && (
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Field: Username or Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider text-[11px]">
                    EMAIL HOẶC TÊN ĐĂNG NHẬP XÁC THỰC *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => {
                        setUsernameOrEmail(e.target.value);
                        if (roleWarning) setRoleWarning('');
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="admin@novacommerce.vn hoặc username..."
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800 shadow-2xs"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Field: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                      MẬT KHẨU TRUY CẬP *
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn..."
                      className="w-full text-xs pl-9 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium text-slate-800 shadow-2xs"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-gray-600 font-medium">Ghi nhớ đăng nhập trên thiết bị này</span>
                  </label>
                  <span className="text-[10px] text-gray-400">Phiên duy trì 30 ngày</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs tracking-wide uppercase transition shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang xác thực hệ thống...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {roleMode === 'ADMIN'
                          ? 'Đăng nhập Phân hệ Quản trị'
                          : 'Đăng nhập vào hệ thống'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Quick Fill Buttons */}
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <span>Kiểm thử nhanh:</span>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition border border-gray-200"
                >
                  Tài khoản Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('client')}
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition border border-gray-200"
                >
                  Khách hàng
                </button>
              </div>

              {/* Social Login Options */}
              <div className="mt-5">
                <div className="relative text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <span className="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    HOẶC XÁC THỰC LIÊN KẾT SSO
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Đăng nhập Google OAuth2 đang được kết nối.')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition"
                  >
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Đăng nhập Microsoft Azure AD đang được kết nối.')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition"
                  >
                    <span>Microsoft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Đăng nhập Apple ID đang được kết nối.')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition"
                  >
                    <span>Apple ID</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Register Redirect */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              Chưa có tài khoản QLShop Fashion?{' '}
              <Link to="/register" className="text-emerald-700 font-bold hover:underline">
                Đăng ký ngay &rarr;
              </Link>
              <div className="text-[10px] text-gray-400 mt-2">
                Được bảo vệ bởi NovaGuard v2.4 &amp; reCAPTCHA Enterprise
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
          <a href="#" className="hover:text-emerald-700">BẢO MẬT HỆ THỐNG</a>
          <a href="#" className="hover:text-emerald-700">ĐIỀU KHOẢN DỊCH VỤ</a>
          <a href="#" className="hover:text-emerald-700">CHÍNH SÁCH BẢO MẬT</a>
        </div>
      </footer>
      <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
    </div>
  );
}
