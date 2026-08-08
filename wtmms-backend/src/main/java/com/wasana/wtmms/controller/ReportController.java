package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.ReportDto;
import com.wasana.wtmms.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    @Operation(summary = "Get all report data")
    public ResponseEntity<ReportDto.ReportsResponse> getReports() {
        return ResponseEntity.ok(reportService.getReports());
    }
}
