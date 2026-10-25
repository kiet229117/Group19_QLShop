import api from '../../../../services/api';

/**
 * Service kết nối API Bình luận, Phản hồi & Đánh giá (Comments) phía Client Shop.
 */
export const getCommentsByProductId = async (productId, signal) => {
  const res = await api.get(`/comments/product/${productId}`, { signal });
  return res.data || res;
};

export const createComment = async ({ productId, content, userId, parentId }, signal) => {
  const payload = {
    productId: Number(productId),
    content: String(content || '').trim(),
    ...(userId ? { userId: Number(userId) } : {}),
    ...(parentId ? { parentId: Number(parentId) } : {}),
  };
  const res = await api.post('/comments', payload, { signal });
  return res.data || res;
};

export const replyComment = async (id, { replyContent, replyAuthor }, signal) => {
  const res = await api.put(
    `/comments/${id}/reply`,
    {
      replyContent: String(replyContent || '').trim(),
      ...(replyAuthor ? { replyAuthor } : {}),
    },
    { signal }
  );
  return res.data || res;
};

export const updateComment = async (id, content, signal) => {
  const res = await api.put(
    `/comments/${id}`,
    { content: String(content || '').trim() },
    {
      params: { content: String(content || '').trim() },
      signal,
    }
  );
  return res.data || res;
};

export const deleteComment = async (id, signal) => {
  const res = await api.delete(`/comments/${id}`, { signal });
  return res.data || res;
};

export const shopCommentService = {
  getCommentsByProductId,
  createComment,
  replyComment,
  updateComment,
  deleteComment,
};

export default shopCommentService;
