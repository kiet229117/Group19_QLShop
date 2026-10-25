import api from '../../../../services/api';

/**
 * Service kết nối API Thông tin cá nhân & Sổ địa chỉ User cho Client Shop.
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
  const res = await api.put(`/users/${id}`, profileData, { signal });
  return res.data || res;
};

export const shopUserService = {
  getMyProfile,
  getUserById,
  updateProfile,
};

export default shopUserService;

