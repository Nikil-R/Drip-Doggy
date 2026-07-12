package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Orders;
import com.dripdoggy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByUserOrderByOrderTimestampDesc(User user);
    boolean existsByTrackingNumberAndIdNot(String trackingNumber, Long id);
    boolean existsByTrackingNumber(String trackingNumber);
}
