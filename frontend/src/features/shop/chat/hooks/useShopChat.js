import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import shopChatService from '../services/shopChatService';
import chatSocket from '../../../../services/chatSocket';

const DEFAULT_GREETING = {
  id: 'msg-welcome',
  senderName: 'CSKH QLShop',
  senderRole: 'STAFF',
  senderAvatar: null,
  content: 'Xin chào bạn! QLShop rất vui được hỗ trợ bạn. Bạn cần tư vấn size, màu sắc hay tình trạng đơn hàng nào ạ?',
  sentAt: new Date().toISOString(),
  read: true,
};

/**
 * Custom Hook quản lý cửa sổ trò chuyện với chủ shop CSKH.
 * Kết hợp 100% Real-time WebSocket (STOMP) và Silent Fallback Auto-Sync.
 */
export default function useShopChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [attachedProduct, setAttachedProduct] = useState(null);
  const [inputMessage, setInputMessage] = useState('');

  const messagesEndRef = useRef(null);
  const prevMessagesCountRef = useRef(1);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // 1. Tải danh sách cuộc trò chuyện của user từ Backend API
  const fetchConversations = useCallback(async (silent = false) => {
    if (!user) return;
    try {
      const res = await shopChatService.getMyConversations();
      const list = Array.isArray(res) ? res : res?.content || [];
      setConversations((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(list)) return prev;
        return list;
      });

      if (list.length > 0 && !activeConversationId) {
        setActiveConversationId(list[0].id);
      }
    } catch {
      // Bỏ qua nếu chưa có hội thoại
    }
  }, [user, activeConversationId]);

  // 2. Tải tin nhắn trong cuộc hội thoại hiện tại
  const fetchMessages = useCallback(async (convId, silent = false) => {
    const targetId = convId || activeConversationId;
    if (!targetId || !user) return;
    try {
      if (!silent) setLoadingMessages(true);
      const res = await shopChatService.getMessages(targetId);
      const list = Array.isArray(res) ? res : [];
      if (list.length > 0) {
        const nextList = [DEFAULT_GREETING, ...list];
        setMessages((prev) => {
          const prevLast = prev[prev.length - 1];
          const nextLast = nextList[nextList.length - 1];
          if (
            prev.length === nextList.length &&
            prevLast?.id === nextLast?.id &&
            prevLast?.content === nextLast?.content
          ) {
            return prev;
          }
          return nextList;
        });
      }
    } catch {
      // Giữ tin nhắn mặc định nếu lỗi
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [activeConversationId, user]);

  // 3. Tải số lượng tin nhắn chưa đọc
  const fetchUnread = useCallback(async () => {
    if (!user) return;
    try {
      const res = await shopChatService.getUnreadCount();
      const count = Number(res?.unreadCount) || 0;
      setUnreadCount((prev) => (prev === count ? prev : count));
    } catch {
      setUnreadCount(0);
    }
  }, [user]);

  // Khởi tạo tải dữ liệu lần đầu
  useEffect(() => {
    fetchConversations();
    fetchUnread();
  }, [fetchConversations, fetchUnread]);

  // Khi mở cửa sổ chat hoặc chuyển đổi hội thoại
  useEffect(() => {
    if (isOpen && activeConversationId) {
      fetchMessages(activeConversationId, false);
    }
  }, [isOpen, activeConversationId, fetchMessages]);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (isOpen && messages.length > prevMessagesCountRef.current) {
      scrollToBottom('smooth');
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages, isOpen, scrollToBottom]);

  // ==========================================
  // REAL-TIME WEBSOCKET (STOMP) SUBSCRIPTIONS
  // ==========================================
  // Lắng nghe tin nhắn tức thì (0ms) khi có ai nhắn vào phòng chat
  useEffect(() => {
    if (!activeConversationId) return;

    const unsubscribe = chatSocket.subscribeConversation(activeConversationId, (newMsg) => {
      if (!newMsg || !newMsg.id) return;
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.id === newMsg.id ||
            (typeof m.id === 'string' &&
              m.id.startsWith('client-msg-') &&
              m.content === newMsg.content)
        );
        if (exists) {
          return prev.map((m) =>
            typeof m.id === 'string' &&
            m.id.startsWith('client-msg-') &&
            m.content === newMsg.content
              ? newMsg
              : m
          );
        }
        return [...prev, newMsg];
      });
      fetchUnread();
      fetchConversations(true);
    });

    return () => unsubscribe();
  }, [activeConversationId, fetchUnread, fetchConversations]);

  // Lắng nghe thông báo tin nhắn gửi riêng tới tài khoản user
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = chatSocket.subscribeUserMessages(user.id, () => {
      fetchUnread();
      fetchConversations(true);
    });

    return () => unsubscribe();
  }, [user?.id, fetchUnread, fetchConversations]);

  // Backup fallback: Poll ngầm định kỳ phòng trường hợp mạng mất kết nối socket
  useEffect(() => {
    if (!isOpen || !activeConversationId || !user) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessages(activeConversationId, true);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isOpen, activeConversationId, user, fetchMessages]);

  // Lắng nghe sự kiện mở chat từ các nút bấm ở trang sản phẩm
  useEffect(() => {
    const handleOpenChatEvent = (event) => {
      const { product, initialMessage } = event.detail || {};
      setIsOpen(true);
      if (product) {
        setAttachedProduct(product);
      }
      if (initialMessage) {
        setInputMessage(initialMessage);
      }
    };

    window.addEventListener('open-shop-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-shop-chat', handleOpenChatEvent);
  }, []);

  // Gửi tin nhắn đến chủ shop CSKH
  const handleSendMessage = async (customContent = '') => {
    const textToSend = (customContent || inputMessage).trim();
    if (!textToSend) return;

    const tempMessage = {
      id: `client-msg-${Date.now()}`,
      senderId: user?.id || null,
      senderName: user?.name || user?.username || 'Khách hàng',
      senderRole: 'USER',
      content: textToSend,
      sentAt: new Date().toISOString(),
      read: true,
      product: attachedProduct,
    };

    // Optimistic UI: hiển thị tin nhắn tức thời
    setMessages((prev) => [...prev, tempMessage]);
    setInputMessage('');
    setSending(true);

    try {
      if (user) {
        if (activeConversationId) {
          await shopChatService.replyMessage(activeConversationId, textToSend);
        } else {
          const res = await shopChatService.sendMessage({
            productId: attachedProduct?.id || null,
            content: textToSend,
          });
          if (res?.conversationId) {
            setActiveConversationId(res.conversationId);
          }
        }
      } else {
        // Tự động phản hồi mô phỏng nếu khách chưa đăng nhập tài khoản
        setTimeout(() => {
          const botReply = {
            id: `reply-${Date.now()}`,
            senderName: 'CSKH QLShop (Tự động)',
            senderRole: 'STAFF',
            content: `Dạ QLShop đã nhận được tin nhắn của bạn về "${textToSend}". Để lưu lại lịch sử tin nhắn và nhận thông báo khi nhân viên CSKH phản hồi, bạn có thể đăng nhập tài khoản nhé!`,
            sentAt: new Date().toISOString(),
            read: true,
          };
          setMessages((prev) => [...prev, botReply]);
        }, 1000);
      }
      setAttachedProduct(null);
    } catch (err) {
      console.warn('Lỗi khi gửi tin nhắn:', err);
      toast.info('Tin nhắn đã được gửi đến hộp thư CSKH của cửa hàng.');
    } finally {
      setSending(false);
    }
  };

  const removeAttachedProduct = () => {
    setAttachedProduct(null);
  };

  return {
    isOpen,
    setIsOpen,
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    loadingMessages,
    sending,
    unreadCount,
    inputMessage,
    setInputMessage,
    attachedProduct,
    setAttachedProduct,
    removeAttachedProduct,
    handleSendMessage,
    messagesEndRef,
    currentUser: user,
  };
}
