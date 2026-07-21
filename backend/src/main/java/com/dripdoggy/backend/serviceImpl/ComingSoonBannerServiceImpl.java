package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Configuration.S3Service;
import com.dripdoggy.backend.Iservice.IComingSoonBannerService;
import com.dripdoggy.backend.RequestDto.ComingSoonBannerRequestDto;
import com.dripdoggy.backend.ResponseDto.ComingSoonBannerResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.ComingSoonBanner;
import com.dripdoggy.backend.exception.FailedToUploadImageException;
import com.dripdoggy.backend.exception.ResourceNotFoundException;
import com.dripdoggy.backend.repository.ComingSoonBannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComingSoonBannerServiceImpl implements IComingSoonBannerService {

    private final ComingSoonBannerRepository comingSoonBannerRepository;
    private final S3Service s3Service;

    @Autowired
    public ComingSoonBannerServiceImpl(ComingSoonBannerRepository comingSoonBannerRepository, S3Service s3Service) {
        this.comingSoonBannerRepository = comingSoonBannerRepository;
        this.s3Service = s3Service;
    }

    @Override
    public ResponseMsgDto createBanner(ComingSoonBannerRequestDto dto, MultipartFile file) {
        if (dto == null || dto.getReleaseTitle() == null || dto.getReleaseTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Release title is required.");
        }

        ComingSoonBanner banner = new ComingSoonBanner();
        banner.setTaglineBadge(dto.getTaglineBadge() != null ? dto.getTaglineBadge() : "UPCOMING RELEASE");
        banner.setReleaseTitle(dto.getReleaseTitle().trim());
        banner.setDescription(dto.getDescription());
        banner.setButtonText(dto.getButtonText() != null ? dto.getButtonText() : "NOTIFY ME");
        banner.setActionLink(dto.getActionLink() != null ? dto.getActionLink() : "#notify");
        banner.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        banner.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        banner.setIsDeleted(false);
        banner.setTargetCategoryId(dto.getTargetCategoryId());
        banner.setTargetSubCategoryId(dto.getTargetSubCategoryId());
        banner.setTargetProductId(dto.getTargetProductId());

        // Process background image upload or URL
        String imageUrl = resolveImageUrl(dto, file);
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Background image is required.");
        }
        banner.setBackgroundImageUrl(imageUrl);

        comingSoonBannerRepository.save(banner);
        return new ResponseMsgDto(201, "Coming soon banner created successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComingSoonBannerResponseDto> getAllAdminBanners() {
        List<ComingSoonBanner> banners = comingSoonBannerRepository.findByIsDeletedFalseOrderByDisplayOrderAscCreatedAtDesc();
        return banners.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComingSoonBannerResponseDto> getPublicActiveBanners() {
        List<ComingSoonBanner> banners = comingSoonBannerRepository.findByIsActiveTrueAndIsDeletedFalseOrderByDisplayOrderAscCreatedAtDesc();
        return banners.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ComingSoonBannerResponseDto getBannerById(Long id) {
        ComingSoonBanner banner = comingSoonBannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coming soon banner not found with id: " + id));

        if (Boolean.TRUE.equals(banner.getIsDeleted())) {
            throw new ResourceNotFoundException("Coming soon banner not found with id: " + id);
        }

        return mapToDto(banner);
    }

    @Override
    public ResponseMsgDto updateBanner(Long id, ComingSoonBannerRequestDto dto, MultipartFile file) {
        ComingSoonBanner banner = comingSoonBannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coming soon banner not found with id: " + id));

        if (Boolean.TRUE.equals(banner.getIsDeleted())) {
            throw new ResourceNotFoundException("Coming soon banner not found with id: " + id);
        }

        if (dto.getReleaseTitle() != null && !dto.getReleaseTitle().trim().isEmpty()) {
            banner.setReleaseTitle(dto.getReleaseTitle().trim());
        }
        if (dto.getTaglineBadge() != null) {
            banner.setTaglineBadge(dto.getTaglineBadge());
        }
        if (dto.getDescription() != null) {
            banner.setDescription(dto.getDescription());
        }
        if (dto.getButtonText() != null) {
            banner.setButtonText(dto.getButtonText());
        }
        if (dto.getActionLink() != null) {
            banner.setActionLink(dto.getActionLink());
        }
        if (dto.getDisplayOrder() != null) {
            banner.setDisplayOrder(dto.getDisplayOrder());
        }
        if (dto.getIsActive() != null) {
            banner.setIsActive(dto.getIsActive());
        }
        if (dto.getTargetCategoryId() != null) {
            banner.setTargetCategoryId(dto.getTargetCategoryId());
        }
        if (dto.getTargetSubCategoryId() != null) {
            banner.setTargetSubCategoryId(dto.getTargetSubCategoryId());
        }
        if (dto.getTargetProductId() != null) {
            banner.setTargetProductId(dto.getTargetProductId());
        }

        String newImageUrl = resolveImageUrl(dto, file);
        if (newImageUrl != null && !newImageUrl.trim().isEmpty()) {
            banner.setBackgroundImageUrl(newImageUrl);
        }

        comingSoonBannerRepository.save(banner);
        return new ResponseMsgDto(200, "Coming soon banner updated successfully.");
    }

    @Override
    public ResponseMsgDto toggleBannerActive(Long id) {
        ComingSoonBanner banner = comingSoonBannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coming soon banner not found with id: " + id));

        if (Boolean.TRUE.equals(banner.getIsDeleted())) {
            throw new ResourceNotFoundException("Coming soon banner not found with id: " + id);
        }

        banner.setIsActive(banner.getIsActive() == null || !banner.getIsActive());
        comingSoonBannerRepository.save(banner);
        String statusStr = banner.getIsActive() ? "active" : "inactive";
        return new ResponseMsgDto(200, "Banner visibility updated to " + statusStr + " successfully.");
    }

    @Override
    public ResponseMsgDto softDeleteBanner(Long id) {
        ComingSoonBanner banner = comingSoonBannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coming soon banner not found with id: " + id));

        if (Boolean.TRUE.equals(banner.getIsDeleted())) {
            throw new ResourceNotFoundException("Coming soon banner not found with id: " + id);
        }

        banner.setIsDeleted(true);
        banner.setIsActive(false);
        comingSoonBannerRepository.save(banner);
        return new ResponseMsgDto(200, "Coming soon banner soft-deleted successfully.");
    }

    private String resolveImageUrl(ComingSoonBannerRequestDto dto, MultipartFile file) {
        MultipartFile uploadFile = (file != null && !file.isEmpty()) ? file :
                (dto != null && dto.getBackgroundImage() != null && !dto.getBackgroundImage().isEmpty()) ? dto.getBackgroundImage() : null;

        if (uploadFile != null) {
            try {
                return s3Service.uploadFile(uploadFile);
            } catch (IOException e) {
                throw new FailedToUploadImageException("Failed to upload background image to S3: " + e.getMessage());
            }
        }
        return dto != null ? dto.getBackgroundImageUrl() : null;
    }

    private ComingSoonBannerResponseDto mapToDto(ComingSoonBanner b) {
        return new ComingSoonBannerResponseDto(
                b.getId(),
                b.getTaglineBadge(),
                b.getReleaseTitle(),
                b.getDescription(),
                b.getBackgroundImageUrl(),
                b.getButtonText(),
                b.getActionLink(),
                b.getDisplayOrder(),
                b.getIsActive(),
                b.getTargetCategoryId(),
                b.getTargetSubCategoryId(),
                b.getTargetProductId(),
                b.getCreatedAt()
        );
    }
}
