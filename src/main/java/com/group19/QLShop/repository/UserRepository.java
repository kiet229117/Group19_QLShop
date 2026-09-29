package com.group19.QLShop.repository;
import java.util.Optional;
<<<<<<< HEAD

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
=======
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
>>>>>>> a7fc072719ac6267605bc9c84e3e3816da8b1fba

import com.group19.QLShop.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User>findByEmail(String email);
<<<<<<< HEAD
    Optional<User>findByUsername(String username);
    Page<User>getAllUsers(Pageable pageable);
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
=======
    Optional<User>findByUserName(String username);
    Page<User>getAllUsers(Pageable pageable);
>>>>>>> a7fc072719ac6267605bc9c84e3e3816da8b1fba
}
