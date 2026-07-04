package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    boolean existsBySkuCodeIgnoreCase(String skuCode);

    boolean existsBySkuCodeIgnoreCaseAndIdNot(String skuCode, Long id);
}
