package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.DashboardDto;
import com.wasana.wtmms.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get dashboard data")
    public ResponseEntity<DashboardDto.DashboardResponse> getDashboard(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(dashboardService.getDashboard(principal.getUsername()));
    }
}
