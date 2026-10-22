import axios from 'axios';

export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

// Origin của backend (bỏ hậu tố /api) – dùng để ghép đường dẫn ảnh tương đối "/uploads/..."
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
<<<<<<< HEAD
  // Không đặt sẵn 'Content-Type: application/json' ở đây: axios sẽ tự đặt JSON cho body dạng object,
  // còn nếu đặt cứng thì FormData (upload ảnh / PUT sửa sản phẩm) bị axios chuyển thành JSON -> backend lỗi.
=======
  headers: {
    'Content-Type': 'application/json',
  },
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
  // Backend lưu JWT trong HttpOnly cookie (access_token) nên phải gửi kèm cookie
  // cho các request cần quyền ADMIN/STAFF (thêm/sửa/xóa sản phẩm, đặt giá sale...).
  withCredentials: true,
});

export default api;
