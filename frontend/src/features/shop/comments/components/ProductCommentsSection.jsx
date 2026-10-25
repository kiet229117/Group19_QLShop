import { useState } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  CornerDownRight,
  MessageCircle,
  ShieldCheck,
  Edit3,
  X,
} from 'lucide-react';
import useShopComments from '../hooks/useShopComments';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';

const QUICK_TAGS = [
  'Chất vải thoáng mát',
  'Form áo lên dáng rất đẹp',
  'Đường may tỉ mỉ, chắc chắn',
  'Giao hàng nhanh đóng gói cẩn thận',
  'Vải cotton co giãn tốt',
];

const QUICK_REPLY_TAGS = [
  'Cảm ơn chia sẻ hữu ích của bạn!',
  'Mình cũng vừa đặt mẫu này, rất ưng ý!',
  'Shop tư vấn giúp mình size phù hợp nhé?',
];

function formatCommentTime(dateVal) {
  if (!dateVal) return 'Vừa xong';
  try {
    return new Date(dateVal).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Vừa xong';
  }
}

/**
 * Component Hiển thị, Gửi bình luận & Phản hồi (Reply) sản phẩm phía Client Shop (Kết nối 100% API Backend).
 */
export default function ProductCommentsSection({ productId, productName }) {
  const {
    comments,
    totalCount,
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
    handleSubmitComment,
    handleToggleReply,
    handleSubmitReply,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteComment,
    currentUser,
  } = useShopComments(productId);

  const [likes, setLikes] = useState({});

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickTagClick = (tag) => {
    setCommentText((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const handleQuickReplyTagClick = (tag) => {
    setReplyText((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const currentUserAvatar = resolveShopImageUrl(currentUser?.avatar);

  return (
    <section className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
      {/* Header phần bình luận */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl">
              Hỏi đáp &amp; Bình luận ({totalCount ?? comments.length})
            </h2>
          </div>
          <p className="text-xs text-zinc-500 sm:text-sm">
            Chia sẻ cảm nhận thực tế hoặc đặt câu hỏi để được Chủ Shop và cộng đồng phản hồi trực tiếp.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200/60">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Bình luận &amp; Phản hồi trực tiếp
        </span>
      </div>

      {/* Form nhập bình luận mới */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200">
            {currentUserAvatar ? (
              <img
                src={currentUserAvatar}
                alt={currentUser?.name || 'Avatar'}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-zinc-400" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Bạn thấy mẫu áo "${productName || 'sản phẩm'}" thế nào? Hãy để lại nhận xét hoặc câu hỏi...`}
              disabled={submitting}
              className="w-full rounded-2xl border border-zinc-200 p-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-50"
            />

            {/* Gợi ý bình luận nhanh */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-zinc-400">Gợi ý nhanh:</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang gửi bình luận...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Gửi bình luận ngay</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Danh sách bình luận & phản hồi */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-zinc-400">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span className="text-sm">Đang tải bình luận từ máy chủ...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 py-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-2 text-sm font-bold text-zinc-700">Chưa có bình luận nào</p>
            <p className="mt-1 text-xs text-zinc-400">
              Hãy là người đầu tiên chia sẻ cảm nhận về mẫu áo này cho mọi người cùng tham khảo nhé!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {comments.map((comment) => {
              const formattedDate = formatCommentTime(comment.createdAt);
              const commentAvatar = resolveShopImageUrl(comment.userAvatar);
              const isOwner =
                currentUser &&
                comment.userId &&
                String(currentUser.id) === String(comment.userId);
              const isStaffComment =
                comment.userRole &&
                ['admin', 'staff'].includes(String(comment.userRole).toLowerCase());
              const isReplyingHere = replyingToId === comment.id;
              const isEditingHere = editingId === comment.id;
              const repliesList = Array.isArray(comment.replies) ? comment.replies : [];

              // Tránh hiển thị trùng lặp nếu replyContent đã nằm trong danh sách replies con
              const hasDuplicateReplyInThread =
                comment.replyContent &&
                repliesList.some(
                  (r) =>
                    String(r.content || '').trim() ===
                    String(comment.replyContent || '').trim()
                );

              return (
                <div
                  key={comment.id}
                  className="space-y-3 py-5 first:pt-0 last:pb-0"
                >
                  {/* Bình luận gốc */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
                      {commentAvatar ? (
                        <img
                          src={commentAvatar}
                          alt={comment.userName || 'User'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (comment.userName || 'K').charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900">
                            {comment.userName ||
                              `Khách hàng #${comment.userId || 'vãng lai'}`}
                          </span>
                          {isStaffComment ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-bold text-white">
                              <ShieldCheck className="h-3 w-3" />
                              Quản trị viên / CSKH
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                              <CheckCircle2 className="h-3 w-3" />
                              Đã mua hàng
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formattedDate}
                          </span>
                          {isOwner && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(comment)}
                                title="Sửa bình luận"
                                className="text-zinc-400 transition hover:text-emerald-600"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Xóa bình luận"
                                className="text-zinc-400 transition hover:text-rose-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Nội dung hoặc khung sửa */}
                      {isEditingHere ? (
                        <form
                          onSubmit={(e) => handleSaveEdit(e, comment.id)}
                          className="space-y-2 pt-1"
                        >
                          <textarea
                            rows={2}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full rounded-xl border border-zinc-300 p-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="rounded-lg border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              disabled={submittingEdit}
                              className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
                            >
                              {submittingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-sm leading-relaxed text-zinc-700">
                          {comment.content}
                        </p>
                      )}

                      {/* Thanh công cụ: Hữu ích & Phản hồi */}
                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleLike(comment.id)}
                          className={`inline-flex items-center gap-1 text-xs font-semibold transition ${
                            likes[comment.id]
                              ? 'text-rose-600'
                              : 'text-zinc-400 hover:text-zinc-600'
                          }`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              likes[comment.id] ? 'fill-rose-600' : ''
                            }`}
                          />
                          <span>{likes[comment.id] ? 'Đã thích' : 'Hữu ích'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleReply(comment)}
                          className={`inline-flex items-center gap-1 text-xs font-bold transition ${
                            isReplyingHere
                              ? 'text-emerald-700'
                              : 'text-zinc-500 hover:text-emerald-700'
                          }`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>
                            {isReplyingHere
                              ? 'Đóng khung phản hồi'
                              : `Phản hồi${
                                  repliesList.length > 0
                                    ? ` (${repliesList.length})`
                                    : ''
                                }`}
                          </span>
                        </button>
                      </div>

                      {/* 1. Phản hồi chính thức từ Admin / Chủ Shop (replyContent) */}
                      {comment.replyContent && !hasDuplicateReplyInThread && (
                        <div className="mt-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                <ShieldCheck className="h-3 w-3" />
                                Phản hồi từ Shop
                              </span>
                              <span className="text-xs font-bold text-zinc-900">
                                {comment.replyAuthor || 'QLShop CSKH'}
                              </span>
                            </div>
                            {comment.repliedAt && (
                              <span className="text-[11px] text-zinc-400">
                                {formatCommentTime(comment.repliedAt)}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-zinc-700 sm:text-sm">
                            {comment.replyContent}
                          </p>
                        </div>
                      )}

                      {/* 2. Danh sách các phản hồi con (Threaded Replies có parentId) */}
                      {repliesList.length > 0 && (
                        <div className="mt-3 space-y-2.5 border-l-2 border-zinc-200 pl-4">
                          {repliesList.map((reply) => {
                            const replyAvatar = resolveShopImageUrl(reply.userAvatar);
                            const isReplyOwner =
                              currentUser &&
                              reply.userId &&
                              String(currentUser.id) === String(reply.userId);
                            const isStaffReply =
                              reply.userRole &&
                              ['admin', 'staff'].includes(
                                String(reply.userRole).toLowerCase()
                              );

                            return (
                              <div
                                key={reply.id}
                                className={`flex items-start gap-2.5 rounded-2xl p-3 ${
                                  isStaffReply
                                    ? 'border border-emerald-200/80 bg-emerald-50/50'
                                    : 'bg-zinc-50/80'
                                }`}
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                                  {replyAvatar ? (
                                    <img
                                      src={replyAvatar}
                                      alt={reply.userName || 'Avatar'}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    (reply.userName || 'U').charAt(0).toUpperCase()
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 space-y-1">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-xs font-bold text-zinc-900">
                                        {reply.userName || `Người dùng #${reply.userId}`}
                                      </span>
                                      {isStaffReply && (
                                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-700 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                                          <ShieldCheck className="h-2.5 w-2.5" />
                                          Chủ Shop / CSKH
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                      <span>{formatCommentTime(reply.createdAt)}</span>
                                      {isReplyOwner && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteComment(reply.id)}
                                          title="Xóa phản hồi"
                                          className="text-zinc-400 transition hover:text-rose-600"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <p className="text-xs leading-relaxed text-zinc-700 sm:text-sm">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 3. Khung nhập phản hồi trực tiếp cho bình luận này */}
                      {isReplyingHere && (
                        <form
                          onSubmit={(e) => handleSubmitReply(e, comment.id)}
                          className="mt-3 space-y-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-bold text-zinc-700">
                              <CornerDownRight className="h-3.5 w-3.5 text-emerald-600" />
                              Phản hồi cho {comment.userName || 'khách hàng'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setReplyingToId(null)}
                              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Nhập phản hồi gửi tới ${comment.userName || 'bình luận này'}...`}
                            disabled={submittingReply}
                            autoFocus
                            className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none sm:text-sm"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1">
                              {QUICK_REPLY_TAGS.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => handleQuickReplyTagClick(tag)}
                                  className="rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setReplyingToId(null)}
                                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                              >
                                Hủy
                              </button>
                              <button
                                type="submit"
                                disabled={submittingReply || !replyText.trim()}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                              >
                                {submittingReply ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Đang gửi...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-3.5 w-3.5" />
                                    <span>Gửi phản hồi</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
