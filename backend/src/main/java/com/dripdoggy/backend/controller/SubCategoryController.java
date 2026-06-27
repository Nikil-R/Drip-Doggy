package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ISubCategoryService;
import com.dripdoggy.backend.RequestDto.SubCategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryDetailsResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/subcategories")
public class SubCategoryController {

    private final ISubCategoryService subCategoryService;

    @Autowired
    public SubCategoryController(ISubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createSubCategory(
            @Valid @ModelAttribute SubCategoryRequestDto subCategoryDto) {
        ResponseMsgDto response = subCategoryService.createSubCategory(subCategoryDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<SubCategoryListResponseDto> fetchAllSubCategories() {
        SubCategoryListResponseDto response = subCategoryService.fetchAllSubCategories();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubCategoryDetailsResponseDto> fetchSubCategoryById(@PathVariable Long id) {
        SubCategoryDetailsResponseDto response = subCategoryService.fetchSubCategoryById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateSubCategory(
            @PathVariable Long id,
            @Valid @ModelAttribute SubCategoryRequestDto subCategoryDto) {
        ResponseMsgDto response = subCategoryService.updateSubCategory(id, subCategoryDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteSubCategory(@PathVariable Long id) {
        ResponseMsgDto response = subCategoryService.deleteSubCategory(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> toggleSubCategoryIsActive(@PathVariable Long id) {
        ResponseMsgDto response = subCategoryService.toggleSubCategoryIsActive(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
