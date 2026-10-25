import React from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Filter,
  RefreshCw,
  CheckCircle2,
  Pin,
  EyeOff,
  ShieldAlert,
  Zap,
  Download,
  ChevronDown,
  Check,
  X,
  Smartphone,
  Headphones,
  BatteryCharging,
  Send,
  MessageCircle,
  AlertTriangle,
  ShieldCheck,
  Search,
  Sliders,
  MoreVertical,
  Trash2,
  ExternalLink,
  ShieldX,
  Edit2,
  Loader2
} from 'lucide-react';
import useComments from '../hooks/useComments';

export default function CommentsPage() {
  const {
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
    handleRemoveKeyword
  } = useComments();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-12">
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">
            Phân hệ Quản trị &gt; Khách hàng &amp; CSKH &gt; <span className="text-gray-800 font-semibold">Bình luận &amp; Đánh giá</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1">
            Quản lý Bình luận &amp; Đánh giá Khách hàng
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Kiểm duyệt bình luận, chỉnh sửa nội dung, xóa vi phạm, và phản hồi thắc mắc của khách hàng từ cơ sở dữ liệu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReviews}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Làm mới DB</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. STAT CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              TỔNG SỐ BÌNH LUẬN
            </span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {loading ? 'Đang tải...' : reviews.length}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                Live DB
              </span>
              <span className="text-gray-400">bình luận hệ thống</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              HIỂN THỊ CÔNG KHAI
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              {loading ? '...' : reviews.filter((r) => !r.hidden).length}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              Đang xuất hiện trên storefront
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              ĐÃ ẨN / TẠM KHÓA
            </span>
            <div className="text-2xl font-black text-rose-600 mt-0.5">
              {loading ? '...' : reviews.filter((r) => r.hidden).length}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              Chờ xử lý hoặc kiểm duyệt
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              TRẠNG THÁI KẾT NỐI
            </span>
            <div className="text-lg font-black text-emerald-700 mt-0.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {loading ? 'Đang kết nối...' : 'GET /api/comments'}
            </div>
            <div className="mt-1 text-[11px] text-gray-400 font-mono">
              Spring Boot MySQL
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. BỘ LỌC
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
              TRẠNG THÁI HIỂN THỊ
            </label>
            <select
              value={moderationStatus}
              onChange={(e) => setModerationStatus(e.target.value)}
              className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 font-medium focus:outline-emerald-600"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="APPROVED">Đang hiển thị công khai</option>
              <option value="HIDDEN">Đã ẩn / Vi phạm</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
              SẮP XẾP
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 font-medium focus:outline-emerald-600"
            >
              <option value="NEWEST">Mới nhất trước</option>
              <option value="OLDEST">Cũ nhất trước</option>
            </select>
          </div>

          <div className="flex items-end gap-2 pt-4 sm:pt-0">
            <button
              onClick={fetchReviews}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đồng bộ từ Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. MAIN SECTION: REVIEWS LIST (LEFT) & ANALYTICS (RIGHT)
          ========================================================================= */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <div className="font-bold text-gray-800 text-sm">Đang nạp dữ liệu bình luận từ cơ sở dữ liệu...</div>
          <div className="text-xs text-gray-400 mt-1">Kết nối API: GET /api/comments</div>
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 space-y-3">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="font-black text-gray-900 text-base">Cơ sở dữ liệu chưa có Bình luận nào</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Hệ thống đã kết nối thành công đến API backend. Khi khách hàng để lại bình luận hoặc đánh giá trên sản phẩm storefront, dữ liệu thật sẽ lập tức xuất hiện tại đây!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (8/12): DANH SÁCH BÌNH LUẬN THẬT TỪ DATABASE */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 pb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">Danh sách bình luận thật từ DB</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[11px] font-semibold">
                  Hiển thị {filteredReviews.length} của {reviews.length}
                </span>
              </div>
              <div className="text-gray-500 text-[11px]">
                Trang {currentPage} / {totalPages}
              </div>
            </div>

            {paginatedReviews.map((rev) => (
              <div
                key={rev.id}
                className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 ${
                  rev.hidden ? 'border-rose-200 bg-rose-50/20' : 'border-gray-200/90'
                }`}
              >
                {/* User info row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.user.avatar}
                      alt={rev.user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.user.name}</span>
                        {rev.user.username && (
                          <span className="text-[11px] text-gray-400 font-mono">
                            (@{rev.user.username})
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                          Mã KH: #{rev.userId}
                        </span>
                        {rev.hidden && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Đã ẩn
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Bản ghi #{rev.backendId} • Ngày đăng: {rev.timeAgo} • {rev.product.name}
                      </div>
                    </div>
                  </div>

                  {/* THAO TÁC SỬA & XÓA BÌNH LUẬN TRỰC TIẾP */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditComment(rev)}
                      className="text-gray-400 hover:text-emerald-700 p-1.5 rounded-lg border border-gray-200 hover:bg-emerald-50 transition"
                      title="Sửa nội dung bình luận"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(rev.backendId)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg border border-gray-200 hover:bg-rose-50 transition"
                      title="Xóa bình luận khỏi DB (Soft Delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="text-xs text-slate-800 leading-relaxed font-medium bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                  "{rev.content}"
                </div>

                {/* Official Store Reply Box if present */}
                {rev.officialReply && (
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-emerald-700 text-white uppercase">
                          {rev.officialReply.role}
                        </span>
                        <span className="font-bold text-slate-900">{rev.officialReply.author}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      "{rev.officialReply.content}"
                    </p>
                  </div>
                )}

                {/* Bottom Bar: Sửa, Ẩn, Phản hồi */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Hệ thống QLShop</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditComment(rev)}
                      className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Sửa nội dung</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleHide(rev.id)}
                      className={`px-3 py-1 rounded-lg border text-xs font-semibold transition ${
                        rev.hidden
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {rev.hidden ? 'Bỏ ẩn' : 'Ẩn đánh giá'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenReplyModal(rev)}
                      className="px-3.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-2xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Phản hồi</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Phân trang cho Danh sách bình luận */}
            <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
              <div className="flex items-center gap-2">
                <span>Hiển thị</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 font-semibold focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>
                  từ <strong className="text-gray-800">{filteredReviews.length > 0 ? startIndex + 1 : 0}</strong> -{' '}
                  <strong className="text-gray-800">{endIndex}</strong> trên tổng số{' '}
                  <strong className="text-gray-800">{filteredReviews.length}</strong> bình luận
                </span>
              </div>

              <div className="flex items-center gap-1 font-semibold text-gray-600">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  |&lt;
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-0.5 rounded transition ${
                      currentPage === page
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'border border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  &gt;
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[10px]"
                >
                  &gt;|
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (4/12): ANALYTICS & THỐNG KÊ */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    TỔNG HỢP TỪ DATABASE
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400">Live DB</span>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <div className="text-3xl font-black text-slate-900 leading-none">
                    {reviews.length}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-semibold">Bình luận tổng</div>
                </div>

                <div className="flex-1 space-y-1.5 text-[11px] font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-16 shrink-0">Hiển thị</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-700 h-full rounded-full"
                        style={{
                          width: `${reviews.length > 0 ? (reviews.filter((r) => !r.hidden).length / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right font-bold text-slate-800">
                      {reviews.filter((r) => !r.hidden).length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-16 shrink-0">Đã ẩn</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{
                          width: `${reviews.length > 0 ? (reviews.filter((r) => r.hidden).length / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right font-bold text-slate-800">
                      {reviews.filter((r) => r.hidden).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    Quy tắc Kiểm duyệt (Active)
                  </h3>
                </div>
              </div>

              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Chỉnh sửa nội dung vi phạm trực tiếp qua API `PUT /api/comments/{'{id}'}`.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Đồng bộ và thực hiện Soft Delete trực tiếp vào database MySQL (`DELETE /api/comments/{'{id}'}`).</span>
                </li>
              </ul>

              <button
                onClick={() => setIsAiFilterConfigOpen(true)}
                className="w-full py-2 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-slate-700 font-bold text-xs transition text-center"
              >
                Cấu hình từ khóa cấm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL SỬA NỘI DUNG BÌNH LUẬN (EDIT COMMENT MODAL)
          ========================================================================= */}
      {isEditModalOpen && editingComment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Chỉnh sửa nội dung bình luận</h3>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Bình luận #{editingComment.backendId} • User ID #{editingComment.userId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditComment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nội dung bình luận <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Nhập nội dung bình luận đã điều chỉnh..."
                  className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:outline-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingComment}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-bold text-xs text-white shadow-2xs flex items-center gap-1.5"
                >
                  {savingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{savingComment ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PHẢN HỒI */}
      {isReplyModalOpen && activeReviewForReply && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">
                  Phản hồi: {activeReviewForReply.user.name}
                </h3>
              </div>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
              <div className="text-gray-600 italic">"{activeReviewForReply.content}"</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nội dung phản hồi CSKH
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập nội dung phản hồi khách hàng..."
                className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:outline-emerald-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsReplyModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveReply}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 font-bold text-xs text-white shadow-2xs"
              >
                Lưu phản hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẤU HÌNH TỪ KHÓA CẤM */}
      {isAiFilterConfigOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShieldX className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Cấu hình Từ khóa Cấm
                </h3>
              </div>
              <button
                onClick={() => setIsAiFilterConfigOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKeyword} className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Nhập từ khóa cấm..."
                className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-emerald-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg"
              >
                Thêm
              </button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
              {blacklistKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-300 text-slate-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-gray-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsAiFilterConfigOpen(false)}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
