package com.wasana.wtmms.dto;

import com.wasana.wtmms.entity.Supplier;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SupplierDto {

    @Data
    public static class Request {
        @NotBlank private String name;
        @NotBlank private String country;
        @NotBlank private String contact;
        @NotBlank @Email private String email;
        @NotBlank private String phone;
        @NotNull @DecimalMin("0.0") @DecimalMax("5.0") private Double rating;
        @NotNull @Min(0) @Max(100) private Integer onTime;
        @NotBlank private String materials;
        private LocalDate lastOrder;
        @NotNull private Supplier.SupplierStatus status;
    }

    @Data
    public static class SummaryResponse {
        private double avgRating;
        private int avgOnTime;
        private int activeCount;
        private int totalCount;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String country;
        private String contact;
        private String email;
        private String phone;
        private Double rating;
        private Integer onTime;
        private String materials;
        private LocalDate lastOrder;
        private Supplier.SupplierStatus status;
        private LocalDateTime createdAt;
    }
}
