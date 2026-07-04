package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Cart;
import com.dripdoggy.backend.entity.ProductVariantSize;
import com.dripdoggy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserAndIsActiveTrue(User user);
    
    Optional<Cart> findByUserAndProductVariantSize(User user, ProductVariantSize productVariantSize);
    
    Optional<Cart> findByIdAndUserAndIsActiveTrue(Long id, User user);
}
