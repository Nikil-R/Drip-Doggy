package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IHomeCategoryService;
import com.dripdoggy.backend.RequestDto.HomeCategoryRequestDto;
import com.dripdoggy.backend.ResponseDto.HomeCategoryResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.HomeCategory;
import com.dripdoggy.backend.exception.ResourceNotFoundException;
import com.dripdoggy.backend.exception.FailedToUploadImageException;
import com.dripdoggy.backend.repository.HomeCategoryRepository;
import com.dripdoggy.backend.Configuration.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HomeCategoryService implements IHomeCategoryService {

    private final HomeCategoryRepository homeCategoryRepository;
    private final S3Service s3Service;

    @Autowired
    public HomeCategoryService(HomeCategoryRepository homeCategoryRepository, S3Service s3Service) {
        this.homeCategoryRepository = homeCategoryRepository;
        this.s3Service = s3Service;
    }

    @Override
    public ResponseMsgDto createCategory(HomeCategoryRequestDto dto) {
        HomeCategory category = new HomeCategory();
        category.setTitle(dto.getTitle());
        category.setDescription(dto.getDescription());
        category.setRoute(dto.getRoute());
        category.setComingSoon(dto.getComingSoon() != null ? dto.getComingSoon() : false);
        category.setComingSeason(dto.getComingSeason());
        category.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        
        boolean activeState = dto.getIsActive() != null ? dto.getIsActive() : true;
        if (activeState) {
            long activeCount = homeCategoryRepository.countByIsActiveTrueAndIdNot(-1L);
            if (activeCount >= 2) {
                throw new IllegalArgumentException("Maximum of 2 category cards can be active on the homepage. Please deactivate an existing category before activating this one.");
            }
        }
        category.setIsActive(activeState);

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                String imageUrl = s3Service.uploadFile(dto.getImage());
                category.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new FailedToUploadImageException("Failed to upload category image to S3: " + e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("Category image is required.");
        }

        homeCategoryRepository.save(category);
        return new ResponseMsgDto(201, "Home category created successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeCategoryResponseDto> getAllCategoriesAdmin() {
        List<HomeCategory> categories = homeCategoryRepository.findAllByOrderByDisplayOrderAsc();
        return categories.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeCategoryResponseDto> getActiveCategoriesPublic() {
        List<HomeCategory> categories = homeCategoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        return categories.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ResponseMsgDto updateCategory(Long id, HomeCategoryRequestDto dto) {
        HomeCategory category = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Home category not found with id: " + id));

        category.setTitle(dto.getTitle());
        category.setDescription(dto.getDescription());
        category.setRoute(dto.getRoute());
        category.setComingSoon(dto.getComingSoon() != null ? dto.getComingSoon() : false);
        category.setComingSeason(dto.getComingSeason());
        
        if (dto.getDisplayOrder() != null) {
            category.setDisplayOrder(dto.getDisplayOrder());
        }

        if (dto.getIsActive() != null) {
            if (dto.getIsActive() && !category.getIsActive()) {
                long activeCount = homeCategoryRepository.countByIsActiveTrueAndIdNot(id);
                if (activeCount >= 2) {
                    throw new IllegalArgumentException("Maximum of 2 category cards can be active on the homepage. Please deactivate an existing category before activating this one.");
                }
            }
            category.setIsActive(dto.getIsActive());
        }

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                String imageUrl = s3Service.uploadFile(dto.getImage());
                category.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new FailedToUploadImageException("Failed to upload category image to S3: " + e.getMessage());
            }
        }

        homeCategoryRepository.save(category);
        return new ResponseMsgDto(200, "Home category updated successfully.");
    }

    @Override
    public ResponseMsgDto deleteCategory(Long id) {
        HomeCategory category = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Home category not found with id: " + id));

        homeCategoryRepository.delete(category);
        return new ResponseMsgDto(200, "Home category deleted successfully.");
    }

    @Override
    public ResponseMsgDto toggleCategoryActiveStatus(Long id) {
        HomeCategory category = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Home category not found with id: " + id));

        boolean targetState = !category.getIsActive();

        if (targetState) {
            long activeCount = homeCategoryRepository.countByIsActiveTrueAndIdNot(id);
            if (activeCount >= 2) {
                throw new IllegalArgumentException("Maximum of 2 category cards can be active on the homepage. Please deactivate an existing category before activating this one.");
            }
        }

        category.setIsActive(targetState);
        homeCategoryRepository.save(category);

        String status = targetState ? "active" : "inactive";
        return new ResponseMsgDto(200, "Category visibility updated to " + status + " successfully.");
    }

    private HomeCategoryResponseDto mapToDto(HomeCategory category) {
        return new HomeCategoryResponseDto(
                category.getId(),
                category.getTitle(),
                category.getDescription(),
                category.getRoute(),
                category.getImageUrl(),
                category.getComingSoon(),
                category.getComingSeason(),
                category.getDisplayOrder(),
                category.getIsActive()
        );
    }
}
