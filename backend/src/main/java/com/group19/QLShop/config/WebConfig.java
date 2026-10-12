package com.group19.QLShop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cấu hình phục vụ toàn bộ file tĩnh trong uploads/ (avatars, products, ...)
        String uploadsUri = Paths.get("uploads").toAbsolutePath().toUri().toString();
        if (!uploadsUri.endsWith("/")) {
            uploadsUri += "/";
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsUri);
    }
}