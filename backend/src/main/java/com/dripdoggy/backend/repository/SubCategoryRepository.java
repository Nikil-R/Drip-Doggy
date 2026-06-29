package com.dripdoggy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dripdoggy.backend.entity.SubCategory;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory,Long> {

    @Query("SELECT s FROM SubCategory s WHERE s.isDeleted = false OR s.isDeleted IS NULL")
    List<SubCategory> findAllActiveSubCategories();
}
