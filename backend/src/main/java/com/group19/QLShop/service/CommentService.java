package com.group19.QLShop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.group19.QLShop.dto.request.CommentRequest;
import com.group19.QLShop.dto.reponse.CommentResponse;
import com.group19.QLShop.entity.Comment;
import com.group19.QLShop.repository.CommentRepository;
@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public CommentResponse createComment(CommentRequest request) {
        Comment comment = new Comment();
        comment.setUserId(request.getUserId());
        comment.setProductId(request.getProductId());
        comment.setContent(request.getContent());
        
        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    public List<CommentResponse> getCommentsByProduct(Long productId) {
        return commentRepository.findActiveCommentsByProductId(productId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse updateComment(Long id, String content) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));
        
        comment.setContent(content);
        Comment updated = commentRepository.save(comment);
        return toResponse(updated);
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));
        
        // Thực hiện Soft Delete
        comment.setDeleted_at(LocalDateTime.now());
        commentRepository.save(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUserId());
        dto.setProductId(comment.getProductId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
