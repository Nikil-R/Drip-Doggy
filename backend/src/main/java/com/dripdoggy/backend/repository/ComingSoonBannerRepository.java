package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.ComingSoonBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComingSoonBannerRepository extends JpaRepository<ComingSoonBanner, Long> {

    List<ComingSoonBanner> findByIsDeletedFalseOrderByDisplayOrderAscCreatedAtDesc();

    List<ComingSoonBanner> findByIsActiveTrueAndIsDeletedFalseOrderByDisplayOrderAscCreatedAtDesc();
}
