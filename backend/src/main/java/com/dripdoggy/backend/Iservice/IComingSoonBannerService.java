package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.ComingSoonBannerRequestDto;
import com.dripdoggy.backend.ResponseDto.ComingSoonBannerResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IComingSoonBannerService {

    ResponseMsgDto createBanner(ComingSoonBannerRequestDto dto, MultipartFile file);

    List<ComingSoonBannerResponseDto> getAllAdminBanners();

    List<ComingSoonBannerResponseDto> getPublicActiveBanners();

    ComingSoonBannerResponseDto getBannerById(Long id);

    ResponseMsgDto updateBanner(Long id, ComingSoonBannerRequestDto dto, MultipartFile file);

    ResponseMsgDto toggleBannerActive(Long id);

    ResponseMsgDto softDeleteBanner(Long id);
}
