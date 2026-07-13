package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByIsDeletedFalseOrderByDisplayOrderAsc();
    List<Banner> findByIsActiveTrueAndIsDeletedFalseOrderByDisplayOrderAsc();
}
