import api from '../../../services/api';

/**
 * Service kết nối toàn bộ hệ thống API Authentication (/api/auth)
 */
export const authService = {
  // 1. Đăng nhập hệ thống (nhận cookie HttpOnly & Bearer token)
  login: async (usernameOrEmail, password) => {
    const res = await api.post('/auth/login', { usernameOrEmail, password });
    return res.data || res;
  },

  // 2. Đăng ký tài khoản mới (username, email, password, fullname, phone)
  register: async ({ username, email, password, fullname, phone }) => {
    const res = await api.post('/auth/register', {
      username,
      email,
      password,
      fullname,
      phone,
    });
    return res.data || res;
  },

  // 3. Đăng xuất (xóa cookie và token trên backend)
  logout: async () => {
    try {
      const res = await api.post('/auth/logout');
      return res.data || res;
    } catch (err) {
      console.warn('Backend logout error:', err);
      return null;
    }
  },

  // 4. Lấy thông tin tài khoản hiện tại từ phiên đăng nhập (Cookie / Token)
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data || res;
    } catch {
      return null;
    }
  },

  // 5. Đổi mật khẩu tài khoản đang đăng nhập
  changePassword: async ({ oldPassword, newPassword }) => {
    const res = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return res.data || res;
  },

  // 6. Quên mật khẩu - gửi mã OTP/Token qua Email
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data || res;
  },

  // 7. Đặt lại mật khẩu mới bằng Token xác nhận
  resetPassword: async ({ token, newPassword }) => {
    const res = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return res.data || res;
  },
};

export default authService;
