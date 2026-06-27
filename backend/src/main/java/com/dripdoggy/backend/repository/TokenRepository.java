package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long> {
}
