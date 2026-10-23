import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Gửi và nhận HttpOnly Cookie tự động
});

// Gắn token Bearer từ localStorage nếu có (phòng trường hợp trình duyệt chặn cookie cross-domain)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qlshop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Bắt lỗi phản hồi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu 401 và không phải đang gọi API login/register, có thể phiên đã hết hạn
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        console.warn('Phiên đăng nhập đã hết hạn hoặc chưa xác thực');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
