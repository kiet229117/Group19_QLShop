import api from '../../../../services/api';

/**
 * Service kết nối API Thông tin cá nhân, Đổi mật khẩu (/api/auth/change-password),
 * Upload Hình ảnh (/api/upload) & Upload Avatar (/api/users/{id}/avatar).
 */
export const getMyProfile = async (signal) => {
  const res = await api.get('/auth/me', { signal });
  return res.data || res;
};

export const getUserById = async (id, signal) => {
  const res = await api.get(`/users/${id}`, { signal });
  return res.data || res;
};

export const updateProfile = async (id, profileData, signal) => {
  const payload = {
    name: profileData.fullname ?? profileData.name,
    username: profileData.username,
    email: profileData.email,
    phone: profileData.phone,
    gender: profileData.gender,
    address: profileData.defaultAddress ?? profileData.address,
    avatar: profileData.avatar,
  };
  const res = await api.put(`/users/${id}`, payload, { signal });
  return res.data || res;
};

/**
 * Đổi mật khẩu tài khoản đang đăng nhập: POST /api/auth/change-password
 * @param {{ oldPassword: string, newPassword: string }} data
 */
export const changePassword = async ({ oldPassword, newPassword }) => {
  const res = await api.post('/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return res.data || res;
};

/**
 * Gọi API upload ảnh dùng chung của hệ thống: POST /api/upload
 * @param {File} file Tệp hình ảnh cần tải lên
 * @param {string} folder Thư mục lưu trữ trên server (mặc định: 'avatars')
 * @returns {Promise<{ url: string }>} Đối tượng chứa đường dẫn ảnh `{ url: "/uploads/avatars/..." }`
 */
export const uploadImage = async (file, folder = 'avatars') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data || res;
};

/**
 * Tải lên và cập nhật trực tiếp ảnh đại diện cho User:
 * Ưu tiên gọi POST /api/users/{id}/avatar, hoặc gọi POST /api/upload?folder=avatars
 */
export const uploadAvatar = async (id, file) => {
  if (id) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post(`/users/${id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data || res;
    } catch {
      // Fallback sang API /api/upload nếu endpoint /users/{id}/avatar gặp lỗi
      const uploaded = await uploadImage(file, 'avatars');
      const avatarUrl = uploaded?.url || uploaded;
      if (avatarUrl) {
        await api.put(`/users/${id}`, { avatar: avatarUrl });
      }
      return { avatar: avatarUrl, url: avatarUrl };
    }
  }

  const uploaded = await uploadImage(file, 'avatars');
  const avatarUrl = uploaded?.url || uploaded;
  return { avatar: avatarUrl, url: avatarUrl };
};

export const shopUserService = {
  getMyProfile,
  getUserById,
  updateProfile,
  changePassword,
  uploadImage,
  uploadAvatar,
};

export default shopUserService;
