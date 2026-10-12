package com.group19.QLShop.security;

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
                        String role = jwtUtils.extractRole(jwt);
                        List<GrantedAuthority> authorities;

                        if (StringUtils.hasText(role)) {
                            // TỐI ƯU SIÊU TỐC (<0.1ms): Trích xuất trực tiếp quyền từ token đã ký số an toàn (KHÔNG CẦN QUERY DB)
                            authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
                        } else {
                            // Dự phòng cho token cũ chưa nhúng claim role: nạp qua database
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
            // Không spam stack trace lỗi khi token hết hạn thông thường
            logger.debug("Token không hợp lệ hoặc đã hết hạn: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // 1. Ưu tiên trích xuất JWT từ HttpOnly Cookie
        String targetCookieName = jwtUtils.getCookieName();
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (targetCookieName.equals(cookie.getName()) && StringUtils.hasText(cookie.getValue())) {
                    return cookie.getValue();
                }
            }
        }

        // 2. Dự phòng: Đọc từ Header Authorization: Bearer <token> (hữu ích cho Postman / API test)
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }
}
