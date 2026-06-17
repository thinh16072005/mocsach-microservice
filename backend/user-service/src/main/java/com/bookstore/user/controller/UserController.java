package com.bookstore.user.controller;

import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.user.dto.request.UpdateProfileRequest;
import com.bookstore.user.entity.User;
import com.bookstore.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookstore.user.dto.request.ChangeAvatarRequest;
import com.bookstore.user.dto.request.UpdateProfileRequest;
import com.bookstore.user.dto.response.UserResponse;
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
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@RequestHeader("X-User-Id") int userId) {
        ApiResponse<UserResponse> response = userService.getUserById(userId);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @RequestHeader("X-User-Id") int loggedInUserId,
            @RequestHeader("X-User-Role") String loggedInUserRole,
            @PathVariable int id) {
        if (!"ADMIN".equals(loggedInUserRole) && loggedInUserId != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền truy cập thông tin này!"));
        }
        ApiResponse<UserResponse> response = userService.getUserById(id);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestHeader("X-User-Role") String loggedInUserRole) {
        if (!"ADMIN".equals(loggedInUserRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền truy cập thông tin này!"));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @PathVariable int id,
            @RequestBody UpdateProfileRequest request) {
        ApiResponse<Void> response = userService.updateProfile(id, request);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/{id}/avatar")
    public ResponseEntity<ApiResponse<Void>> changeAvatar(
            @PathVariable int id,
            @RequestBody ChangeAvatarRequest request) {
        ApiResponse<Void> response = userService.changeAvatar(id, request);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateByAdmin(
            @RequestHeader("X-User-Role") String loggedInUserRole,
            @PathVariable int id,
            @RequestBody Map<String, Object> payload) {
        if (!"ADMIN".equals(loggedInUserRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền thực hiện hành động này!"));
        }
        ApiResponse<Void> response = userService.updateByAdmin(id, payload);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByIds(@RequestBody List<Integer> ids) {
        return ResponseEntity.ok(userService.getUsersByIds(ids));
    }

    @GetMapping("/search/existsByEmail")
    public ResponseEntity<Boolean> existsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.existsByEmail(email));
    }

    @GetMapping("/search/existsByUsername")
    public ResponseEntity<Boolean> existsByUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.existsByUsername(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateUserProfile(
            @RequestHeader("X-User-Id") int userId,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(userId, request));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> updateUserProfileById(
            @RequestHeader("X-User-Id") int loggedInUserId,
            @RequestHeader("X-User-Role") String loggedInUserRole,
            @PathVariable("userId") int targetUserId,
            @RequestBody UpdateProfileRequest request) {

        if (!"ADMIN".equals(loggedInUserRole) && loggedInUserId != targetUserId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền cập nhật thông tin này!"));
        }
        return ResponseEntity.ok(userService.updateUserProfile(targetUserId, request));
    }
}


