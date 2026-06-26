package com.dripdoggy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dripdoggy.backend.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
	
}
