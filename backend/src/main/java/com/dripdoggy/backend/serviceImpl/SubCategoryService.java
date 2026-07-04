package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Configuration.S3Service;
import com.dripdoggy.backend.Iservice.ISubCategoryService;
import com.dripdoggy.backend.RequestDto.SubCategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryDetailsResponseDto;
import com.dripdoggy.backend.entity.Category;
import com.dripdoggy.backend.entity.SubCategory;
import com.dripdoggy.backend.exception.CategoryNotFoundException;
import com.dripdoggy.backend.exception.FailedToUploadImageException;
import com.dripdoggy.backend.exception.SubCategoryNotFoundException;
import com.dripdoggy.backend.repository.CategoryRepository;
import com.dripdoggy.backend.repository.SubCategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubCategoryService implements ISubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryrepo;
    private final S3Service s3service;
    private final ModelMapper modelMapper;

    @Autowired
    public SubCategoryService(SubCategoryRepository subCategoryRepository,
                             CategoryRepository categoryrepo,
                             S3Service s3service,
                             ModelMapper modelMapper) {
        this.subCategoryRepository = subCategoryRepository;
        this.categoryrepo = categoryrepo;
        this.s3service = s3service;
        this.modelMapper = modelMapper;
    }

    @Override
    public ResponseMsgDto createSubCategory(SubCategoryRequestDto subCategoryDto) {
        SubCategory subCategory = new SubCategory();
        subCategory.setSubcategoryName(subCategoryDto.getSubcategoryName());
        subCategory.setDescription(subCategoryDto.getDescription());
        subCategory.setIsActive(subCategoryDto.getIsActive() != null ? subCategoryDto.getIsActive() : true);
        subCategory.setIsDeleted(false);

        if (subCategoryDto.getImage() != null && !subCategoryDto.getImage().isEmpty()) {
            try {
                String imageUrl = s3service.uploadFile(subCategoryDto.getImage());
                subCategory.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new FailedToUploadImageException("Failed to upload image to S3: " + e.getMessage());
            }
        }

        if (subCategoryDto.getCategoryId() != null) {
            Category category = categoryrepo.findById(subCategoryDto.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + subCategoryDto.getCategoryId()));
            subCategory.setCategory(category);
        } else {
            throw new CategoryNotFoundException("Category ID must be provided");
        }

        subCategoryRepository.save(subCategory);
        return new ResponseMsgDto(201, subCategory.getSubcategoryName() + " Subcategory created successfully");
    }

    @Override
    public SubCategoryListResponseDto fetchAllSubCategories() {
        List<SubCategory> subCategories = subCategoryRepository.findAllActiveSubCategories();
        boolean isAdmin = isCurrentUserAdmin();
        List<SubCategoryResponseDto> responseDtos = subCategories.stream()
                .filter(s -> isAdmin || (s.getIsActive() != null && s.getIsActive()))
                .filter(s -> {
                    if (isAdmin) return true;
                    Category cat = s.getCategory();
                    return cat == null || (Boolean.TRUE.equals(cat.getIsActive()) && !Boolean.TRUE.equals(cat.getIsDeleted()));
                })
                .map(this::mapToSubCategoryResponseDto)
                .collect(Collectors.toList());
        return new SubCategoryListResponseDto(200, "Subcategories fetched successfully", responseDtos);
    }

    @Override
    public SubCategoryDetailsResponseDto fetchSubCategoryById(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new SubCategoryNotFoundException("Subcategory not found with ID: " + id));
        if (Boolean.TRUE.equals(subCategory.getIsDeleted())) {
            throw new SubCategoryNotFoundException("Subcategory not found with ID: " + id);
        }
        if (!isCurrentUserAdmin()) {
            if (subCategory.getIsActive() == null || !subCategory.getIsActive()) {
                throw new SubCategoryNotFoundException("Subcategory not found with ID: " + id);
            }
            Category cat = subCategory.getCategory();
            if (cat != null && (cat.getIsActive() == null || !cat.getIsActive() || Boolean.TRUE.equals(cat.getIsDeleted()))) {
                throw new SubCategoryNotFoundException("Subcategory not found with ID: " + id);
            }
        }
        SubCategoryResponseDto responseDto = mapToSubCategoryResponseDto(subCategory);
        return new SubCategoryDetailsResponseDto(200, "Subcategory fetched successfully", responseDto);
    }

    @Override
    public ResponseMsgDto updateSubCategory(Long id, SubCategoryRequestDto subCategoryDto) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new SubCategoryNotFoundException("Subcategory not found with ID: " + id));
        if (Boolean.TRUE.equals(subCategory.getIsDeleted())) {
            throw new SubCategoryNotFoundException("Subcategory not found with ID: " + id);
        }

        if (subCategoryDto.getImage() != null && !subCategoryDto.getImage().isEmpty()) {
            try {
                String imageUrl = s3service.uploadFile(subCategoryDto.getImage());
                subCategory.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new FailedToUploadImageException("Failed to upload image to S3: " + e.getMessage());
            }
        }

        subCategory.setSubcategoryName(subCategoryDto.getSubcategoryName());
        subCategory.setDescription(subCategoryDto.getDescription());

        Boolean newActive = subCategoryDto.getIsActive();
        if (newActive == null) {
            newActive = true;
        }
        subCategory.setIsActive(newActive);

        if (subCategoryDto.getCategoryId() != null) {
            Category category = categoryrepo.findById(subCategoryDto.getCategoryId())
                    .orElseThrow(() -> new SubCategoryNotFoundException("Category not found with ID: " + subCategoryDto.getCategoryId()));
            subCategory.setCategory(category);
        }

        subCategoryRepository.save(subCategory);
        return new ResponseMsgDto(200, subCategory.getSubcategoryName() + " Subcategory updated successfully");
    }

    @Override
    public ResponseMsgDto deleteSubCategory(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new SubCategoryNotFoundException("Subcategory not found"));
        subCategory.setIsDeleted(true);
        subCategory.setIsActive(false);
        subCategoryRepository.save(subCategory);
        return new ResponseMsgDto(200, subCategory.getSubcategoryName() + " Subcategory deleted successfully");
    }

    @Override
    public ResponseMsgDto toggleSubCategoryIsActive(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new SubCategoryNotFoundException("Subcategory not found with ID: " + id));
        if (Boolean.TRUE.equals(subCategory.getIsDeleted())) {
            throw new SubCategoryNotFoundException("Subcategory not found with ID: " + id);
        }

        boolean newActiveStatus = subCategory.getIsActive() == null || !subCategory.getIsActive();
        subCategory.setIsActive(newActiveStatus);
        subCategoryRepository.save(subCategory);

        String message = newActiveStatus ?
                subCategory.getSubcategoryName() + " Subcategory activated successfully" :
                subCategory.getSubcategoryName() + " Subcategory deactivated successfully";

        return new ResponseMsgDto(200, message);
    }

    private SubCategoryResponseDto mapToSubCategoryResponseDto(SubCategory sub) {
        SubCategoryResponseDto dto = new SubCategoryResponseDto();
        dto.setSubCategoryId(sub.getId());
        dto.setSubcategoryName(sub.getSubcategoryName());
        dto.setImageUrl(sub.getImageUrl());
        dto.setDescription(sub.getDescription());
        dto.setIsActive(sub.getIsActive());
        if (sub.getCategory() != null) {
            dto.setCategoryId(sub.getCategory().getId());
        }
        return dto;
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
