package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Configuration.S3Service;
import com.dripdoggy.backend.Iservice.IProductService;
import com.dripdoggy.backend.RequestDto.*;
import com.dripdoggy.backend.ResponseDto.*;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.DiscountType;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductVariantSizeRepository productVariantSizeRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final ProductFeatureRepository productFeatureRepository;
    private final ImageRepository imageRepository;
    private final S3Service s3Service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          SubCategoryRepository subCategoryRepository,
                          ProductVariantRepository productVariantRepository,
                          ProductVariantSizeRepository productVariantSizeRepository,
                          ProductSpecificationRepository productSpecificationRepository,
                          ProductFeatureRepository productFeatureRepository,
                          ImageRepository imageRepository,
                          S3Service s3Service) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.productVariantRepository = productVariantRepository;
        this.productVariantSizeRepository = productVariantSizeRepository;
        this.productSpecificationRepository = productSpecificationRepository;
        this.productFeatureRepository = productFeatureRepository;
        this.imageRepository = imageRepository;
        this.s3Service = s3Service;
    }

    private void validateImageDimensions(MultipartFile file) {
        // Image dimension validation is now handled on the frontend.
    }

    private BigDecimal calculateFinalPrice(BigDecimal mrp, DiscountType discountType, BigDecimal discountValue) {
        if (mrp == null) return BigDecimal.ZERO;
        if (discountType == null || discountValue == null) return mrp;

        BigDecimal finalPrice = mrp;
        if (discountType == DiscountType.PERCENTAGE) {
            BigDecimal discountAmount = mrp.multiply(discountValue).divide(BigDecimal.valueOf(100));
            finalPrice = mrp.subtract(discountAmount);
        } else if (discountType == DiscountType.FLAT) {
            finalPrice = mrp.subtract(discountValue);
        }

        if (finalPrice.compareTo(BigDecimal.ZERO) < 0) {
            finalPrice = BigDecimal.ZERO;
        }
        return finalPrice;
    }

    private String serializeCustomSpecs(Map<String, String> customSpecs) {
        if (customSpecs == null || customSpecs.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(customSpecs);
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, String> deserializeCustomSpecs(String customSpecsStr) {
        if (customSpecsStr == null || customSpecsStr.isEmpty()) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(customSpecsStr, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    @Override
    public ResponseMsgDto createProduct(ProductRequestDto productReqDto) {
        // Validate Product SKU
        if (productReqDto.getSkuCode() != null && productRepository.existsBySkuCodeIgnoreCase(productReqDto.getSkuCode())) {
            throw new DuplicateProductSkuException("Product with SKU '" + productReqDto.getSkuCode() + "' already exists");
        }

        // Validate Category & SubCategory
        Category category = categoryRepository.findById(productReqDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        SubCategory subCategory = subCategoryRepository.findById(productReqDto.getSubCategoryId())
                .orElseThrow(() -> new SubCategoryNotFoundException("SubCategory not found"));

        // Create Product
        Product product = new Product();
        product.setProductName(productReqDto.getProductName());
        product.setSkuCode(productReqDto.getSkuCode());
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setBaseTitle(productReqDto.getBaseTitle());
        product.setProductDescription(productReqDto.getProductDescription());
        product.setIsActive(productReqDto.getIsActive() != null ? productReqDto.getIsActive() : true);
        product.setIsDeleted(false);

        Product savedProduct = productRepository.save(product);

        // Handle Product Specification
        if (productReqDto.getSpecification() != null) {
            ProductSpecificationRequestDto specDto = productReqDto.getSpecification();
            ProductSpecification spec = new ProductSpecification();
            spec.setFabric(specDto.getFabric());
            spec.setFit(specDto.getFit());
            spec.setWaterproofing(specDto.getWaterproofing());
            spec.setHardware(specDto.getHardware());
            spec.setPocketDesign(specDto.getPocketDesign());
            spec.setPattern(specDto.getPattern());
            spec.setNeckCollarType(specDto.getNeckCollarType());
            spec.setSleeveType(specDto.getSleeveType());
            spec.setPockets(specDto.getPockets());
            spec.setWashCare(specDto.getWashCare());
            spec.setCustomSpecs(serializeCustomSpecs(specDto.getCustomSpecs()));
            spec.setProduct(savedProduct);

            productSpecificationRepository.save(spec);
            savedProduct.setProductSpecification(spec);
        }

        // Handle Design Feature Bullets
        if (productReqDto.getFeatures() != null) {
            List<ProductFeature> features = new ArrayList<>();
            for (String featureName : productReqDto.getFeatures()) {
                if (featureName != null && !featureName.trim().isEmpty()) {
                    ProductFeature feature = new ProductFeature();
                    feature.setFeatureName(featureName);
                    feature.setIsActive(true);
                    feature.setProduct(savedProduct);
                    productFeatureRepository.save(feature);
                    features.add(feature);
                }
            }
            savedProduct.setProductFeatures(features);
        }

        // Handle Variants
        if (productReqDto.getVariants() != null) {
            List<ProductVariant> variants = new ArrayList<>();
            for (ProductVariantRequestDto variantDto : productReqDto.getVariants()) {
                // Validate Variant SKU
                if (variantDto.getSkuCode() != null && productVariantRepository.existsBySkuCodeIgnoreCase(variantDto.getSkuCode())) {
                    throw new DuplicateProductSkuException("Variant SKU '" + variantDto.getSkuCode() + "' already exists");
                }

                // Validate Variant Images Dimensions
                if (variantDto.getImages() != null) {
                    for (MultipartFile imageFile : variantDto.getImages()) {
                        validateImageDimensions(imageFile);
                    }
                }

                ProductVariant variant = new ProductVariant();
                variant.setVariantName(variantDto.getVariantName());
                variant.setSkuCode(variantDto.getSkuCode());
                variant.setMrp(variantDto.getMrp());
                variant.setDiscountType(variantDto.getDiscountType());
                variant.setDiscountValue(variantDto.getDiscountValue());
                variant.setPrice(calculateFinalPrice(variantDto.getMrp(), variantDto.getDiscountType(), variantDto.getDiscountValue()));
                variant.setIsActive(variantDto.getIsActive() != null ? variantDto.getIsActive() : true);
                variant.setProduct(savedProduct);

                ProductVariant savedVariant = productVariantRepository.save(variant);

                // Save Variant Images to S3
                List<Image> images = new ArrayList<>();
                String primaryImgUrl = variantDto.getPrimaryImageUrl();
                String resolvedPrimaryUrl = null;

                if (variantDto.getImages() != null) {
                    for (MultipartFile imageFile : variantDto.getImages()) {
                        if (!imageFile.isEmpty()) {
                            try {
                                String imageUrl = s3Service.uploadFile(imageFile);
                                Image image = new Image();
                                image.setImageUrl(imageUrl);
                                image.setIsActive(true);
                                image.setProductVariant(savedVariant);
                                image.setProduct(savedProduct);
                                imageRepository.save(image);
                                images.add(image);

                                if (primaryImgUrl != null && imageFile.getOriginalFilename() != null 
                                        && imageFile.getOriginalFilename().equalsIgnoreCase(primaryImgUrl.trim())) {
                                    resolvedPrimaryUrl = imageUrl;
                                }
                            } catch (Exception e) {
                                throw new FailedToUploadImageException("Failed to upload variant image to S3: " + e.getMessage());
                            }
                        }
                    }
                }
                savedVariant.setImages(images);

                // Set Primary Image URL
                if (resolvedPrimaryUrl != null) {
                    savedVariant.setPrimaryImageUrl(resolvedPrimaryUrl);
                } else if (primaryImgUrl != null && !primaryImgUrl.trim().isEmpty()) {
                    boolean found = false;
                    for (Image img : images) {
                        if (img.getImageUrl().equals(primaryImgUrl.trim())) {
                            savedVariant.setPrimaryImageUrl(img.getImageUrl());
                            found = true;
                            break;
                        }
                    }
                    if (!found && !images.isEmpty()) {
                        savedVariant.setPrimaryImageUrl(images.get(0).getImageUrl());
                    }
                } else if (!images.isEmpty()) {
                    savedVariant.setPrimaryImageUrl(images.get(0).getImageUrl());
                }

                // Save Variant Sizes and Stock Quantities
                List<ProductVariantSize> sizes = new ArrayList<>();
                if (variantDto.getSizes() != null) {
                    for (ProductVariantSizeRequestDto sizeDto : variantDto.getSizes()) {
                        ProductVariantSize size = new ProductVariantSize();
                        size.setSizeName(sizeDto.getSizeName());
                        size.setStockQuantity(sizeDto.getStockQuantity() != null ? sizeDto.getStockQuantity() : 0);
                        size.setIsActive(sizeDto.getIsActive() != null ? sizeDto.getIsActive() : true);
                        size.setProductVariant(savedVariant);
                        productVariantSizeRepository.save(size);
                        sizes.add(size);
                    }
                }
                savedVariant.setProductVariantSizes(sizes);

                variants.add(savedVariant);
            }
            savedProduct.setProductVariants(variants);
        }

        productRepository.save(savedProduct);

        return new ResponseMsgDto(201, savedProduct.getProductName() + " Product created successfully");
    }

    @Override
    public ProductListResponseDto fetchAllActiveProducts() {
        List<Product> products = productRepository.findAllActiveProducts();
        boolean isAdmin = isCurrentUserAdmin();
        List<ProductResponseDto> responseDtos = products.stream()
                .filter(p -> isAdmin || (p.getIsActive() != null && p.getIsActive()))
                .filter(p -> {
                    if (isAdmin) return true;
                    Category cat = p.getCategory();
                    if (cat != null && (cat.getIsActive() == null || !cat.getIsActive() || Boolean.TRUE.equals(cat.getIsDeleted()))) {
                        return false;
                    }
                    SubCategory sub = p.getSubCategory();
                    if (sub != null && (sub.getIsActive() == null || !sub.getIsActive() || Boolean.TRUE.equals(sub.getIsDeleted()))) {
                        return false;
                    }
                    return true;
                })
                .map(this::mapToProductResponseDto)
                .collect(Collectors.toList());

        return new ProductListResponseDto(200, "Products fetched successfully", responseDtos);
    }

    @Override
    public ProductListResponseDto fetchProductsFiltered(Long categoryId, Long subCategoryId) {
        List<Product> products = productRepository.findProductsByFilters(categoryId, subCategoryId);
        boolean isAdmin = isCurrentUserAdmin();
        List<ProductResponseDto> responseDtos = products.stream()
                .filter(p -> isAdmin || (p.getIsActive() != null && p.getIsActive()))
                .filter(p -> {
                    if (isAdmin) return true;
                    Category cat = p.getCategory();
                    if (cat != null && (cat.getIsActive() == null || !cat.getIsActive() || Boolean.TRUE.equals(cat.getIsDeleted()))) {
                        return false;
                    }
                    SubCategory sub = p.getSubCategory();
                    if (sub != null && (sub.getIsActive() == null || !sub.getIsActive() || Boolean.TRUE.equals(sub.getIsDeleted()))) {
                        return false;
                    }
                    return true;
                })
                .map(this::mapToProductResponseDto)
                .collect(Collectors.toList());

        return new ProductListResponseDto(200, "Products fetched successfully", responseDtos);
    }

    @Override
    public ProductDetailsResponseDto fetchProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (Boolean.TRUE.equals(product.getIsDeleted())) {
            throw new ProductNotFoundException("Product not found");
        }

        if (!isCurrentUserAdmin()) {
            if (product.getIsActive() == null || !product.getIsActive()) {
                throw new ProductNotFoundException("Product not found");
            }
            Category cat = product.getCategory();
            if (cat != null && (cat.getIsActive() == null || !cat.getIsActive() || Boolean.TRUE.equals(cat.getIsDeleted()))) {
                throw new ProductNotFoundException("Product not found");
            }
            SubCategory sub = product.getSubCategory();
            if (sub != null && (sub.getIsActive() == null || !sub.getIsActive() || Boolean.TRUE.equals(sub.getIsDeleted()))) {
                throw new ProductNotFoundException("Product not found");
            }
        }

        return new ProductDetailsResponseDto(200, "Product fetched successfully", mapToProductResponseDto(product));
    }

    @Override
    public ResponseMsgDto updateProduct(Long id, ProductRequestDto productReqDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (Boolean.TRUE.equals(product.getIsDeleted())) {
            throw new ProductNotFoundException("Product not found");
        }

        // Validate Product SKU uniqueness (except current product)
        if (productReqDto.getSkuCode() != null && productRepository.existsBySkuCodeIgnoreCaseAndIdNot(productReqDto.getSkuCode(), id)) {
            throw new DuplicateProductSkuException("Product SKU '" + productReqDto.getSkuCode() + "' already exists");
        }

        // Validate Category & SubCategory
        Category category = categoryRepository.findById(productReqDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        SubCategory subCategory = subCategoryRepository.findById(productReqDto.getSubCategoryId())
                .orElseThrow(() -> new SubCategoryNotFoundException("SubCategory not found"));

        // Update basic attributes
        product.setProductName(productReqDto.getProductName());
        product.setSkuCode(productReqDto.getSkuCode());
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setBaseTitle(productReqDto.getBaseTitle());
        product.setProductDescription(productReqDto.getProductDescription());
        if (productReqDto.getIsActive() != null) {
            product.setIsActive(productReqDto.getIsActive());
        }

        // Update Product Specification
        if (productReqDto.getSpecification() != null) {
            ProductSpecificationRequestDto specDto = productReqDto.getSpecification();
            ProductSpecification spec = product.getProductSpecification();
            if (spec == null) {
                spec = new ProductSpecification();
                spec.setProduct(product);
            }
            spec.setFabric(specDto.getFabric());
            spec.setFit(specDto.getFit());
            spec.setWaterproofing(specDto.getWaterproofing());
            spec.setHardware(specDto.getHardware());
            spec.setPocketDesign(specDto.getPocketDesign());
            spec.setPattern(specDto.getPattern());
            spec.setNeckCollarType(specDto.getNeckCollarType());
            spec.setSleeveType(specDto.getSleeveType());
            spec.setPockets(specDto.getPockets());
            spec.setWashCare(specDto.getWashCare());
            spec.setCustomSpecs(serializeCustomSpecs(specDto.getCustomSpecs()));

            productSpecificationRepository.save(spec);
            product.setProductSpecification(spec);
        }

        // Update Design Feature Bullets (delete old, save new)
        if (product.getProductFeatures() != null) {
            productFeatureRepository.deleteAll(product.getProductFeatures());
            product.getProductFeatures().clear();
        } else {
            product.setProductFeatures(new ArrayList<>());
        }
        if (productReqDto.getFeatures() != null) {
            List<ProductFeature> features = new ArrayList<>();
            for (String featureName : productReqDto.getFeatures()) {
                if (featureName != null && !featureName.trim().isEmpty()) {
                    ProductFeature feature = new ProductFeature();
                    feature.setFeatureName(featureName);
                    feature.setIsActive(true);
                    feature.setProduct(product);
                    productFeatureRepository.save(feature);
                    features.add(feature);
                }
            }
            product.getProductFeatures().addAll(features);
        }

        // Update Variants and Sizes (merge strategy to prevent breaking cart/order_items references)
        if (productReqDto.getVariants() != null) {
            Map<String, ProductVariant> existingVariantMap = new HashMap<>();
            if (product.getProductVariants() != null) {
                for (ProductVariant exVar : product.getProductVariants()) {
                    if (exVar.getSkuCode() != null) {
                        existingVariantMap.put(exVar.getSkuCode().toLowerCase(), exVar);
                    }
                }
            }

            List<ProductVariant> updatedVariants = new ArrayList<>();
            Set<String> processedSkus = new HashSet<>();

            for (ProductVariantRequestDto varDto : productReqDto.getVariants()) {
                String lowerSku = varDto.getSkuCode().toLowerCase();
                processedSkus.add(lowerSku);

                ProductVariant variant = existingVariantMap.get(lowerSku);
                boolean isNew = false;

                if (variant == null) {
                    // Check if SKU is used by another product variant
                    if (productVariantRepository.existsBySkuCodeIgnoreCase(varDto.getSkuCode())) {
                        throw new DuplicateProductSkuException("Variant SKU '" + varDto.getSkuCode() + "' already exists");
                    }
                    variant = new ProductVariant();
                    variant.setSkuCode(varDto.getSkuCode());
                    variant.setProduct(product);
                    isNew = true;
                }

                variant.setVariantName(varDto.getVariantName());
                variant.setMrp(varDto.getMrp());
                variant.setDiscountType(varDto.getDiscountType());
                variant.setDiscountValue(varDto.getDiscountValue());
                variant.setPrice(calculateFinalPrice(varDto.getMrp(), varDto.getDiscountType(), varDto.getDiscountValue()));
                if (varDto.getIsActive() != null) {
                    variant.setIsActive(varDto.getIsActive());
                }

                ProductVariant savedVariant = productVariantRepository.save(variant);

                // Validate Variant Images
                if (varDto.getImages() != null) {
                    for (MultipartFile imgFile : varDto.getImages()) {
                        validateImageDimensions(imgFile);
                    }
                }

                // Handle Variant Images: Keep existing ones, update in-place for new uploads, delete unkept ones
                List<Image> variantImages = new ArrayList<>();
                List<Image> existingUnusedImages = new ArrayList<>();

                if (!isNew && savedVariant.getImages() != null) {
                    List<String> keepUrls = (varDto.getExistingImageUrls() != null) 
                            ? varDto.getExistingImageUrls() 
                            : new ArrayList<>();

                    for (Image existingImg : savedVariant.getImages()) {
                        if (keepUrls.contains(existingImg.getImageUrl())) {
                            variantImages.add(existingImg);
                        } else {
                            existingUnusedImages.add(existingImg);
                        }
                    }
                }

                // Upload new variant images to S3 & reuse/update existing rows or create new ones
                String primaryImgUrl = varDto.getPrimaryImageUrl();
                String resolvedPrimaryUrl = null;

                if (varDto.getImages() != null) {
                    for (MultipartFile imageFile : varDto.getImages()) {
                        if (!imageFile.isEmpty()) {
                            try {
                                String imageUrl = s3Service.uploadFile(imageFile);
                                Image imageToSave;
                                if (!existingUnusedImages.isEmpty()) {
                                    // Reuse and update the existing DB row in place!
                                    imageToSave = existingUnusedImages.remove(0);
                                    imageToSave.setImageUrl(imageUrl);
                                    imageToSave.setIsActive(true);
                                    imageToSave.setProductVariant(savedVariant);
                                    imageToSave.setProduct(product);
                                } else {
                                    // Create a new DB row if no existing unused image row is available
                                    imageToSave = new Image();
                                    imageToSave.setImageUrl(imageUrl);
                                    imageToSave.setIsActive(true);
                                    imageToSave.setProductVariant(savedVariant);
                                    imageToSave.setProduct(product);
                                }
                                imageRepository.save(imageToSave);
                                variantImages.add(imageToSave);

                                if (primaryImgUrl != null && imageFile.getOriginalFilename() != null 
                                        && imageFile.getOriginalFilename().equalsIgnoreCase(primaryImgUrl.trim())) {
                                    resolvedPrimaryUrl = imageUrl;
                                }
                            } catch (Exception e) {
                                throw new FailedToUploadImageException("Failed to upload variant image to S3: " + e.getMessage());
                            }
                        }
                    }
                }

                // Hard delete any remaining unused image rows from the database table to prevent orphans!
                if (!existingUnusedImages.isEmpty()) {
                    for (Image unusedImg : existingUnusedImages) {
                        imageRepository.delete(unusedImg);
                    }
                }

                savedVariant.setImages(variantImages);


                // Set/Update Primary Image Url
                if (resolvedPrimaryUrl != null) {
                    savedVariant.setPrimaryImageUrl(resolvedPrimaryUrl);
                } else if (primaryImgUrl != null && !primaryImgUrl.trim().isEmpty()) {
                    boolean found = false;
                    for (Image img : variantImages) {
                        if (img.getImageUrl().equals(primaryImgUrl.trim())) {
                            savedVariant.setPrimaryImageUrl(img.getImageUrl());
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        boolean currentPrimaryStillValid = false;
                        if (savedVariant.getPrimaryImageUrl() != null) {
                            for (Image img : variantImages) {
                                if (img.getImageUrl().equals(savedVariant.getPrimaryImageUrl())) {
                                    currentPrimaryStillValid = true;
                                    break;
                                }
                            }
                        }
                        if (!currentPrimaryStillValid) {
                            savedVariant.setPrimaryImageUrl(!variantImages.isEmpty() ? variantImages.get(0).getImageUrl() : null);
                        }
                    }
                } else {
                    // Check if current primaryImageUrl is still valid (in variantImages list)
                    boolean currentPrimaryStillValid = false;
                    if (savedVariant.getPrimaryImageUrl() != null) {
                        for (Image img : variantImages) {
                            if (img.getImageUrl().equals(savedVariant.getPrimaryImageUrl())) {
                                currentPrimaryStillValid = true;
                                break;
                            }
                        }
                    }
                    if (!currentPrimaryStillValid) {
                        if (!variantImages.isEmpty()) {
                            savedVariant.setPrimaryImageUrl(variantImages.get(0).getImageUrl());
                        } else {
                            savedVariant.setPrimaryImageUrl(null);
                        }
                    }
                }

                // Handle Variant Sizes
                Map<String, ProductVariantSize> existingSizeMap = new HashMap<>();
                if (!isNew && savedVariant.getProductVariantSizes() != null) {
                    for (ProductVariantSize size : savedVariant.getProductVariantSizes()) {
                        existingSizeMap.put(size.getSizeName().toLowerCase(), size);
                    }
                }

                List<ProductVariantSize> updatedSizes = new ArrayList<>();
                if (varDto.getSizes() != null) {
                    for (ProductVariantSizeRequestDto sizeDto : varDto.getSizes()) {
                        String lowerSize = sizeDto.getSizeName().toLowerCase();
                        ProductVariantSize size = existingSizeMap.get(lowerSize);
                        if (size == null) {
                            size = new ProductVariantSize();
                            size.setSizeName(sizeDto.getSizeName());
                            size.setProductVariant(savedVariant);
                        }
                        size.setStockQuantity(sizeDto.getStockQuantity() != null ? sizeDto.getStockQuantity() : 0);
                        if (sizeDto.getIsActive() != null) {
                            size.setIsActive(sizeDto.getIsActive());
                        }
                        productVariantSizeRepository.save(size);
                        updatedSizes.add(size);
                    }
                }
                if (savedVariant.getProductVariantSizes() != null) {
                    savedVariant.getProductVariantSizes().clear();
                    savedVariant.getProductVariantSizes().addAll(updatedSizes);
                } else {
                    savedVariant.setProductVariantSizes(updatedSizes);
                }

                updatedVariants.add(savedVariant);
            }

            // Deactivate variants not present in request to prevent breaking historic order relationships
            if (product.getProductVariants() != null) {
                for (ProductVariant oldVar : product.getProductVariants()) {
                    if (oldVar.getSkuCode() != null && !processedSkus.contains(oldVar.getSkuCode().toLowerCase())) {
                        oldVar.setIsActive(false);
                        productVariantRepository.save(oldVar);
                        updatedVariants.add(oldVar);
                    }
                }
            }

            if (product.getProductVariants() != null) {
                product.getProductVariants().clear();
                product.getProductVariants().addAll(updatedVariants);
            } else {
                product.setProductVariants(updatedVariants);
            }
        }

        productRepository.save(product);

        return new ResponseMsgDto(200, product.getProductName() + " Product updated successfully");
    }

    @Override
    public ResponseMsgDto deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (Boolean.TRUE.equals(product.getIsDeleted())) {
            throw new ProductNotFoundException("Product not found");
        }

        // Soft delete: set isActive to false and isDeleted to true
        product.setIsActive(false);
        product.setIsDeleted(true);
        if (product.getSkuCode() != null && !product.getSkuCode().contains("_DELETED_")) {
            product.setSkuCode(product.getSkuCode() + "_DELETED_" + System.currentTimeMillis());
        }

        // Soft delete and deactivate all variants and their sizes
        if (product.getProductVariants() != null) {
            for (ProductVariant variant : product.getProductVariants()) {
                variant.setIsActive(false);
                variant.setIsDeleted(true);
                if (variant.getSkuCode() != null && !variant.getSkuCode().contains("_DELETED_")) {
                    variant.setSkuCode(variant.getSkuCode() + "_DELETED_" + System.currentTimeMillis());
                }
                if (variant.getProductVariantSizes() != null) {
                    for (ProductVariantSize size : variant.getProductVariantSizes()) {
                        size.setIsActive(false);
                        productVariantSizeRepository.save(size);
                    }
                }
                productVariantRepository.save(variant);
            }
        }

        productRepository.save(product);

        return new ResponseMsgDto(200, product.getProductName() + " Product deleted successfully");
    }

    @Override
    public ResponseMsgDto toggleProductIsActive(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (Boolean.TRUE.equals(product.getIsDeleted())) {
            throw new ProductNotFoundException("Product not found");
        }

        boolean nextActiveState = product.getIsActive() == null || !product.getIsActive();
        product.setIsActive(nextActiveState);

        // Update all variants to match the product's new active state
        if (product.getProductVariants() != null) {
            for (ProductVariant variant : product.getProductVariants()) {
                variant.setIsActive(nextActiveState);
                productVariantRepository.save(variant);
            }
        }

        productRepository.save(product);

        String stateStr = nextActiveState ? "activated" : "deactivated";
        return new ResponseMsgDto(200, product.getProductName() + " Product " + stateStr + " successfully");
    }

    @Override
    public ResponseMsgDto toggleProductVariantIsActive(Long id) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new ProductVariantNotFoundException("Product variant not found"));

        boolean nextActiveState = variant.getIsActive() == null || !variant.getIsActive();
        variant.setIsActive(nextActiveState);

        productVariantRepository.save(variant);

        String stateStr = nextActiveState ? "activated" : "deactivated";
        return new ResponseMsgDto(200, "Product variant '" + variant.getVariantName() + "' " + stateStr + " successfully");
    }

    @Override
    public ResponseMsgDto toggleProductVariantSizeIsActive(Long id) {
        ProductVariantSize variantSize = productVariantSizeRepository.findById(id)
                .orElseThrow(() -> new ProductVariantSizeNotFoundException("Product variant size not found"));

        boolean nextActiveState = variantSize.getIsActive() == null || !variantSize.getIsActive();
        variantSize.setIsActive(nextActiveState);

        productVariantSizeRepository.save(variantSize);

        String variantName = (variantSize.getProductVariant() != null) ? variantSize.getProductVariant().getVariantName() : "Unknown";
        String stateStr = nextActiveState ? "activated" : "deactivated";
        return new ResponseMsgDto(200, "Product variant size '" + variantSize.getSizeName() + "' of variant '" + variantName + "' " + stateStr + " successfully");
    }

    @Override
    public ResponseMsgDto deleteProductVariant(Long id) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new ProductVariantNotFoundException("Product variant not found"));

        if (Boolean.TRUE.equals(variant.getIsDeleted())) {
            throw new ProductVariantNotFoundException("Product variant not found");
        }

        // Soft delete: set isActive to false and isDeleted to true
        variant.setIsActive(false);
        variant.setIsDeleted(true);
        if (variant.getSkuCode() != null && !variant.getSkuCode().contains("_DELETED_")) {
            variant.setSkuCode(variant.getSkuCode() + "_DELETED_" + System.currentTimeMillis());
        }

        if (variant.getProductVariantSizes() != null) {
            for (ProductVariantSize size : variant.getProductVariantSizes()) {
                size.setIsActive(false);
                productVariantSizeRepository.save(size);
            }
        }

        productVariantRepository.save(variant);

        return new ResponseMsgDto(200, "Product variant '" + variant.getVariantName() + "' deleted successfully");
    }

    private ProductResponseDto mapToProductResponseDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setSkuCode(product.getSkuCode());
        dto.setBaseTitle(product.getBaseTitle());
        dto.setProductDescription(product.getProductDescription());
        dto.setIsActive(product.getIsActive());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getCategoryName());
        }

        if (product.getSubCategory() != null) {
            dto.setSubCategoryId(product.getSubCategory().getId());
            dto.setSubcategoryName(product.getSubCategory().getSubcategoryName());
        }

        // Map Specifications
        if (product.getProductSpecification() != null) {
            ProductSpecification spec = product.getProductSpecification();
            ProductSpecificationResponseDto specDto = new ProductSpecificationResponseDto();
            specDto.setId(spec.getId());
            specDto.setFabric(spec.getFabric());
            specDto.setFit(spec.getFit());
            specDto.setWaterproofing(spec.getWaterproofing());
            specDto.setHardware(spec.getHardware());
            specDto.setPocketDesign(spec.getPocketDesign());
            specDto.setPattern(spec.getPattern());
            specDto.setNeckCollarType(spec.getNeckCollarType());
            specDto.setSleeveType(spec.getSleeveType());
            specDto.setPockets(spec.getPockets());
            specDto.setWashCare(spec.getWashCare());
            specDto.setCustomSpecs(deserializeCustomSpecs(spec.getCustomSpecs()));

            dto.setSpecification(specDto);
        }

        // Map Features
        if (product.getProductFeatures() != null) {
            List<ProductFeatureResponseDto> featureDtos = product.getProductFeatures().stream()
                    .map(f -> new ProductFeatureResponseDto(f.getId(), f.getFeatureName(), f.getIsActive()))
                    .collect(Collectors.toList());
            dto.setFeatures(featureDtos);
        }

        // Map Variants
        if (product.getProductVariants() != null) {
            boolean isAdmin = isCurrentUserAdmin();
            List<ProductVariantResponseDto> variantDtos = product.getProductVariants().stream()
                    .filter(v -> v.getIsDeleted() == null || !v.getIsDeleted())
                    .filter(v -> isAdmin || (v.getIsActive() != null && v.getIsActive()))
                    .map(v -> {
                        ProductVariantResponseDto vDto = new ProductVariantResponseDto();
                        vDto.setId(v.getId());
                        vDto.setVariantName(v.getVariantName());
                        vDto.setSkuCode(v.getSkuCode());
                        vDto.setMrp(v.getMrp());
                        vDto.setPrice(v.getPrice());
                        vDto.setDiscountType(v.getDiscountType());
                        vDto.setDiscountValue(v.getDiscountValue());
                        vDto.setIsActive(v.getIsActive());

                        // Map Variant Images URLs
                        if (v.getImages() != null) {
                            List<String> imageUrls = v.getImages().stream()
                                    .map(Image::getImageUrl)
                                    .collect(Collectors.toList());
                            vDto.setImageUrls(imageUrls);
                        }
                        vDto.setPrimaryImageUrl(v.getPrimaryImageUrl());

                        // Map Variant Sizes
                        if (v.getProductVariantSizes() != null) {
                            List<ProductVariantSizeResponseDto> sizeDtos = v.getProductVariantSizes().stream()
                                    .filter(sz -> sz.getIsActive() != null && sz.getIsActive())
                                    .map(sz -> new ProductVariantSizeResponseDto(sz.getId(), sz.getSizeName(), sz.getStockQuantity(), sz.getIsActive()))
                                    .collect(Collectors.toList());
                            vDto.setSizes(sizeDtos);
                        }

                        return vDto;
                    })
                    .collect(Collectors.toList());
            dto.setVariants(variantDtos);
        }

        return dto;
    }

    @Override
    public ProductResponseDto mapProductToDto(Product product) {
        return mapToProductResponseDto(product);
    }

    @Override
    public com.dripdoggy.backend.ResponseDto.ProductVariantDetailsResponseDto fetchVariantDetailsById(Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new com.dripdoggy.backend.exception.ResourceNotFoundException("Product variant not found"));

        if (Boolean.TRUE.equals(variant.getIsDeleted())) {
            throw new com.dripdoggy.backend.exception.ResourceNotFoundException("Product variant not found");
        }

        Product product = variant.getProduct();
        if (product == null || Boolean.TRUE.equals(product.getIsDeleted())) {
            throw new com.dripdoggy.backend.exception.ResourceNotFoundException("Product not found");
        }

        List<String> imageUrls = new ArrayList<>();
        if (variant.getImages() != null) {
            imageUrls = variant.getImages().stream()
                    .map(com.dripdoggy.backend.entity.Image::getImageUrl)
                    .collect(Collectors.toList());
        }

        List<ProductVariantSizeResponseDto> sizeDtos = new ArrayList<>();
        if (variant.getProductVariantSizes() != null) {
            sizeDtos = variant.getProductVariantSizes().stream()
                    .filter(sz -> sz.getIsActive() != null && sz.getIsActive())
                    .map(sz -> new ProductVariantSizeResponseDto(sz.getId(), sz.getSizeName(), sz.getStockQuantity(), sz.getIsActive()))
                    .collect(Collectors.toList());
        }

        return new com.dripdoggy.backend.ResponseDto.ProductVariantDetailsResponseDto(
                variant.getId(),
                variant.getVariantName(),
                product.getId(),
                product.getProductName(),
                product.getProductDescription(),
                variant.getPrice(),
                variant.getMrp(),
                imageUrls,
                sizeDtos
        );
    }

    private boolean isCurrentUserAdmin() {
        org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    }
}
