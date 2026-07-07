package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import com.dripdoggy.backend.enums.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNo(String phoneNo);
    List<User> findByRole(UserRole role);
}
