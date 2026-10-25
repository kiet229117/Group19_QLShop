import api from '../../../../services/api';

/**
 * Service kết nối API Giỏ hàng (Cart) từ Backend cho Client Shop.
 */
export const getCartByUserId = async (userId, signal) => {
  const res = await api.get(`/carts/user/${userId}`, { signal });
  return res.data || res;
};

export const addItemToCart = async (userId, itemData, signal) => {
  const res = await api.post(`/carts/user/${userId}/items`, itemData, { signal });
  return res.data || res;
};

export const increaseItemQuantity = async (userId, cartItemId, signal) => {
  const res = await api.put(`/carts/user/${userId}/items/${cartItemId}/increase`, {}, { signal });
  return res.data || res;
};

export const decreaseItemQuantity = async (userId, cartItemId, signal) => {
  const res = await api.put(`/carts/user/${userId}/items/${cartItemId}/decrease`, {}, { signal });
  return res.data || res;
};

export const removeItemFromCart = async (userId, cartItemId, signal) => {
  const res = await api.delete(`/carts/user/${userId}/items/${cartItemId}`, { signal });
  return res.data || res;
};

export const clearUserCart = async (userId, signal) => {
  const res = await api.delete(`/carts/user/${userId}`, { signal });
  return res.data || res;
};

export const shopCartService = {
  getCartByUserId,
  addItemToCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeItemFromCart,
  clearUserCart,
};

export default shopCartService;

