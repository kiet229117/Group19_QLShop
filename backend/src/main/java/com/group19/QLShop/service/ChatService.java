package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.group19.QLShop.dto.reponse.ConversationResponse;
import com.group19.QLShop.dto.reponse.MessageResponse;
import com.group19.QLShop.dto.request.MessageRequest;
import com.group19.QLShop.entity.Conversation;
import com.group19.QLShop.entity.Message;
import com.group19.QLShop.entity.Product;
import com.group19.QLShop.entity.ProductImage;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.entity.enums.Role;
import com.group19.QLShop.exception.AppException;
import com.group19.QLShop.repository.ConversationRepository;
import com.group19.QLShop.repository.MessageRepository;
import com.group19.QLShop.repository.ProductImageRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Gửi tin nhắn mới (mở hội thoại mới hoặc tiếp tục hội thoại có sẵn theo sản phẩm / ID)
     */
    @Transactional
    public MessageResponse sendMessage(String username, MessageRequest request) {
        User sender = resolveUser(username);

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new AppException("Nội dung tin nhắn không được để trống");
        }

        Conversation conversation;

        // Kịch bản 1: Đã truyền trực tiếp conversationId
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findByIdWithDetails(request.getConversationId())
                    .orElseThrow(() -> new AppException("Không tìm thấy cuộc trò chuyện với ID: " + request.getConversationId()));
            checkUserInConversation(sender, conversation);
        }
        // Kịch bản 2: Khách hàng hỏi về một sản phẩm cụ thể
        else if (request.getProductId() != null) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new AppException("Không tìm thấy sản phẩm với ID: " + request.getProductId()));

            User buyer = sender;
            User seller = getShopOwnerUser();

            // Nếu người gửi là Admin/Staff thì tìm hội thoại hoặc báo lỗi
            if (sender.getRole() == Role.admin || sender.getRole() == Role.staff) {
                seller = sender;
            }

            conversation = conversationRepository.findByBuyerAndProduct(buyer, product)
                    .orElseGet(() -> {
                        Conversation newConv = Conversation.builder()
                                .buyer(buyer)
                                .seller(getShopOwnerUser())
                                .product(product)
                                .lastMessageAt(LocalDateTime.now())
                                .build();
                        return conversationRepository.save(newConv);
                    });
        }
        // Kịch bản 3: Khách hàng chat chung với Shop (không gắn sản phẩm cụ thể)
        else {
            User buyer = sender;
            conversation = conversationRepository.findByBuyerAndProductIsNull(buyer)
                    .orElseGet(() -> {
                        Conversation newConv = Conversation.builder()
                                .buyer(buyer)
                                .seller(getShopOwnerUser())
                                .product(null)
                                .lastMessageAt(LocalDateTime.now())
                                .build();
                        return conversationRepository.save(newConv);
                    });
        }

        // Tạo và lưu tin nhắn
        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(request.getContent().trim())
                .read(false)
                .build();
        Message savedMessage = messageRepository.save(message);

        // Cập nhật mốc thời gian tin nhắn mới nhất
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageResponse response = mapToMessageResponse(savedMessage);
        broadcastMessage(conversation, response);
        return response;
    }

    
    /**
     * Trả lời tin nhắn trong một cuộc hội thoại cụ thể
     */
    @Transactional
    public MessageResponse replyMessage(String username, Long conversationId, String content) {
        User sender = resolveUser(username);

        if (content == null || content.trim().isEmpty()) {
            throw new AppException("Nội dung tin nhắn không được để trống");
        }

        Conversation conversation = conversationRepository.findByIdWithDetails(conversationId)
                .orElseThrow(() -> new AppException("Không tìm thấy cuộc trò chuyện với ID: " + conversationId));

        checkUserInConversation(sender, conversation);

        // Nếu shop seller chưa được gán và người trả lời là admin/staff -> gán vào cuộc trò chuyện
        if (conversation.getSeller() == null && (sender.getRole() == Role.admin || sender.getRole() == Role.staff)) {
            conversation.setSeller(sender);
        }

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content.trim())
                .read(false)
                .build();
        Message savedMessage = messageRepository.save(message);

        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageResponse response = mapToMessageResponse(savedMessage);
        broadcastMessage(conversation, response);
        return response;
    }

    private void broadcastMessage(Conversation conversation, MessageResponse response) {
        if (messagingTemplate == null || conversation == null || response == null) return;
        try {
            // 1. Gửi realtime vào phòng chat cụ thể (/topic/conversations/{id})
            messagingTemplate.convertAndSend("/topic/conversations/" + conversation.getId(), response);

            // 2. Gửi realtime thông báo cho toàn bộ Admin/Staff (/topic/admin/conversations)
            messagingTemplate.convertAndSend("/topic/admin/conversations", response);

            // 3. Gửi realtime cho người mua (/topic/user/{buyerId}/messages)
            if (conversation.getBuyer() != null && conversation.getBuyer().getId() != null) {
                messagingTemplate.convertAndSend("/topic/user/" + conversation.getBuyer().getId() + "/messages", response);
            }
        } catch (Exception e) {
            log.warn("Lỗi khi gửi WebSocket STOMP broadcast: {}", e.getMessage());
        }
    }

    /**
     * Lấy danh sách các cuộc hội thoại:
     * - Nếu là Admin / Staff: Hiển thị toàn bộ các cuộc hội thoại khách hàng gửi tới shop
     * - Nếu là Khách hàng: Hiển thị các cuộc hội thoại của riêng họ với shop
     */
    @Transactional(readOnly = true)
    public List<ConversationResponse> getMyConversations(String username) {
        User currentUser = resolveUser(username);

        List<Conversation> conversations;
        boolean isShopStaff = (currentUser.getRole() == Role.admin || currentUser.getRole() == Role.staff);

        if (isShopStaff) {
            conversations = conversationRepository.findAllForShopOwnerWithDetails();
        } else {
            conversations = conversationRepository.findByBuyerWithDetails(currentUser);
        }

        return conversations.stream().map(conv -> {
            // Xác định đối phương trò chuyện
            User partner;
            if (currentUser.getId().equals(conv.getBuyer().getId())) {
                partner = conv.getSeller() != null ? conv.getSeller() : getShopOwnerUser();
            } else {
                partner = conv.getBuyer();
            }

            Message lastMsg = messageRepository.findTopByConversationOrderBySentAtDesc(conv);
            long unreadCount = messageRepository.countUnreadMessages(conv, currentUser);

            String partnerName = partner != null
                    ? (partner.getName() != null && !partner.getName().isBlank() ? partner.getName() : partner.getUsername())
                    : "Chăm sóc khách hàng";
            String partnerAvatar = partner != null ? partner.getAvatar() : null;
            String partnerRole = partner != null && partner.getRole() != null ? partner.getRole().name().toUpperCase() : "STAFF";

            // Thông tin sản phẩm liên quan
            Long productId = null;
            String productName = null;
            Double productPrice = null;
            String productImageUrl = null;

            if (conv.getProduct() != null) {
                Product p = conv.getProduct();
                productId = p.getId();
                productName = p.getName();
                productPrice = p.getPrice();

                // Lấy ảnh đại diện sản phẩm từ list đã fetch hoặc DB
                if (p.getImages() != null && !p.getImages().isEmpty()) {
                    productImageUrl = p.getImages().stream()
                            .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                            .map(ProductImage::getImageUrl)
                            .findFirst()
                            .orElseGet(() -> p.getImages().get(0).getImageUrl());
                } else {
                    List<ProductImage> imgs = productImageRepository.findByProductIdOrderByIsPrimaryDesc(p.getId());
                    if (!imgs.isEmpty()) {
                        productImageUrl = imgs.get(0).getImageUrl();
                    }
                }
            }

            return ConversationResponse.builder()
                    .id(conv.getId())
                    .partnerId(partner != null ? partner.getId() : null)
                    .partnerName(partnerName)
                    .partnerAvatar(partnerAvatar)
                    .partnerRole(partnerRole)
                    .productId(productId)
                    .productName(productName)
                    .productPrice(productPrice)
                    .productImageUrl(productImageUrl)
                    .lastMessage(lastMsg != null ? lastMsg.getContent() : "")
                    .lastMessageAt(conv.getLastMessageAt())
                    .unreadCount(unreadCount)
                    .build();
        }).toList();
    }

    /**
     * Lấy toàn bộ tin nhắn trong một cuộc hội thoại và tự động đánh dấu đã đọc
     */
    @Transactional
    public List<MessageResponse> getMessages(String username, Long conversationId) {
        User currentUser = resolveUser(username);

        Conversation conversation = conversationRepository.findByIdWithDetails(conversationId)
                .orElseThrow(() -> new AppException("Không tìm thấy cuộc trò chuyện với ID: " + conversationId));

        checkUserInConversation(currentUser, conversation);

        // Đánh dấu các tin nhắn đối phương gửi là đã đọc
        messageRepository.markMessagesAsRead(conversation, currentUser);

        List<Message> messages = messageRepository.findByConversationWithSender(conversation);
        return messages.stream().map(this::mapToMessageResponse).toList();
    }

    /**
     * Lấy tổng số tin nhắn chưa đọc của người dùng / chủ shop để hiển thị thông báo
     */
    @Transactional(readOnly = true)
    public long getUnreadTotalCount(String username) {
        User currentUser = resolveUser(username);
        if (currentUser.getRole() == Role.admin || currentUser.getRole() == Role.staff) {
            return messageRepository.countTotalUnreadForAdmin(currentUser);
        } else {
            return messageRepository.countTotalUnreadForUser(currentUser);
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private User resolveUser(String usernameOrEmail) {
        if (usernameOrEmail == null || usernameOrEmail.isBlank()) {
            throw new AppException("Vui lòng đăng nhập để sử dụng tính năng nhắn tin");
        }
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new AppException("Không tìm thấy thông tin tài khoản người dùng: " + usernameOrEmail));
    }

    private User getShopOwnerUser() {
        return userRepository.findFirstByRole(Role.admin)
                .or(() -> userRepository.findFirstByRole(Role.staff))
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElse(null);
    }

    private void checkUserInConversation(User user, Conversation conversation) {
        boolean isBuyer = conversation.getBuyer() != null && conversation.getBuyer().getId().equals(user.getId());
        boolean isSeller = conversation.getSeller() != null && conversation.getSeller().getId().equals(user.getId());
        boolean isStaffOrAdmin = (user.getRole() == Role.admin || user.getRole() == Role.staff);

        if (!isBuyer && !isSeller && !isStaffOrAdmin) {
            throw new AppException("Bạn không có quyền tham gia cuộc trò chuyện này");
        }
    }

    private MessageResponse mapToMessageResponse(Message message) {
        User sender = message.getSender();
        String senderName = sender != null
                ? (sender.getName() != null && !sender.getName().isBlank() ? sender.getName() : sender.getUsername())
                : "Người dùng";
        String senderRole = sender != null && sender.getRole() != null ? sender.getRole().name().toUpperCase() : "USER";

        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation() != null ? message.getConversation().getId() : null)
                .senderId(sender != null ? sender.getId() : null)
                .senderName(senderName)
                .senderAvatar(sender != null ? sender.getAvatar() : null)
                .senderRole(senderRole)
                .content(message.getContent())
                .read(message.getRead())
                .sentAt(message.getSentAt())
                .build();
    }
}
