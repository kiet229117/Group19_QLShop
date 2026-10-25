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
} from 'lucide-react';
import useShopComments from '../hooks/useShopComments';

const QUICK_TAGS = [
  'Chất vải thoáng mát',
  'Form áo lên dáng rất đẹp',
  'Đường may tỉ mỉ, chắc chắn',
  'Giao hàng nhanh đóng gói cẩn thận',
  'Vải cotton co giãn tốt',
];

/**
 * Component Hiển thị & Gửi bình luận sản phẩm phía Client Shop (Kết nối 100% API Backend).
 */
export default function ProductCommentsSection({ productId, productName }) {
  const {
    comments,
    loading,
    submitting,
    commentText,
    setCommentText,
    handleSubmitComment,
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
              Hỏi đáp &amp; Bình luận ({comments.length})
            </h2>
          </div>
          <p className="text-xs text-zinc-500 sm:text-sm">
            Chia sẻ cảm nhận thực tế về chất liệu vải, form dáng và trải nghiệm mặc của mẫu áo này.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200/60">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Bình luận thời gian thực qua API
        </span>
      </div>

      {/* Form nhập bình luận mới */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name || 'Avatar'}
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
              placeholder={`Bạn thấy mẫu áo "${productName || 'sản phẩm'}" thế nào? Hãy để lại nhận xét...`}
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

      {/* Danh sách bình luận đã có */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-zinc-400">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
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
              const formattedDate = comment.createdAt
                ? new Date(comment.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Vừa xong';

              const isOwner =
                currentUser &&
                comment.userId &&
                String(currentUser.id) === String(comment.userId);

              return (
                <div key={comment.id} className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm ring-1 ring-emerald-200">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (comment.userName || 'K').charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900">
                          {comment.userName || `Khách hàng #${comment.userId || 'vãng lai'}`}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                          Đã mua hàng
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formattedDate}
                        </span>
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Xóa bình luận"
                            className="text-zinc-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-zinc-700">
                      {comment.content}
                    </p>

                    <div className="pt-1">
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
                          className={`h-3.5 w-3.5 ${likes[comment.id] ? 'fill-rose-600' : ''}`}
                        />
                        <span>{likes[comment.id] ? 'Đã thích' : 'Hữu ích'}</span>
                      </button>
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

