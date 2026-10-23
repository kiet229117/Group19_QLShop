package com.group19.QLShop.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import com.group19.QLShop.dto.reponse.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý lỗi sai tên đăng nhập hoặc mật khẩu (Spring Security)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!"
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi xác thực chung (Tài khoản bị khóa, token không hợp lệ...)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex) {
        String msg = "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
        if (ex.getMessage() != null && (ex.getMessage().contains("disabled") || ex.getMessage().contains("locked"))) {
            msg = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!";
        }
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), msg);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        int status = ex.getStatusCode().value();
        String message = ex.getReason() != null ? ex.getReason() : "Yêu cầu không hợp lệ";
        ErrorResponse error = new ErrorResponse(status, message);
        return new ResponseEntity<>(error, ex.getStatusCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Dữ liệu đầu vào không hợp lệ");
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), errorMessage);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi ràng buộc dữ liệu cơ sở dữ liệu (Khóa ngoại, Unique key...)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "";
        String friendlyMessage = "Thao tác không thể hoàn tất do ràng buộc dữ liệu trong hệ thống.";

        if (msg.contains("foreign key constraint fails") || msg.contains("Cannot delete or update a parent row")) {
            if (msg.contains("order")) {
                friendlyMessage = "Không thể xóa do tài khoản này đã có lịch sử đơn hàng. Vui lòng chuyển sang chức năng Khóa tài khoản.";
            } else if (msg.contains("comment")) {
                friendlyMessage = "Không thể xóa do dữ liệu này đang có đánh giá hoặc bình luận liên quan.";
            } else if (msg.contains("conversation") || msg.contains("message")) {
                friendlyMessage = "Không thể xóa do đang có các phiên hội thoại tin nhắn liên kết.";
            } else {
                friendlyMessage = "Không thể xóa dữ liệu này vì đang được liên kết với các bảng dữ liệu khác trong hệ thống.";
            }
        } else if (msg.contains("Duplicate entry")) {
            if (msg.contains("username") || msg.contains("users")) {
                friendlyMessage = "Tên đăng nhập hoặc Email đã tồn tại. Vui lòng chọn thông tin khác!";
            } else {
                friendlyMessage = "Dữ liệu bị trùng lặp trong hệ thống. Vui lòng kiểm tra lại!";
            }
        }

        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), friendlyMessage);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "Đã có lỗi xảy ra trong quá trình xử lý";

        // Lọc sạch cú pháp SQL kỹ thuật nếu có lọt ra
        if (msg.contains("could not execute statement") || msg.contains("SQL [") || msg.contains("foreign key constraint fails")) {
            msg = "Không thể thực hiện thao tác do ràng buộc dữ liệu liên kết trong hệ thống.";
        } else if (msg.contains("Bad credentials") || msg.contains("bad credentials")) {
            msg = "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
        }

        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), msg);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        ErrorResponse error = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Hệ thống gặp sự cố trong quá trình xử lý. Vui lòng thử lại sau!");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
