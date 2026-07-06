package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.ProductRequestDto;
import com.dripdoggy.backend.ResponseDto.ProductDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface IProductService {
    ResponseMsgDto createProduct(ProductRequestDto productReqDto);
    ProductListResponseDto fetchAllActiveProducts();
    ProductDetailsResponseDto fetchProductById(Long id);
    ResponseMsgDto updateProduct(Long id, ProductRequestDto productReqDto);
    ResponseMsgDto deleteProduct(Long id);
    ResponseMsgDto toggleProductIsActive(Long id);
    ResponseMsgDto toggleProductVariantIsActive(Long id);
    ResponseMsgDto toggleProductVariantSizeIsActive(Long id);
    ResponseMsgDto deleteProductVariant(Long id);
}
