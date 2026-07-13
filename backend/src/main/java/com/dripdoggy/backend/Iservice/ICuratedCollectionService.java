package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.CuratedCollectionRequestDto;
import com.dripdoggy.backend.ResponseDto.CuratedCollectionResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface ICuratedCollectionService {
    CuratedCollectionResponseDto getCollection(String sectionKey);
    ResponseMsgDto updateCollection(String sectionKey, CuratedCollectionRequestDto dto);
}
