package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICuratedCollectionService;
import com.dripdoggy.backend.RequestDto.CuratedCollectionRequestDto;
import com.dripdoggy.backend.ResponseDto.CuratedCollectionResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/curated-collections")
public class AdminCuratedCollectionController {

    private final ICuratedCollectionService curatedCollectionService;

    @Autowired
    public AdminCuratedCollectionController(ICuratedCollectionService curatedCollectionService) {
        this.curatedCollectionService = curatedCollectionService;
    }

    @GetMapping("/{sectionKey}")
    public ResponseEntity<CuratedCollectionResponseDto> getCollection(@PathVariable String sectionKey) {
        CuratedCollectionResponseDto response = curatedCollectionService.getCollection(sectionKey);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{sectionKey}")
    public ResponseEntity<ResponseMsgDto> updateCollection(
            @PathVariable String sectionKey,
            @Valid @RequestBody CuratedCollectionRequestDto dto) {
        ResponseMsgDto response = curatedCollectionService.updateCollection(sectionKey, dto);
        return ResponseEntity.ok(response);
    }
}
