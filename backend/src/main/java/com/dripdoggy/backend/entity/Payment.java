package com.dripdoggy.backend.entity;

import com.dripdoggy.backend.enums.BankSettlementStatus;
import com.dripdoggy.backend.enums.PaymentStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Column(name = "customer_name")
    private String customerName;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_type")
    private String paymentType = "COD";

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "bank_settlement_status", nullable = false)
    private BankSettlementStatus bankSettlementStatus = BankSettlementStatus.PENDING_DEPOSIT;

    @Column(name = "bank_settled_at")
    private LocalDateTime bankSettledAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.paymentType == null) {
            this.paymentType = "COD";
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = PaymentStatus.PENDING;
        }
        if (this.bankSettlementStatus == null) {
            this.bankSettlementStatus = BankSettlementStatus.PENDING_DEPOSIT;
        }
    }

    public Payment() {
    }

    public Payment(Long id, Orders order, String orderNumber, String customerName, BigDecimal amount, String paymentType, PaymentStatus paymentStatus, BankSettlementStatus bankSettlementStatus, LocalDateTime bankSettledAt, LocalDateTime createdAt) {
        this.id = id;
        this.order = order;
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.amount = amount;
        this.paymentType = paymentType;
        this.paymentStatus = paymentStatus;
        this.bankSettlementStatus = bankSettlementStatus;
        this.bankSettledAt = bankSettledAt;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Orders getOrder() {
        return order;
    }

    public void setOrder(Orders order) {
        this.order = order;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public BankSettlementStatus getBankSettlementStatus() {
        return bankSettlementStatus;
    }

    public void setBankSettlementStatus(BankSettlementStatus bankSettlementStatus) {
        this.bankSettlementStatus = bankSettlementStatus;
    }

    public LocalDateTime getBankSettledAt() {
        return bankSettledAt;
    }

    public void setBankSettledAt(LocalDateTime bankSettledAt) {
        this.bankSettledAt = bankSettledAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
