package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IBannerService;
import com.dripdoggy.backend.RequestDto.BannerRequestDto;
import com.dripdoggy.backend.ResponseDto.BannerResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
public class AdminBannerController {

    private final IBannerService bannerService;

    @Autowired
    public AdminBannerController(IBannerService bannerService) {
        this.bannerService = bannerService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createBanner(@Valid @ModelAttribute BannerRequestDto dto) {
        ResponseMsgDto response = bannerService.createBanner(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BannerResponseDto>> getAllBanners() {
        List<BannerResponseDto> responses = bannerService.getAllBannersAdmin();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateBanner(
            @PathVariable Long id,
            @Valid @ModelAttribute BannerRequestDto dto) {
        ResponseMsgDto response = bannerService.updateBanner(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteBanner(@PathVariable Long id) {
        ResponseMsgDto response = bannerService.deleteBanner(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ResponseMsgDto> toggleBannerActiveStatus(@PathVariable Long id) {
        ResponseMsgDto response = bannerService.toggleBannerActiveStatus(id);
        return ResponseEntity.ok(response);
    }
}
