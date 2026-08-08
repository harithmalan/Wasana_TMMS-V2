package com.wasana.wtmms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String type = "Bearer";
        private UserDto.Response user;

        public LoginResponse(String token, UserDto.Response user) {
            this.token = token;
            this.user = user;
        }
    }
}
