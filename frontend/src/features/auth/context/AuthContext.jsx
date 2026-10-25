import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Lock, LogIn, X } from 'lucide-react';
import authService from '../services/authService';
import { toast } from '../../../components/common/Toast';

// Helper chuẩn hóa role khớp với enum Role backend (admin, staff, user) hoặc JWT claim (ROLE_ADMIN, ROLE_STAFF, ROLE_USER)
export function normalizeRole(role) {
  if (!role) return 'USER';
  const clean = String(role).replace(/^ROLE_/i, '').trim().toUpperCase();
  if (clean === 'ADMIN') return 'ADMIN';
  if (clean === 'STAFF') return 'STAFF';
  return 'USER';
}

export function isStaffOrAdmin(userOrRole) {
  if (!userOrRole) return false;
  const role = typeof userOrRole === 'object' ? userOrRole?.role : userOrRole;
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'STAFF';
}

// Giải mã payload token JWT an toàn
function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Chuẩn hóa đối tượng user trước khi lưu vào state & storage
function formatUserData(rawUser, token) {
  if (!rawUser && !token) return null;
  const decoded = token ? decodeJwtPayload(token) : null;

  // Ưu tiên role từ UserResponse, nếu không có lấy từ claim "role" trong JWT
  const rawRole = rawUser?.role || decoded?.role || 'user';
  const role = normalizeRole(rawRole);

  return {
    ...rawUser,
    id: rawUser?.id || decoded?.id,
    username: rawUser?.username || decoded?.sub,
    email: rawUser?.email || decoded?.email,
    name: rawUser?.name || rawUser?.fullname || decoded?.sub || 'Người dùng',
    fullname: rawUser?.fullname || rawUser?.name || decoded?.sub || 'Người dùng',
    role, // Luôn chuẩn hóa thành 'ADMIN' | 'STAFF' | 'USER'
    backendRole: rawRole, // Giữ nguyên giá trị gốc từ enum backend ('admin', 'staff', 'user')
  };
}

// Đọc token ưu tiên từ sessionStorage của tab hiện tại để không bị nhảy sang tài khoản Admin khi mở nhiều tab
function getInitialToken() {
  const sessionToken = sessionStorage.getItem('qlshop_token');
  if (sessionToken) return sessionToken;
  const localToken = localStorage.getItem('qlshop_token');
  if (localToken) {
    sessionStorage.setItem('qlshop_token', localToken);
  }
  return localToken || null;
}

