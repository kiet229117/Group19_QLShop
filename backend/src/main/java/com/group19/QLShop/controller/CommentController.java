package com.group19.QLShop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.group19.QLShop.dto.request.CommentRequest;
import com.group19.QLShop.dto.request.CommentUpdateRequest;
import com.group19.QLShop.dto.reponse.CommentResponse;
import com.group19.QLShop.dto.reponse.CommentSummaryResponse;
import com.group19.QLShop.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    // Tiêm thẳng class Service trực tiếp vào Controller
    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @Valid @RequestBody CommentRequest request, Authentication authentication) {
        return ResponseEntity.ok(commentService.createComment(request, authentication.getName()));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(commentService.getCommentsByProduct(productId));
    }

    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<CommentSummaryResponse> getProductSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(commentService.getProductSummary(productId));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<CommentResponse>> getMyComments(Authentication authentication) {
        return ResponseEntity.ok(commentService.getCommentsByCurrentUser(authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(commentService.updateComment(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id, Authentication authentication) {
        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.ok("Xóa bình luận thành công");
    }
}
