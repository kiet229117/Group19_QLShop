package com.group19.QLShop.repository;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.group19.QLShop.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User>findByEmail(String email);
    Optional<User>findByUserName(String username);
    Page<User>getAllUsers(Pageable pageable);
}
