package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IHomeCategoryService;
import com.dripdoggy.backend.RequestDto.HomeCategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.HomeCategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/home-categories")
public class AdminHomeCategoryController {

    private final IHomeCategoryService homeCategoryService;

    @Autowired
    public AdminHomeCategoryController(IHomeCategoryService homeCategoryService) {
        this.homeCategoryService = homeCategoryService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createCategory(@Valid @ModelAttribute HomeCategoryRequestDto dto) {
        ResponseMsgDto response = homeCategoryService.createCategory(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<HomeCategoryResponseDto>> getAllCategories() {
        List<HomeCategoryResponseDto> responses = homeCategoryService.getAllCategoriesAdmin();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateCategory(
            @PathVariable Long id,
            @Valid @ModelAttribute HomeCategoryRequestDto dto) {
        ResponseMsgDto response = homeCategoryService.updateCategory(id, dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateCategoryPut(
            @PathVariable Long id,
            @Valid @ModelAttribute HomeCategoryRequestDto dto) {
        ResponseMsgDto response = homeCategoryService.updateCategory(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteCategory(@PathVariable Long id) {
        ResponseMsgDto response = homeCategoryService.deleteCategory(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ResponseMsgDto> toggleCategoryActiveStatus(@PathVariable Long id) {
        ResponseMsgDto response = homeCategoryService.toggleCategoryActiveStatus(id);
        return ResponseEntity.ok(response);
    }
}
