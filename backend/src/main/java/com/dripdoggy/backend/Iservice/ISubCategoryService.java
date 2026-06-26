package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.SubCategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryDetailsResponseDto;

public interface ISubCategoryService {
    ResponseMsgDto createSubCategory(SubCategoryRequestDto subCategoryDto);
    SubCategoryListResponseDto fetchAllSubCategories();
    SubCategoryDetailsResponseDto fetchSubCategoryById(Long id);
    ResponseMsgDto updateSubCategory(Long id, SubCategoryRequestDto subCategoryDto);
    ResponseMsgDto deleteSubCategory(Long id);
    ResponseMsgDto toggleSubCategoryIsActive(Long id);
}
