package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {
}
