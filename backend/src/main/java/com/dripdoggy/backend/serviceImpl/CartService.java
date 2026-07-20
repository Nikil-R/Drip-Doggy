package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.ICartService;
import com.dripdoggy.backend.RequestDto.CartRequestDto;
import com.dripdoggy.backend.ResponseDto.CartListResponseDto;
import com.dripdoggy.backend.ResponseDto.CartResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.RequestDto.AddBundleToCartRequestDto;
import com.dripdoggy.backend.repository.BundleRepository;
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
    private final BundleRepository bundleRepository;

    @Autowired
    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductVariantSizeRepository productVariantSizeRepository, BundleRepository bundleRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productVariantSizeRepository = productVariantSizeRepository;
        this.bundleRepository = bundleRepository;
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
            if (variant.getPrice() != null && item.getQuantity() != null) {
                dto.setSubTotal(variant.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));
            }
            if (item.getBundle() != null) {
                dto.setBundleId(item.getBundle().getId());
                dto.setBundleTitle(item.getBundle().getTitle());
            }

            int stock = size.getStockQuantity() != null ? size.getStockQuantity() : 0;
            dto.setIsAvailable(stock >= item.getQuantity() && Boolean.TRUE.equals(size.getIsActive()));
            dto.setIsOutOfStock(stock <= 0);
            dto.setItemsLeft(stock < 10 ? stock : null);

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

        Optional<Cart> existingCartOpt = cartRepository.findByUserAndProductVariantSize(user, size);

        if (existingCartOpt.isPresent()) {
            Cart existingCart = existingCartOpt.get();
            if (Boolean.TRUE.equals(existingCart.getIsActive())) {
                int newQuantity = existingCart.getQuantity() + request.getQuantity();
                existingCart.setQuantity(newQuantity);
            } else {
                existingCart.setIsActive(true);
                existingCart.setQuantity(request.getQuantity());
            }
            cartRepository.save(existingCart);
        } else {
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

        if (cartItem.getBundle() != null) {
            throw new CannotDeleteBundleException("You cannot modify the quantity of a bundle item.");
        }

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

        cartItem.setQuantity(quantity);
        cartRepository.save(cartItem);

        return new ResponseMsgDto(200, "Cart item quantity updated successfully");
    }

    @Override
    public ResponseMsgDto removeCartItem(Long cartItemId) {
        User user = getCurrentUser();
        Cart cartItem = cartRepository.findByIdAndUserAndIsActiveTrue(cartItemId, user)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found or inactive"));

        if (cartItem.getBundle() != null) {
            throw new CannotDeleteBundleException("You cannot delete a single item from a bundle. To remove the bundle, please remove the entire bundle.");
        }

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

    @Override
    public ResponseMsgDto addBundleToCart(AddBundleToCartRequestDto request) {
        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        if (request.getProductVariantSizeIds() == null || request.getProductVariantSizeIds().isEmpty()) {
            throw new IllegalArgumentException("At least one product variant size is required to add bundle to cart");
        }

        User user = getCurrentUser();
        Bundle bundle = bundleRepository.findById(request.getBundleId())
                .orElseThrow(() -> new ResourceNotFoundException("Bundle not found"));

        if (Boolean.TRUE.equals(bundle.getIsDeleted()) || bundle.getIsActive() == null || !bundle.getIsActive()) {
            throw new IllegalArgumentException("This bundle is inactive or has been deleted");
        }

        List<ProductVariantSize> selectedSizes = productVariantSizeRepository.findAllById(request.getProductVariantSizeIds());
        if (selectedSizes.size() != request.getProductVariantSizeIds().size()) {
            throw new ResourceNotFoundException("One or more product variant sizes not found");
        }

        // Validate selected sizes belong to variants in the bundle and cover all bundle variants
        java.util.Set<Long> bundleVariantIds = bundle.getProductVariants().stream()
                .map(ProductVariant::getId)
                .collect(java.util.stream.Collectors.toSet());

        java.util.Set<Long> selectedVariantIds = new java.util.HashSet<>();
        for (ProductVariantSize size : selectedSizes) {
            if (!Boolean.TRUE.equals(size.getIsActive())) {
                throw new IllegalArgumentException("Product size '" + size.getSizeName() + "' is deactivated");
            }
            ProductVariant variant = size.getProductVariant();
            if (variant == null || Boolean.TRUE.equals(variant.getIsDeleted()) || !Boolean.TRUE.equals(variant.getIsActive())) {
                throw new IllegalArgumentException("One of the product variants is deactivated or deleted");
            }
            // Check stock
            int stock = size.getStockQuantity() != null ? size.getStockQuantity() : 0;
            if (stock < request.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for size " + size.getSizeName() + " of variant " + variant.getVariantName() + ". Available: " + stock);
            }
            selectedVariantIds.add(variant.getId());
        }

        // Validate that every product variant in the bundle has exactly one selected size
        for (ProductVariant variant : bundle.getProductVariants()) {
            if (!selectedVariantIds.contains(variant.getId())) {
                String productName = variant.getProduct() != null ? variant.getProduct().getProductName() : "Product";
                throw new BundleSizeNotSelectedException("Please select a size for all products in the bundle. Missing size selection for: " + productName);
            }
        }

        // Validate that no extra/unrelated variant sizes were passed
        for (ProductVariantSize size : selectedSizes) {
            ProductVariant variant = size.getProductVariant();
            if (variant == null || !bundleVariantIds.contains(variant.getId())) {
                throw new IllegalArgumentException("The selected size '" + size.getSizeName() + "' does not belong to any variant in the bundle.");
            }
        }

        // Add or update cart items
        for (ProductVariantSize size : selectedSizes) {
            Optional<Cart> existingCartOpt = cartRepository.findByUserAndProductVariantSizeAndBundle(user, size, bundle);
            if (existingCartOpt.isPresent()) {
                Cart existingCart = existingCartOpt.get();
                if (Boolean.TRUE.equals(existingCart.getIsActive())) {
                    existingCart.setQuantity(existingCart.getQuantity() + request.getQuantity());
                } else {
                    existingCart.setIsActive(true);
                    existingCart.setQuantity(request.getQuantity());
                }
                cartRepository.save(existingCart);
            } else {
                Cart newCart = new Cart();
                newCart.setUser(user);
                newCart.setProductVariantSize(size);
                newCart.setBundle(bundle);
                newCart.setQuantity(request.getQuantity());
                newCart.setIsActive(true);
                cartRepository.save(newCart);
            }
        }

        return new ResponseMsgDto(200, "Bundle added to cart successfully");
    }

    @Override
    public ResponseMsgDto updateCartItemSize(Long cartItemId, Long productVariantSizeId) {
        User user = getCurrentUser();
        Cart cartItem = cartRepository.findByIdAndUserAndIsActiveTrue(cartItemId, user)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found or inactive"));

        ProductVariantSize newSize = productVariantSizeRepository.findById(productVariantSizeId)
                .orElse(null);

        ProductVariantSize currentSize = cartItem.getProductVariantSize();
        if (currentSize == null) {
            throw new ResourceNotFoundException("Current product variant size not found");
        }
        ProductVariant currentVariant = currentSize.getProductVariant();
        if (currentVariant == null) {
            throw new ResourceNotFoundException("Current product variant not found");
        }
        Product product = currentVariant.getProduct();
        String productName = product != null ? product.getProductName() : "Product";

        // Validate new size existence, active status and stock quantity
        if (newSize == null || !Boolean.TRUE.equals(newSize.getIsActive()) || (newSize.getStockQuantity() != null && newSize.getStockQuantity() < cartItem.getQuantity())) {
            throw new ProductVariantSizeNotAvailableException("The size is not available for " + productName);
        }

        // Validate that new size belongs to the same product variant as the current size
        if (newSize.getProductVariant() == null || !newSize.getProductVariant().getId().equals(currentVariant.getId())) {
            throw new IllegalArgumentException("Cannot change size to a different product variant. The new size must belong to the same product variant.");
        }

        // If the size is already the same, it's a no-op
        if (newSize.getId().equals(currentSize.getId())) {
            return new ResponseMsgDto(200, "Cart item size updated successfully");
        }

        // If it's a bundle item, check if there's already a cart item in this bundle with the new size
        Bundle bundle = cartItem.getBundle();
        if (bundle != null) {
            Optional<Cart> existingCartOpt = cartRepository.findByUserAndProductVariantSizeAndBundle(user, newSize, bundle);
            if (existingCartOpt.isPresent()) {
                Cart existingCart = existingCartOpt.get();
                if (Boolean.TRUE.equals(existingCart.getIsActive())) {
                    existingCart.setQuantity(existingCart.getQuantity() + cartItem.getQuantity());
                } else {
                    existingCart.setIsActive(true);
                    existingCart.setQuantity(cartItem.getQuantity());
                }
                cartItem.setIsActive(false);
                cartRepository.save(existingCart);
                cartRepository.save(cartItem);
                return new ResponseMsgDto(200, "Cart item size updated successfully");
            }
        } else {
            // Standalone item: check if there's already a cart item with the new size (without a bundle)
            List<Cart> activeItems = cartRepository.findByUserAndIsActiveTrue(user);
            Optional<Cart> existingCartOpt = activeItems.stream()
                    .filter(item -> item.getProductVariantSize() != null && item.getProductVariantSize().getId().equals(newSize.getId()) && item.getBundle() == null)
                    .findFirst();

            if (existingCartOpt.isPresent()) {
                Cart existingCart = existingCartOpt.get();
                existingCart.setQuantity(existingCart.getQuantity() + cartItem.getQuantity());
                cartItem.setIsActive(false);
                cartRepository.save(existingCart);
                cartRepository.save(cartItem);
                return new ResponseMsgDto(200, "Cart item size updated successfully");
            }
        }

        // Otherwise, simply update the size on the current cart item
        cartItem.setProductVariantSize(newSize);
        cartRepository.save(cartItem);

        return new ResponseMsgDto(200, "Cart item size updated successfully");
    }

    @Override
    public ResponseMsgDto removeBundleFromCart(Long bundleId) {
        User user = getCurrentUser();
        List<Cart> bundleItems = cartRepository.findByUserAndBundleIdAndIsActiveTrue(user, bundleId);
        
        if (bundleItems.isEmpty()) {
            throw new ResourceNotFoundException("No active bundle with ID " + bundleId + " found in your cart.");
        }

        for (Cart item : bundleItems) {
            item.setIsActive(false);
        }
        cartRepository.saveAll(bundleItems);

        return new ResponseMsgDto(200, "Bundle removed from cart successfully");
    }
}
