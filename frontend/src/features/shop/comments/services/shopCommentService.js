import api from '../../../../services/api';

/**
 * Service kết nối API Bình luận & Đánh giá (Comments) phía Client Shop.
 */
export const getCommentsByProductId = async (productId, signal) => {
  const res = await api.get(`/comments/product/${productId}`, { signal });
  return res.data || res;
};

export const createComment = async ({ productId, content, userId }, signal) => {
  const payload = {
    productId: Number(productId),
    content: String(content || '').trim(),
    ...(userId ? { userId: Number(userId) } : {}),
  };
  const res = await api.post('/comments', payload, { signal });
  return res.data || res;
};

export const updateComment = async (id, content, signal) => {
  const res = await api.put(`/comments/${id}`, null, {
    params: { content: String(content || '').trim() },
    signal,
  });
  return res.data || res;
};

export const deleteComment = async (id, signal) => {
  const res = await api.delete(`/comments/${id}`, { signal });
  return res.data || res;
};

export const shopCommentService = {
  getCommentsByProductId,
  createComment,
  updateComment,
  deleteComment,
};

export default shopCommentService;

