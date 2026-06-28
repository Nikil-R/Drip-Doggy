package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Configuration.S3Service;
import com.dripdoggy.backend.Iservice.ICategoryService;
import com.dripdoggy.backend.RequestDto.CategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.CategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.CategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDeleteResponseDto;
import com.dripdoggy.backend.entity.Category;
import com.dripdoggy.backend.entity.SubCategory;
import com.dripdoggy.backend.exception.DuplicateCategoryFoundException;
import com.dripdoggy.backend.exception.CategoryNotFoundException;
import com.dripdoggy.backend.exception.FailedToUploadImageException;
import com.dripdoggy.backend.exception.SubCategoryNotFoundException;
import com.dripdoggy.backend.repository.CategoryRepository;
import com.dripdoggy.backend.repository.SubCategoryRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryrepo;
    private final SubCategoryRepository subCategoryRepository;
    private final S3Service s3service;
    private final ModelMapper modelMapper;

    @Autowired
    public CategoryService(CategoryRepository categoryrepo,
                           SubCategoryRepository subCategoryRepository,
                           S3Service s3service,
                           ModelMapper modelMapper) {
        this.categoryrepo = categoryrepo;
        this.subCategoryRepository = subCategoryRepository;
        this.s3service = s3service;
        this.modelMapper = modelMapper;
    }

    @Override
    public ResponseMsgDto createCategory(CategoryRequestDto categoryReqDto) {
        if (categoryrepo.existsByCategoryNameIgnoreCase(categoryReqDto.getCategoryName())) {
            throw new DuplicateCategoryFoundException("Category with name '" + categoryReqDto.getCategoryName() + "' already exists");
        }
        Category category = modelMapper.map(categoryReqDto, Category.class);
        category.setIsActive(categoryReqDto.getIsActive() != null ? categoryReqDto.getIsActive() : true);
        category.setIsDeleted(false);

        if (categoryReqDto.getImage() != null && !categoryReqDto.getImage().isEmpty()) {
            try {
                String imageUrl = s3service.uploadFile(categoryReqDto.getImage());
                category.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new FailedToUploadImageException("Failed to upload image to S3: " + e.getMessage());
            }
        }

        categoryrepo.save(category);

        if (categoryReqDto.getSubCategoryIds() != null && !categoryReqDto.getSubCategoryIds().isEmpty()) {
            saveOrUpdateSubCategories(category, categoryReqDto.getSubCategoryIds());
        }

        Category savedCategory = categoryrepo.save(category);
        return new ResponseMsgDto(201, savedCategory.getCategoryName() + " Category created successfully");
    }

    @Override
    public CategoryListResponseDto fetchAllCategory() {
        List<Category> categories = categoryrepo.findAllActiveCategories();
        List<CategoryResponseDto> responseDtos = categories.stream()
                .map(this::mapToCategoryResponseDto)
                .collect(Collectors.toList());

        return new CategoryListResponseDto(200, "Categories fetched successfully", responseDtos);
    }

    @Override
    public CategoryDetailsResponseDto fetchCategoryById(Long id) {
        Category category = categoryrepo.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + id));
        if (Boolean.TRUE.equals(category.getIsDeleted())) {
            throw new CategoryNotFoundException("Category not found with ID: " + id);
        }
        CategoryResponseDto responseDto = mapToCategoryResponseDto(category);

        return new CategoryDetailsResponseDto(200, category.getCategoryName() + " Category fetched successfully", responseDto);
    }

    @Override
    public ResponseMsgDto updateCategory(Long id, CategoryRequestDto categoryDto) {
        Category category = categoryrepo.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + id));
        if (Boolean.TRUE.equals(category.getIsDeleted())) {
            throw new CategoryNotFoundException("Category not found with ID: " + id);
        }

        if (categoryrepo.existsByCategoryNameIgnoreCaseAndIdNot(categoryDto.getCategoryName(), id)) {
            throw new DuplicateCategoryFoundException("Category with name '" + categoryDto.getCategoryName() + "' already exists");
        }

        if (categoryDto.getImage() != null && !categoryDto.getImage().isEmpty()) {
            try {
                String imageUrl = s3service.uploadFile(categoryDto.getImage());
                category.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new FailedToUploadImageException("Failed to upload image to S3: ");
            }
        }

        // Update fields
        category.setCategoryName(categoryDto.getCategoryName());
        category.setDescription(categoryDto.getDescription());

        Boolean newActive = categoryDto.getIsActive();
        if (newActive == null) {
            newActive = true;
        }
        category.setIsActive(newActive);

        // Update associations
        if (categoryDto.getSubCategoryIds() != null) {
            saveOrUpdateSubCategories(category, categoryDto.getSubCategoryIds());
        }

        Category updatedCategory = categoryrepo.save(category);

        // Propagate active status change to all currently associated subcategories
        if (updatedCategory.getSubCategories() != null) {
            for (SubCategory sub : updatedCategory.getSubCategories()) {
                sub.setIsActive(newActive);
                subCategoryRepository.save(sub);
            }
        }

        return new ResponseMsgDto(200, updatedCategory.getCategoryName() + " Category updated successfully");
    }

    @Override
    public ResponseMsgDto deleteCategory(Long id) {
        Category category = categoryrepo.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        if (Boolean.TRUE.equals(category.getIsDeleted())) {
            throw new CategoryNotFoundException(category.getCategoryName()+" "+"Category not found");
        }

        String originalName = category.getCategoryName();
        if (originalName.contains("_deleted_")) {
            originalName = originalName.substring(0, originalName.indexOf("_deleted_"));
        }
        
        boolean hasSubCategories = false;

        // Soft delete all associated subcategories in the database
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            hasSubCategories = true;
            for (SubCategory sub : category.getSubCategories()) {
                sub.setIsActive(false);
                sub.setIsDeleted(true);
                subCategoryRepository.save(sub);
            }
        }

        category.setIsActive(false);
        category.setIsDeleted(true);
        category.setCategoryName(originalName + "_deleted_" + System.currentTimeMillis());
        categoryrepo.save(category);

        String message;
        if (!hasSubCategories) {
            message = originalName + " Category deleted successfully.";
        } else {
            message = originalName + " Category and all its associated subcategories have been deleted successfully.";
        }

        return new ResponseMsgDto(200, message);
    }

    @Override
    public ResponseMsgDto updateCategoryIsActiveById(Long categoryId) {
        Category category = categoryrepo.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));
        if (Boolean.TRUE.equals(category.getIsDeleted())) {
            throw new CategoryNotFoundException("Category not found with ID: " + categoryId);
        }

        boolean newActiveStatus = category.getIsActive() == null || !category.getIsActive();
        category.setIsActive(newActiveStatus);

        if (category.getSubCategories() != null) {
            for (SubCategory sub : category.getSubCategories()) {
                sub.setIsActive(newActiveStatus);
                subCategoryRepository.save(sub);
            }
        }

        Category saved = categoryrepo.save(category);
        String message = saved.getIsActive() ?
                saved.getCategoryName() + " Category activated successfully" :
                saved.getCategoryName() + " Category deactivated successfully";
        return new ResponseMsgDto(200, message);
    }

    private void saveOrUpdateSubCategories(Category category, String subIdsStr) {
        if (subIdsStr == null || subIdsStr.isEmpty()) {
            if (category.getSubCategories() != null) {
                for (SubCategory oldSub : category.getSubCategories()) {
                    oldSub.setCategory(null);
                    subCategoryRepository.save(oldSub);
                }
            }
            category.setSubCategories(Collections.emptyList());
            return;
        }

        if (subIdsStr.startsWith("[")) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                List<Map<String, Object>> parsedSubCategories = mapper.readValue(subIdsStr, new TypeReference<List<Map<String, Object>>>() {});
                List<SubCategory> newSubCategories = new ArrayList<>();
                List<Long> keepSubCategoryIds = new ArrayList<>();

                for (Map<String, Object> subMap : parsedSubCategories) {
                    String subIdStr = String.valueOf(subMap.get("id"));
                    String name = (String) subMap.get("name");
                    String description = (String) subMap.get("description");
                    String imageUrl = (String) subMap.get("imageUrl");
                    Boolean isActive = (Boolean) subMap.get("isActive");
                    if (isActive == null) isActive = true;

                    SubCategory subCategory = null;
                    if (subIdStr != null && subIdStr.matches("\\d+")) {
                        Long subId = Long.parseLong(subIdStr);
                        subCategory = subCategoryRepository.findById(subId).orElse(null);
                    }

                    if (subCategory == null) {
                        subCategory = new SubCategory();
                    }

                    subCategory.setSubcategoryName(name);
                    subCategory.setDescription(description != null ? description : "");
                    subCategory.setImageUrl(imageUrl != null ? imageUrl : "");
                    subCategory.setIsActive(isActive);
                    subCategory.setCategory(category);

                    subCategory = subCategoryRepository.save(subCategory);
                    newSubCategories.add(subCategory);
                    keepSubCategoryIds.add(subCategory.getId());
                }

                // Dissociate removed subcategories
                if (category.getSubCategories() != null) {
                    for (SubCategory oldSub : category.getSubCategories()) {
                        if (!keepSubCategoryIds.contains(oldSub.getId())) {
                            oldSub.setCategory(null);
                            subCategoryRepository.save(oldSub);
                        }
                    }
                }
                category.setSubCategories(newSubCategories);

            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            List<Long> ids = Arrays.stream(subIdsStr.split(","))
                    .map(String::trim)
                    .filter(s -> s.matches("\\d+"))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());

            if (category.getSubCategories() != null) {
                for (SubCategory oldSub : category.getSubCategories()) {
                    oldSub.setCategory(null);
                    subCategoryRepository.save(oldSub);
                }
            }

            if (!ids.isEmpty()) {
                List<SubCategory> newSubCategories = subCategoryRepository.findAllById(ids);
                if (newSubCategories.size() != ids.size()) {
                    throw new SubCategoryNotFoundException("One or more SubCategories not found");
                }
                for (SubCategory subCategory : newSubCategories) {
                    subCategory.setCategory(category);
                    subCategoryRepository.save(subCategory);
                }
                category.setSubCategories(newSubCategories);
            } else {
                category.setSubCategories(Collections.emptyList());
            }
        }
    }

    private String serializeSubCategories(List<SubCategory> subCategories) {
        if (subCategories == null || subCategories.isEmpty()) {
            return "[]";
        }
        ObjectMapper mapper = new ObjectMapper();
        List<Map<String, Object>> list = new ArrayList<>();
        for (SubCategory sub : subCategories) {
            if (Boolean.TRUE.equals(sub.getIsDeleted())) {
                continue;
            }
            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(sub.getId()));
            map.put("name", sub.getSubcategoryName());
            map.put("description", sub.getDescription() != null ? sub.getDescription() : "");
            map.put("imageUrl", sub.getImageUrl() != null ? sub.getImageUrl() : "");
            map.put("isActive", sub.getIsActive() != null ? sub.getIsActive() : true);
            map.put("categoryId", sub.getCategory() != null ? String.valueOf(sub.getCategory().getId()) : "");
            list.add(map);
        }
        try {
            return mapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    private CategoryResponseDto mapToCategoryResponseDto(Category category) {
        CategoryResponseDto dto = modelMapper.map(category, CategoryResponseDto.class);

        List<SubCategoryResponseDto> subCategoryResponseDtos = category.getSubCategories() != null ?
                category.getSubCategories().stream()
                        .filter(sub -> !Boolean.TRUE.equals(sub.getIsDeleted()))
                        .map(this::mapToSubCategoryResponseDto)
                        .collect(Collectors.toList()) : Collections.emptyList();

        dto.setSubCategories(subCategoryResponseDtos);

        // Populate custom frontend-expected fields
        dto.setCategoryId(category.getId());
        dto.setImagePath(category.getImageUrl());
        dto.setIsDeleted(category.getIsDeleted() != null ? category.getIsDeleted() : false);
        dto.setSubCategoryIds(serializeSubCategories(category.getSubCategories()));

        return dto;
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
}
