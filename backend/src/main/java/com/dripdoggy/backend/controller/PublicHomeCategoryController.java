package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IHomeCategoryService;
import com.dripdoggy.backend.ResponseDto.HomeCategoryResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/home-categories")
public class PublicHomeCategoryController {

    private final IHomeCategoryService homeCategoryService;

    @Autowired
    public PublicHomeCategoryController(IHomeCategoryService homeCategoryService) {
        this.homeCategoryService = homeCategoryService;
    }

    @GetMapping
    public ResponseEntity<List<HomeCategoryResponseDto>> getActiveCategories() {
        List<HomeCategoryResponseDto> responses = homeCategoryService.getActiveCategoriesPublic();
        return ResponseEntity.ok(responses);
    }
}
