package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Orders;
import com.dripdoggy.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder(Orders order);
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByOrderNumber(String orderNumber);
    List<Payment> findAllByOrderByCreatedAtDesc();
}
