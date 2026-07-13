package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IBannerService;
import com.dripdoggy.backend.ResponseDto.BannerResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/banners")
public class PublicBannerController {

    private final IBannerService bannerService;

    @Autowired
    public PublicBannerController(IBannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ResponseEntity<List<BannerResponseDto>> getActiveBanners() {
        List<BannerResponseDto> responses = bannerService.getActiveBannersPublic();
        return ResponseEntity.ok(responses);
    }
}
