package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.CuratedCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CuratedCollectionRepository extends JpaRepository<CuratedCollection, Long> {
    Optional<CuratedCollection> findBySectionKey(String sectionKey);
}
