package com.bookstore.user.service;

import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.user.entity.User;
import com.bookstore.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Gọi từ auth-service khi đăng ký
    public ApiResponse<Void> initUserProfile(Map<String, Object> payload) {
        int userId = (Integer) payload.get("userId");
        String email = (String) payload.get("email");
        String firstName = payload.getOrDefault("firstName", "").toString();
        String lastName = payload.getOrDefault("lastName", "").toString();

        if (userRepository.existsById(userId)) {
            return ApiResponse.error("User profile đã tồn tại.");
        }

        User user = User.builder()
                .idUser(userId)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .avatar("")
                .build();
        userRepository.save(user);
        return ApiResponse.success("Profile đã được tạo.");
    }

    public ApiResponse<User> getUserProfile(int userId) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return ApiResponse.error("Không tìm thấy thông tin người dùng!");
        }
        return ApiResponse.success("Lấy thông tin profile thành công!", user);
    }
}
