package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICuratedCollectionService;
import com.dripdoggy.backend.ResponseDto.CuratedCollectionResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/curated-collections")
public class PublicCuratedCollectionController {

    private final ICuratedCollectionService curatedCollectionService;

    @Autowired
    public PublicCuratedCollectionController(ICuratedCollectionService curatedCollectionService) {
        this.curatedCollectionService = curatedCollectionService;
    }

    @GetMapping("/{sectionKey}")
    public ResponseEntity<CuratedCollectionResponseDto> getCollection(@PathVariable String sectionKey) {
        CuratedCollectionResponseDto response = curatedCollectionService.getCollection(sectionKey);
        return ResponseEntity.ok(response);
    }
}
