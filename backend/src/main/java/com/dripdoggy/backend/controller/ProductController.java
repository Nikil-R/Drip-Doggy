package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IProductService;
import com.dripdoggy.backend.RequestDto.ProductRequestDto;
import com.dripdoggy.backend.RequestDto.ProductVariantRequestDto;
import com.dripdoggy.backend.ResponseDto.ProductDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {

    private final IProductService productService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createProduct(
            @RequestParam(value = "data", required = false) String dataJson,
            @Valid @ModelAttribute ProductRequestDto productDto,
            HttpServletRequest request) {
        ProductRequestDto finalDto = resolveProductDto(dataJson, productDto, request);
        ResponseMsgDto response = productService.createProduct(finalDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ProductListResponseDto> fetchAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subCategoryId) {
        ProductListResponseDto response = productService.fetchProductsFiltered(categoryId, subCategoryId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsResponseDto> fetchProductById(@PathVariable Long id) {
        ProductDetailsResponseDto response = productService.fetchProductById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{id}") // changing from put to post --- 
    public ResponseEntity<ResponseMsgDto> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "data", required = false) String dataJson,
            @Valid @ModelAttribute ProductRequestDto productDto,
            HttpServletRequest request) {
        ProductRequestDto finalDto = resolveProductDto(dataJson, productDto, request);
        ResponseMsgDto response = productService.updateProduct(id, finalDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteProduct(@PathVariable Long id) {
        ResponseMsgDto response = productService.deleteProduct(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> toggleProductIsActive(@PathVariable Long id) {
        ResponseMsgDto response = productService.toggleProductIsActive(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/variants/{id}")
    public ResponseEntity<ResponseMsgDto> toggleProductVariantIsActive(@PathVariable Long id) {
        ResponseMsgDto response = productService.toggleProductVariantIsActive(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/variants/sizes/{id}")
    public ResponseEntity<ResponseMsgDto> toggleProductVariantSizeIsActive(@PathVariable Long id) {
        ResponseMsgDto response = productService.toggleProductVariantSizeIsActive(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/variants/{id}")
    public ResponseEntity<ResponseMsgDto> deleteProductVariant(@PathVariable Long id) {
        ResponseMsgDto response = productService.deleteProductVariant(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private ProductRequestDto resolveProductDto(String dataJson, ProductRequestDto formDto, HttpServletRequest request) {
        ProductRequestDto finalDto = formDto;

        // 1. If 'data' parameter (JSON string) is present, parse it
        if (dataJson != null && !dataJson.trim().isEmpty()) {
            try {
                finalDto = objectMapper.readValue(dataJson.trim(), ProductRequestDto.class);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid JSON string format in 'data' field: " + e.getMessage(), e);
            }
        }

        if (finalDto == null) {
            finalDto = new ProductRequestDto();
        }

        // 2. Extract image files from multipart request
        if (request instanceof MultipartHttpServletRequest) {
            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            List<MultipartFile> topLevelImages = multipartRequest.getFiles("images");

            if (finalDto.getVariants() != null && !finalDto.getVariants().isEmpty()) {
                int numVariants = finalDto.getVariants().size();
                java.util.Set<MultipartFile> assignedFiles = new java.util.HashSet<>();

                // Pass 1: Try matching using imagesMetadata array if present
                for (int i = 0; i < numVariants; i++) {
                    ProductVariantRequestDto variant = finalDto.getVariants().get(i);
                    List<MultipartFile> variantFiles = new java.util.ArrayList<>();

                    if (variant.getImagesMetadata() != null && !variant.getImagesMetadata().isEmpty() && topLevelImages != null) {
                        for (com.dripdoggy.backend.RequestDto.ImageMetadataRequestDto meta : variant.getImagesMetadata()) {
                            if (meta.getFileName() != null && !meta.getFileName().trim().isEmpty()) {
                                String targetName = cleanFileName(meta.getFileName());
                                for (MultipartFile file : topLevelImages) {
                                    String uploadName = cleanFileName(file.getOriginalFilename());
                                    if (!uploadName.isEmpty() && (uploadName.equalsIgnoreCase(targetName) || uploadName.endsWith(targetName) || targetName.endsWith(uploadName))) {
                                        variantFiles.add(file);
                                        assignedFiles.add(file);
                                        if (Boolean.TRUE.equals(meta.getIsPrimary())) {
                                            variant.setPrimaryImageUrl(file.getOriginalFilename());
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (!variantFiles.isEmpty()) {
                        variant.setImages(variantFiles);
                    }
                }

                // Pass 2: Check for variant-specific form keys e.g. "variants[i].images" or "images[i]"
                for (int i = 0; i < numVariants; i++) {
                    ProductVariantRequestDto variant = finalDto.getVariants().get(i);
                    if (variant.getImages() == null || variant.getImages().isEmpty()) {
                        List<MultipartFile> specFiles = multipartRequest.getFiles("variants[" + i + "].images");
                        if (specFiles == null || specFiles.isEmpty()) {
                            specFiles = multipartRequest.getFiles("images[" + i + "]");
                        }
                        if (specFiles != null && !specFiles.isEmpty()) {
                            variant.setImages(specFiles);
                            assignedFiles.addAll(specFiles);
                        }
                    }
                }

                // Pass 3: Smart Variant Keyword Matching & Balanced Fallback Distribution
                if (topLevelImages != null && !topLevelImages.isEmpty()) {
                    List<MultipartFile> unassignedImages = new java.util.ArrayList<>();
                    for (MultipartFile file : topLevelImages) {
                        if (!assignedFiles.contains(file)) {
                            unassignedImages.add(file);
                        }
                    }

                    if (!unassignedImages.isEmpty()) {
                        // 3A: Keyword matching on variant names/colors (e.g. "white", "green", "pink")
                        for (int i = 0; i < numVariants; i++) {
                            ProductVariantRequestDto variant = finalDto.getVariants().get(i);
                            if (variant.getImages() == null || variant.getImages().isEmpty()) {
                                String vName = variant.getVariantName() != null ? variant.getVariantName().toLowerCase() : "";
                                List<MultipartFile> matched = new java.util.ArrayList<>();
                                java.util.Iterator<MultipartFile> it = unassignedImages.iterator();
                                while (it.hasNext()) {
                                    MultipartFile f = it.next();
                                    String fname = cleanFileName(f.getOriginalFilename()).toLowerCase();
                                    String[] words = vName.split("\\s+");
                                    boolean matchesWord = false;
                                    for (String w : words) {
                                        if (w.length() >= 3 && fname.contains(w)) {
                                            matchesWord = true;
                                            break;
                                        }
                                    }
                                    if (matchesWord) {
                                        matched.add(f);
                                        it.remove();
                                    }
                                }
                                if (!matched.isEmpty()) {
                                    variant.setImages(matched);
                                    if (variant.getPrimaryImageUrl() == null) {
                                        variant.setPrimaryImageUrl(matched.get(0).getOriginalFilename());
                                    }
                                }
                            }
                        }

                        // 3B: Balanced Distribution for remaining unassigned images across empty variants
                        if (!unassignedImages.isEmpty()) {
                            List<ProductVariantRequestDto> emptyVariants = new java.util.ArrayList<>();
                            for (ProductVariantRequestDto v : finalDto.getVariants()) {
                                if (v.getImages() == null || v.getImages().isEmpty()) {
                                    emptyVariants.add(v);
                                }
                            }

                            if (!emptyVariants.isEmpty()) {
                                int totalEmpty = emptyVariants.size();
                                int filesPerVariant = Math.max(1, unassignedImages.size() / totalEmpty);
                                int fileIdx = 0;
                                for (int vIdx = 0; vIdx < totalEmpty && fileIdx < unassignedImages.size(); vIdx++) {
                                    ProductVariantRequestDto v = emptyVariants.get(vIdx);
                                    List<MultipartFile> vFiles = new java.util.ArrayList<>();
                                    int count = (vIdx == totalEmpty - 1) ? (unassignedImages.size() - fileIdx) : filesPerVariant;
                                    for (int k = 0; k < count && fileIdx < unassignedImages.size(); k++) {
                                        vFiles.add(unassignedImages.get(fileIdx++));
                                    }
                                    v.setImages(vFiles);
                                    if (v.getPrimaryImageUrl() == null && !vFiles.isEmpty()) {
                                        v.setPrimaryImageUrl(vFiles.get(0).getOriginalFilename());
                                    }
                                }
                            }
                        }
                    }
                }

                // Final check: Ensure every variant with images has a primaryImageUrl set
                for (int i = 0; i < numVariants; i++) {
                    ProductVariantRequestDto v = finalDto.getVariants().get(i);
                    if (v.getPrimaryImageUrl() == null && v.getImages() != null && !v.getImages().isEmpty()) {
                        v.setPrimaryImageUrl(v.getImages().get(0).getOriginalFilename());
                    }
                }
            }
        }

        return finalDto;
    }

    private String cleanFileName(String fn) {
        if (fn == null) return "";
        String cleaned = fn.trim();
        int lastSlash = Math.max(cleaned.lastIndexOf('/'), cleaned.lastIndexOf('\\'));
        if (lastSlash >= 0) {
            cleaned = cleaned.substring(lastSlash + 1);
        }
        return cleaned;
    }
}
