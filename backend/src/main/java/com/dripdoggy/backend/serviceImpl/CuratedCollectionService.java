package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.ICuratedCollectionService;
import com.dripdoggy.backend.Iservice.IProductService;
import com.dripdoggy.backend.RequestDto.CuratedCollectionRequestDto;
import com.dripdoggy.backend.ResponseDto.CuratedCollectionResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.CuratedCollection;
import com.dripdoggy.backend.entity.Product;
import com.dripdoggy.backend.exception.ResourceNotFoundException;
import com.dripdoggy.backend.repository.CuratedCollectionRepository;
import com.dripdoggy.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CuratedCollectionService implements ICuratedCollectionService {

    private final CuratedCollectionRepository curatedCollectionRepository;
    private final ProductRepository productRepository;
    private final IProductService productService;

    @Autowired
    public CuratedCollectionService(CuratedCollectionRepository curatedCollectionRepository,
                                    ProductRepository productRepository,
                                    IProductService productService) {
        this.curatedCollectionRepository = curatedCollectionRepository;
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @Override
    @Transactional(readOnly = true)
    public CuratedCollectionResponseDto getCollection(String sectionKey) {
        CuratedCollection collection = curatedCollectionRepository.findBySectionKey(sectionKey.toUpperCase().trim())
                .orElse(null);

        if (collection == null) {
            return new CuratedCollectionResponseDto(sectionKey.toUpperCase().trim(), sectionKey, "", true, new ArrayList<>());
        }

        List<ProductResponseDto> productDtos = collection.getProducts().stream()
                .map(productService::mapProductToDto)
                .collect(Collectors.toList());

        return new CuratedCollectionResponseDto(
                collection.getSectionKey(),
                collection.getTitle(),
                collection.getSubtitle(),
                collection.getIsActive(),
                productDtos
        );
    }

    @Override
    public ResponseMsgDto updateCollection(String sectionKey, CuratedCollectionRequestDto dto) {
        if (dto.getProductIds() != null && dto.getProductIds().size() > 4) {
            throw new IllegalArgumentException("Only up to 4 products can be selected for this section.");
        }

        String normalizedKey = sectionKey.toUpperCase().trim();
        CuratedCollection collection = curatedCollectionRepository.findBySectionKey(normalizedKey)
                .orElseGet(() -> {
                    CuratedCollection newCol = new CuratedCollection();
                    newCol.setSectionKey(normalizedKey);
                    return newCol;
                });

        if (dto.getTitle() != null) {
            collection.setTitle(dto.getTitle());
        } else if (collection.getTitle() == null) {
            collection.setTitle(sectionKey);
        }

        if (dto.getSubtitle() != null) {
            collection.setSubtitle(dto.getSubtitle());
        }

        if (dto.getIsActive() != null) {
            collection.setIsActive(dto.getIsActive());
        } else if (collection.getIsActive() == null) {
            collection.setIsActive(true);
        }

        List<Product> products = new ArrayList<>();
        if (dto.getProductIds() != null) {
            for (Long id : dto.getProductIds()) {
                Product product = productRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
                if (Boolean.TRUE.equals(product.getIsDeleted())) {
                    throw new ResourceNotFoundException("Product with id " + id + " has been deleted.");
                }
                products.add(product);
            }
        }
        collection.setProducts(products);

        curatedCollectionRepository.save(collection);

        return new ResponseMsgDto(200, "Collection '" + normalizedKey + "' updated successfully.");
    }
}
