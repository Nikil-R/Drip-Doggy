package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.ProductVariantSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantSizeRepository extends JpaRepository<ProductVariantSize, Long> {
}
