package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.OrderReturn;
import com.dripdoggy.backend.enums.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderReturnRepository extends JpaRepository<OrderReturn, Long> {
    boolean existsByOrderIdAndOrderItemId(Long orderId, Long orderItemId);
    List<OrderReturn> findByStatus(ReturnStatus status);
    List<OrderReturn> findByOrderItemId(Long orderItemId);
}
