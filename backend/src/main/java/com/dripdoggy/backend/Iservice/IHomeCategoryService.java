package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.HomeCategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.HomeCategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import java.util.List;

public interface IHomeCategoryService {
    ResponseMsgDto createCategory(HomeCategoryRequestDto dto);
    List<HomeCategoryResponseDto> getAllCategoriesAdmin();
    List<HomeCategoryResponseDto> getActiveCategoriesPublic();
    ResponseMsgDto updateCategory(Long id, HomeCategoryRequestDto dto);
    ResponseMsgDto deleteCategory(Long id);
    ResponseMsgDto toggleCategoryActiveStatus(Long id);
}
