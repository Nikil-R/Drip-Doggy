package com.dripdoggy.backend.ResponseDto;

public class CustomerListItemDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String registered;
    private int orders;
    private int cartItems;
    private int wishlistItems;
    private String status;

    public CustomerListItemDto() {
    }

    public CustomerListItemDto(Long id, String name, String email, String phone, String registered, int orders, int cartItems, int wishlistItems, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.registered = registered;
        this.orders = orders;
        this.cartItems = cartItems;
        this.wishlistItems = wishlistItems;
        this.status = status;
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

    public String getRegistered() {
        return registered;
    }

    public void setRegistered(String registered) {
        this.registered = registered;
    }

    public int getOrders() {
        return orders;
    }

    public void setOrders(int orders) {
        this.orders = orders;
    }

    public int getCartItems() {
        return cartItems;
    }

    public void setCartItems(int cartItems) {
        this.cartItems = cartItems;
    }

    public int getWishlistItems() {
        return wishlistItems;
    }

    public void setWishlistItems(int wishlistItems) {
        this.wishlistItems = wishlistItems;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
