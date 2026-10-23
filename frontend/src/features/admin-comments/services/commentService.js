import api from '../../../services/api';

export const commentService = {
  // Lấy toàn bộ bình luận từ database hệ thống cho Admin (GET /api/comments)
  getAllComments: async () => {
    try {
      const res = await api.get('/comments');
      return res.data || res;
    } catch (err) {
      console.warn('API getAllComments error:', err);
      return [];
    }
  },

  // Lấy danh sách bình luận theo sản phẩm
  getCommentsByProduct: async (productId) => {
    try {
      const res = await api.get(`/comments/product/${productId}`);
      return res.data || res;
    } catch (err) {
      console.warn('API getCommentsByProduct error, using mock:', err);
      return null;
    }
  },

  // Tạo bình luận mới
  createComment: async (data) => {
    const res = await api.post('/comments', data);
    return res.data || res;
  },

  // Cập nhật bình luận
  updateComment: async (id, content) => {
    const res = await api.put(`/comments/${id}?content=${encodeURIComponent(content)}`);
    return res.data || res;
  },

  // Xóa bình luận
  deleteComment: async (id) => {
    const res = await api.delete(`/comments/${id}`);
    return res.data || res;
  },
};

export default commentService;

