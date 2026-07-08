package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.ICartService;
import com.dripdoggy.backend.RequestDto.CartRequestDto;
import com.dripdoggy.backend.ResponseDto.CartListResponseDto;
import com.dripdoggy.backend.ResponseDto.CartResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.CartRepository;
import com.dripdoggy.backend.repository.ProductVariantSizeRepository;
import com.dripdoggy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService implements ICartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductVariantSizeRepository productVariantSizeRepository;

    @Autowired
    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductVariantSizeRepository productVariantSizeRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productVariantSizeRepository = productVariantSizeRepository;
    }

    private User getCurrentUser() {
        org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Access Denied: User must be authenticated.");
        }
        String principalName = authentication.getName();
        if (principalName.contains("@")) {
            return userRepository.findByEmail(principalName)
                    .orElseThrow(() -> new EmailNotFoundException("Email address is not registered: " + principalName));
        } else {
            String alternative = principalName.startsWith("+") ? principalName.substring(1) : "+" + principalName;
            return userRepository.findByPhoneNo(principalName)
                    .or(() -> userRepository.findByPhoneNo(alternative))
                    .orElseThrow(() -> new PhoneNotFoundException("Phone number is not registered: " + principalName));
        }
    }

    @Override
    public CartListResponseDto getCart() {
        User user = getCurrentUser();
        List<Cart> rawCartItems = cartRepository.findByUserAndIsActiveTrue(user);
        List<CartResponseDto> activeResponseItems = new ArrayList<>();

        for (Cart item : rawCartItems) {
            ProductVariantSize size = item.getProductVariantSize();
            if (size == null) {
                // Self-healing soft delete
                item.setIsActive(false);
                cartRepository.save(item);
                continue;
            }

            ProductVariant variant = size.getProductVariant();
            if (variant == null || Boolean.TRUE.equals(variant.getIsDeleted()) || !Boolean.TRUE.equals(variant.getIsActive())) {
                // Self-healing soft delete
                item.setIsActive(false);
                cartRepository.save(item);
                continue;
            }

            Product product = variant.getProduct();
            if (product == null || Boolean.TRUE.equals(product.getIsDeleted()) || !Boolean.TRUE.equals(product.getIsActive())) {
                // Self-healing soft delete
                item.setIsActive(false);
                cartRepository.save(item);
                continue;
            }

            if (!Boolean.TRUE.equals(size.getIsActive())) {
                // Self-healing soft delete
                item.setIsActive(false);
                cartRepository.save(item);
                continue;
            }

            // Check Category Active status
            Category category = product.getCategory();
            if (category == null || Boolean.TRUE.equals(category.getIsDeleted()) || !Boolean.TRUE.equals(category.getIsActive())) {
                // Self-healing soft delete
                item.setIsActive(false);
                cartRepository.save(item);
                continue;
            }

            // Check SubCategory Active status
            SubCategory subCategory = product.getSubCategory();
            if (subCategory == null || Boolean.TRUE.equals(subCategory.getIsDeleted()) || !Boolean.TRUE.equals(subCategory.getIsActive())) {
                // Self-healing soft delete
                item.setIsActive(false);
                cartRepository.save(item);
                continue;
            }

            CartResponseDto dto = new CartResponseDto();
            dto.setId(item.getId());
            dto.setQuantity(item.getQuantity());
            dto.setIsActive(item.getIsActive());
            dto.setProductVariantSizeId(size.getId());
            dto.setSizeName(size.getSizeName());
            dto.setProductName(product.getProductName());
            dto.setVariantName(variant.getVariantName());
            dto.setPrice(variant.getPrice());
            dto.setPrimaryImageUrl(variant.getPrimaryImageUrl());

            activeResponseItems.add(dto);
        }

        return new CartListResponseDto(200, "Cart items fetched successfully", activeResponseItems);
    }

    @Override
    public ResponseMsgDto addToCart(CartRequestDto request) {
        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        User user = getCurrentUser();
        ProductVariantSize size = productVariantSizeRepository.findById(request.getProductVariantSizeId())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant size not found"));

        ProductVariant variant = size.getProductVariant();
        if (variant == null || Boolean.TRUE.equals(variant.getIsDeleted()) || !Boolean.TRUE.equals(variant.getIsActive())) {
            throw new ResourceNotFoundException("Product variant is deactivated or not found.");
        }

        Product product = variant.getProduct();
        if (product == null || Boolean.TRUE.equals(product.getIsDeleted()) || !Boolean.TRUE.equals(product.getIsActive())) {
            throw new ResourceNotFoundException("Product is deactivated or not found.");
        }

        Category category = product.getCategory();
        if (category == null || Boolean.TRUE.equals(category.getIsDeleted()) || !Boolean.TRUE.equals(category.getIsActive())) {
            throw new ResourceNotFoundException("Category of this product is deactivated or not found.");
        }

        SubCategory subCategory = product.getSubCategory();
        if (subCategory == null || Boolean.TRUE.equals(subCategory.getIsDeleted()) || !Boolean.TRUE.equals(subCategory.getIsActive())) {
            throw new ResourceNotFoundException("Subcategory of this product is deactivated or not found.");
        }

        if (!Boolean.TRUE.equals(size.getIsActive())) {
            throw new ResourceNotFoundException("Product size is deactivated.");
        }

        // Check overall stock
        int availableStock = size.getStockQuantity() != null ? size.getStockQuantity() : 0;

        Optional<Cart> existingCartOpt = cartRepository.findByUserAndProductVariantSize(user, size);

        if (existingCartOpt.isPresent()) {
            Cart existingCart = existingCartOpt.get();
            if (Boolean.TRUE.equals(existingCart.getIsActive())) {
                int newQuantity = existingCart.getQuantity() + request.getQuantity();
                if (newQuantity > availableStock) {
                    throw new CustomerCartSizeforParticularSizeexxceedException("Insufficient stock available in Customer cart . Only " + availableStock + " units left.");
                }
                existingCart.setQuantity(newQuantity);
            } else {
                if (request.getQuantity() > availableStock) {
                    throw new CustomerCartSizeforParticularSizeexxceedException("Insufficient stock available in Customer cart . Only " + availableStock + " units left.");
                }
                existingCart.setIsActive(true);
                existingCart.setQuantity(request.getQuantity());
            }
            cartRepository.save(existingCart);
        } else {
            if (request.getQuantity() > availableStock) {
                throw new CustomerCartSizeforParticularSizeexxceedException("Insufficient stock available in Customer cart . Only " + availableStock + " units left.");
            }
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setProductVariantSize(size);
            newCart.setQuantity(request.getQuantity());
            newCart.setIsActive(true);
            cartRepository.save(newCart);
        }

        return new ResponseMsgDto(200, "Item added to cart successfully");
    }

    @Override
    public ResponseMsgDto updateCartItemQuantity(Long cartItemId, Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        User user = getCurrentUser();
        Cart cartItem = cartRepository.findByIdAndUserAndIsActiveTrue(cartItemId, user)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found or inactive"));

        ProductVariantSize size = cartItem.getProductVariantSize();
        if (size == null || !Boolean.TRUE.equals(size.getIsActive())) {
            throw new IllegalArgumentException("This product size is no longer active.");
        }

        ProductVariant variant = size.getProductVariant();
        if (variant == null || Boolean.TRUE.equals(variant.getIsDeleted()) || !Boolean.TRUE.equals(variant.getIsActive())) {
            throw new IllegalArgumentException("This product variant is no longer active.");
        }

        Product product = variant.getProduct();
        if (product == null || Boolean.TRUE.equals(product.getIsDeleted()) || !Boolean.TRUE.equals(product.getIsActive())) {
            throw new IllegalArgumentException("This product is no longer active.");
        }

        Category category = product.getCategory();
        if (category == null || Boolean.TRUE.equals(category.getIsDeleted()) || !Boolean.TRUE.equals(category.getIsActive())) {
            throw new IllegalArgumentException("This product's category is no longer active.");
        }

        SubCategory subCategory = product.getSubCategory();
        if (subCategory == null || Boolean.TRUE.equals(subCategory.getIsDeleted()) || !Boolean.TRUE.equals(subCategory.getIsActive())) {
            throw new IllegalArgumentException("This product's subcategory is no longer active.");
        }

        int availableStock = size.getStockQuantity() != null ? size.getStockQuantity() : 0;
        if (quantity > availableStock) {
            throw new CustomerCartSizeforParticularSizeexxceedException("Insufficient stock available in Customer cart . Only " + availableStock + " units left.");
        }

        cartItem.setQuantity(quantity);
        cartRepository.save(cartItem);

        return new ResponseMsgDto(200, "Cart item quantity updated successfully");
    }

    @Override
    public ResponseMsgDto removeCartItem(Long cartItemId) {
        User user = getCurrentUser();
        Cart cartItem = cartRepository.findByIdAndUserAndIsActiveTrue(cartItemId, user)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found or inactive"));

        // Soft Delete
        cartItem.setIsActive(false);
        cartRepository.save(cartItem);

        return new ResponseMsgDto(200, "Item removed from cart successfully");
    }

    @Override
    public ResponseMsgDto clearCart() {
        User user = getCurrentUser();
        List<Cart> activeItems = cartRepository.findByUserAndIsActiveTrue(user);
        for (Cart item : activeItems) {
            item.setIsActive(false);
        }
        cartRepository.saveAll(activeItems);

        return new ResponseMsgDto(200, "Cart cleared successfully");
    }
}
