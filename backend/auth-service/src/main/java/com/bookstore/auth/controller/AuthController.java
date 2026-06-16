package com.bookstore.auth.controller;

import com.bookstore.auth.dto.request.LoginRequest;
import com.bookstore.auth.dto.request.RegisterRequest;
import com.bookstore.auth.dto.response.JwtResponse;
import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequest request) {
        ApiResponse<Void> response = authService.register(request);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/activate")
    public ResponseEntity<ApiResponse<Void>> activate(@RequestParam String email,
                                                       @RequestParam String code) {
        ApiResponse<Void> response = authService.activateAccount(email, code);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody LoginRequest request) {
        ApiResponse<JwtResponse> response = authService.login(request);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
}
