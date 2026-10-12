package com.group19.QLShop.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.group19.QLShop.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Lấy danh sách comment chưa bị xóa soft-delete theo Product
    @Query("SELECT c FROM Comment c WHERE c.productId = :productId AND c.deleted_at IS NULL")
    List<Comment> findActiveCommentsByProductId(Long productId);
}
