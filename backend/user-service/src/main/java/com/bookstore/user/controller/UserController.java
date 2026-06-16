package com.bookstore.user.controller;

import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.user.entity.User;
import com.bookstore.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/init")
    public ResponseEntity<ApiResponse<Void>> initProfile(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(userService.initUserProfile(payload));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getUserProfile(@RequestHeader("X-User-Id") int userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUserProfileById(
            @RequestHeader("X-User-Id") int loggedInUserId,
            @RequestHeader("X-User-Role") String loggedInUserRole,
            @PathVariable("userId") int targetUserId) {

        if (!"ADMIN".equals(loggedInUserRole) && loggedInUserId != targetUserId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền truy cập thông tin này!"));
        }
        return ResponseEntity.ok(userService.getUserProfile(targetUserId));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<com.bookstore.user.dto.response.UserResponse>>> getAllUsers(
            @RequestHeader("X-User-Role") String loggedInUserRole) {
        if (!"ADMIN".equals(loggedInUserRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền truy cập thông tin này!"));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
}

