import { useState, useEffect, useCallback, useMemo } from 'react';
import { chatService } from '../services/chatService';

export default function useChat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeMessages, setActiveMessages] = useState([]);

  // 1. Tải danh sách hội thoại từ Backend API (GET /api/chat/conversations)
  const fetchConversations = useCallback(async () => {
    setLoading(true);
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

        setConversations(mapped);
        setActiveId((prev) => (prev ? prev : mapped[0]?.id));
      } else {
        setConversations([]);
        setActiveId(null);
        setActiveMessages([]);
      }
    } catch (err) {
      console.warn('Lỗi khi tải danh sách cuộc trò chuyện từ /api/chat/conversations:', err);
      setConversations([]);
      setActiveId(null);
      setActiveMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
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

  // 2. Tải toàn bộ tin nhắn thật của cuộc trò chuyện đang mở (GET /api/chat/conversations/{id}/messages)
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      const msgs = await chatService.getMessages(conversationId);
      if (Array.isArray(msgs)) {
        const formatted = msgs.map((m) => {
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
        });
        setActiveMessages(formatted);
      } else {
        setActiveMessages([]);
      }
    } catch (err) {
      console.warn('Lỗi tải tin nhắn từ backend:', err);
      setActiveMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    const conv = conversations.find((c) => c.id === activeId);
    if (conv?.conversationId) {
      fetchMessages(conv.conversationId);
    }
  }, [activeId, conversations, fetchMessages]);

  // 3. CSKH gửi tin nhắn phản hồi (POST /api/chat/conversations/{id}/reply)
  const sendMessage = async (content) => {
    if (!content?.trim() || !activeConversation?.conversationId) return;
    try {
      await chatService.replyMessage(activeConversation.conversationId, content.trim());
      // Nạp lại tin nhắn mới ngay lập tức
      await fetchMessages(activeConversation.conversationId);
      // Cập nhật lại tin nhắn cuối cùng trên danh sách
      await fetchConversations();
    } catch (err) {
      alert('Không thể gửi tin nhắn: ' + (err.response?.data?.message || err.message));
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
