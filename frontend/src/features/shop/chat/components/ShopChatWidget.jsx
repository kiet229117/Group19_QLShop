import { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Minimize2,
} from 'lucide-react';
import useShopChat from '../hooks/useShopChat';
import { formatCurrency } from '../../shared/utils/formatters';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';

const QUICK_QUESTIONS = [
  'Shop còn size L áo này không?',
  'Bao lâu thì nhận được hàng ạ?',
  'Phí vận chuyển tính như thế nào?',
  'Shop có hỗ trợ đổi trả nếu không vừa size không?',
];

/**
 * Cửa sổ chat nổi (Floating CSKH Chat Widget) cho toàn bộ Client Shop.
 * Kết nối trực tiếp API Backend (`/api/chat/send`, `/api/chat/conversations`).
 */
export default function ShopChatWidget() {
  const {
    isOpen,
    setIsOpen,
    messages,
    loadingMessages,
    sending,
    unreadCount,
    inputMessage,
    setInputMessage,
    attachedProduct,
    removeAttachedProduct,
    handleSendMessage,
    messagesEndRef,
    currentUser,
  } = useShopChat();

  const [minimized, setMinimized] = useState(false);

  const onSubmitForm = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleQuickQuestion = (q) => {
    handleSendMessage(q);
  };

  return (
    <>
      {/* 1. NÚT NỔI GÓC DƯỚI (FLOATING TRIGGER BUTTON) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setMinimized(false);
            }}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 active:scale-95 sm:px-5"
          >
            {/* Chấm tròn báo trạng thái trực tuyến */}
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-200" />
            </span>

            <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-xs sm:text-sm tracking-tight font-extrabold">Nhắn tin CSKH</span>

            {/* Badge tin nhắn chưa đọc */}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* 2. CỬA SỔ HỘP THOẠI CHAT TRỰC TUYẾN */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-2xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:w-96 ${
            minimized ? 'h-16' : 'h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Header hộp thoại */}
          <div className="flex items-center justify-between bg-zinc-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 font-black text-white shadow-md">
                <span>QL</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 bg-emerald-400" />
              </div>
              <div className="leading-tight">
                <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>Chủ shop &amp; CSKH QLShop</span>
                </h3>
                <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Đang trực tuyến • Phản hồi ngay
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMinimized((prev) => !prev)}
                title={minimized ? 'Phóng to' : 'Thu nhỏ'}
                className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                {minimized ? <ChevronDown className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng cửa sổ chat"
                className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Thẻ đính kèm sản phẩm khách hàng đang hỏi */}
              {attachedProduct && (
                <div className="flex items-center justify-between border-b border-zinc-100 bg-emerald-50/70 p-3 text-xs text-zinc-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={resolveShopImageUrl(attachedProduct.image)}
                      alt={attachedProduct.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover border border-emerald-200"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-zinc-900">{attachedProduct.name}</p>
                      <p className="font-semibold text-rose-600">
                        {formatCurrency(attachedProduct.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachedProduct}
                    className="p-1 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Vùng hiển thị tin nhắn */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
                {loadingMessages && (
                  <div className="flex justify-center py-2 text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    <span>Đang đồng bộ tin nhắn...</span>
                  </div>
                )}

                {messages.map((msg, index) => {
                  const isUser = msg.senderRole === 'USER' || msg.senderId === currentUser?.id;
                  const timeFormatted = msg.sentAt
                    ? new Date(msg.sentAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Vừa xong';

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          QL
                        </div>
                      )}

                      <div
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                          isUser
                            ? 'bg-zinc-900 text-white rounded-br-xs'
                            : 'bg-zinc-100 text-zinc-800 rounded-bl-xs'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`mt-1 text-[9px] text-right ${
                            isUser ? 'text-zinc-400' : 'text-zinc-400'
                          }`}
                        >
                          {timeFormatted}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Gợi ý câu hỏi nhanh */}
              <div className="border-t border-zinc-100 bg-zinc-50/60 p-2.5">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Câu hỏi nhanh:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQuickQuestion(q)}
                      className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khung nhập tin nhắn */}
              <form
                onSubmit={onSubmitForm}
                className="flex items-center gap-2 border-t border-zinc-200 bg-white p-3"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn cho chủ shop..."
                  disabled={sending}
                  className="h-10 flex-1 rounded-xl border border-zinc-200 px-3.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={sending || !inputMessage.trim()}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-emerald-600 disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

