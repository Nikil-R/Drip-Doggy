package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.isDeleted = false OR p.isDeleted IS NULL")
    List<Product> findAllActiveProducts();

    boolean existsBySkuCodeIgnoreCase(String skuCode);

    boolean existsBySkuCodeIgnoreCaseAndIdNot(String skuCode, Long id);
}
