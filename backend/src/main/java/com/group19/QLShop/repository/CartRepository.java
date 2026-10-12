package com.group19.QLShop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.group19.QLShop.entity.Cart;
import com.group19.QLShop.entity.User;
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId);
    Optional<Cart> findByUser(User user);
}
