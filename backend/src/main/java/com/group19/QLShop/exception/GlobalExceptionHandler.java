package com.group19.QLShop.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import com.group19.QLShop.dto.reponse.ErrorResponse;
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        // Lấy HTTP Status gốc từ Exception (ví dụ: 404, 400)
        int status = ex.getStatusCode().value();
        
        // Lấy lý do lỗi bạn đã truyền vào khi throw
        String message = ex.getReason(); 
        
        ErrorResponse error = new ErrorResponse(status, message);
        
        return new ResponseEntity<>(error, ex.getStatusCode());
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Dữ liệu đầu vào không hợp lệ");
        ErrorResponse error = new ErrorResponse(org.springframework.http.HttpStatus.BAD_REQUEST.value(), errorMessage);
        return new ResponseEntity<>(error, org.springframework.http.HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse error = new ErrorResponse(org.springframework.http.HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(error, org.springframework.http.HttpStatus.BAD_REQUEST);
    }
}

