package com.group19.QLShop.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.group19.QLShop.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProductIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long productId);

    List<Comment> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(c), COALESCE(AVG(c.rating), 0) FROM Comment c "
            + "WHERE c.productId = :productId AND c.deletedAt IS NULL")
    Object[] getRatingSummary(Long productId);
}
