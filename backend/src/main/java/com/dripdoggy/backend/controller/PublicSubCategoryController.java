package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ISubCategoryService;
import com.dripdoggy.backend.ResponseDto.SubCategoryListResponseDto;
import com.dripdoggy.backend.ResponseDto.SubCategoryDetailsResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/subcategories")
public class PublicSubCategoryController {

    private final ISubCategoryService subCategoryService;

    @Autowired
    public PublicSubCategoryController(ISubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
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
}
