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
}

