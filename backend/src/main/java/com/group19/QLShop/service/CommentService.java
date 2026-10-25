package com.group19.QLShop.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.group19.QLShop.dto.reponse.CommentResponse;
import com.group19.QLShop.dto.request.CommentRequest;
import com.group19.QLShop.entity.Comment;
import com.group19.QLShop.entity.User;
import com.group19.QLShop.exception.AppException;
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
        Long resolvedUserId = request.getUserId();
        User currentUser = null;

        if (resolvedUserId != null) {
            currentUser = userRepository.findById(resolvedUserId).orElse(null);
        }

        if (currentUser == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null) {
                currentUser = userRepository.findByUsername(auth.getName())
                        .orElseGet(() -> userRepository.findByEmail(auth.getName()).orElse(null));
                if (currentUser != null) {
                    resolvedUserId = currentUser.getId();
                }
            }
        }

        if (resolvedUserId == null) {
            throw new AppException("Vui lòng đăng nhập tài khoản để gửi bình luận hoặc phản hồi");
        }

        Comment comment = new Comment();
        comment.setUserId(resolvedUserId);
        comment.setProductId(request.getProductId());
        comment.setParentId(request.getParentId());
        comment.setContent(request.getContent());

        Comment saved = commentRepository.save(comment);

        // Nếu đây là phản hồi cho một bình luận gốc và người gửi là Admin/Staff, đồng bộ luôn vào replyContent của bình luận gốc
        if (request.getParentId() != null && currentUser != null && currentUser.getRole() != null) {
            String roleName = currentUser.getRole().name().toLowerCase();
            if ("admin".equals(roleName) || "staff".equals(roleName)) {
                final String authorName = (currentUser.getName() != null && !currentUser.getName().isBlank())
                        ? currentUser.getName()
                        : "QLShop CSKH";
                commentRepository.findById(request.getParentId()).ifPresent(parent -> {
                    parent.setReplyContent(request.getContent());
                    parent.setReplyAuthor(authorName);
                    parent.setRepliedAt(LocalDateTime.now());
                    commentRepository.save(parent);
                });
            }
        }

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
                .orElseThrow(() -> new AppException("Không tìm thấy bình luận"));

        comment.setContent(content);
        Comment updated = commentRepository.save(comment);
        return toResponse(updated);
    }

    @Transactional
    public CommentResponse replyComment(Long id, String replyContent, String replyAuthor) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy bình luận cần phản hồi"));

        String author = replyAuthor;
        if (author == null || author.isBlank()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null) {
                User u = userRepository.findByUsername(auth.getName()).orElse(null);
                if (u != null && u.getName() != null && !u.getName().isBlank()) {
                    author = u.getName() + " (QLShop CSKH)";
                }
            }
        }
        if (author == null || author.isBlank()) {
            author = "QLShop CSKH";
        }

        comment.setReplyContent(replyContent);
        comment.setReplyAuthor(author);
        comment.setRepliedAt(LocalDateTime.now());

        Comment updated = commentRepository.save(comment);
        return toResponse(updated);
    }

    @Transactional
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy bình luận"));

        // Thực hiện Soft Delete
        comment.setDeleted_at(LocalDateTime.now());
        commentRepository.save(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUserId());
        dto.setProductId(comment.getProductId());
        dto.setParentId(comment.getParentId());
        dto.setContent(comment.getContent());
        dto.setReplyContent(comment.getReplyContent());
        dto.setReplyAuthor(comment.getReplyAuthor());
        dto.setRepliedAt(comment.getRepliedAt());
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
                dto.setUserRole(user.getRole() != null ? user.getRole().name() : "user");
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
