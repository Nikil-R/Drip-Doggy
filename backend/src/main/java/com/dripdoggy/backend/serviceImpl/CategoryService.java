package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Configuration.S3Service;

import com.dripdoggy.backend.Iservice.ICategoryService;
import com.dripdoggy.backend.RequestDto.CategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.CategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.CategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDetailsResponseDto;
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

import java.util.Collections;
import java.util.List;
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
        Category category = modelMapper.map(categoryReqDto, Category.class);
        category.setIsActive(categoryReqDto.getIsActive() != null ? categoryReqDto.getIsActive() : true);

        if (categoryReqDto.getImage() != null && !categoryReqDto.getImage().isEmpty()) {
            try {
                String imageUrl = s3service.uploadFile(categoryReqDto.getImage());
                category.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new FailedToUploadImageException("Failed to upload image to S3: " + e.getMessage());
            }
        }

        if (categoryReqDto.getSubCategoryIds() != null && !categoryReqDto.getSubCategoryIds().isEmpty()) {
            List<SubCategory> subCategories = subCategoryRepository.findAllById(categoryReqDto.getSubCategoryIds());
            if (subCategories.size() != categoryReqDto.getSubCategoryIds().size()) {
                throw new SubCategoryNotFoundException("One or more SubCategories not found");
            }
            for (SubCategory subCategory : subCategories) {
                subCategory.setCategory(category);
                subCategory.setIsActive(category.getIsActive());
                subCategoryRepository.save(subCategory);
            }
            category.setSubCategories(subCategories);
        }

        categoryrepo.save(category);

        return new ResponseMsgDto(201, category.getCategoryName()+" "+"Category created successfully");
    }

    @Override
    public CategoryListResponseDto fetchAllCategory() {
        List<Category> categories = categoryrepo.findAll();
        List<CategoryResponseDto> responseDtos = categories.stream()
                .map(this::mapToCategoryResponseDto)
                .collect(Collectors.toList());

        return new CategoryListResponseDto(200, "Categories fetched successfully", responseDtos);
    }

    @Override
    public CategoryDetailsResponseDto fetchCategoryById(Long id) {
        Category category = categoryrepo.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: "));
        CategoryResponseDto responseDto = mapToCategoryResponseDto(category);

        return new CategoryDetailsResponseDto(200, category.getCategoryName()+" "+"Category fetched successfully", responseDto);
    }

    @Override
    public ResponseMsgDto updateCategory(Long id, CategoryRequestDto categoryDto) {
        Category category = categoryrepo.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + id));

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
            if (category.getSubCategories() != null) {
                for (SubCategory oldSub : category.getSubCategories()) {
                    oldSub.setCategory(null);
                    subCategoryRepository.save(oldSub);
                }
            }

            if (!categoryDto.getSubCategoryIds().isEmpty()) {
                List<SubCategory> newSubCategories = subCategoryRepository.findAllById(categoryDto.getSubCategoryIds());
                if (newSubCategories.size() != categoryDto.getSubCategoryIds().size()) {
                    throw new SubCategoryNotFoundException("One or more SubCategories not found");
                }
                for (SubCategory subCategory : newSubCategories) {
                    subCategory.setCategory(category);
                }
                category.setSubCategories(newSubCategories);
            } else {
                category.setSubCategories(Collections.emptyList());
            }
        }

        Category updatedCategory = categoryrepo.save(category);

        // Propagate active status change to all currently associated subcategories
        if (updatedCategory.getSubCategories() != null) {
            for (SubCategory sub : updatedCategory.getSubCategories()) {
                sub.setIsActive(newActive);
                subCategoryRepository.save(sub);
            }
        }

//        CategoryResponseDto responseDto = mapToCategoryResponseDto(updatedCategory);

        return new ResponseMsgDto(200, updatedCategory.getCategoryName()+" "+"Category"+"deleted successfully");
    }

    @Override
    public ResponseMsgDto deleteCategory(Long id) {
        Category category = categoryrepo.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        category.setIsActive(false);
        if (category.getSubCategories() != null) {
            for (SubCategory sub : category.getSubCategories()) {
                sub.setIsActive(false);
                subCategoryRepository.save(sub);
            }
        }

        categoryrepo.save(category);
        return new ResponseMsgDto(200, category.getCategoryName()+" "+"Category"+" "+"deleted successfully");
    }

    @Override
    public ResponseMsgDto updateCategoryIsActiveById(Long categoryId) {
        Category category = categoryrepo.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));

        boolean newActiveStatus = category.getIsActive() == null || !category.getIsActive();
        category.setIsActive(newActiveStatus);

        if (category.getSubCategories() != null) {
            for (SubCategory sub : category.getSubCategories()) {
                sub.setIsActive(newActiveStatus);
                subCategoryRepository.save(sub);
            }
        }

        categoryrepo.save(category);

        String message = newActiveStatus ? 
        		category.getCategoryName()+" "+"Category and its subcategories activated successfully" : 
        		category.getCategoryName()+" "+"Category and its subcategories deactivated successfully";

        return new ResponseMsgDto(200, message);
    }

    private CategoryResponseDto mapToCategoryResponseDto(Category category) {
        CategoryResponseDto dto = modelMapper.map(category, CategoryResponseDto.class);

        List<SubCategoryResponseDto> subCategoryResponseDtos = category.getSubCategories() != null ?
                category.getSubCategories().stream()
                        .map(sub -> modelMapper.map(sub, SubCategoryResponseDto.class))
                        .collect(Collectors.toList()) : Collections.emptyList();

        dto.setSubCategories(subCategoryResponseDtos);
        return dto;
    }

}
