package com.group19.QLShop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Cấu hình Spring WebSocket + STOMP Broker cho hệ thống Chat CSKH Real-time.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Cho phép broker lắng nghe và broadcast trên các tiền tố /topic (chung) và /queue (riêng)
        registry.enableSimpleBroker("/topic", "/queue");
        // Tiền tố cho các message client gửi lên server
        registry.setApplicationDestinationPrefixes("/app");
        // Tiền tố gửi đích danh user
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đăng ký endpoint STOMP kết hợp SockJS fallback
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                .withSockJS();

        // Đăng ký endpoint Native WebSocket trực tiếp
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*");
    }
}

