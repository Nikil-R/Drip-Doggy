package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Address;
import com.dripdoggy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserAndIsActiveTrue(User user);
    
    Optional<Address> findByIdAndUserAndIsActiveTrue(Long id, User user);
    
    List<Address> findByUserAndIsDefaultTrueAndIsActiveTrue(User user);
}
