package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICategoryService;
import com.dripdoggy.backend.RequestDto.CategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.CategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDetailsResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/categories")
public class CategoryController {

    private final ICategoryService categoryService;

    @Autowired
    public CategoryController(ICategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createCategory(
            @Valid @ModelAttribute CategoryRequestDto categoryDto) {
        ResponseMsgDto response = categoryService.createCategory(categoryDto);
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatus()));
    }

    @GetMapping
    public ResponseEntity<CategoryListResponseDto> fetchAllCategory() {
        CategoryListResponseDto response = categoryService.fetchAllCategory();
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatus()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDetailsResponseDto> fetchCategoryById(@PathVariable Long id) {
        CategoryDetailsResponseDto response = categoryService.fetchCategoryById(id);
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatus()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateCategory(
            @PathVariable Long id,
            @Valid @ModelAttribute CategoryRequestDto categoryDto) {
    	ResponseMsgDto response = categoryService.updateCategory(id, categoryDto);
        return new ResponseEntity<ResponseMsgDto>(response, HttpStatus.valueOf(response.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteCategory(@PathVariable Long id) {
        ResponseMsgDto response = categoryService.deleteCategory(id);
        return new ResponseEntity<ResponseMsgDto>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> toggleCategoryIsActive(@PathVariable Long id) {
        ResponseMsgDto response = categoryService.updateCategoryIsActiveById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
