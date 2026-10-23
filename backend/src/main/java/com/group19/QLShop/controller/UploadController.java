package com.group19.QLShop.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.group19.QLShop.service.FileStorageService;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * API upload ảnh dùng chung cho các phân hệ (Categories, Brands, Products, Banners,...)
     * Lưu ảnh vào thư mục uploads/{folder}/ và trả về URL ảnh tương đối
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        String relativePath = fileStorageService.storeFile(file, folder);
        Map<String, String> response = new HashMap<>();
        response.put("url", relativePath);
        return ResponseEntity.ok(response);
    }
}

