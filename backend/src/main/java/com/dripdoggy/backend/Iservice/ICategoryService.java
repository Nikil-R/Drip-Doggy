package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.CategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.CategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDeleteResponseDto;

public interface ICategoryService {
    CategoryResponseDto createCategory(CategoryRequestDto categoryDto);
    CategoryListResponseDto fetchAllCategory();
    CategoryDetailsResponseDto fetchCategoryById(Long id);
    CategoryResponseDto updateCategory(Long id, CategoryRequestDto categoryDto);
    CategoryResponseDto updateCategoryIsActiveById(Long categoryId);
    CategoryDeleteResponseDto deleteCategory(Long id);
}
