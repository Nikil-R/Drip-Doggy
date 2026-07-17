package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.BundleRequestDto;
import com.dripdoggy.backend.ResponseDto.BundleResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import java.util.List;

public interface IBundleService {
    ResponseMsgDto createOrUpdateBundle(BundleRequestDto bundleReqDto);
    List<BundleResponseDto> getAllBundles();
    BundleResponseDto getActiveBundleByVariantId(Long variantId);
    ResponseMsgDto deleteBundle(Long id);
    ResponseMsgDto toggleBundleActiveStatus(Long id);
}
