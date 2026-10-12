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

    // Tiêm thẳng class Service trực tiếp vào Controller
    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.createComment(request));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(commentService.getCommentsByProduct(productId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id, 
            @RequestParam String content) {
        return ResponseEntity.ok(commentService.updateComment(id, content));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Xóa bình luận thành công");
    }
}
