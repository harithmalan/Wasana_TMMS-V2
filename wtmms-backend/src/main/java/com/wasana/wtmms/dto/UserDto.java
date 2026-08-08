package com.wasana.wtmms.dto;

import com.wasana.wtmms.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class UserDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        @NotBlank private String password;
        @NotNull private User.Role role;
        @NotNull private User.UserStatus status;
        private String phone;
        private String department;
    }

    @Data
    public static class UpdateRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        @NotNull private User.Role role;
        @NotNull private User.UserStatus status;
        private String phone;
        private String department;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String email;
        private User.Role role;
        private User.UserStatus status;
        private String lastLogin;
        private String avatar;
        private String phone;
        private String department;
        private LocalDateTime createdAt;
    }

    @Data
    public static class ProfileUpdateRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        private String phone;
        private String department;
        private String language;
        private String timezone;
        private String dateFormat;
        private String currency;
    }

    @Data
    public static class PasswordChangeRequest {
        @NotBlank private String currentPassword;
        @NotBlank private String newPassword;
        @NotBlank private String confirmPassword;
    }

    @Data
    public static class PreferencesRequest {
        private boolean emailNotifications;
        private boolean lowStockAlerts;
        private boolean weeklyReports;
        private boolean aiForecastUpdates;
        private String language;
        private String timezone;
        private String dateFormat;
        private String currency;
    }
}
