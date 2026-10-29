import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// Địa chỉ WebSocket endpoint (/ws-chat)
const WS_ENDPOINT = API_BASE_URL.replace(/\/api$/, '') + '/ws-chat';

class ChatSocketManager {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = new Map(); // key: destination, value: Set<callback>
    this.activeSubscriptions = new Map(); // key: destination, value: StompSubscription
  }

  /**
   * Khởi tạo kết nối STOMP qua SockJS fallback
   */
  connect() {
    if (this.client && (this.client.active || this.connected)) {
      return this.client;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {}, // Bật console.log để debug nếu cần
      onConnect: () => {
        this.connected = true;
        // Tái đăng ký lại các kênh khi kết nối lại
        this.resubscribeAll();
      },
      onDisconnect: () => {
        this.connected = false;
      },
      onStompError: (frame) => {
        console.warn('Lỗi STOMP Broker:', frame.headers['message']);
      },
      onWebSocketError: () => {
        // Tự động thử kết nối lại
      },
    });

    try {
      this.client.activate();
    } catch (e) {
      console.warn('Không thể kích hoạt kết nối WebSocket:', e);
    }

    return this.client;
  }

  resubscribeAll() {
    if (!this.client || !this.client.connected) return;

    this.subscribers.forEach((callbacks, destination) => {
      if (callbacks.size > 0 && !this.activeSubscriptions.has(destination)) {
        try {
          const sub = this.client.subscribe(destination, (message) => {
            try {
              const data = JSON.parse(message.body);
              callbacks.forEach((cb) => {
                try {
                  cb(data);
                } catch (err) {
                  console.error('Lỗi thực thi callback message:', err);
                }
              });
            } catch {
              callbacks.forEach((cb) => cb(message.body));
            }
          });
          this.activeSubscriptions.set(destination, sub);
        } catch (err) {
          console.warn(`Lỗi khi subscribe ${destination}:`, err);
        }
      }
    });
  }

  /**
   * Đăng ký lắng nghe sự kiện trên một kênh (topic/queue)
   * @param {string} destination VD: '/topic/conversations/1'
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(destination, callback) {
    if (!destination || typeof callback !== 'function') return () => {};

    if (!this.subscribers.has(destination)) {
      this.subscribers.set(destination, new Set());
    }
    this.subscribers.get(destination).add(callback);

    this.connect();

    if (this.client && this.client.connected && !this.activeSubscriptions.has(destination)) {
      try {
        const sub = this.client.subscribe(destination, (message) => {
          try {
            const data = JSON.parse(message.body);
            const cbs = this.subscribers.get(destination);
            if (cbs) cbs.forEach((cb) => cb(data));
          } catch {
            const cbs = this.subscribers.get(destination);
            if (cbs) cbs.forEach((cb) => cb(message.body));
          }
        });
        this.activeSubscriptions.set(destination, sub);
      } catch (err) {
        console.warn(`Lỗi khi subscribe ${destination}:`, err);
      }
    }

    // Trả về hàm hủy đăng ký
    return () => {
      const cbs = this.subscribers.get(destination);
      if (cbs) {
        cbs.delete(callback);
        if (cbs.size === 0) {
          this.subscribers.delete(destination);
          const activeSub = this.activeSubscriptions.get(destination);
          if (activeSub) {
            try {
              activeSub.unsubscribe();
            } catch {}
            this.activeSubscriptions.delete(destination);
          }
        }
      }
    };
  }

  /**
   * Đăng ký lắng nghe tin nhắn trong phòng chat cụ thể
   */
  subscribeConversation(conversationId, callback) {
    if (!conversationId) return () => {};
    return this.subscribe(`/topic/conversations/${conversationId}`, callback);
  }

  /**
   * Đăng ký lắng nghe cập nhật toàn bộ hội thoại cho Admin / CSKH
   */
  subscribeAdminConversations(callback) {
    return this.subscribe('/topic/admin/conversations', callback);
  }

  /**
   * Đăng ký lắng nghe tin nhắn cá nhân theo User ID
   */
  subscribeUserMessages(userId, callback) {
    if (!userId) return () => {};
    return this.subscribe(`/topic/user/${userId}/messages`, callback);
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch {}
      this.client = null;
      this.connected = false;
      this.activeSubscriptions.clear();
      this.subscribers.clear();
    }
  }
}

export const chatSocket = new ChatSocketManager();
export default chatSocket;

