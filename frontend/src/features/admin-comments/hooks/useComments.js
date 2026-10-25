import { useState, useEffect, useCallback } from 'react';
import commentService from '../services/commentService';
import { userService } from '../../admin-users/services/userService';
import { toast } from '../../../components/common/Toast';
import { getFriendlyErrorMessage } from '../../../utils/errorHandler';

export default function useComments() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [starFilter, setStarFilter] = useState('ALL');
  const [onlyMedia, setOnlyMedia] = useState(false);
  const [moderationStatus, setModerationStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal Phản hồi bình luận
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [activeReviewForReply, setActiveReviewForReply] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  // Modal Sửa nội dung bình luận
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [savingComment, setSavingComment] = useState(false);

  const [isAiBatchModalOpen, setIsAiBatchModalOpen] = useState(false);
  const [isAiFilterConfigOpen, setIsAiFilterConfigOpen] = useState(false);
  const [isScanningAi, setIsScanningAi] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Blacklist keywords
  const [blacklistKeywords, setBlacklistKeywords] = useState([
    'cá cược', 'nhận 200k', 'casino', 'zalo 09', 'lừa đảo', 'telegram', 's****68'
  ]);
  const [newKeyword, setNewKeyword] = useState('');

  // Tải danh sách Bình luận & Đánh giá từ Backend (GET /api/comments)
  const fetchReviews = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [data, usersList] = await Promise.all([
        commentService.getAllComments(),
        userService.getAllUsers().catch(() => []),
      ]);

      const userMap = {};
      if (Array.isArray(usersList)) {
        usersList.forEach((u) => {
          userMap[u.id] = u;
        });
      }

      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((c) => {
          const userObj = userMap[c.userId];
          const userName =
            c.userName ||
            userObj?.name ||
            userObj?.username ||
            (c.userId ? `Khách hàng #${c.userId}` : 'Khách vãng lai');
          const username = userObj?.username || '';
          const userAvatar =
            c.userAvatar ||
            userObj?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0d9488&color=fff`;
          const productName = c.productName || `Sản phẩm thời trang #${c.productId}`;

          return {
            id: `REV-${c.id}`,
            backendId: c.id,
            userId: c.userId,
            productId: c.productId,
            parentId: c.parentId || null,
            user: {
              name: userName,
              username: username,
              avatar: userAvatar,
              badge: 'Đã mua hàng',
              badgeColor: 'emerald',
              verifiedBuyer: true,
              pinned: false,
            },
            orderId: `NV-${String(c.id).padStart(5, '0')}`,
            timeAgo: c.createdAt
              ? new Date(c.createdAt).toLocaleDateString('vi-VN') +
                ' ' +
                new Date(c.createdAt).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Vừa xong',
            productSpecs: `Sản phẩm: ${productName}`,
            product: {
              name: productName,
              sku: `SKU-QL-${c.productId}`,
              price: 'Sản phẩm QLShop',
              icon: 'phone',
            },
            rating: 5,
            content: c.content || '',
            images: [],
            officialReply: c.replyContent
              ? {
                  author: c.replyAuthor || 'QLShop CSKH',
                  role: 'Admin CSKH',
                  timeAgo: c.repliedAt
                    ? new Date(c.repliedAt).toLocaleDateString('vi-VN') +
                      ' ' +
                      new Date(c.repliedAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Đã phản hồi',
                  content: c.replyContent,
                }
              : null,
            helpfulCount: 0,
            aiSentiment: {
              score: '98.5%',
              label: 'Cảm xúc tích cực',
              color: 'emerald',
            },
            hidden: false,
            pinnedToHome: false,
            isUrgent: false,
            isSpam: false,
          };
        });
        setReviews(mapped);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.warn('Lỗi tải bình luận từ backend:', err);
      setReviews([]);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(false);
  }, [fetchReviews]);

  // Lọc đánh giá
  const filteredReviews = reviews.filter((r) => {
    if (starFilter !== 'ALL' && r.rating !== parseInt(starFilter)) return false;
    if (onlyMedia && (!r.images || r.images.length === 0)) return false;
    if (moderationStatus === 'APPROVED' && r.hidden) return false;
    if (moderationStatus === 'HIDDEN' && !r.hidden) return false;
    return true;
  });

  // Phân trang
  useEffect(() => {
    setCurrentPage(1);
  }, [starFilter, onlyMedia, moderationStatus, sortBy, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredReviews.length);
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  // Xử lý Pin / Unpin
  const togglePin = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pinnedToHome: !r.pinnedToHome } : r))
    );
  };

  // Xử lý Ẩn / Hiện đánh giá
  const toggleHide = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r))
    );
  };

  // Mở modal sửa bình luận
  const handleOpenEditComment = (review) => {
    setEditingComment(review);
    setEditContent(review.content || '');
    setIsEditModalOpen(true);
  };

  // Lưu sửa nội dung bình luận qua API (PUT /api/comments/{id})
  const handleSaveEditComment = async (e) => {
    e.preventDefault();
    if (!editingComment || !editContent.trim()) return;
    setSavingComment(true);
    try {
      await commentService.updateComment(editingComment.backendId, editContent.trim());
      toast.success(`Đã cập nhật nội dung bình luận #${editingComment.backendId}!`);
      setIsEditModalOpen(false);
      setEditingComment(null);
      await fetchReviews(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi cập nhật bình luận'));
    } finally {
      setSavingComment(false);
    }
  };

  // Xóa bình luận từ Database (DELETE /api/comments/{id})
  const handleDeleteComment = async (backendId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này khỏi hệ thống?')) return;
    try {
      await commentService.deleteComment(backendId);
      toast.success('Đã xóa bình luận khỏi hệ thống thành công!');
      await fetchReviews(true);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi xóa bình luận'));
    }
  };

  // Mở modal phản hồi
  const handleOpenReplyModal = (review, defaultMessage = '') => {
    setActiveReviewForReply(review);
    setReplyText(defaultMessage || review.officialReply?.content || '');
    setIsReplyModalOpen(true);
  };

  // Lưu phản hồi lên Database (PUT /api/comments/{id}/reply)
  const handleSaveReply = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeReviewForReply || !replyText.trim()) {
      toast.warning('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    setSavingReply(true);
    try {
      await commentService.replyComment(
        activeReviewForReply.backendId,
        replyText.trim(),
        'QLShop CSKH'
      );
      toast.success(
        `Đã lưu phản hồi cho bình luận #${activeReviewForReply.backendId} thành công!`
      );
      setIsReplyModalOpen(false);
      setActiveReviewForReply(null);
      setReplyText('');
      await fetchReviews(true);
    } catch (err) {
      console.error('Lỗi khi lưu phản hồi bình luận:', err);
      toast.error(
        getFriendlyErrorMessage(err, 'Không thể gửi phản hồi bình luận lúc này.')
      );
    } finally {
      setSavingReply(false);
    }
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    if (!blacklistKeywords.includes(newKeyword.trim().toLowerCase())) {
      setBlacklistKeywords([...blacklistKeywords, newKeyword.trim().toLowerCase()]);
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw) => {
    setBlacklistKeywords(blacklistKeywords.filter((k) => k !== kw));
  };

  return {
    reviews,
    loading,
    starFilter,
    setStarFilter,
    onlyMedia,
    setOnlyMedia,
    moderationStatus,
    setModerationStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isReplyModalOpen,
    setIsReplyModalOpen,
    activeReviewForReply,
    setActiveReviewForReply,
    replyText,
    setReplyText,
    savingReply,
    isEditModalOpen,
    setIsEditModalOpen,
    editingComment,
    setEditingComment,
    editContent,
    setEditContent,
    savingComment,
    isAiBatchModalOpen,
    setIsAiBatchModalOpen,
    isAiFilterConfigOpen,
    setIsAiFilterConfigOpen,
    isScanningAi,
    setIsScanningAi,
    scanProgress,
    setScanProgress,
    blacklistKeywords,
    setBlacklistKeywords,
    newKeyword,
    setNewKeyword,
    fetchReviews,
    filteredReviews,
    totalPages,
    startIndex,
    endIndex,
    paginatedReviews,
    togglePin,
    toggleHide,
    handleOpenEditComment,
    handleSaveEditComment,
    handleDeleteComment,
    handleOpenReplyModal,
    handleSaveReply,
    handleAddKeyword,
    handleRemoveKeyword,
  };
}
