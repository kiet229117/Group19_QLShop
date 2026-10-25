import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import shopCommentService from '../services/shopCommentService';

/**
 * Custom Hook quản lý bình luận sản phẩm phía Client Shop (Kết nối 100% API).
 */
export default function useShopComments(productId) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Tải danh sách bình luận theo productId từ API
  const fetchComments = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await shopCommentService.getCommentsByProductId(productId);
      const list = Array.isArray(res) ? res : res?.content || [];
      setComments(list);
    } catch (err) {
      console.warn('Lỗi tải bình luận sản phẩm:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Gửi bình luận mới lên Backend API (POST /api/comments)
  const handleSubmitComment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanText = commentText.trim();
    if (!cleanText) {
      toast.warning('Vui lòng nhập nội dung bình luận!');
      return false;
    }

    try {
      setSubmitting(true);
      const newComment = await shopCommentService.createComment({
        productId,
        content: cleanText,
        userId: user?.id || null,
      });

      toast.success('Bình luận của bạn đã được đăng thành công!');
      setCommentText('');
      // Làm mới danh sách bình luận
      await fetchComments();
      return newComment;
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
      toast.error(err.response?.data?.message || err.message || 'Không thể đăng bình luận lúc này.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa bình luận
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      await shopCommentService.deleteComment(commentId);
      toast.success('Đã xóa bình luận thành công!');
      await fetchComments();
    } catch (err) {
      toast.error('Không thể xóa bình luận.');
    }
  };

  return {
    comments,
    loading,
    submitting,
    commentText,
    setCommentText,
    fetchComments,
    handleSubmitComment,
    handleDeleteComment,
    currentUser: user,
  };
}

