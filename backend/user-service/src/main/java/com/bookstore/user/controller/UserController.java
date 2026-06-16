package com.bookstore.user.controller;

import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/init")
    public ResponseEntity<ApiResponse<Void>> initProfile(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(userService.initUserProfile(payload));
    }
}
