import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

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

// Chuẩn hóa đối tượng user trước khi lưu vào state & localStorage
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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('qlshop_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qlshop_user');
      const savedToken = localStorage.getItem('qlshop_token');
      return saved ? formatUserData(JSON.parse(saved), savedToken) : (savedToken ? formatUserData(null, savedToken) : null);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Khởi động: Kiểm tra phiên đăng nhập từ backend qua GET /api/auth/me
  useEffect(() => {
    async function verifySession() {
      try {
        if (token) {
          const currentUser = await authService.getMe();
          if (currentUser) {
            const formatted = formatUserData(currentUser, token);
            setUser(formatted);
            localStorage.setItem('qlshop_user', JSON.stringify(formatted));
          }
        }
      } catch (err) {
        console.warn('Phiên đăng nhập không hợp lệ hoặc đã hết hạn:', err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('qlshop_token');
        localStorage.removeItem('qlshop_user');
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, [token]);

  // Đăng nhập
  const login = async (usernameOrEmail, password) => {
    const data = await authService.login(usernameOrEmail, password);
    const newToken = data?.token || token;
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('qlshop_token', newToken);
    }
    if (data?.user || newToken) {
      const formatted = formatUserData(data?.user, newToken);
      setUser(formatted);
      localStorage.setItem('qlshop_user', JSON.stringify(formatted));
    }
    return data;
  };

  // Đăng ký
  const register = async (registerData) => {
    const data = await authService.register(registerData);
    const newToken = data?.token || token;
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('qlshop_token', newToken);
    }
    if (data?.user || newToken) {
      const formatted = formatUserData(data?.user, newToken);
      setUser(formatted);
      localStorage.setItem('qlshop_user', JSON.stringify(formatted));
    }
    return data;
  };

  // Đăng xuất (xóa sạch thông tin đăng nhập, wishlist và giỏ hàng)
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Lỗi khi đăng xuất backend:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('qlshop_token');
      localStorage.removeItem('qlshop_user');
      localStorage.removeItem('qlshop_client_wishlist');
      localStorage.removeItem('qlshop_cart_items');
      window.dispatchEvent(new Event('auth:logout'));
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
}

export default AuthContext;
