package com.group19.QLShop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
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

    // 2. TẠO BÌNH LUẬN MỚI (HOẶC PHẢN HỒI BÌNH LUẬN VỚI parentId)
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
            @RequestParam(required = false) String content,
            @RequestBody(required = false) Map<String, String> body) {
        String resolvedContent = content;
        if ((resolvedContent == null || resolvedContent.isBlank()) && body != null) {
            resolvedContent = body.getOrDefault("content", "");
        }
        return ResponseEntity.ok(commentService.updateComment(id, resolvedContent));
    }

    // 5. PHẢN HỒI BÌNH LUẬN (ADMIN / CSKH HOẶC CHỦ SHOP)
    // PUT /api/comments/{id}/reply & POST /api/comments/{id}/reply
    @RequestMapping(value = "/{id}/reply", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<CommentResponse> replyComment(
            @PathVariable Long id,
            @RequestParam(required = false) String replyContent,
            @RequestParam(required = false) String replyAuthor,
            @RequestBody(required = false) Map<String, String> body) {
        String resolvedContent = replyContent;
        String resolvedAuthor = replyAuthor;
        if (body != null) {
            if (resolvedContent == null || resolvedContent.isBlank()) {
                resolvedContent = body.getOrDefault("replyContent", body.getOrDefault("content", ""));
            }
            if (resolvedAuthor == null || resolvedAuthor.isBlank()) {
                resolvedAuthor = body.get("replyAuthor");
            }
        }
        return ResponseEntity.ok(commentService.replyComment(id, resolvedContent, resolvedAuthor));
    }

    // 6. XÓA BÌNH LUẬN (SOFT DELETE)
    // DELETE /api/comments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Xóa bình luận thành công");
    }
}