function getInitialUser(initialToken) {
  try {
    const sessionSaved = sessionStorage.getItem('qlshop_user');
    if (sessionSaved) {
      return formatUserData(JSON.parse(sessionSaved), initialToken);
    }
    const localSaved = localStorage.getItem('qlshop_user');
    if (localSaved) {
      sessionStorage.setItem('qlshop_user', localSaved);
      return formatUserData(JSON.parse(localSaved), initialToken);
    }
    return initialToken ? formatUserData(null, initialToken) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getInitialToken());
  const [user, setUser] = useState(() => getInitialUser(getInitialToken()));
  const [loading, setLoading] = useState(true);
  const [lockedNotice, setLockedNotice] = useState(null);

  // Xóa phiên đăng nhập của tab hiện tại (và localStorage nếu cùng user)
  const clearCurrentSession = useCallback((targetUserIdOrUsername) => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('qlshop_token');
    sessionStorage.removeItem('qlshop_user');

    try {
      const localUserRaw = localStorage.getItem('qlshop_user');
      if (!targetUserIdOrUsername || !localUserRaw) {
        localStorage.removeItem('qlshop_token');
        localStorage.removeItem('qlshop_user');
      } else {
        const localUser = JSON.parse(localUserRaw);
        if (
          String(localUser?.id) === String(targetUserIdOrUsername) ||
          localUser?.username === targetUserIdOrUsername
        ) {
          localStorage.removeItem('qlshop_token');
          localStorage.removeItem('qlshop_user');
        }
      }
    } catch {
      localStorage.removeItem('qlshop_token');
      localStorage.removeItem('qlshop_user');
    }

    localStorage.removeItem('qlshop_client_wishlist');
    localStorage.removeItem('qlshop_cart_items');
    window.dispatchEvent(new Event('auth:logout'));
  }, []);

  // Xử lý khi phát hiện tài khoản hiện tại bị khóa
  const handleAccountLocked = useCallback(
    (detail = {}) => {
      const reason =
        detail.lockReason ||
        (detail.message
          ? detail.message.replace(/^Tài khoản của bạn đã bị khóa do:\s*/i, '')
          : '') ||
        'Vi phạm chính sách hoạt động của hệ thống.';
      const fullMessage = `Tài khoản của bạn đã bị khóa do: ${reason}`;

      clearCurrentSession(user?.id || user?.username);
      setLockedNotice({
        reason,
        message: fullMessage,
      });
      toast.error(fullMessage);
    },
    [clearCurrentSession, user?.id, user?.username]
  );

  // Khởi động: Kiểm tra phiên đăng nhập từ backend qua GET /api/auth/me
  useEffect(() => {
    async function verifySession() {
      try {
        if (token) {
          const currentUser = await authService.getMe();
          if (currentUser) {
            if (currentUser.active === false) {
              handleAccountLocked({
                lockReason: currentUser.lockReason,
                message: currentUser.lockReason
                  ? `Tài khoản của bạn đã bị khóa do: ${currentUser.lockReason}`
                  : undefined,
              });
              return;
            }
            const formatted = formatUserData(currentUser, token);
            setUser(formatted);
            const serialized = JSON.stringify(formatted);
            sessionStorage.setItem('qlshop_user', serialized);
          }
        }
      } catch (err) {
        const errData = err?.response?.data;
        const errMsg = typeof errData?.message === 'string' ? errData.message : '';
        if (
          errData?.code === 'ACCOUNT_LOCKED' ||
          errData?.locked === true ||
          errMsg.includes('Tài khoản của bạn đã bị khóa')
        ) {
          handleAccountLocked({
            lockReason: errData?.lockReason,
            message: errMsg,
          });
        } else {
          console.warn('Phiên đăng nhập không hợp lệ hoặc đã hết hạn:', err);
          setUser(null);
          setToken(null);
          sessionStorage.removeItem('qlshop_token');
          sessionStorage.removeItem('qlshop_user');
        }
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, [token, handleAccountLocked]);

  // Lắng nghe sự kiện khóa tài khoản từ API Interceptor (403 ACCOUNT_LOCKED) và từ tab Admin (storage event)
  useEffect(() => {
    const onApiLocked = (event) => {
      if (!user && !token) return;
      handleAccountLocked(event.detail || {});
    };

    const onStorageLocked = (event) => {
      if (event.key !== 'qlshop_locked_notice' || !event.newValue || !user) return;
      try {
        const payload = JSON.parse(event.newValue);
        const isCurrentUser =
          (payload.userId && String(payload.userId) === String(user.id)) ||
          (payload.username &&
            user.username &&
            payload.username.toLowerCase() === user.username.toLowerCase()) ||
          (payload.email &&
            user.email &&
            payload.email.toLowerCase() === user.email.toLowerCase());

        if (isCurrentUser) {
          handleAccountLocked({
            lockReason: payload.lockReason,
            message: payload.message,
          });
        }
      } catch (e) {
        console.warn('Không thể đọc sự kiện khóa tài khoản:', e);
      }
    };

    // Khi người dùng chuyển lại tab Client, kiểm tra nhanh trạng thái tài khoản trên server
    const onWindowFocus = async () => {
      if (!token || !user) return;
      try {
        const currentUser = await authService.getMe();
        if (currentUser && currentUser.active === false) {
          handleAccountLocked({
            lockReason: currentUser.lockReason,
          });
        }
      } catch {
        // Đã được xử lý bởi interceptor nếu là lỗi ACCOUNT_LOCKED
      }
    };

    window.addEventListener('auth:account-locked', onApiLocked);
    window.addEventListener('storage', onStorageLocked);
    window.addEventListener('focus', onWindowFocus);
    return () => {
      window.removeEventListener('auth:account-locked', onApiLocked);
      window.removeEventListener('storage', onStorageLocked);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [user, token, handleAccountLocked]);

  // Đăng nhập
  const login = async (usernameOrEmail, password, roleMode = 'CLIENT') => {
    const data = await authService.login(usernameOrEmail, password, roleMode);
    const newToken = data?.token || token;
    setLockedNotice(null);
    if (newToken) {
      setToken(newToken);
      sessionStorage.setItem('qlshop_token', newToken);
      localStorage.setItem('qlshop_token', newToken);
    }
    if (data?.user || newToken) {
      const formatted = formatUserData(data?.user, newToken);
      setUser(formatted);
      const serialized = JSON.stringify(formatted);
      sessionStorage.setItem('qlshop_user', serialized);
      localStorage.setItem('qlshop_user', serialized);
    }
    return data;
  };

  // Đăng ký
  const register = async (registerData) => {
    const data = await authService.register(registerData);
    const newToken = data?.token || token;
    setLockedNotice(null);
    if (newToken) {
      setToken(newToken);
      sessionStorage.setItem('qlshop_token', newToken);
      localStorage.setItem('qlshop_token', newToken);
    }
    if (data?.user || newToken) {
      const formatted = formatUserData(data?.user, newToken);
      setUser(formatted);
      const serialized = JSON.stringify(formatted);
      sessionStorage.setItem('qlshop_user', serialized);
      localStorage.setItem('qlshop_user', serialized);
    }
    return data;
  };

  // Đăng xuất (xóa sạch thông tin đăng nhập, wishlist và giỏ hàng)
  const logout = async () => {
    const currentId = user?.id || user?.username;
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Lỗi khi đăng xuất backend:', err);
    } finally {
      clearCurrentSession(currentId);
    }
  };

  // Đổi mật khẩu
  const changePassword = async ({ oldPassword, newPassword }) => {
    return await authService.changePassword({ oldPassword, newPassword });
  };

  // Quên mật khẩu
  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email);
  };

  // Đặt lại mật khẩu
  const resetPassword = async ({ token: resetToken, newPassword }) => {
    return await authService.resetPassword({ token: resetToken, newPassword });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user || !!token,
    isAdmin: isStaffOrAdmin(user),
    isOnlyAdmin: normalizeRole(user?.role) === 'ADMIN',
    loading,
    login,
    register,
    logout,
    setUser,
    changePassword,
    forgotPassword,
    resetPassword,
    lockedNotice,
    clearLockedNotice: () => setLockedNotice(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Modal thông báo cho Client ngay khi tài khoản bị khóa */}
      {lockedNotice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                    <Lock className="w-3 h-3" /> Thông báo bảo mật
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Tài khoản của bạn đã bị khóa
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockedNotice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 space-y-1.5">
              <div className="font-bold text-rose-800">
                Tài khoản của bạn đã bị khóa do:
              </div>
              <p className="text-sm font-semibold text-rose-900 leading-relaxed">
                {lockedNotice.reason}
              </p>
            </div>

            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Phiên đăng nhập hiện tại đã được đăng xuất tự động. Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ bộ phận Chăm sóc khách hàng để được hỗ trợ mở khóa.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setLockedNotice(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Đã hiểu
              </button>
              <a
                href="/login"
                onClick={() => setLockedNotice(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đến trang Đăng nhập</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
}

export default AuthContext;
