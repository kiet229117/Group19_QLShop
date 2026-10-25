import api from '../../../../services/api';

/**
 * Service kết nối API Trò chuyện & Nhắn tin CSKH (Chat) phía Client Shop.
 */
export const sendMessage = async ({ productId, conversationId, content }, signal) => {
  const payload = {
    content: String(content || '').trim(),
    ...(productId ? { productId: Number(productId) } : {}),
    ...(conversationId ? { conversationId: Number(conversationId) } : {}),
  };
  const res = await api.post('/chat/send', payload, { signal });
  return res.data || res;
};

export const replyMessage = async (conversationId, content, signal) => {
  const res = await api.post(
    `/chat/conversations/${conversationId}/reply`,
    { content: String(content || '').trim() },
    { signal }
  );
  return res.data || res;
};

export const getMyConversations = async (signal) => {
  const res = await api.get('/chat/conversations', { signal });
  return res.data || res;
};

export const getMessages = async (conversationId, signal) => {
  const res = await api.get(`/chat/conversations/${conversationId}/messages`, { signal });
  return res.data || res;
};

export const getUnreadCount = async (signal) => {
  const res = await api.get('/chat/unread-count', { signal });
  return res.data || res;
};

export const shopChatService = {
  sendMessage,
  replyMessage,
  getMyConversations,
  getMessages,
  getUnreadCount,
};

export default shopChatService;

