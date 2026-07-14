package com.dripdoggy.backend.exception;

import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleResourceNotFound(ResourceNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(404, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OrderAlreadyShippedException.class)
    public ResponseEntity<ResponseMsgDto> handleOrderAlreadyShipped(OrderAlreadyShippedException ex) {
        ResponseMsgDto response = new ResponseMsgDto(400, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleCategoryNotFound(CategoryNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SubCategoryNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleSubCategoryNotFound(SubCategoryNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleProductNotFound(ProductNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductVariantNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleProductVariantNotFound(ProductVariantNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductVariantSizeNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleProductVariantSizeNotFound(ProductVariantSizeNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidImageDimensionException.class)
    public ResponseEntity<ResponseMsgDto> handleInvalidImageDimension(InvalidImageDimensionException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleUserNotFound(UserNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleOrderNotFound(OrderNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CouponNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleCouponNotFound(CouponNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ResponseMsgDto> handleInvalidCredentials(InvalidCredentialsException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(DuplicateCategoryFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleDuplicateCategoryFound(DuplicateCategoryFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateProductSkuException.class)
    public ResponseEntity<ResponseMsgDto> handleDuplicateProductSku(DuplicateProductSkuException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCountryCodeException.class)
    public ResponseEntity<ResponseMsgDto> handleInvalidCountryCode(InvalidCountryCodeException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleEmailNotFound(EmailNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PhoneNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handlePhoneNotFound(PhoneNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CustomerAlreadyFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleCustomerAlreadyFound(CustomerAlreadyFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.CONFLICT.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(org.springframework.validation.BindException.class)
    public ResponseEntity<ResponseMsgDto> handleBindException(org.springframework.validation.BindException ex) {
        String defaultMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), defaultMessage);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<ResponseMsgDto> handleConstraintViolation(jakarta.validation.ConstraintViolationException ex) {
        String defaultMessage = ex.getConstraintViolations().iterator().next().getMessage();
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), defaultMessage);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FailedToUploadImageException.class)
    public ResponseEntity<ResponseMsgDto> handleFailedToUploadImage(FailedToUploadImageException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ResponseMsgDto> handleDataIntegrityViolation(org.springframework.dao.DataIntegrityViolationException ex) {
        String message = "Database error: constraint violation.";
        if (ex.getRootCause() != null && ex.getRootCause().getMessage() != null) {
            String rootMsg = ex.getRootCause().getMessage();
            if (rootMsg.contains("Duplicate entry") || rootMsg.contains("ConstraintViolation") || rootMsg.contains("UK") || rootMsg.contains("duplicate key")) {
                message = "A user with this email or phone number is already registered.";
            }
        }
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.CONFLICT.value(), message);
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidAdminEmailException.class)
    public ResponseEntity<ResponseMsgDto> handleInvalidAdminEmail(InvalidAdminEmailException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AdminNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleAdminNotFound(AdminNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OtpNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleOtpNotFound(OtpNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CartItemNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleCartItemNotFound(CartItemNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotRegisteredException.class)
    public ResponseEntity<ResponseMsgDto> handleUserNotRegistered(UserNotRegisteredException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AddressNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleAddressNotFound(AddressNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CustomerCartSizeforParticularSizeexxceedException.class)
    public ResponseEntity<ResponseMsgDto> handleCustomerCartSizeforParticularSizeexxceed(CustomerCartSizeforParticularSizeexxceedException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CartEmptyException.class)
    public ResponseEntity<ResponseMsgDto> handleCartEmpty(CartEmptyException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<ResponseMsgDto> handleMaxUploadSizeExceededException(org.springframework.web.multipart.MaxUploadSizeExceededException ex) {
        // Include the actual exception message to help debug how big the payload really is
        String detailMsg = ex.getMessage() != null ? ex.getMessage() : "Unknown size limits.";
        if (ex.getCause() != null && ex.getCause().getMessage() != null) {
            detailMsg += " - Cause: " + ex.getCause().getMessage();
        }
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.PAYLOAD_TOO_LARGE.value(), "Maximum upload size exceeded. Actual error: " + detailMsg);
        return new ResponseEntity<>(response, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @ExceptionHandler(CouponExpiredException.class)
    public ResponseEntity<ResponseMsgDto> handleCouponExpired(CouponExpiredException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CouponFirstOrderOnlyException.class)
    public ResponseEntity<ResponseMsgDto> handleCouponFirstOrderOnly(CouponFirstOrderOnlyException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DiscountNotAppliedException.class)
    public ResponseEntity<ResponseMsgDto> handleDiscountNotApplied(DiscountNotAppliedException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidOrderStateException.class)
    public ResponseEntity<ResponseMsgDto> handleInvalidOrderState(InvalidOrderStateException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingRefundProofException.class)
    public ResponseEntity<ResponseMsgDto> handleMissingRefundProof(MissingRefundProofException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReturnRequestAlreadyResolvedException.class)
    public ResponseEntity<ResponseMsgDto> handleReturnRequestAlreadyResolved(ReturnRequestAlreadyResolvedException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidOrderItemIDException.class)
    public ResponseEntity<ResponseMsgDto> handleInvalidOrderItemID(InvalidOrderItemIDException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingTrackingNumberException.class)
    public ResponseEntity<ResponseMsgDto> handleMissingTrackingNumber(MissingTrackingNumberException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseMsgDto> handleIllegalArgument(IllegalArgumentException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReviewImageLimitExceededException.class)
    public ResponseEntity<ResponseMsgDto> handleReviewImageLimitExceeded(ReviewImageLimitExceededException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ProductNotPurchasedException.class)
    public ResponseEntity<ResponseMsgDto> handleProductNotPurchased(ProductNotPurchasedException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleReviewNotFound(ReviewNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BannerNotFoundException.class)
    public ResponseEntity<ResponseMsgDto> handleBannerNotFound(BannerNotFoundException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidReturnQuantityException.class)
    public ResponseEntity<ResponseMsgDto> handleInvalidReturnQuantity(InvalidReturnQuantityException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReviewNotAllowedException.class)
    public ResponseEntity<ResponseMsgDto> handleReviewNotAllowed(ReviewNotAllowedException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateReviewException.class)
    public ResponseEntity<ResponseMsgDto> handleDuplicateReview(DuplicateReviewException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.CONFLICT.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<ResponseMsgDto> handleHttpMessageNotReadable(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        String message = "Malformed JSON request or invalid input value.";
        if (ex.getCause() instanceof com.fasterxml.jackson.databind.exc.InvalidFormatException) {
            com.fasterxml.jackson.databind.exc.InvalidFormatException cause = (com.fasterxml.jackson.databind.exc.InvalidFormatException) ex.getCause();
            if (cause.getTargetType() != null && cause.getTargetType().isEnum()) {
                message = "Invalid value for " + cause.getTargetType().getSimpleName() + ": '" + cause.getValue() + "'.";
            }
        } else if (ex.getCause() != null) {
            message = ex.getCause().getMessage();
        }
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), message);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OrderAlreadyPackedException.class)
    public ResponseEntity<ResponseMsgDto> handleOrderAlreadyPacked(OrderAlreadyPackedException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseMsgDto> handleGlobalException(Exception ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
