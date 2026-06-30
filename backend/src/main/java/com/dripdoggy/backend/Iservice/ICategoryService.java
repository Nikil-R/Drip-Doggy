package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.CategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.CategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDetailsResponseDto;

import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface ICategoryService {
    ResponseMsgDto createCategory(CategoryRequestDto categoryDto);
    CategoryListResponseDto fetchAllCategory();
    CategoryDetailsResponseDto fetchCategoryById(Long id);
    ResponseMsgDto updateCategory(Long id, CategoryRequestDto categoryDto);
    ResponseMsgDto updateCategoryIsActiveById(Long categoryId);
    ResponseMsgDto deleteCategory(Long id);
}
