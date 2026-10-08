package com.group19.QLShop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.group19.QLShop.dto.request.CommentRequest;
import com.group19.QLShop.dto.request.CommentUpdateRequest;
import com.group19.QLShop.dto.reponse.CommentResponse;
import com.group19.QLShop.dto.reponse.CommentSummaryResponse;
import com.group19.QLShop.entity.Comment;
import com.group19.QLShop.repository.CommentRepository;
import com.group19.QLShop.repository.UserRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public CommentResponse createComment(CommentRequest request, String username) {
        Comment comment = new Comment();
        comment.setUserId(getUserId(username));
        comment.setProductId(request.getProductId());
        comment.setRating(request.getRating());
        comment.setContent(request.getContent());

        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    public List<CommentResponse> getCommentsByProduct(Long productId) {
        return commentRepository.findByProductIdAndDeletedAtIsNullOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CommentResponse> getCommentsByCurrentUser(String username) {
        return commentRepository.findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(getUserId(username))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CommentSummaryResponse getProductSummary(Long productId) {
        Object[] summary = commentRepository.getRatingSummary(productId);
        long totalComments = ((Number) summary[0]).longValue();
        double averageRating = ((Number) summary[1]).doubleValue();
        return new CommentSummaryResponse(productId, totalComments, averageRating);
    }

    public CommentResponse updateComment(Long id, CommentUpdateRequest request, String username) {
        Comment comment = getOwnedComment(id, username);
        comment.setContent(request.getContent());
        comment.setRating(request.getRating());
        Comment updated = commentRepository.save(comment);
        return toResponse(updated);
    }

    public void deleteComment(Long id, String username) {
        Comment comment = getOwnedComment(id, username);
        comment.setDeletedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    private Comment getOwnedComment(Long id, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bình luận"));
        if (!comment.getUserId().equals(getUserId(username))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền chỉnh sửa bình luận này");
        }
        if (comment.getDeletedAt() != null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bình luận");
        }
        return comment;
    }

    private Long getUserId(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"))
                .getId();
    }

    private CommentResponse toResponse(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUserId());
        dto.setProductId(comment.getProductId());
        dto.setRating(comment.getRating());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
