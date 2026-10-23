import { useState, useRef, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  Send,
  Smile,
  Paperclip,
  CreditCard,
  Bot,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  ShoppingBag,
  Truck,
  Copy,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  CheckCheck,
  Gift,
  PhoneCall,
  X
} from 'lucide-react';
import useChat from '../hooks/useChat';

export default function ChatsPage() {
  const {
    conversations,
    allCount,
    unreadCount,
    pendingCount,
    activeConversation,
    activeId,
    setActiveId,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    sendMessage,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Xử lý gửi tin nhắn
  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  // Phím tắt gửi tin nhắn nhanh
  const applyQuickReply = (text) => {
    setInputText(text);
  };

  return (
    <div className="space-y-3 max-w-[1700px] mx-auto text-xs pb-6">
      {/* =========================================================================
          TOP BANNER THÔNG TIN CSKH
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-200/80 shadow-2xs gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-gray-800">
            Trực tuyến: CSKH đang tiếp nhận <strong className="text-emerald-800">{conversations.length} cuộc hội thoại</strong> ({unreadCount} tin chưa đọc)
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-500">
          <span className="text-[11px]">Kênh tích hợp: Web Chat, Zalo OA, Shopee</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
            SLAs: 98.4%
          </span>
        </div>
      </div>

      {/* =========================================================================
          BỐ CỤC CHÍNH 3 CỘT (3-COLUMN LIVE CHAT & CRM)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-[calc(100vh-160px)] min-h-[640px]">
        {/* =======================================================================
            CỘT 1 (3/12): HỘP THƯ CSKH (DANH SÁCH CUỘC HỘI THOẠI)
            ======================================================================= */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs flex flex-col overflow-hidden">
          {/* Header Cột 1 */}
          <div className="p-3 border-b border-gray-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-xs tracking-tight">
                Hộp thư CSKH (Omnichannel)
              </h2>
              <button className="text-gray-400 hover:text-gray-700 p-0.5">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tabs Lọc */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 text-[11px]">
              <button
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1 rounded-md font-semibold transition ${
                  filterTab === 'all' ? 'bg-emerald-800 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tất cả ({allCount})
              </button>
              <button
                onClick={() => setFilterTab('unread')}
                className={`flex-1 py-1 rounded-md font-semibold transition ${
                  filterTab === 'unread' ? 'bg-emerald-800 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
              <button
                onClick={() => setFilterTab('pending')}
                className={`flex-1 py-1 rounded-md font-semibold transition ${
                  filterTab === 'pending' ? 'bg-emerald-800 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Chờ xử lý ({pendingCount})
              </button>
            </div>

            {/* Ô tìm kiếm hội thoại */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm người gửi, nội dung chat..."
                className="w-full pl-7 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[11px] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Danh sách Hội thoại (Scrollable) */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-gray-300" />
                <div className="font-bold text-xs text-gray-600">Chưa có cuộc trò chuyện</div>
                <div className="text-[11px] text-gray-400">
                  Tin nhắn mới từ khách hàng storefront sẽ xuất hiện tại đây theo thời gian thực.
                </div>
              </div>
            ) : (
              conversations.map((c) => {
                const isActive = activeId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`p-3 transition-colors cursor-pointer flex items-start gap-2.5 ${
                      isActive ? 'bg-emerald-50/40 border-l-4 border-l-emerald-600' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={c.customer.avatar}
                        alt={c.customer.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      {c.customer.status === 'online' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-gray-900 truncate">{c.customer.name}</span>
                          <span className={`px-1 py-0.2 rounded text-[9px] font-bold border ${c.customer.tierClass}`}>
                            {c.customer.tier}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{c.time}</span>
                      </div>

                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{c.lastMessage}</p>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 text-[9px] font-medium truncate max-w-[150px]">
                          {c.tag}
                        </span>
                        {c.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Cột 1 */}
          <div className="p-2 px-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
            <span>Kết nối: Web Chat, Zalo OA</span>
            <span className="text-emerald-700 font-semibold">SLAs: 98.4%</span>
          </div>
        </div>

        {/* =======================================================================
            CỘT 2 (6/12): KHUNG CHAT TRỰC TUYẾN (TRUNG TÂM)
            ======================================================================= */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200/80 shadow-2xs flex flex-col overflow-hidden">
          {!activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">Hộp thoại CSKH Trực tuyến</h3>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Chưa có phiên hội thoại nào được chọn. Nhấp vào một cuộc trò chuyện từ danh sách hoặc đợi khách hàng gửi tin nhắn.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header Khung Chat */}
              <div className="p-3 px-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={activeConversation.customer.avatar}
                      alt={activeConversation.customer.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-sm">{activeConversation.customer.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${activeConversation.customer.tierClass}`}>
                        {activeConversation.customer.tier}
                      </span>
                      <span className="text-emerald-600 font-semibold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> online
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      NV phụ trách: <strong>{activeConversation.customer.staff}</strong> • Kênh: {activeConversation.customer.channel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 text-[11px] shadow-2xs transition">
                    <ArrowRightLeft className="w-3 h-3 text-gray-500" />
                    <span>Chuyển giao phiên</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] shadow-sm transition">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Đóng hội thoại</span>
                  </button>
                </div>
              </div>

          {/* Thân Tin Nhắn (Scrollable Messages Body) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fbfdfc]">
            {/* Pill thông báo bắt đầu phiên */}
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium border border-gray-200/60">
                Phiên hỗ trợ #{activeConversation.id || 'CHAT'} • {activeConversation.customerName || 'Khách hàng'} • Trực tuyến
              </span>
            </div>

            {/* Render các tin nhắn */}
            {activeConversation?.messages?.map((msg) => {
              // 1. Thẻ Đơn hàng lồng trong khung chat
              if (msg.sender === 'system-order' && activeConversation.linkedOrder) {
                const ord = activeConversation.linkedOrder;
                return (
                  <div key={msg.id} className="max-w-md my-2 rounded-xl border border-gray-200 bg-white p-3 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-[11px]">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        📦 Đơn hàng liên kết: <strong>{ord.id}</strong>
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${ord.statusClass}`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 py-2.5">
                      <img src={ord.image} alt={ord.productName} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 truncate">{ord.productName}</div>
                        <div className="text-[10px] text-gray-400">{ord.productVariant}</div>
                        <div className="font-black text-emerald-800 text-xs mt-0.5">{ord.price}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-emerald-600" />
                        Sẵn sàng bàn giao tài xế GHN
                      </span>
                      <a href="/admin/orders" className="text-emerald-800 hover:underline font-bold">
                        Chi tiết đơn &rarr;
                      </a>
                    </div>
                  </div>
                );
              }

              // 2. Tin nhắn của Khách hàng
              if (msg.sender === 'customer') {
                return (
                  <div key={msg.id} className="flex items-start gap-2.5 max-w-lg">
                    <img src={msg.avatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-gray-400 mb-0.5">
                        <span className="font-bold text-gray-700">{msg.senderName}</span> • {msg.time}
                      </div>
                      <div className="p-3 rounded-2xl rounded-tl-xs bg-white text-gray-800 border border-gray-200/80 shadow-2xs text-xs leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. Tin nhắn của Nhân viên CSKH (Staff)
              return (
                <div key={msg.id} className="flex items-start justify-end gap-2.5 ml-auto max-w-lg">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 mb-0.5">
                      {msg.time} • <span className="font-bold text-emerald-800">{msg.senderName}</span>
                    </div>
                    <div className="p-3 rounded-2xl rounded-tr-xs bg-emerald-800 text-white shadow-xs text-xs leading-relaxed text-left">
                      {msg.content}
                    </div>
                    {msg.readStatus && (
                      <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1">
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                        <span>{msg.readStatus}</span>
                      </div>
                    )}
                  </div>
                  <img src={msg.avatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Thanh Phím Tắt Trả Lời Nhanh (Quick Replies) */}
          <div className="p-2 px-3 bg-gray-50/80 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-gray-400 font-bold shrink-0 flex items-center gap-1 text-[10px]">
              ⚡ PHÍM TẮT:
            </span>
            <button
              onClick={() => applyQuickReply('Dạ NovaCommerce chào bạn! Shop có thể hỗ trợ gì cho bạn hôm nay ạ?')}
              className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shrink-0 shadow-2xs font-medium"
            >
              /chao-hoi (Chào mẫu)
            </button>
            <button
              onClick={() => applyQuickReply('Dạ bạn hoàn toàn được kiểm tra hàng trước khi thanh toán (đồng kiểm niêm phong) nhé ạ!')}
              className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shrink-0 shadow-2xs font-medium"
            >
              /van-chuyen (Quy định đồng kiểm)
            </button>
            <button
              onClick={() => applyQuickReply('Shop xin gửi tặng bạn voucher giảm 50.000đ cho đơn hàng tiếp theo: NOVA50K')}
              className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shrink-0 shadow-2xs font-medium"
            >
              /voucher-50k
            </button>
          </div>

          {/* Ô Nhập Tin Nhắn & Nút Gửi */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200/80 space-y-2 shrink-0">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nhập tin nhắn phản hồi (Nhấn Enter để gửi, Shift+Enter để xuống dòng)..."
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-emerald-500 resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <button type="button" className="p-1 hover:text-gray-700">
                  <Smile className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 hover:text-gray-700">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 hover:text-gray-700">
                  <CreditCard className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 hover:text-emerald-700 flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Trợ lý AI gợi ý phản hồi sẵn sàng</span>
                </button>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition active:scale-95"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
          </>
          )}
        </div>

        {/* =======================================================================
            CỘT 3 (3/12): HỒ SƠ KHÁCH HÀNG (CRM) & THÔNG TIN ĐƠN HÀNG
            ======================================================================= */}
        {activeConversation ? (
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs flex flex-col overflow-y-auto p-3.5 space-y-3.5">
            {/* Header Cột 3 */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-xs tracking-tight flex items-center gap-1.5">
                <span className="text-emerald-700">📁</span> HỒ SƠ KHÁCH HÀNG (CRM)
              </h3>
              <a href="/admin/users" className="text-[10px] text-emerald-800 hover:underline font-bold flex items-center gap-0.5">
                <span>Chi tiết</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Profile Khách hàng */}
            <div className="flex items-center gap-3 p-2.5 bg-gray-50/70 rounded-xl border border-gray-100">
              <img
                src={activeConversation.customer.avatar}
                alt={activeConversation.customer.name}
                className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-emerald-500/20"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 truncate">{activeConversation.customer.name}</h4>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${activeConversation.customer.tierClass}`}>
                    {activeConversation.customer.tier}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-gray-400" />
                  {activeConversation.customer.phone}
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                  {activeConversation.customer.email}
                </div>
              </div>
            </div>

            {/* Chỉ số Tích lũy & Đơn hàng */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">TÍCH LŨY CHI TIÊU</span>
                <div className="text-xs font-black text-gray-900 mt-0.5">{activeConversation.customer.totalSpent}</div>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">TỔNG ĐƠN HÀNG</span>
                <div className="text-xs font-black text-emerald-800 mt-0.5">{activeConversation.customer.totalOrders}</div>
              </div>
            </div>

            {/* Đơn hàng gần nhất */}
            {activeConversation.linkedOrder && (
              <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1 text-gray-800">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    Đơn hàng gần nhất
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    {activeConversation.linkedOrder.deliveryStatus}
                  </span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-gray-400">Mã đơn:</span>
                  <strong className="text-gray-900">{activeConversation.linkedOrder.id}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Mã vận đơn:</span>
                  <span className="font-mono text-gray-800 flex items-center gap-1">
                    {activeConversation.linkedOrder.carrierCode}
                    <Copy className="w-2.5 h-2.5 text-gray-400 cursor-pointer" />
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Địa chỉ giao:</span>
                  <span className="text-gray-700 text-right">{activeConversation.linkedOrder.shippingAddress}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Thanh toán:</span>
                  <strong className="text-gray-900">{activeConversation.linkedOrder.paymentMethod}</strong>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-gray-200 text-[10px]">
                  <span className="text-emerald-700 font-semibold">Dự kiến giao: {activeConversation.linkedOrder.eta}</span>
                  <a href="/admin/orders" className="text-gray-500 hover:text-emerald-800 font-medium">
                    Xem lộ trình
                  </a>
                </div>
              </div>
            )}

            {/* Giỏ hàng hiện tại (Đang mở) */}
            {activeConversation.activeCart && (
              <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100 space-y-2 text-[11px]">
                <div className="flex items-center justify-between font-bold text-gray-800">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    Giỏ hàng hiện tại (Đang mở)
                  </span>
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {activeConversation.activeCart.count}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <img
                    src={activeConversation.activeCart.image}
                    alt={activeConversation.activeCart.name}
                    className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{activeConversation.activeCart.name}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-bold text-gray-900">{activeConversation.activeCart.price}</span>
                      <span className="text-[10px] text-gray-400">SL: {activeConversation.activeCart.quantity}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 italic">
                  {activeConversation.activeCart.updatedAgo}
                </p>
              </div>
            )}

            {/* Ghi chú CSKH nội bộ */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>📝 Ghi chú CSKH nội bộ</span>
                <button className="text-[10px] text-emerald-800 hover:underline font-bold">
                  + Thêm ghi chú
                </button>
              </div>

              {activeConversation.notes?.map((n, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/70 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-900">{n.author}</span>
                    <span className="text-gray-400">{n.date}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-[10px]">{n.content}</p>
                </div>
              ))}
            </div>

            {/* Tác vụ hỗ trợ tức thì */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                TÁC VỤ HỖ TRỢ TỨC THÌ
              </span>

              <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Tạo đơn hàng hỗ trợ</span>
              </button>

              <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition">
                <Gift className="w-3.5 h-3.5 text-amber-700" />
                <span>Tặng Voucher giảm giá 50k</span>
              </button>

              <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-200 transition">
                <PhoneCall className="w-3.5 h-3.5 text-gray-500" />
                <span>Gọi hotline ngay (VoIP Cloud)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs flex flex-col items-center justify-center p-8 text-center text-gray-400 space-y-2">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
            <div className="font-bold text-xs text-gray-700">Hồ sơ khách hàng (CRM)</div>
            <p className="text-[11px] text-gray-400">
              Chọn cuộc trò chuyện ở danh sách để xem chi tiết lịch sử mua sắm và giỏ hàng của khách.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

