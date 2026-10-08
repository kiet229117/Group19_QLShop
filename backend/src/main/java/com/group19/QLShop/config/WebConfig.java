package com.group19.QLShop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
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

        // Hiển thị avatar
        Path avatarUploadDir = Paths.get("uploads/avatars");
        String avatarUploadPath = avatarUploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/avatars/**")
                .addResourceLocations("file:/" + avatarUploadPath + "/");

        // Hiển thị ảnh product
        Path productUploadDir = Paths.get("uploads/products");
        String productUploadPath = productUploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:/" + productUploadPath + "/");
    }
}