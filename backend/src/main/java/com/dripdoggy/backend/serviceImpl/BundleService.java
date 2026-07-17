package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IBundleService;
import com.dripdoggy.backend.RequestDto.BundleRequestDto;
import com.dripdoggy.backend.ResponseDto.BundleResponseDto;
import com.dripdoggy.backend.ResponseDto.BundleVariantResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductVariantSizeResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.Bundle;
import com.dripdoggy.backend.entity.ProductVariant;
import com.dripdoggy.backend.entity.ProductVariantSize;
import com.dripdoggy.backend.enums.DiscountType;
import com.dripdoggy.backend.exception.ResourceNotFoundException;
import com.dripdoggy.backend.repository.BundleRepository;
import com.dripdoggy.backend.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BundleService implements IBundleService {

    private final BundleRepository bundleRepository;
    private final ProductVariantRepository productVariantRepository;

    @Autowired
    public BundleService(BundleRepository bundleRepository,
                         ProductVariantRepository productVariantRepository) {
        this.bundleRepository = bundleRepository;
        this.productVariantRepository = productVariantRepository;
    }

    @Override
    public ResponseMsgDto createOrUpdateBundle(BundleRequestDto bundleReqDto) {
        // 1. Validate main product variant
        ProductVariant mainProductVariant = productVariantRepository.findById(bundleReqDto.getMainProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant with ID " + bundleReqDto.getMainProductVariantId() + " not found in the database. Please verify and try again."));

        if (Boolean.TRUE.equals(mainProductVariant.getIsDeleted()) || !Boolean.TRUE.equals(mainProductVariant.getIsActive())) {
            throw new IllegalArgumentException("Main product variant is deactivated or deleted.");
        }

        // 2. Validate all list variants
        List<ProductVariant> variants = productVariantRepository.findAllById(bundleReqDto.getProductVariantIds());
        if (variants.size() != bundleReqDto.getProductVariantIds().size()) {
            throw new ResourceNotFoundException("One or more product variants in the list were not found in the database. Please verify and try again.");
        }

        if (variants.isEmpty()) {
            throw new IllegalArgumentException("Bundle must contain at least one valid product variant.");
        }

        for (ProductVariant v : variants) {
            if (Boolean.TRUE.equals(v.getIsDeleted()) || !Boolean.TRUE.equals(v.getIsActive())) {
                throw new IllegalArgumentException("One of the product variants in the bundle is deactivated or deleted.");
            }
        }

        // Enforce that main variant is in the list of variants
        boolean mainVariantPresent = variants.stream().anyMatch(v -> v.getId().equals(mainProductVariant.getId()));
        if (!mainVariantPresent) {
            throw new IllegalArgumentException("The main product variant must be included in the bundle product variants list.");
        }

        // Check if bundle already exists for this main variant
        Optional<Bundle> existingOpt = bundleRepository.findActiveBundleByMainProductVariantId(bundleReqDto.getMainProductVariantId());
        Bundle bundle;
        int status;
        String message;

        if (existingOpt.isPresent()) {
            bundle = existingOpt.get();
            bundle.setTitle(bundleReqDto.getTitle());
            bundle.setDiscountType(bundleReqDto.getDiscountType());
            bundle.setDiscountValue(bundleReqDto.getDiscountValue());
            bundle.setIsActive(bundleReqDto.getIsActive() != null ? bundleReqDto.getIsActive() : true);
            bundle.setProductVariants(variants);
            status = 200;
            message = "Bundle updated successfully";
        } else {
            bundle = new Bundle();
            bundle.setTitle(bundleReqDto.getTitle());
            bundle.setMainProductVariant(mainProductVariant);
            bundle.setDiscountType(bundleReqDto.getDiscountType());
            bundle.setDiscountValue(bundleReqDto.getDiscountValue());
            bundle.setIsActive(bundleReqDto.getIsActive() != null ? bundleReqDto.getIsActive() : true);
            bundle.setProductVariants(variants);
            bundle.setIsDeleted(false);
            status = 201;
            message = "Bundle created successfully";
        }

        bundleRepository.save(bundle);
        return new ResponseMsgDto(status, message);
    }

    @Override
    public List<BundleResponseDto> getAllBundles() {
        return bundleRepository.findAllActiveBundles().stream()
                .map(this::mapToBundleResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public BundleResponseDto getActiveBundleByVariantId(Long variantId) {
        if (!productVariantRepository.existsById(variantId)) {
            throw new ResourceNotFoundException("Product variant not found");
        }

        return bundleRepository.findActiveBundleByMainProductVariantId(variantId)
                .map(this::mapToBundleResponseDto)
                .orElse(null);
    }

    @Override
    public ResponseMsgDto deleteBundle(Long id) {
        Bundle bundle = bundleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bundle with ID " + id + " not found"));
        if (Boolean.TRUE.equals(bundle.getIsDeleted())) {
            throw new ResourceNotFoundException("Bundle with ID " + id + " not found");
        }
        // Soft delete
        bundle.setIsDeleted(true);
        bundle.setIsActive(false);
        bundleRepository.save(bundle);
        return new ResponseMsgDto(200, "Bundle soft deleted successfully");
    }

    @Override
    public ResponseMsgDto toggleBundleActiveStatus(Long id) {
        Bundle bundle = bundleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bundle with ID " + id + " not found"));
        if (Boolean.TRUE.equals(bundle.getIsDeleted())) {
            throw new ResourceNotFoundException("Bundle not found");
        }
        bundle.setIsActive(!bundle.getIsActive());
        bundleRepository.save(bundle);
        String status = bundle.getIsActive() ? "active" : "inactive";
        return new ResponseMsgDto(200, "Bundle visibility updated to " + status + " successfully.");
    }

    private BundleResponseDto mapToBundleResponseDto(Bundle bundle) {
        BundleResponseDto dto = new BundleResponseDto();
        dto.setId(bundle.getId());
        dto.setTitle(bundle.getTitle());
        dto.setMainProductVariantId(bundle.getMainProductVariant().getId());
        dto.setDiscountType(bundle.getDiscountType());
        dto.setDiscountValue(bundle.getDiscountValue());
        dto.setIsActive(bundle.getIsActive());

        List<BundleVariantResponseDto> variantDtos = new ArrayList<>();
        BigDecimal originalTotal = BigDecimal.ZERO;

        for (ProductVariant variant : bundle.getProductVariants()) {
            if (Boolean.TRUE.equals(variant.getIsDeleted()) || !Boolean.TRUE.equals(variant.getIsActive())) {
                continue;
            }
            List<ProductVariantSizeResponseDto> sizeDtos = new ArrayList<>();
            if (variant.getProductVariantSizes() != null) {
                for (ProductVariantSize size : variant.getProductVariantSizes()) {
                    if (Boolean.TRUE.equals(size.getIsActive())) {
                        sizeDtos.add(new ProductVariantSizeResponseDto(
                                size.getId(),
                                size.getSizeName(),
                                size.getStockQuantity(),
                                size.getIsActive()
                        ));
                    }
                }
            }

            BundleVariantResponseDto varDto = new BundleVariantResponseDto(
                    variant.getId(),
                    variant.getVariantName(),
                    variant.getProduct() != null ? variant.getProduct().getId() : null,
                    variant.getProduct() != null ? variant.getProduct().getProductName() : "",
                    variant.getPrimaryImageUrl(),
                    variant.getPrice(),
                    variant.getMrp(),
                    sizeDtos
            );

            variantDtos.add(varDto);
            originalTotal = originalTotal.add(variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO);
        }

        dto.setVariants(variantDtos);
        dto.setOriginalTotal(originalTotal);

        // Apply discount percentage or flat discount
        BigDecimal bundlePrice;
        if (bundle.getDiscountType() == DiscountType.PERCENTAGE) {
            BigDecimal discountFraction = bundle.getDiscountValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            BigDecimal discountAmount = originalTotal.multiply(discountFraction);
            bundlePrice = originalTotal.subtract(discountAmount);
        } else { // FLAT discount
            bundlePrice = originalTotal.subtract(bundle.getDiscountValue());
        }

        // Clamp bundle price to zero if negative
        if (bundlePrice.compareTo(BigDecimal.ZERO) < 0) {
            bundlePrice = BigDecimal.ZERO;
        }

        dto.setBundlePrice(bundlePrice.setScale(2, RoundingMode.HALF_UP));

        return dto;
    }
}
