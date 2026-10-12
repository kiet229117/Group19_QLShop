package com.group19.QLShop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "conversations",
    indexes = {
        @Index(name = "idx_conv_buyer", columnList = "buyer_id"),
        @Index(name = "idx_conv_seller", columnList = "seller_id"),
        @Index(name = "idx_conv_last_msg", columnList = "last_message_at")
    }
)
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Khách hàng (Người mua)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // Chủ shop / Nhân viên tư vấn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;

    // Sản phẩm khách đang quan tâm / hỏi tư vấn (có thể để trống nếu chat chung)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // Thời điểm gửi tin nhắn gần nhất để sắp xếp hội thoại lên đầu
    @Column(name = "last_message_at", nullable = false)
    private LocalDateTime lastMessageAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.lastMessageAt == null) {
            this.lastMessageAt = LocalDateTime.now();
        }
    }
}

