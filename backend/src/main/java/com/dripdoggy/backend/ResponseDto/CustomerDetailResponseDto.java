package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CustomerDetailResponseDto {
    private int status;
    private String message;
    private Data data;

    public CustomerDetailResponseDto() {
    }

    public CustomerDetailResponseDto(int status, String message, Data data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {
        private OnboardingProfile onboardingProfile;
        private List<AddressResponseDto> shippingAddresses;
        private PurchaseSummary purchaseSummary;
        private List<RecentOrder> recentOrders;
        private List<CartResponseDto> shoppingCartItems;
        private List<String> wishlistStyles;

        public Data() {
        }

        public Data(OnboardingProfile onboardingProfile, List<AddressResponseDto> shippingAddresses, PurchaseSummary purchaseSummary, List<RecentOrder> recentOrders, List<CartResponseDto> shoppingCartItems, List<String> wishlistStyles) {
            this.onboardingProfile = onboardingProfile;
            this.shippingAddresses = shippingAddresses;
            this.purchaseSummary = purchaseSummary;
            this.recentOrders = recentOrders;
            this.shoppingCartItems = shoppingCartItems;
            this.wishlistStyles = wishlistStyles;
        }

        // Getters and Setters
        public OnboardingProfile getOnboardingProfile() {
            return onboardingProfile;
        }

        public void setOnboardingProfile(OnboardingProfile onboardingProfile) {
            this.onboardingProfile = onboardingProfile;
        }

        public List<AddressResponseDto> getShippingAddresses() {
            return shippingAddresses;
        }

        public void setShippingAddresses(List<AddressResponseDto> shippingAddresses) {
            this.shippingAddresses = shippingAddresses;
        }

        public PurchaseSummary getPurchaseSummary() {
            return purchaseSummary;
        }

        public void setPurchaseSummary(PurchaseSummary purchaseSummary) {
            this.purchaseSummary = purchaseSummary;
        }

        public List<RecentOrder> getRecentOrders() {
            return recentOrders;
        }

        public void setRecentOrders(List<RecentOrder> recentOrders) {
            this.recentOrders = recentOrders;
        }

        public List<CartResponseDto> getShoppingCartItems() {
            return shoppingCartItems;
        }

        public void setShoppingCartItems(List<CartResponseDto> shoppingCartItems) {
            this.shoppingCartItems = shoppingCartItems;
        }

        public List<String> getWishlistStyles() {
            return wishlistStyles;
        }

        public void setWishlistStyles(List<String> wishlistStyles) {
            this.wishlistStyles = wishlistStyles;
        }
    }

    public static class OnboardingProfile {
        private String id;
        private String firstName;
        private String lastName;
        private String gender;
        private String dob;
        private String email;
        private String phone;

        public OnboardingProfile() {
        }

        public OnboardingProfile(String id, String firstName, String lastName, String gender, String dob, String email, String phone) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.gender = gender;
            this.dob = dob;
            this.email = email;
            this.phone = phone;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }

    public static class PurchaseSummary {
        private int totalOrders;
        private String lastPurchase;
        private String dateJoined;

        public PurchaseSummary() {
        }

        public PurchaseSummary(int totalOrders, String lastPurchase, String dateJoined) {
            this.totalOrders = totalOrders;
            this.lastPurchase = lastPurchase;
            this.dateJoined = dateJoined;
        }

        // Getters and Setters
        public int getTotalOrders() {
            return totalOrders;
        }

        public void setTotalOrders(int totalOrders) {
            this.totalOrders = totalOrders;
        }

        public String getLastPurchase() {
            return lastPurchase;
        }

        public void setLastPurchase(String lastPurchase) {
            this.lastPurchase = lastPurchase;
        }

        public String getDateJoined() {
            return dateJoined;
        }

        public void setDateJoined(String dateJoined) {
            this.dateJoined = dateJoined;
        }
    }

    public static class RecentOrder {
        private String id;
        private String date;
        private double amount;
        private String status;
        private String payment;
        private String trackingNumber;
        private String pendingAt;
        private String processingAt;
        private String shippedAt;
        private String deliveredAt;
        private String cancelledAt;

        public RecentOrder() {
        }

        public RecentOrder(String id, String date, double amount, String status, String payment) {
            this.id = id;
            this.date = date;
            this.amount = amount;
            this.status = status;
            this.payment = payment;
        }

        public RecentOrder(String id, String date, double amount, String status, String payment, String trackingNumber, String pendingAt, String processingAt, String shippedAt, String deliveredAt, String cancelledAt) {
            this.id = id;
            this.date = date;
            this.amount = amount;
            this.status = status;
            this.payment = payment;
            this.trackingNumber = trackingNumber;
            this.pendingAt = pendingAt;
            this.processingAt = processingAt;
            this.shippedAt = shippedAt;
            this.deliveredAt = deliveredAt;
            this.cancelledAt = cancelledAt;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getPayment() {
            return payment;
        }

        public void setPayment(String payment) {
            this.payment = payment;
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
    }
}
