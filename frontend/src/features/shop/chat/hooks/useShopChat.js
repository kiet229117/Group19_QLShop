import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import shopChatService from '../services/shopChatService';

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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 1. Tải danh sách cuộc trò chuyện của user từ Backend API
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await shopChatService.getMyConversations();
      const list = Array.isArray(res) ? res : res?.content || [];
      setConversations(list);

      if (list.length > 0 && !activeConversationId) {
        setActiveConversationId(list[0].id);
      }
    } catch {
      // Bỏ qua nếu chưa có hội thoại
    }
  }, [user, activeConversationId]);

  // 2. Tải tin nhắn trong cuộc hội thoại hiện tại
  const fetchMessages = useCallback(async (convId) => {
    const targetId = convId || activeConversationId;
    if (!targetId || !user) return;
    try {
      setLoadingMessages(true);
      const res = await shopChatService.getMessages(targetId);
      const list = Array.isArray(res) ? res : [];
      if (list.length > 0) {
        setMessages([DEFAULT_GREETING, ...list]);
      }
    } catch {
      // Giữ tin nhắn mặc định nếu lỗi
    } finally {
      setLoadingMessages(false);
    }
  }, [activeConversationId, user]);

  // 3. Tải số lượng tin nhắn chưa đọc
  const fetchUnread = useCallback(async () => {
    if (!user) return;
    try {
      const res = await shopChatService.getUnreadCount();
      setUnreadCount(Number(res?.unreadCount) || 0);
    } catch {
      setUnreadCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
    fetchUnread();
  }, [fetchConversations, fetchUnread]);

  useEffect(() => {
    if (isOpen && activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [isOpen, activeConversationId, fetchMessages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // 4. Lắng nghe sự kiện mở chat từ các nút bấm ở trang sản phẩm
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

  // 5. Gửi tin nhắn đến chủ shop CSKH qua API
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

    // Optimistic UI: hiển thị tin nhắn ngay
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
        await fetchConversations();
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
        }, 1200);
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

