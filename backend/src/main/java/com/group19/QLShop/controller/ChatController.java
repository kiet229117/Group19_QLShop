package com.group19.QLShop.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.group19.QLShop.dto.reponse.ConversationResponse;
import com.group19.QLShop.dto.reponse.MessageResponse;
import com.group19.QLShop.dto.request.MessageRequest;
import com.group19.QLShop.exception.AppException;
import com.group19.QLShop.service.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // ==========================================
    // 1. GỬI TIN NHẮN MỚI (MỞ HỘI THOẠI / HỎI VỀ SẢN PHẨM)
    // POST /api/chat/send
    // Body: { "productId": 10, "content": "Shop còn size 42 không?" }
    // ==========================================
    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication authentication,
            @Valid @RequestBody MessageRequest request) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException("Vui lòng đăng nhập để gửi tin nhắn");
        }
        MessageResponse response = chatService.sendMessage(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==========================================
    // 2. TRẢ LỜI TIN NHẮN TRONG HỘI THOẠI ĐANG MỞ
    // POST /api/chat/conversations/{conversationId}/reply
    // Body: { "content": "Dạ còn sẵn hàng bạn nhé!" }
    // ==========================================
    @PostMapping("/conversations/{conversationId}/reply")
    public ResponseEntity<MessageResponse> replyMessage(
            Authentication authentication,
            @PathVariable Long conversationId,
            @RequestBody Map<String, String> payload) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException("Vui lòng đăng nhập để gửi tin nhắn");
        }

        String content = payload.get("content");
        if (content == null || content.trim().isEmpty()) {
            throw new AppException("Nội dung tin nhắn không được để trống");
        }

        MessageResponse response = chatService.replyMessage(authentication.getName(), conversationId, content);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // 3. LẤY DANH SÁCH CUỘC TRÒ CHUYỆN (HỘP THƯ)
    // GET /api/chat/conversations
    // - User: các cuộc trò chuyện của mình với shop
    // - Admin / Staff: toàn bộ danh sách khách hàng nhắn tin tới shop
    // ==========================================
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getMyConversations(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException("Vui lòng đăng nhập để xem danh sách tin nhắn");
        }
        return ResponseEntity.ok(chatService.getMyConversations(authentication.getName()));
    }

    // ==========================================
    // 4. LẤY CHI TIẾT TIN NHẮN & TỰ ĐỘNG ĐÁNH DẤU ĐÃ ĐỌC
    // GET /api/chat/conversations/{conversationId}/messages
    // ==========================================
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            Authentication authentication,
            @PathVariable Long conversationId) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException("Vui lòng đăng nhập để xem tin nhắn");
        }
        return ResponseEntity.ok(chatService.getMessages(authentication.getName(), conversationId));
    }

    // ==========================================
    // 5. LẤY TỔNG SỐ TIN NHẮN CHƯA ĐỌC (CHO BADGE THÔNG BÁO HEADER)
    // GET /api/chat/unread-count
    // ==========================================
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> res = new HashMap<>();
            res.put("unreadCount", 0);
            return ResponseEntity.ok(res);
        }
        long count = chatService.getUnreadTotalCount(authentication.getName());
        Map<String, Object> res = new HashMap<>();
        res.put("unreadCount", count);
        return ResponseEntity.ok(res);
    }
}
