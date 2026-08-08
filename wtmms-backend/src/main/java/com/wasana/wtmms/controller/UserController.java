package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.UserDto;
import com.wasana.wtmms.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Users")
public class UserController {

    private final UserService userService;

    // ── Admin: User Management ────────────────────────────────────────────

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<List<UserDto.Response>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID (Admin only)")
    public ResponseEntity<UserDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping("/users")
    @Operation(summary = "Create user (Admin only)")
    public ResponseEntity<UserDto.Response> create(@Valid @RequestBody UserDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user (Admin only)")
    public ResponseEntity<UserDto.Response> update(@PathVariable Long id,
                                                    @Valid @RequestBody UserDto.UpdateRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user (Admin only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Profile (any authenticated user) ─────────────────────────────────

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserDto.Response> getProfile(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.findAll().stream()
                .filter(u -> u.getEmail().equals(principal.getUsername()))
                .findFirst().orElseThrow());
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserDto.Response> updateProfile(@AuthenticationPrincipal UserDetails principal,
                                                           @Valid @RequestBody UserDto.ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(principal.getUsername(), request));
    }

    @PutMapping("/profile/password")
    @Operation(summary = "Change password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal UserDetails principal,
                                                @Valid @RequestBody UserDto.PasswordChangeRequest request) {
        userService.changePassword(principal.getUsername(), request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/profile/preferences")
    @Operation(summary = "Update preferences")
    public ResponseEntity<UserDto.Response> updatePreferences(@AuthenticationPrincipal UserDetails principal,
                                                               @RequestBody UserDto.PreferencesRequest request) {
        return ResponseEntity.ok(userService.updatePreferences(principal.getUsername(), request));
    }

    @PatchMapping("/profile/2fa")
    @Operation(summary = "Toggle 2FA")
    public ResponseEntity<UserDto.Response> toggleTwoFa(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.toggleTwoFa(principal.getUsername()));
    }
}
