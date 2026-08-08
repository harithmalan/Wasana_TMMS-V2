package com.wasana.wtmms.dto;

import com.wasana.wtmms.entity.InventoryItem;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InventoryDto {

    @Data
    public static class Request {
        @NotBlank private String type;
        @NotBlank private String grade;
        @NotNull @Min(0) private Integer qty;
        @NotBlank private String unit;
        @NotNull @DecimalMin("0.01") private BigDecimal price;
        @NotBlank private String location;
        @NotNull @Min(0) private Integer reorder;
    }

    @Data
    public static class Response {
        private String id;
        private String type;
        private String grade;
        private Integer qty;
        private String unit;
        private BigDecimal price;
        private InventoryItem.StockStatus status;
        private String location;
        private Integer reorder;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
