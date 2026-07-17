package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Bundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BundleRepository extends JpaRepository<Bundle, Long> {

    @Query("SELECT b FROM Bundle b LEFT JOIN FETCH b.productVariants WHERE b.mainProductVariant.id = :variantId AND b.isActive = true AND b.isDeleted = false")
    Optional<Bundle> findActiveBundleByMainProductVariantId(@Param("variantId") Long variantId);

    @Query("SELECT b FROM Bundle b LEFT JOIN FETCH b.productVariants WHERE b.isDeleted = false")
    List<Bundle> findAllActiveBundles();
}
