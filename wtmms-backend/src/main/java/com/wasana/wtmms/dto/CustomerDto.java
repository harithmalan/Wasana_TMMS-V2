package com.wasana.wtmms.dto;

import com.wasana.wtmms.entity.Customer;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CustomerDto {

    @Data
    public static class Request {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        @NotBlank private String phone;
        @NotBlank private String city;
        @NotNull @Min(1) @Max(5) private Integer rating;
        @NotNull private Customer.Segment segment;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String contact;
        private String email;
        private String phone;
        private String city;
        private Integer totalOrders;
        private BigDecimal totalSpend;
        private Integer rating;
        private Customer.Segment segment;
        private LocalDateTime createdAt;
    }
}
