package com.dripdoggy.backend.entity;

import com.dripdoggy.backend.enums.DeliveryStatus;
import com.dripdoggy.backend.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    private BigDecimal discount;
    private BigDecimal tax;

    @Column(name = "order_timestamp")
    private LocalDateTime orderTimestamp;

    @Column(name = "platform_fee")
    private BigDecimal platformFee;

    @Column(name = "delivery_method")
    private String deliveryMethod;

    @Column(name = "shipping_fee")
    private BigDecimal shippingFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status")
    private DeliveryStatus deliveryStatus;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "cancelled_by")
    private String cancelledBy;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "processing_timestamp")
    private LocalDateTime processingTimestamp;

    @Column(name = "shipped_timestamp")
    private LocalDateTime shippedTimestamp;

    @Column(name = "delivered_timestamp")
    private LocalDateTime deliveredTimestamp;

    @Column(name = "cancelled_timestamp")
    private LocalDateTime cancelledTimestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    @JsonIgnore
    private Address address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "order")
    private List<Review> reviews;

    // Constructors
    public Orders() {
    }

    public Orders(Long id, String phoneNumber, BigDecimal totalAmount, BigDecimal discount, BigDecimal tax, LocalDateTime orderTimestamp, BigDecimal platformFee, PaymentStatus paymentStatus, DeliveryStatus deliveryStatus, User user, Address address, List<OrderItem> orderItems, List<Review> reviews) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.totalAmount = totalAmount;
        this.discount = discount;
        this.tax = tax;
        this.orderTimestamp = orderTimestamp;
        this.platformFee = platformFee;
        this.paymentStatus = paymentStatus;
        this.deliveryStatus = deliveryStatus;
        this.user = user;
        this.address = address;
        this.orderItems = orderItems;
        this.reviews = reviews;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public LocalDateTime getOrderTimestamp() {
        return orderTimestamp;
    }

    public void setOrderTimestamp(LocalDateTime orderTimestamp) {
        this.orderTimestamp = orderTimestamp;
    }

    public BigDecimal getPlatformFee() {
        return platformFee != null ? platformFee : BigDecimal.ZERO;
    }

    public void setPlatformFee(BigDecimal platformFee) {
        this.platformFee = platformFee;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public LocalDateTime getProcessingTimestamp() {
        return processingTimestamp;
    }

    public void setProcessingTimestamp(LocalDateTime processingTimestamp) {
        this.processingTimestamp = processingTimestamp;
    }

    public LocalDateTime getShippedTimestamp() {
        return shippedTimestamp;
    }

    public void setShippedTimestamp(LocalDateTime shippedTimestamp) {
        this.shippedTimestamp = shippedTimestamp;
    }

    public LocalDateTime getDeliveredTimestamp() {
        return deliveredTimestamp;
    }

    public void setDeliveredTimestamp(LocalDateTime deliveredTimestamp) {
        this.deliveredTimestamp = deliveredTimestamp;
    }

    public LocalDateTime getCancelledTimestamp() {
        return cancelledTimestamp;
    }

    public void setCancelledTimestamp(LocalDateTime cancelledTimestamp) {
        this.cancelledTimestamp = cancelledTimestamp;
    }

    public String getCancelledBy() {
        return cancelledBy;
    }

    public void setCancelledBy(String cancelledBy) {
        this.cancelledBy = cancelledBy;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
    
    
}
