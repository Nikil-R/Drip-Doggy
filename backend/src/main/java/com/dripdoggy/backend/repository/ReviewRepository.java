package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    List<Review> findByUserIdAndIsActiveTrue(Long userId);
    boolean existsByUserIdAndOrderIdAndProductVariantId(Long userId, Long orderId, Long productVariantId);
    List<Review> findByProductVariantProductIdAndIsActiveTrue(Long productId);
    List<Review> findByProductVariantIdAndIsActiveTrue(Long productVariantId);
}
