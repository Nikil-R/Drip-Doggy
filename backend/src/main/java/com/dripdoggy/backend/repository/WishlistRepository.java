package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Wishlist;
import com.dripdoggy.backend.entity.ProductVariantSize;
import com.dripdoggy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserAndIsActiveTrue(User user);
    
    List<Wishlist> findByUserAndProductVariantSize(User user, ProductVariantSize productVariantSize);
    
    Optional<Wishlist> findByIdAndUserAndIsActiveTrue(Long id, User user);
}
