package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.OrderItem;
import com.dripdoggy.backend.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Orders order);
}
