package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.HomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomeCategoryRepository extends JpaRepository<HomeCategory, Long> {
    List<HomeCategory> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<HomeCategory> findAllByOrderByDisplayOrderAsc();
    long countByIsActiveTrueAndIdNot(Long id);
}
