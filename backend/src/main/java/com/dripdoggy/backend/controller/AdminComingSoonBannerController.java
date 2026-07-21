package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IComingSoonBannerService;
import com.dripdoggy.backend.RequestDto.ComingSoonBannerRequestDto;
import com.dripdoggy.backend.ResponseDto.ComingSoonBannerResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coming-soon-banners")
@PreAuthorize("hasRole('ADMIN')")
public class AdminComingSoonBannerController {

    private final IComingSoonBannerService comingSoonBannerService;

    @Autowired
    public AdminComingSoonBannerController(IComingSoonBannerService comingSoonBannerService) {
        this.comingSoonBannerService = comingSoonBannerService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createBanner(
            @ModelAttribute ComingSoonBannerRequestDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        ResponseMsgDto response = comingSoonBannerService.createBanner(dto, file);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ComingSoonBannerResponseDto>> getAllAdminBanners() {
        List<ComingSoonBannerResponseDto> banners = comingSoonBannerService.getAllAdminBanners();
        return ResponseEntity.ok(banners);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComingSoonBannerResponseDto> getBannerById(@PathVariable Long id) {
        ComingSoonBannerResponseDto banner = comingSoonBannerService.getBannerById(id);
        return ResponseEntity.ok(banner);
    }

    @PostMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateBannerPost(
            @PathVariable Long id,
            @ModelAttribute ComingSoonBannerRequestDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        ResponseMsgDto response = comingSoonBannerService.updateBanner(id, dto, file);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateBannerPut(
            @PathVariable Long id,
            @ModelAttribute ComingSoonBannerRequestDto dto,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        ResponseMsgDto response = comingSoonBannerService.updateBanner(id, dto, file);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ResponseMsgDto> toggleBannerActive(@PathVariable Long id) {
        ResponseMsgDto response = comingSoonBannerService.toggleBannerActive(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> softDeleteBanner(@PathVariable Long id) {
        ResponseMsgDto response = comingSoonBannerService.softDeleteBanner(id);
        return ResponseEntity.ok(response);
    }
}
