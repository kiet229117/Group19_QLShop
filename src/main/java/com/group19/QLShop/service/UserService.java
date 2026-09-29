package com.group19.QLShop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.entity.User;
import com.group19.QLShop.repository.UserRepository;

@Service 
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Xem user bằng username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(()
         -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với user:" + username));
    }

    // Xem tất cả
    public Page<User> getAllUsers(int page, int size) {
        Pageable data = PageRequest.of(page, size);
        return userRepository.findAll(data);
    }

    // Thêm
    public User addUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username không được để trống");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username đã tồn tại trong hệ thống");
        }
        if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại trong hệ thống");
        }

        User newUser = new User();
        newUser.setName(user.getName());
        newUser.setUsername(user.getUsername());
        newUser.setPhone(user.getPhone());
        newUser.setEmail(user.getEmail());
        newUser.setGender(user.getGender());
        newUser.setAddress(user.getAddress());
        newUser.setPassword(user.getPassword()); 
        newUser.setAvatar(user.getAvatar());
        newUser.setRole(user.getRole());

        return userRepository.save(newUser);
    }

    // sửa
    public User updateUser(Long id, User user) {
        User exists = userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        if (user.getUsername() != null && !user.getUsername().equals(exists.getUsername()) && userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username đã tồn tại");
        }
        if (user.getEmail() != null && !user.getEmail().equals(exists.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }

        exists.setName(user.getName());
        if (user.getUsername() != null) exists.setUsername(user.getUsername());
        exists.setPhone(user.getPhone());
        exists.setEmail(user.getEmail());
        exists.setGender(user.getGender());
        exists.setAddress(user.getAddress());
        
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            exists.setPassword(user.getPassword()); 
        }
        
        exists.setAvatar(user.getAvatar());
        if(user.getRole() != null) exists.setRole(user.getRole());

        return userRepository.save(exists);
    }
    
    // Xóa
    public void deleteUser(Long id) {
        User exists = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        userRepository.delete(exists);
    }
}