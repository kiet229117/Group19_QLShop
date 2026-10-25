import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import shopCommentService from '../services/shopCommentService';

/**
 * Custom Hook quản lý bình luận & phản hồi sản phẩm phía Client Shop (Kết nối 100% API).
 */
export default function useShopComments(productId) {
  const { user, isAuthenticated } = useAuth();
  const [rawComments, setRawComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');

  // State cho Phản hồi (Reply) bình luận
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // State cho Sửa bình luận
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Tải danh sách bình luận theo productId từ API
  const fetchComments = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await shopCommentService.getCommentsByProductId(productId);
      const list = Array.isArray(res) ? res : res?.content || [];
      setRawComments(list);
    } catch (err) {
      console.warn('Lỗi tải bình luận sản phẩm:', err);
      setRawComments([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Nhóm bình luận gốc và các phản hồi con (theo parentId)
  const threadedComments = useMemo(() => {
    const roots = [];
    const childrenByParent = {};

    rawComments.forEach((item) => {
      if (item.parentId) {
        const key = String(item.parentId);
        if (!childrenByParent[key]) childrenByParent[key] = [];
        childrenByParent[key].push(item);
      } else {
        roots.push(item);
      }
    });

    // Sắp xếp bình luận gốc mới nhất lên đầu, phản hồi con theo thứ tự thời gian
    return roots
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .map((root) => ({
        ...root,
        replies: (childrenByParent[String(root.id)] || []).sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        ),
      }));
  }, [rawComments]);

  // Gửi bình luận mới lên Backend API (POST /api/comments)
  const handleSubmitComment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isAuthenticated || !user?.id) {
      toast.warning('Vui lòng đăng nhập tài khoản để gửi bình luận!');
      return false;
    }

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
        userId: user.id,
      });

      toast.success('Bình luận của bạn đã được đăng thành công!');
      setCommentText('');
      await fetchComments();
      return newComment;
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Không thể đăng bình luận lúc này.'
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Mở khung nhập phản hồi cho 1 bình luận
  const handleToggleReply = (comment) => {
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập tài khoản để phản hồi bình luận!');
      return;
    }
    if (replyingToId === comment.id) {
      setReplyingToId(null);
      setReplyText('');
    } else {
      setReplyingToId(comment.id);
      setReplyText('');
      setEditingId(null);
    }
  };

  // Gửi phản hồi cho bình luận (POST /api/comments với parentId)
  const handleSubmitReply = async (e, parentCommentId) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isAuthenticated || !user?.id) {
      toast.warning('Vui lòng đăng nhập tài khoản để gửi phản hồi!');
      return false;
    }

    const cleanReply = replyText.trim();
    if (!cleanReply) {
      toast.warning('Vui lòng nhập nội dung phản hồi!');
      return false;
    }

    try {
      setSubmittingReply(true);
      await shopCommentService.createComment({
        productId,
        parentId: parentCommentId,
        content: cleanReply,
        userId: user.id,
      });

      toast.success('Đã gửi phản hồi bình luận thành công!');
      setReplyingToId(null);
      setReplyText('');
      await fetchComments();
      return true;
    } catch (err) {
      console.error('Lỗi khi gửi phản hồi bình luận:', err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Không thể gửi phản hồi lúc này.'
      );
      return false;
    } finally {
      setSubmittingReply(false);
    }
  };

  // Mở khung sửa bình luận của chính mình
  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content || '');
    setReplyingToId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Lưu chỉnh sửa bình luận (PUT /api/comments/{id})
  const handleSaveEdit = async (e, commentId) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanEdit = editText.trim();
    if (!cleanEdit) {
      toast.warning('Nội dung bình luận không được để trống!');
      return false;
    }

    try {
      setSubmittingEdit(true);
      await shopCommentService.updateComment(commentId, cleanEdit);
      toast.success('Đã cập nhật bình luận thành công!');
      setEditingId(null);
      setEditText('');
      await fetchComments();
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Không thể cập nhật bình luận lúc này.'
      );
      return false;
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Xóa bình luận
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      await shopCommentService.deleteComment(commentId);
      toast.success('Đã xóa bình luận thành công!');
      await fetchComments();
    } catch {
      toast.error('Không thể xóa bình luận.');
    }
  };

  return {
    comments: threadedComments,
    totalCount: rawComments.length,
    loading,
    submitting,
    commentText,
    setCommentText,
    replyingToId,
    setReplyingToId,
    replyText,
    setReplyText,
    submittingReply,
    editingId,
    editText,
    setEditText,
    submittingEdit,
    fetchComments,
    handleSubmitComment,
    handleToggleReply,
    handleSubmitReply,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteComment,
    currentUser: user,
    isAuthenticated,
  };
}
