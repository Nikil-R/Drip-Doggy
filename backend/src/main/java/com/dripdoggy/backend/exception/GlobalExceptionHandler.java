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

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ResponseMsgDto> handleBadRequest(BadRequestException ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseMsgDto> handleGlobalException(Exception ex) {
        ResponseMsgDto response = new ResponseMsgDto(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
