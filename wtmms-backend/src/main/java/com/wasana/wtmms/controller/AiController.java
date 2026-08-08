package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.AiDto;
import com.wasana.wtmms.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "AI Forecasting")
public class AiController {

    private final AiService aiService;

    @GetMapping("/forecast")
    @Operation(summary = "Get AI demand forecast and recommendations")
    public ResponseEntity<AiDto.ForecastResponse> getForecast() {
        return ResponseEntity.ok(aiService.getForecast());
    }
}
