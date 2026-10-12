package com.group19.QLShop.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.group19.QLShop.entity.User;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret:9a4f2c8d3b7a1e6f5c8d2b4a7e9f1c3d5a7b9e2f4a6c8d0e1b3a5c7f9e1d3b5a9a4f2c8d3b7a1e6f}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    @Value("${app.jwt.cookie-name:access_token}")
    private String cookieName;

    public String getCookieName() {
        return cookieName != null ? cookieName : "access_token";
    }

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Sinh token đầy đủ thông tin (id, username, email, role) - Tối ưu cực đại không cần query DB mỗi request
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String roleName = user.getRole() != null ? user.getRole().name().toUpperCase() : "USER";
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("id", user.getId())
                .claim("email", user.getEmail())
                .claim("role", roleName)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(UserDetails userDetails) {
        return generateTokenFromUsername(userDetails.getUsername());
    }

    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public ResponseCookie generateJwtCookie(String token) {
        return ResponseCookie.from(getCookieName(), token)
                .path("/")
                .maxAge(jwtExpirationMs / 1000)
                .httpOnly(true)
                .secure(false) // Đặt true khi triển khai trên HTTPS production
                .sameSite("Lax")
                .build();
    }

    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(getCookieName(), "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .build();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object idObj = claims.get("id");
            if (idObj instanceof Number) {
                return ((Number) idObj).longValue();
            }
        } catch (Exception ignored) {}
        return null;
    }

    public String extractRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("role", String.class);
        } catch (Exception ignored) {}
        return null;
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
