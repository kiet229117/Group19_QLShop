package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.group19.QLShop.dto.reponse.CommentResponse;
import com.group19.QLShop.dto.request.CommentRequest;
import com.group19.QLShop.entity.Comment;
import com.group19.QLShop.repository.CommentRepository;
import com.group19.QLShop.repository.ProductRepository;
import com.group19.QLShop.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
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

    public List<CommentResponse> getAllComments() {
        return commentRepository.findAllActiveComments()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(Long id, String content) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));
        
        comment.setContent(content);
        Comment updated = commentRepository.save(comment);
        return toResponse(updated);
    }

    @Transactional
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

        if (comment.getUserId() != null) {
            userRepository.findById(comment.getUserId()).ifPresent(user -> {
                String name = user.getName();
                if (name == null || name.isBlank()) {
                    name = user.getUsername();
                }
                dto.setUserName(name != null ? name : "Người dùng #" + user.getId());
                dto.setUserAvatar(user.getAvatar());
            });
        }

        if (comment.getProductId() != null) {
            productRepository.findById(comment.getProductId()).ifPresent(product -> {
                dto.setProductName(product.getName());
            });
        }

        return dto;
    }
}
