package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IBundleService;
import com.dripdoggy.backend.RequestDto.BundleRequestDto;
import com.dripdoggy.backend.ResponseDto.BundleResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bundles")
public class AdminBundleController {

    private final IBundleService bundleService;

    @Autowired
    public AdminBundleController(IBundleService bundleService) {
        this.bundleService = bundleService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createOrUpdateBundle(@Valid @RequestBody BundleRequestDto request) {
        ResponseMsgDto response = bundleService.createOrUpdateBundle(request);
        HttpStatus status = response.getStatus() == 201 ? HttpStatus.CREATED : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping
    public ResponseEntity<List<BundleResponseDto>> getAllBundles() {
        List<BundleResponseDto> response = bundleService.getAllBundles();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteBundle(@PathVariable Long id) {
        ResponseMsgDto response = bundleService.deleteBundle(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ResponseMsgDto> toggleBundleActiveStatus(@PathVariable Long id) {
        ResponseMsgDto response = bundleService.toggleBundleActiveStatus(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
