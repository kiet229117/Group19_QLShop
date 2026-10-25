package com.group19.QLShop.security;

import com.group19.QLShop.entity.User;
import com.group19.QLShop.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                String username = jwtUtils.extractUsername(jwt);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (!jwtUtils.isTokenExpired(jwt)) {
                        // Kiểm tra trực tiếp trạng thái hoạt động (active) của tài khoản trong DB
                        User dbUser = userRepository.findByUsername(username).orElse(null);
                        if (dbUser != null && Boolean.FALSE.equals(dbUser.getActive())) {
                            String reason = (dbUser.getLockReason() != null && !dbUser.getLockReason().isBlank())
                                    ? dbUser.getLockReason()
                                    : "Vi phạm quy định hoạt động của hệ thống QLShop.";
                            String fullMsg = "Tài khoản của bạn đã bị khóa do: " + reason;

                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write(String.format(
                                    "{\"status\":403,\"code\":\"ACCOUNT_LOCKED\",\"locked\":true,\"lockReason\":\"%s\",\"message\":\"%s\"}",
                                    reason.replace("\\", "\\\\").replace("\"", "\\\""),
                                    fullMsg.replace("\\", "\\\\").replace("\"", "\\\"")
                            ));
                            return;
                        }

                        String role = jwtUtils.extractRole(jwt);
                        List<GrantedAuthority> authorities;

                        if (StringUtils.hasText(role)) {
                            authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
                        } else {
                            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                            authorities = new ArrayList<>(userDetails.getAuthorities());
                        }

                        UserDetails principal = new org.springframework.security.core.userdetails.User(
                                username, "", authorities
                        );

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                principal, null, authorities
                        );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (Exception ex) {
            logger.debug("Token không hợp lệ hoặc đã hết hạn: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // 1. Ưu tiên đọc từ Header Authorization: Bearer <token> để mỗi tab (Client / Admin) giữ đúng phiên riêng biệt
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        // 2. Dự phòng: Trích xuất JWT từ HttpOnly Cookie
        String targetCookieName = jwtUtils.getCookieName();
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (targetCookieName.equals(cookie.getName()) && StringUtils.hasText(cookie.getValue())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}
