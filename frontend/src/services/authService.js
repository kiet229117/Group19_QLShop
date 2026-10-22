import api from './api';

// POST /api/auth/login  -> backend set cookie HttpOnly "access_token"
export const login = (usernameOrEmail, password) =>
  api.post('/auth/login', { usernameOrEmail, password }).then((res) => res.data);

// GET /api/auth/me -> thông tin người dùng đang đăng nhập (401 nếu chưa đăng nhập)
export const getMe = () => api.get('/auth/me').then((res) => res.data);

// POST /api/auth/logout -> xóa cookie
export const logout = () => api.post('/auth/logout').then((res) => res.data);

// Role backend trả về dạng chữ thường: "admin" | "staff" | "user"
export const normalizeRole = (user) => String(user?.role ?? '').toLowerCase();
export const canWriteProducts = (user) => ['admin', 'staff'].includes(normalizeRole(user));
export const canDeleteProducts = (user) => normalizeRole(user) === 'admin';
