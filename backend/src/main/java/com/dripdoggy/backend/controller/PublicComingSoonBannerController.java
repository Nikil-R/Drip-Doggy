package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IComingSoonBannerService;
import com.dripdoggy.backend.ResponseDto.ComingSoonBannerResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/coming-soon-banners")
public class PublicComingSoonBannerController {

    private final IComingSoonBannerService comingSoonBannerService;

    @Autowired
    public PublicComingSoonBannerController(IComingSoonBannerService comingSoonBannerService) {
        this.comingSoonBannerService = comingSoonBannerService;
    }

    @GetMapping
    public ResponseEntity<List<ComingSoonBannerResponseDto>> getPublicActiveBanners() {
        List<ComingSoonBannerResponseDto> banners = comingSoonBannerService.getPublicActiveBanners();
        return ResponseEntity.ok(banners);
    }
}
