import axios from 'axios';

export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

// Origin của backend (bỏ hậu tố /api) – dùng để ghép đường dẫn ảnh tương đối "/uploads/..."
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Backend lưu JWT trong HttpOnly cookie (access_token) nên phải gửi kèm cookie
  // cho các request cần quyền ADMIN/STAFF (thêm/sửa/xóa sản phẩm, đặt giá sale...).
  withCredentials: true,
});

export default api;
