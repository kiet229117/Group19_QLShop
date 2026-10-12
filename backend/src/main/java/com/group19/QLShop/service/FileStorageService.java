package com.group19.QLShop.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.group19.QLShop.exception.AppException;

@Service // Thêm annotation này để Spring nhận diện là một Bean dịch vụ
public class FileStorageService {
    private final String BASE_UPLOAD_DIR = "uploads/";

        public String storeFile(MultipartFile file, String subFolder) {
        if (file.isEmpty()) {
            throw new AppException("File không được để trống");
        }
        // 1. Kiểm tra định dạng ảnh hợp lệ
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException("Chỉ chấp nhận file định dạng hình ảnh (JPG, PNG, WEBP,...)");
        }
        try {
            // 2. Tạo thư mục con (vd: uploads/avatars/ hoặc uploads/products/)
            Path uploadPath = Paths.get(BASE_UPLOAD_DIR + subFolder);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            // 3. Đặt tên file ngẫu nhiên tránh trùng lặp
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID() + fileExtension;
            // 4. Lưu file vật lý
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            // 5. Trả về đường dẫn tương đối để lưu vào DB
            return "/" + BASE_UPLOAD_DIR + subFolder + "/" + fileName;
        } catch (IOException e) {
            throw new AppException("Lỗi khi lưu trữ file: " + e.getMessage(), e);
        }
    }
    public void deleteFile(String relativePath) {
        if (relativePath == null || relativePath.trim().isEmpty()) return;
        // Nếu là URL online (Unsplash, Cloudinary, CDN) thì không xóa file local
        if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
            return;
        }
        try {
            String path = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;
            Files.deleteIfExists(Paths.get(path));
        } catch (Exception e) {
            System.err.println("Không thể xóa file cũ: " + relativePath + " (" + e.getMessage() + ")");
        }
    }

}
