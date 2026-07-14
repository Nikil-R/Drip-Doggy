package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.isDeleted = false OR p.isDeleted IS NULL")
    List<Product> findAllActiveProducts();

    @Query("SELECT p FROM Product p WHERE (p.isDeleted = false OR p.isDeleted IS NULL) " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:subCategoryId IS NULL OR p.subCategory.id = :subCategoryId)")
    List<Product> findProductsByFilters(@Param("categoryId") Long categoryId, @Param("subCategoryId") Long subCategoryId);

    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE LOWER(p.skuCode) = LOWER(:skuCode) AND (p.isDeleted = false OR p.isDeleted IS NULL)")
    boolean existsActiveBySkuCode(@Param("skuCode") String skuCode);

    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE LOWER(p.skuCode) = LOWER(:skuCode) AND p.id <> :id AND (p.isDeleted = false OR p.isDeleted IS NULL)")
    boolean existsActiveBySkuCodeAndIdNot(@Param("skuCode") String skuCode, @Param("id") Long id);

    List<Product> findBySkuCodeIgnoreCase(String skuCode);
}
