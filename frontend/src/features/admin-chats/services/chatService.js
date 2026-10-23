import api from '../../../services/api';

export const chatService = {
  // 1. Lấy danh sách toàn bộ cuộc trò chuyện của shop (GET /api/chat/conversations)
  getConversations: async () => {
    const res = await api.get('/chat/conversations');
    return res.data || res;
  },

  // 2. Lấy chi tiết toàn bộ tin nhắn trong cuộc hội thoại (GET /api/chat/conversations/{conversationId}/messages)
  getMessages: async (conversationId) => {
    const res = await api.get(`/chat/conversations/${conversationId}/messages`);
    return res.data || res;
  },

  // 3. Nhân viên CSKH phản hồi tin nhắn (POST /api/chat/conversations/{conversationId}/reply)
  replyMessage: async (conversationId, content) => {
    const res = await api.post(`/chat/conversations/${conversationId}/reply`, { content });
    return res.data || res;
  },

  // 4. Lấy số lượng tin nhắn chưa đọc cho badge thông báo (GET /api/chat/unread-count)
  getUnreadCount: async () => {
    const res = await api.get('/chat/unread-count');
    return res.data || res;
  },
};

export default chatService;

