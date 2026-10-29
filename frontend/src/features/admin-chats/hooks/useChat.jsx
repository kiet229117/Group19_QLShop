import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { chatService } from '../services/chatService';
import chatSocket from '../../../services/chatSocket';

const formatAdminMessage = (m) => {
  const roleUpper = (m.senderRole || '').toUpperCase();
  const isStaff = roleUpper.includes('ADMIN') || roleUpper.includes('STAFF');
  return {
    id: `msg-${m.id}`,
    sender: isStaff ? 'staff' : 'customer',
    senderName: m.senderName || (isStaff ? 'CSKH QLShop' : 'Khách hàng'),
    avatar:
      m.senderAvatar ||
      (isStaff
        ? 'https://ui-avatars.com/api/?name=CSKH&background=047857&color=fff'
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.senderName || 'U')}&background=0d9488&color=fff`),
    time: m.sentAt
      ? new Date(m.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      : 'Vừa xong',
    content: m.content,
    readStatus: m.read ? 'Đã đọc' : 'Chưa đọc',
  };
};

export default function useChat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeMessages, setActiveMessages] = useState([]);

  const prevActiveMessagesCountRef = useRef(0);

  // 1. Tải danh sách hội thoại từ Backend API (hỗ trợ silent ngầm không chớp màn hình)
  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await chatService.getConversations();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((c) => ({
          id: `conv-${c.id}`,
          conversationId: c.id,
          customer: {
            id: c.partnerId,
            name: c.partnerName || 'Khách hàng',
            role: c.partnerRole || 'USER',
            tier: (c.partnerRole || '').toUpperCase().includes('ADMIN')
              ? 'Quản trị'
              : (c.partnerRole || '').toUpperCase().includes('STAFF')
              ? 'Nhân viên'
              : 'Thành viên',
            tierClass: 'bg-slate-100 text-slate-800 border-slate-200',
            avatar:
              c.partnerAvatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(c.partnerName || 'Khách hàng')}&background=0d9488&color=fff`,
            phone: 'Khách hàng trực tuyến',
            email: `${(c.partnerName || 'customer').toLowerCase().replace(/\s+/g, '')}@qlshop.com`,
            totalSpent: '0 đ',
            totalOrders: 'Giao dịch online',
            status: 'online',
            channel: 'Website QLShop Storefront',
            staff: 'Admin CSKH',
          },
          lastMessage: c.lastMessage || 'Bắt đầu cuộc trò chuyện...',
          time: c.lastMessageAt
            ? new Date(c.lastMessageAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            : 'Vừa xong',
          tag: c.productName ? `SP: ${c.productName}` : 'Tư vấn thời trang',
          unreadCount: c.unreadCount || 0,
          statusType: c.unreadCount > 0 ? 'unread' : 'all',
          linkedProduct: c.productId
            ? {
                id: c.productId,
                name: c.productName,
                price: c.productPrice
                  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.productPrice)
                  : '',
                image: c.productImageUrl,
              }
            : null,
          messages: [],
        }));

        setConversations((prev) => {
          // So sánh tin nhắn cuối và số lượng để tránh re-render giật lag
          const prevSummary = prev.map((p) => `${p.id}_${p.lastMessage}_${p.unreadCount}`).join('|');
          const nextSummary = mapped.map((p) => `${p.id}_${p.lastMessage}_${p.unreadCount}`).join('|');
          if (prevSummary === nextSummary) return prev;
          return mapped;
        });

        setActiveId((prev) => (prev ? prev : mapped[0]?.id));
      } else {
        setConversations([]);
        setActiveId(null);
        setActiveMessages([]);
      }
    } catch (err) {
      console.warn('Lỗi khi tải danh sách cuộc trò chuyện từ /api/chat/conversations:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations(false);
  }, [fetchConversations]);

  // Cuộc trò chuyện đang chọn
  const activeConversation = useMemo(() => {
    const conv = conversations.find((c) => c.id === activeId) || conversations[0] || null;
    if (conv) {
      return {
        ...conv,
        messages: activeMessages,
      };
    }
    return null;
  }, [conversations, activeId, activeMessages]);

  // 2. Tải toàn bộ tin nhắn thật của cuộc trò chuyện đang mở (hỗ trợ silent ngầm)
  const fetchMessages = useCallback(async (conversationId, silent = false) => {
    if (!conversationId) return;
    if (!silent) setLoadingMessages(true);
    try {
      const msgs = await chatService.getMessages(conversationId);
      if (Array.isArray(msgs)) {
        const formatted = msgs.map(formatAdminMessage);

        setActiveMessages((prev) => {
          if (prev.length === formatted.length) {
            const prevLast = prev[prev.length - 1];
            const nextLast = formatted[formatted.length - 1];
            if (prevLast?.id === nextLast?.id && prevLast?.content === nextLast?.content) {
              return prev;
            }
          }
          return formatted;
        });
      } else {
        setActiveMessages([]);
      }
    } catch (err) {
      console.warn('Lỗi tải tin nhắn từ backend:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  // Khi chọn cuộc hội thoại khác
  useEffect(() => {
    const conv = conversations.find((c) => c.id === activeId);
    if (conv?.conversationId) {
      fetchMessages(conv.conversationId, false);
    }
  }, [activeId, fetchMessages]);

  // ==========================================
  // REAL-TIME WEBSOCKET (STOMP) SUBSCRIPTIONS
  // ==========================================
  // 3. Lắng nghe tin nhắn tức thời (0ms) cho cuộc hội thoại đang mở
  useEffect(() => {
    const conv = conversations.find((c) => c.id === activeId);
    if (!conv?.conversationId) return;

    const unsubscribe = chatSocket.subscribeConversation(conv.conversationId, (rawMsg) => {
      if (!rawMsg || !rawMsg.id) return;
      const formatted = formatAdminMessage(rawMsg);

      setActiveMessages((prev) => {
        // Thay thế optimistic message nếu có
        const hasOptimistic = prev.some(
          (m) =>
            typeof m.id === 'string' &&
            m.id.startsWith('msg-temp-') &&
            m.content === formatted.content
        );

        if (hasOptimistic) {
          return prev.map((m) =>
            typeof m.id === 'string' &&
            m.id.startsWith('msg-temp-') &&
            m.content === formatted.content
              ? formatted
              : m
          );
        }

        // Tránh trùng lặp tin nhắn
        if (prev.some((m) => m.id === formatted.id)) {
          return prev;
        }

        return [...prev, formatted];
      });

      // Cập nhật danh sách hội thoại ngầm để update lastMessage, time, unread
      fetchConversations(true);
    });

    return () => unsubscribe();
  }, [activeId, conversations, fetchConversations]);

  // 4. Lắng nghe thông báo Admin toàn cục khi có bất kỳ khách hàng nào gửi tin nhắn
  useEffect(() => {
    const unsubscribe = chatSocket.subscribeAdminConversations((rawMsg) => {
      // Khi có khách hàng gửi tin nhắn vào bất kỳ phòng chat nào
      fetchConversations(true);
      const conv = conversations.find((c) => c.id === activeId);
      if (conv?.conversationId && rawMsg?.conversationId === conv.conversationId) {
        fetchMessages(conv.conversationId, true);
      }
    });

    return () => unsubscribe();
  }, [activeId, conversations, fetchConversations, fetchMessages]);

  // 5. Silent Fallback Polling định kỳ mỗi 8s (phòng trường hợp mạng rớt socket)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const conv = conversations.find((c) => c.id === activeId);
        if (conv?.conversationId) {
          fetchMessages(conv.conversationId, true);
        }
        fetchConversations(true);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [activeId, conversations, fetchMessages, fetchConversations]);

  // 4. CSKH gửi tin nhắn phản hồi (Optimistic UI không giật lag)
  const sendMessage = async (content) => {
    if (!content?.trim() || !activeConversation?.conversationId) return;
    const text = content.trim();

    // Optimistic UI: Hiển thị tin nhắn ngay lập tức trong khung chat
    const tempMsg = {
      id: `msg-temp-${Date.now()}`,
      sender: 'staff',
      senderName: 'CSKH QLShop',
      avatar: 'https://ui-avatars.com/api/?name=CSKH&background=047857&color=fff',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      content: text,
      readStatus: 'Đang gửi...',
    };
    setActiveMessages((prev) => [...prev, tempMsg]);

    try {
      await chatService.replyMessage(activeConversation.conversationId, text);
      // Nạp lại dữ liệu thật một cách âm thầm
      fetchMessages(activeConversation.conversationId, true);
      fetchConversations(true);
    } catch (err) {
      alert('Không thể gửi tin nhắn: ' + (err.response?.data?.message || err.message));
      // Re-fetch để phục hồi tin nhắn chính xác nếu lỗi
      fetchMessages(activeConversation.conversationId, true);
    }
  };

  // Bộ lọc hội thoại theo Tab & Tìm kiếm
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (filterTab === 'unread' && c.unreadCount === 0) return false;
      if (filterTab === 'pending' && c.unreadCount > 0) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = c.customer.name.toLowerCase().includes(query);
        const matchMsg = c.lastMessage.toLowerCase().includes(query);
        if (!matchName && !matchMsg) return false;
      }
      return true;
    });
  }, [conversations, filterTab, searchQuery]);

  return {
    conversations: filteredConversations,
    rawConversations: conversations,
    allCount: conversations.length,
    unreadCount: conversations.filter((c) => c.unreadCount > 0).length,
    pendingCount: conversations.filter((c) => c.unreadCount === 0).length,
    activeConversation,
    activeId,
    setActiveId,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    sendMessage,
    loading,
    loadingMessages,
    refetch: fetchConversations,
  };
}
