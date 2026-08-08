package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.NotificationDto;
import com.wasana.wtmms.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get all notifications for current user")
    public ResponseEntity<List<NotificationDto.Response>> getAll(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(notificationService.findAll(principal.getUsername()));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(notificationService.getUnreadCount(principal.getUsername()));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<NotificationDto.Response> markAsRead(@PathVariable Long id,
                                                                @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(notificationService.markAsRead(id, principal.getUsername()));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal UserDetails principal) {
        notificationService.markAllRead(principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
