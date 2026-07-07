package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import com.dripdoggy.backend.enums.UserRole;
import java.time.LocalDateTime;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNo(String phoneNo);
    List<User> findByRole(UserRole role);
    long countByRole(UserRole role);
    long countByRoleAndIsBlocked(UserRole role, boolean isBlocked);
    long countByRoleAndCreatedAtAfter(UserRole role, LocalDateTime dateTime);
}
