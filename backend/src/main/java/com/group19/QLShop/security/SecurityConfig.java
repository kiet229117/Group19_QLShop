package com.group19.QLShop.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.http.HttpMethod;

import java.util.List;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                // Khi sử dụng Cookie/Credentials, không dùng "*", mà dùng allowedOriginPatterns
                config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"status\":401,\"message\":\"Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("{\"status\":403,\"message\":\"Bạn không có quyền thực hiện thao tác này\"}");
                })
            )
            .authorizeHttpRequests(auth -> auth
                // ==========================================
                // 1. PUBLIC: Không cần đăng nhập
                // ==========================================
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/check-role",
                    "/api/auth/forgot-password",
                    "/api/auth/reset-password",
                    "/error",
                    "/api/seed/**",
                    "/api/webhook/**",
                    "/api/vouchers/available",
                    "/api/vouchers/apply"
                ).permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/products/**",
                    "/api/brands/**",
                    "/api/categories/**",
                    "/api/comments/**",
                    "/api/banners/**"
                ).permitAll()
                .requestMatchers("/uploads/**", "/api/upload/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/goods-receipts/**", "/api/suppliers/**", "/api/orders/**", "/api/vouchers/**", "/api/admin/dashboard/**").permitAll()

                // ==========================================
                // 2. AUTH: Thông tin cá nhân, đổi mật khẩu, đăng xuất (Đã đăng nhập)
                // ==========================================
                .requestMatchers("/api/auth/logout", "/api/auth/me", "/api/auth/change-password").authenticated()

                // ==========================================
                // 3. QUẢN LÝ SẢN PHẨM (PRODUCTS)
                // ==========================================
                .requestMatchers(HttpMethod.POST, "/api/products/filter").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                // ==========================================
                // 4. QUẢN LÝ THƯƠNG HIỆU, DANH MỤC, BANNER & VOUCHER
                // ==========================================
                .requestMatchers(HttpMethod.GET, "/api/vouchers").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.POST, "/api/brands/**", "/api/categories/**", "/api/banners/**", "/api/vouchers/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/brands/**", "/api/categories/**", "/api/banners/**", "/api/vouchers/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.PATCH, "/api/banners/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/brands/**", "/api/categories/**", "/api/banners/**", "/api/vouchers/**").hasRole("ADMIN")

                // ==========================================
                // 5. QUẢN LÝ NGƯỜI DÙNG (USERS)
                // ==========================================
                .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").authenticated()

                // ==========================================
                // 6. QUẢN LÝ ĐƠN HÀNG (ORDERS)
                // ==========================================
                .requestMatchers(HttpMethod.GET, "/api/orders").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/orders/*/status").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasRole("ADMIN")
                .requestMatchers("/api/orders/**").authenticated()

                // ==========================================
                // 7. QUẢN LÝ GIỎ HÀNG (CARTS)
                // ==========================================
                .requestMatchers(HttpMethod.GET, "/api/carts").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/carts/**").authenticated()

                // ==========================================
                // 8. BÌNH LUẬN (COMMENTS)
                // ==========================================
                .requestMatchers("/api/comments/**").authenticated()

                // ==========================================
                // 9. DANH SÁCH YÊU THÍCH (WISHLISTS)
                // ==========================================
                .requestMatchers("/api/wishlists/**").permitAll()

                // ==========================================
                // 10. TRÒ CHUYỆN / CHAT (CHATS & MESSAGES)
                // ==========================================
                .requestMatchers("/api/chat/**").authenticated()

                // ==========================================
                // 11. ĐƯỜNG DẪN QUẢN TRỊ RIÊNG (DASHBOARD & ADMIN)
                // ==========================================
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "STAFF")

                // ==========================================
                // 12. TẤT CẢ CÁC REQUEST KHÁC: Yêu cầu đăng nhập
                // ==========================================
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
