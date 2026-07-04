package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICategoryService;
import com.dripdoggy.backend.ResponseDto.CategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.CategoryListResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
public class PublicCategoryController {

    private final ICategoryService categoryService;

    @Autowired
    public PublicCategoryController(ICategoryService categoryService) {
        this.categoryService = categoryService;
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
}
