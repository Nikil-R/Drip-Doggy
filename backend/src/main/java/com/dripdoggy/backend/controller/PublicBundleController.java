package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IBundleService;
import com.dripdoggy.backend.ResponseDto.BundleResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/bundles")
public class PublicBundleController {

    private final IBundleService bundleService;

    @Autowired
    public PublicBundleController(IBundleService bundleService) {
        this.bundleService = bundleService;
    }

    @GetMapping("/variant/{variantId}")
    public ResponseEntity<BundleResponseDto> getActiveBundleByVariantId(@PathVariable Long variantId) {
        return new ResponseEntity<>(bundleService.getActiveBundleByVariantId(variantId), HttpStatus.OK);
    }
}
