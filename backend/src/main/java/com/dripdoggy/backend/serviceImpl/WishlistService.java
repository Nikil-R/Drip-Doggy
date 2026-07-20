package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IWishlistService;
import com.dripdoggy.backend.RequestDto.WishlistRequestDto;
import com.dripdoggy.backend.ResponseDto.WishlistListResponseDto;
import com.dripdoggy.backend.ResponseDto.WishlistResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.WishlistRepository;
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
public class WishlistService implements IWishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductVariantSizeRepository productVariantSizeRepository;

    @Autowired
    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository, ProductVariantSizeRepository productVariantSizeRepository) {
        this.wishlistRepository = wishlistRepository;
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

    private void validateProductActive(ProductVariantSize size) {
        if (size == null || !Boolean.TRUE.equals(size.getIsActive())) {
            throw new ProductNotFoundException("This product is not found.");
        }

        ProductVariant variant = size.getProductVariant();
        if (variant == null || Boolean.TRUE.equals(variant.getIsDeleted()) || !Boolean.TRUE.equals(variant.getIsActive())) {
            throw new ProductNotFoundException("This product is not found.");
        }

        Product product = variant.getProduct();
        if (product == null || Boolean.TRUE.equals(product.getIsDeleted()) || !Boolean.TRUE.equals(product.getIsActive())) {
            throw new ProductNotFoundException("This product is not found.");
        }

        Category category = product.getCategory();
        if (category == null || Boolean.TRUE.equals(category.getIsDeleted()) || !Boolean.TRUE.equals(category.getIsActive())) {
            throw new ProductNotFoundException("This product is not found.");
        }

        SubCategory subCategory = product.getSubCategory();
        if (subCategory == null || Boolean.TRUE.equals(subCategory.getIsDeleted()) || !Boolean.TRUE.equals(subCategory.getIsActive())) {
            throw new ProductNotFoundException("This product is not found.");
        }
    }

    @Override
    public WishlistListResponseDto getWishlist() {
        User user = getCurrentUser();
        List<Wishlist> rawWishlistItems = wishlistRepository.findByUserAndIsActiveTrue(user);
        List<WishlistResponseDto> responseItems = new ArrayList<>();

        for (Wishlist item : rawWishlistItems) {
            ProductVariantSize size = item.getProductVariantSize();
            
            // Validate product status. If inactive or deleted, throw custom exception
            validateProductActive(size);

            ProductVariant variant = size.getProductVariant();
            Product product = variant.getProduct();

            WishlistResponseDto dto = new WishlistResponseDto();
            dto.setId(item.getId());
            dto.setProductVariantSizeId(size.getId());
            dto.setSizeName(size.getSizeName());
            dto.setProductName(product.getProductName());
            dto.setVariantName(variant.getVariantName());
            dto.setPrice(variant.getPrice());
            dto.setPrimaryImageUrl(variant.getPrimaryImageUrl());
            dto.setIsActive(item.getIsActive());

            responseItems.add(dto);
        }

        return new WishlistListResponseDto(200, "Wishlist items fetched successfully", responseItems);
    }

    @Override
    public ResponseMsgDto addToWishlist(WishlistRequestDto request) {
        User user = getCurrentUser();
        ProductVariantSize size = productVariantSizeRepository.findById(request.getProductVariantSizeId())
                .orElseThrow(() -> new ProductNotFoundException("This product is not found."));

        // Validate product status before adding
        validateProductActive(size);

        synchronized (("wishlist_user_" + user.getId()).intern()) {
            List<Wishlist> existingWishlistList = wishlistRepository.findByUserAndProductVariantSize(user, size);

            if (!existingWishlistList.isEmpty()) {
                Wishlist existingWishlist = existingWishlistList.get(0);
                if (!Boolean.TRUE.equals(existingWishlist.getIsActive())) {
                    existingWishlist.setIsActive(true);
                    wishlistRepository.save(existingWishlist);
                }
                for (int i = 1; i < existingWishlistList.size(); i++) {
                    wishlistRepository.delete(existingWishlistList.get(i));
                }
            } else {
                Wishlist newWishlist = new Wishlist();
                newWishlist.setUser(user);
                newWishlist.setProductVariantSize(size);
                newWishlist.setIsActive(true);
                wishlistRepository.save(newWishlist);
            }
        }

        return new ResponseMsgDto(200, "Item added to wishlist successfully");
    }

    @Override
    public ResponseMsgDto removeWishlistItem(Long wishlistItemId) {
        User user = getCurrentUser();
        Wishlist wishlistItem = wishlistRepository.findByIdAndUserAndIsActiveTrue(wishlistItemId, user)
                .orElseThrow(() -> new ProductNotFoundException("This product is not found."));

        // Soft Delete
        wishlistItem.setIsActive(false);
        wishlistRepository.save(wishlistItem);

        return new ResponseMsgDto(200, "Item removed from wishlist successfully");
    }

    @Override
    public ResponseMsgDto toggleWishlistItemActive(Long wishlistItemId) {
        User user = getCurrentUser();
        Wishlist wishlistItem = wishlistRepository.findByIdAndUserAndIsActiveTrue(wishlistItemId, user)
                .orElseThrow(() -> new ProductNotFoundException("This product is not found."));

        // Soft Delete / Deactivate
        wishlistItem.setIsActive(false);
        wishlistRepository.save(wishlistItem);

        return new ResponseMsgDto(200, "Item deactivated in wishlist successfully");
    }
}
