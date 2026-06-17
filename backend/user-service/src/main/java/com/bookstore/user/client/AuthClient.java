package com.bookstore.user.client;
 
import com.bookstore.common.dto.response.ApiResponse;
import com.bookstore.common.dto.shared.AuthUserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
 
import java.util.Collections;
import java.util.List;
import java.util.Map;
 
@Slf4j
@Component
@RequiredArgsConstructor
public class AuthClient {
 
    private final RestTemplate restTemplate;
 
    @Value("${services.auth-url:http://localhost:8081}")
    private String authUrl;
 
    public List<AuthUserDto> getAllAuthUsers() {
        try {
            String url = authUrl + "/auth/users";
            ResponseEntity<ApiResponse<List<AuthUserDto>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<List<AuthUserDto>>>() {}
            );
            if (response.getBody() != null && response.getBody().isSuccess()) {
                return response.getBody().getData();
            }
        } catch (Exception e) {
            log.error("Failed to fetch all auth users from auth-service: {}", e.getMessage());
        }
        return Collections.emptyList();
    }
 
    public AuthUserDto getAuthUserById(int id) {
        try {
            String url = authUrl + "/auth/users/" + id;
            ResponseEntity<ApiResponse<AuthUserDto>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<AuthUserDto>>() {}
            );
            if (response.getBody() != null && response.getBody().isSuccess()) {
                return response.getBody().getData();
            }
        } catch (Exception e) {
            log.error("Failed to fetch auth user details for id={}: {}", id, e.getMessage());
        }
        return null;
    }
 
    public void updateStatus(int id, boolean enabled) {
        try {
            String url = authUrl + "/auth/users/" + id + "/status";
            restTemplate.put(url, Map.of("enabled", enabled));
        } catch (Exception e) {
            log.error("Failed to update status for auth user id={}: {}", id, e.getMessage());
        }
    }
}
