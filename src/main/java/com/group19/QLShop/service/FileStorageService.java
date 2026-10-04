package com.group19.QLShop.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service // Thêm annotation này để Spring nhận diện là một Bean dịch vụ
public class FileStorageService {
    private final String uploadDir = "uploads/products/";

    public String storeFile(MultipartFile file) throws IOException {

        // 1. Tạo thư mục nếu chưa tồn tại
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2. Lấy tên file gốc
        String originalFileName = file.getOriginalFilename();

        // 3. Tạo tên file mới nhằm tránh trùng lặp trùng tên
        String fileName = UUID.randomUUID() + "_" + originalFileName;

        // 4. Tạo đường dẫn file vật lý
        Path filePath = uploadPath.resolve(fileName);

        // 5. Lưu file vào ổ đĩa vật lý của Server
        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);

        // 6. Trả về đường dẫn chuẩn để lưu vào Database phục vụ hiển thị
        return "/uploads/products/" + fileName;
    }

    // Thêm hàm này vào bên trong class FileStorageService của bạn
public void deleteImage(String imagePath) {
    if (imagePath == null || imagePath.isEmpty()) return;
    
    try {
        // Biến đổi ngược "/uploads/products/tên_file" thành đường dẫn vật lý để xóa
        String relativePath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
        Path filePath = Paths.get(relativePath);
        
        // Tiến hành xóa file nếu tồn tại
        Files.deleteIfExists(filePath);
    } catch (IOException e) {
        // Log lỗi hoặc bỏ qua nếu không tìm thấy file vật lý
        System.err.println("Không thể xóa file vật lý tại: " + imagePath + ". Lỗi: " + e.getMessage());
    }
}

}
