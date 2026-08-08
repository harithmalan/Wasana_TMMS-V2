package com.wasana.wtmms.dto;

import com.wasana.wtmms.entity.Order;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class OrderDto {

    @Data
    public static class Request {
        @NotBlank private String customer;
        @NotBlank private String items;
        @NotNull @DecimalMin("0.01") private BigDecimal amount;
        @NotNull private LocalDate date;
        @NotNull private Order.OrderStatus status;
        @NotNull private Order.PaymentStatus payment;
    }

    @Data
    public static class Response {
        private String id;
        private String customer;
        private String items;
        private BigDecimal amount;
        private LocalDate date;
        private Order.OrderStatus status;
        private Order.PaymentStatus payment;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class SummaryResponse {
        private long totalOrders;
        private BigDecimal totalRevenue;
        private BigDecimal pendingPayments;
        private long pendingPaymentCount;
        private BigDecimal avgOrderValue;
    }
}
