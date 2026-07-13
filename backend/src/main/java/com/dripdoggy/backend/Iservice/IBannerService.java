package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.BannerRequestDto;
import com.dripdoggy.backend.ResponseDto.BannerResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import java.util.List;

public interface IBannerService {
    ResponseMsgDto createBanner(BannerRequestDto dto);
    List<BannerResponseDto> getAllBannersAdmin();
    List<BannerResponseDto> getActiveBannersPublic();
    ResponseMsgDto updateBanner(Long id, BannerRequestDto dto);
    ResponseMsgDto deleteBanner(Long id);
    ResponseMsgDto toggleBannerActiveStatus(Long id);
}
