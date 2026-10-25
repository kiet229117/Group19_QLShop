import api from '../../../services/api';

export const authService = {
  // 1. Đăng nhập
  login: async (usernameOrEmail, password) => {
    const res = await api.post('/auth/login', { usernameOrEmail, password });
    return res.data || res;
  },

  // 2. Đăng ký tài khoản mới (khớp chính xác các trường DTO backend: username, email, password, fullname, phone)
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

  // 3. Đăng xuất (xóa cookie và token)
  logout: async () => {
    try {
      const res = await api.post('/auth/logout');
      return res.data || res;
    } catch (err) {
      console.warn('Backend logout error:', err);
      return null;
    }
  },

  // 4. Lấy thông tin người dùng hiện tại từ Cookie/Token
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data || res;
    } catch {
      return null;
    }
  },
};

export default authService;

