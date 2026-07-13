package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IBannerService;
import com.dripdoggy.backend.RequestDto.BannerRequestDto;
import com.dripdoggy.backend.ResponseDto.BannerResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.Banner;
import com.dripdoggy.backend.entity.Image;
import com.dripdoggy.backend.exception.BannerNotFoundException;
import com.dripdoggy.backend.exception.FailedToUploadImageException;
import com.dripdoggy.backend.repository.BannerRepository;
import com.dripdoggy.backend.Configuration.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BannerService implements IBannerService {

    private final BannerRepository bannerRepository;
    private final S3Service s3Service;

    @Autowired
    public BannerService(BannerRepository bannerRepository, S3Service s3Service) {
        this.bannerRepository = bannerRepository;
        this.s3Service = s3Service;
    }

    @Override
    public ResponseMsgDto createBanner(BannerRequestDto dto) {
        Banner banner = new Banner();
        banner.setTagline(dto.getTagline());
        banner.setTitle(dto.getTitle());
        banner.setDescription(dto.getDescription());
        banner.setRedirectTo(dto.getRedirectTo());
        banner.setButtonText(dto.getButtonText());
        banner.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        banner.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        banner.setIsDeleted(false);

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                String imageUrl = s3Service.uploadFile(dto.getImage());
                Image image = new Image();
                image.setImageUrl(imageUrl);
                image.setIsActive(true);
                image.setBanner(banner);
                banner.setImage(image);
            } catch (IOException e) {
                throw new FailedToUploadImageException("Failed to upload banner image to S3: " + e.getMessage());
            }
        }

        bannerRepository.save(banner);
        return new ResponseMsgDto(201, "Banner created successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponseDto> getAllBannersAdmin() {
        List<Banner> banners = bannerRepository.findByIsDeletedFalseOrderByDisplayOrderAsc();
        return banners.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponseDto> getActiveBannersPublic() {
        List<Banner> banners = bannerRepository.findByIsActiveTrueAndIsDeletedFalseOrderByDisplayOrderAsc();
        return banners.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ResponseMsgDto updateBanner(Long id, BannerRequestDto dto) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new BannerNotFoundException("Banner not found with id: " + id));

        if (Boolean.TRUE.equals(banner.getIsDeleted())) {
            throw new BannerNotFoundException("Banner not found for"+" "+banner.getTitle());
        }

        banner.setTagline(dto.getTagline());
        banner.setTitle(dto.getTitle());
        banner.setDescription(dto.getDescription());
        banner.setRedirectTo(dto.getRedirectTo());
        banner.setButtonText(dto.getButtonText());
        if (dto.getDisplayOrder() != null) {
            banner.setDisplayOrder(dto.getDisplayOrder());
        }
        if (dto.getIsActive() != null) {
            banner.setIsActive(dto.getIsActive());
        }

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                String imageUrl = s3Service.uploadFile(dto.getImage());
                Image image = banner.getImage();
                if (image == null) {
                    image = new Image();
                    image.setBanner(banner);
                }
                image.setImageUrl(imageUrl);
                image.setIsActive(true);
                banner.setImage(image);
            } catch (IOException e) {
                throw new FailedToUploadImageException("Failed to upload banner image to S3: " + e.getMessage());
            }
        }

        bannerRepository.save(banner);
        return new ResponseMsgDto(200, "Banner updated successfully.");
    }

    @Override
    public ResponseMsgDto deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new BannerNotFoundException("Banner not found"));

        if (Boolean.TRUE.equals(banner.getIsDeleted())) {
            throw new BannerNotFoundException("Banner not found for"+" "+banner.getTitle());
        }

        banner.setIsDeleted(true);
        banner.setIsActive(false);
        bannerRepository.save(banner);
        return new ResponseMsgDto(200, "Banner soft-deleted successfully.");
    }

    @Override
    public ResponseMsgDto toggleBannerActiveStatus(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new BannerNotFoundException("Banner not found with id: " + id));

        if (Boolean.TRUE.equals(banner.getIsDeleted())) {
            throw new BannerNotFoundException("Banner not found for"+" "+banner.getTitle());
        }

        banner.setIsActive(banner.getIsActive() == null || !banner.getIsActive());
        bannerRepository.save(banner);
        String status = banner.getIsActive() ? "active" : "inactive";
        return new ResponseMsgDto(200, "Banner visibility updated to " + status + " successfully.");
    }

    private BannerResponseDto mapToDto(Banner banner) {
        String imageUrl = banner.getImage() != null ? banner.getImage().getImageUrl() : null;
        return new BannerResponseDto(
                banner.getId(),
                banner.getTagline(),
                banner.getTitle(),
                banner.getDescription(),
                banner.getRedirectTo(),
                banner.getButtonText(),
                banner.getDisplayOrder(),
                banner.getIsActive(),
                imageUrl
        );
    }
}
