package com.group19.QLShop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.group19.QLShop.entity.Conversation;
import com.group19.QLShop.entity.Message;
import com.group19.QLShop.entity.User;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Lấy toàn bộ tin nhắn trong hội thoại kèm sender (tránh N+1 query), sắp xếp tăng dần theo thời gian gửi
     */
    @Query("SELECT m FROM Message m JOIN FETCH m.sender s WHERE m.conversation = :conversation ORDER BY m.sentAt ASC")
    List<Message> findByConversationWithSender(@Param("conversation") Conversation conversation);

    @Query("SELECT m FROM Message m JOIN FETCH m.sender s WHERE m.conversation.id = :conversationId ORDER BY m.sentAt ASC")
    List<Message> findByConversationIdWithSender(@Param("conversationId") Long conversationId);

    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);

    /**
     * Lấy tin nhắn mới nhất của một hội thoại (để hiển thị preview tin nhắn cuối)
     */
    Message findTopByConversationOrderBySentAtDesc(Conversation conversation);

    /**
     * Đếm số tin nhắn chưa đọc trong 1 hội thoại cụ thể mà đối phương gửi tới người dùng
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation = :conversation AND m.sender != :user AND m.read = false")
    long countUnreadMessages(@Param("conversation") Conversation conversation, @Param("user") User user);

    /**
     * Đếm tổng số tin nhắn chưa đọc của người dùng trên toàn hệ thống (hiển thị badge trên thanh header)
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE (m.conversation.buyer = :user OR m.conversation.seller = :user) AND m.sender != :user AND m.read = false")
    long countTotalUnreadForUser(@Param("user") User user);

    /**
     * Đếm tổng số tin nhắn chưa đọc của khách gửi tới shop (dành cho Admin / Staff)
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender != :adminUser AND m.read = false")
    long countTotalUnreadForAdmin(@Param("adminUser") User adminUser);

    /**
     * Đánh dấu toàn bộ tin nhắn trong cuộc trò chuyện là đã đọc khi người dùng mở xem
     */
    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.read = true WHERE m.conversation = :conversation AND m.sender != :user AND m.read = false")
    int markMessagesAsRead(@Param("conversation") Conversation conversation, @Param("user") User user);
}
