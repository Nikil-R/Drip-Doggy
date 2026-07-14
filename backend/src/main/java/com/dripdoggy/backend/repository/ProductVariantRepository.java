package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    @Query("SELECT COUNT(pv) > 0 FROM ProductVariant pv WHERE LOWER(pv.skuCode) = LOWER(:skuCode) AND (pv.isDeleted = false OR pv.isDeleted IS NULL)")
    boolean existsActiveBySkuCode(@Param("skuCode") String skuCode);

    @Query("SELECT COUNT(pv) > 0 FROM ProductVariant pv WHERE LOWER(pv.skuCode) = LOWER(:skuCode) AND pv.id <> :id AND (pv.isDeleted = false OR pv.isDeleted IS NULL)")
    boolean existsActiveBySkuCodeAndIdNot(@Param("skuCode") String skuCode, @Param("id") Long id);
}
