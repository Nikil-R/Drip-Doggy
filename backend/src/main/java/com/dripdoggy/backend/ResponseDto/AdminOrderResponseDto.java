package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;
import java.util.List;

public class AdminOrderResponseDto {
    private String orderNumber;
    private String orderTimestamp;
    private BigDecimal totalAmount;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal platformFee;
    private BigDecimal shippingFee;
    private String deliveryMethod;
    private String deliveryStatus;
    private String paymentStatus;
    private String phoneNumber;
    private String customerEmail;
    private String customerName;
    private String destinationAddress;
    private String trackingNumber;
    private String pendingAt;
    private String processingAt;
    private String shippedAt;
    private String deliveredAt;
    private String cancelledAt;
    private List<OrderItemDetail> items;
    private BigDecimal subTotal;

    public AdminOrderResponseDto() {
    }

    public AdminOrderResponseDto(String orderNumber, String orderTimestamp, BigDecimal totalAmount, BigDecimal discount, BigDecimal tax, BigDecimal platformFee, BigDecimal shippingFee, String deliveryMethod, String deliveryStatus, String paymentStatus, String phoneNumber, String customerEmail, String customerName, String destinationAddress, String trackingNumber, String pendingAt, String processingAt, String shippedAt, String deliveredAt, String cancelledAt, List<OrderItemDetail> items) {
        this.orderNumber = orderNumber;
        this.orderTimestamp = orderTimestamp;
        this.totalAmount = totalAmount;
        this.discount = discount;
        this.tax = tax;
        this.platformFee = platformFee;
        this.shippingFee = shippingFee;
        this.deliveryMethod = deliveryMethod;
        this.deliveryStatus = deliveryStatus;
        this.paymentStatus = paymentStatus;
        this.phoneNumber = phoneNumber;
        this.customerEmail = customerEmail;
        this.customerName = customerName;
        this.destinationAddress = destinationAddress;
        this.trackingNumber = trackingNumber;
        this.pendingAt = pendingAt;
        this.processingAt = processingAt;
        this.shippedAt = shippedAt;
        this.deliveredAt = deliveredAt;
        this.cancelledAt = cancelledAt;
        this.items = items;
    }

    // Getters and Setters
    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getOrderTimestamp() {
        return orderTimestamp;
    }

    public void setOrderTimestamp(String orderTimestamp) {
        this.orderTimestamp = orderTimestamp;
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

    public BigDecimal getPlatformFee() {
        return platformFee;
    }

    public void setPlatformFee(BigDecimal platformFee) {
        this.platformFee = platformFee;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDestinationAddress() {
        return destinationAddress;
    }

    public void setDestinationAddress(String destinationAddress) {
        this.destinationAddress = destinationAddress;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getPendingAt() {
        return pendingAt;
    }

    public void setPendingAt(String pendingAt) {
        this.pendingAt = pendingAt;
    }

    public String getProcessingAt() {
        return processingAt;
    }

    public void setProcessingAt(String processingAt) {
        this.processingAt = processingAt;
    }

    public String getShippedAt() {
        return shippedAt;
    }

    public void setShippedAt(String shippedAt) {
        this.shippedAt = shippedAt;
    }

    public String getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(String deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public String getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(String cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public List<OrderItemDetail> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDetail> items) {
        this.items = items;
    }

    public BigDecimal getSubTotal() {
        if (subTotal == null && totalAmount != null) {
            BigDecimal disc = discount != null ? discount : BigDecimal.ZERO;
            BigDecimal tx = tax != null ? tax : BigDecimal.ZERO;
            BigDecimal ship = shippingFee != null ? shippingFee : BigDecimal.ZERO;
            BigDecimal plat = platformFee != null ? platformFee : BigDecimal.ZERO;
            return totalAmount.add(disc).subtract(tx).subtract(ship).subtract(plat);
        }
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    public static class OrderItemDetail {
        private Long id;
        private String name;
        private String sku;
        private String size;
        private int qty;
        private double price;
        private String image;
        private String returnRequestType;
        private String returnRequestStatus;

        public OrderItemDetail() {
        }

        public OrderItemDetail(Long id, String name, String sku, String size, int qty, double price, String image) {
            this.id = id;
            this.name = name;
            this.sku = sku;
            this.size = size;
            this.qty = qty;
            this.price = price;
            this.image = image;
        }

        public OrderItemDetail(Long id, String name, String sku, String size, int qty, double price, String image, String returnRequestType, String returnRequestStatus) {
            this.id = id;
            this.name = name;
            this.sku = sku;
            this.size = size;
            this.qty = qty;
            this.price = price;
            this.image = image;
            this.returnRequestType = returnRequestType;
            this.returnRequestStatus = returnRequestStatus;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSku() {
            return sku;
        }

        public void setSku(String sku) {
            this.sku = sku;
        }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public int getQty() {
            return qty;
        }

        public void setQty(int qty) {
            this.qty = qty;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getReturnRequestType() {
            return returnRequestType;
        }

        public void setReturnRequestType(String returnRequestType) {
            this.returnRequestType = returnRequestType;
        }

        public String getReturnRequestStatus() {
            return returnRequestStatus;
        }

        public void setReturnRequestStatus(String returnRequestStatus) {
            this.returnRequestStatus = returnRequestStatus;
        }
    }
}
