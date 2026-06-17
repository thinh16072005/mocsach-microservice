package com.bookstore.user.service;

import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.user.dto.request.UpdateProfileRequest;
import com.bookstore.user.entity.User;
import com.bookstore.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

import com.bookstore.user.dto.request.ChangeAvatarRequest;
import com.bookstore.user.util.Base64ToMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final com.bookstore.user.client.AuthClient authClient;
    private final CloudinaryService cloudinaryService;

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

    public ApiResponse<User> updateUserProfile(int userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return ApiResponse.error("Không tìm thấy thông tin người dùng!");
        }

        if (isNotBlank(request.getFirstName())) user.setFirstName(request.getFirstName());
        if (isNotBlank(request.getLastName())) user.setLastName(request.getLastName());
        if (isNotBlank(request.getPhoneNumber())) user.setPhoneNumber(request.getPhoneNumber());
        if (isNotBlank(request.getGender())) user.setGender(request.getGender().charAt(0));
        if (request.getDateOfBirth() != null) user.setDateOfBirth(new java.sql.Date(request.getDateOfBirth().getTime()));
        if (request.getDeliveryAddress() != null) user.setDeliveryAddress(request.getDeliveryAddress());
        if (isNotBlank(request.getAvatar())) user.setAvatar(request.getAvatar());

        userRepository.save(user);
        return ApiResponse.success("Cập nhật thông tin profile thành công!", user);
    }

    public ApiResponse<List<com.bookstore.user.dto.response.UserResponse>> getAllUsers() {
        List<com.bookstore.common.dto.shared.AuthUserDto> authUsers = authClient.getAllAuthUsers();
        Map<Integer, com.bookstore.common.dto.shared.AuthUserDto> authMap = authUsers.stream()
                .collect(Collectors.toMap(com.bookstore.common.dto.shared.AuthUserDto::getId, au -> au, (a, b) -> a));

        List<com.bookstore.user.dto.response.UserResponse> users = userRepository.findAll().stream()
                .map(u -> {
                    com.bookstore.user.dto.response.UserResponse resp = toResponse(u);
                    com.bookstore.common.dto.shared.AuthUserDto au = authMap.get(u.getIdUser());
                    if (au != null) {
                        resp.setUsername(au.getUsername());
                        resp.setEnabled(au.isEnabled());
                    }
                    return resp;
                })
                .collect(Collectors.toList());
        return ApiResponse.success("Danh sách người dùng", users);
    }

    public ApiResponse<com.bookstore.user.dto.response.UserResponse> getUserById(int id) {
        User user = userRepository.findById(id)
                .orElse(null);
        if (user == null) return ApiResponse.error("Người dùng không tồn tại!");
        com.bookstore.user.dto.response.UserResponse resp = toResponse(user);
        com.bookstore.common.dto.shared.AuthUserDto au = authClient.getAuthUserById(id);
        if (au != null) {
            resp.setUsername(au.getUsername());
            resp.setEnabled(au.isEnabled());
        }
        return ApiResponse.success("OK", resp);
    }

    private com.bookstore.user.dto.response.UserResponse toResponse(User u) {
        return com.bookstore.user.dto.response.UserResponse.builder()
                .idUser(u.getIdUser())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .gender(u.getGender())
                .dateOfBirth(u.getDateOfBirth())
                .deliveryAddress(u.getDeliveryAddress())
                .avatar(u.getAvatar())
                .build();
    }

    public ApiResponse<Void> updateProfile(int userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) return ApiResponse.error("Người dùng không tồn tại!");

        if (isNotBlank(request.getFirstName())) user.setFirstName(request.getFirstName());
        if (isNotBlank(request.getLastName())) user.setLastName(request.getLastName());
        if (isNotBlank(request.getPhoneNumber())) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getDeliveryAddress() != null) user.setDeliveryAddress(request.getDeliveryAddress());
        if (request.getDateOfBirth() != null)
            user.setDateOfBirth(new java.sql.Date(request.getDateOfBirth().getTime()));
        if (isNotBlank(request.getGender()))
            user.setGender(request.getGender().charAt(0));

        userRepository.save(user);
        return ApiResponse.success("Cập nhật thông tin thành công!");
    }

    public ApiResponse<Void> changeAvatar(int userId, ChangeAvatarRequest request) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) return ApiResponse.error("Người dùng không tồn tại!");

        String base64 = request.getAvatar();
        if (!Base64ToMultipartFile.isBase64(base64)) {
            return ApiResponse.error("Dữ liệu ảnh không hợp lệ!");
        }

        // Xóa ảnh cũ
        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            cloudinaryService.deleteImage(user.getAvatar());
        }

        MultipartFile file = Base64ToMultipartFile.convert(base64);
        String avatarUrl = cloudinaryService.uploadImage(file, "User_" + userId);
        user.setAvatar(avatarUrl);
        userRepository.save(user);
        return ApiResponse.success("Đổi avatar thành công!");
    }

    public ApiResponse<List<com.bookstore.user.dto.response.UserResponse>> getUsersByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return ApiResponse.success("Danh sách trống", List.of());
        }
        List<User> users = userRepository.findAllById(ids);
        List<com.bookstore.common.dto.shared.AuthUserDto> authUsers = authClient.getAllAuthUsers();
        Map<Integer, com.bookstore.common.dto.shared.AuthUserDto> authMap = authUsers.stream()
                .collect(Collectors.toMap(com.bookstore.common.dto.shared.AuthUserDto::getId, au -> au, (a, b) -> a));

        List<com.bookstore.user.dto.response.UserResponse> responses = users.stream()
                .map(u -> {
                    com.bookstore.user.dto.response.UserResponse resp = toResponse(u);
                    com.bookstore.common.dto.shared.AuthUserDto au = authMap.get(u.getIdUser());
                    if (au != null) {
                        resp.setUsername(au.getUsername());
                        resp.setEnabled(au.isEnabled());
                    }
                    return resp;
                })
                .collect(Collectors.toList());
        return ApiResponse.success("OK", responses);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        if (username == null || username.trim().isEmpty()) return false;
        return authClient.getAllAuthUsers().stream()
                .anyMatch(au -> au.getUsername().equalsIgnoreCase(username.trim()));
    }

    private boolean isNotBlank(String s) {
        return s != null && !s.trim().isEmpty();
    }

    public ApiResponse<Void> updateByAdmin(int userId, Map<String, Object> payload) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) return ApiResponse.error("Người dùng không tồn tại!");

        if (payload.containsKey("firstName")) user.setFirstName((String) payload.get("firstName"));
        if (payload.containsKey("lastName")) user.setLastName((String) payload.get("lastName"));
        if (payload.containsKey("phoneNumber")) user.setPhoneNumber((String) payload.get("phoneNumber"));
        if (payload.containsKey("deliveryAddress")) user.setDeliveryAddress((String) payload.get("deliveryAddress"));

        userRepository.save(user);

        if (payload.containsKey("enabled")) {
            boolean enabled = (Boolean) payload.get("enabled");
            authClient.updateStatus(userId, enabled);
        }

        return ApiResponse.success("Cập nhật thành công.");
    }
}
