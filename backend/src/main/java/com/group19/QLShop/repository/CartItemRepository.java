package com.group19.QLShop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.CartItems;
@Repository

public interface CartItemRepository extends JpaRepository<CartItems, Long> {
    List<CartItems> findByCartId(Long cartId);

    Optional<CartItems> findByCartIdAndProductId(Long cartId, Long productId);

    void deleteByCartId(Long cartId);
}
