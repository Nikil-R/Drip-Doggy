package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICategoryService;
import com.dripdoggy.backend.RequestDto.CategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.CategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

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
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> fetchAllCategory() {
        CategoryListResponseDto response = categoryService.fetchAllCategory();
        return new ResponseEntity<>(response.getDetails(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> fetchCategoryById(@PathVariable Long id) {
        CategoryDetailsResponseDto response = categoryService.fetchCategoryById(id);
        return new ResponseEntity<>(response.getDetails(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateCategory(
            @PathVariable Long id,
            @Valid @ModelAttribute CategoryRequestDto categoryDto) {
        ResponseMsgDto response = categoryService.updateCategory(id, categoryDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteCategory(@PathVariable Long id) {
        ResponseMsgDto response = categoryService.deleteCategory(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> toggleCategoryIsActive(@PathVariable Long id) {
        ResponseMsgDto response = categoryService.updateCategoryIsActiveById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
