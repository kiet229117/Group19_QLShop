package com.group19.QLShop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.group19.QLShop.dto.request.CommentRequest;
import com.group19.QLShop.dto.reponse.CommentResponse;
import com.group19.QLShop.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 1. LẤY TẤT CẢ BÌNH LUẬN TOÀN HỆ THỐNG CHO ADMIN
    // GET /api/comments
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    // 2. TẠO BÌNH LUẬN MỚI
    // POST /api/comments
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.createComment(request));
    }

    // 3. LẤY BÌNH LUẬN THEO SẢN PHẨM
    // GET /api/comments/product/{productId}
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(commentService.getCommentsByProduct(productId));
    }

    // 4. CẬP NHẬT BÌNH LUẬN
    // PUT /api/comments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id, 
            @RequestParam String content) {
        return ResponseEntity.ok(commentService.updateComment(id, content));
    }

    // 5. XÓA BÌNH LUẬN (SOFT DELETE)
    // DELETE /api/comments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Xóa bình luận thành công");
    }
}
