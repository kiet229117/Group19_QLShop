import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Gửi và nhận HttpOnly Cookie tự động
});

// Gắn token Bearer ưu tiên từ sessionStorage (cô lập phiên theo từng tab), dự phòng localStorage
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem('qlshop_token') ||
      localStorage.getItem('qlshop_token');
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
    const status = error.response?.status;
    const data = error.response?.data;
    const msg = typeof data?.message === 'string' ? data.message : '';

    // Phát hiện tài khoản bị khóa từ Backend (HTTP 403 ACCOUNT_LOCKED hoặc message khóa tài khoản)
    const isLocked =
      data?.code === 'ACCOUNT_LOCKED' ||
      data?.locked === true ||
      msg.includes('Tài khoản của bạn đã bị khóa');

    if (isLocked && !window.location.pathname.includes('/login')) {
      window.dispatchEvent(
        new CustomEvent('auth:account-locked', {
          detail: {
            message:
              msg ||
              'Tài khoản của bạn đã bị khóa do: Vi phạm chính sách hoạt động của hệ thống.',
            lockReason:
              data?.lockReason ||
              msg.replace(/^Tài khoản của bạn đã bị khóa do:\s*/i, '') ||
              'Vi phạm chính sách hoạt động của hệ thống.',
          },
        })
      );
    }

    if (status === 401) {
      // Nếu 401 và không phải đang gọi API login/register, có thể phiên đã hết hạn
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        console.warn('Phiên đăng nhập đã hết hạn hoặc chưa xác thực');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
