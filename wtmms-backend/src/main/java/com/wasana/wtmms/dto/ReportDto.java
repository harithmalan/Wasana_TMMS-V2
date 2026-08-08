package com.wasana.wtmms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class ReportDto {

    @Data @AllArgsConstructor
    public static class RevenueReport {
        private String month;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal profit;
    }

    @Data @AllArgsConstructor
    public static class StockReport {
        private String type;
        private Integer qty;
        private BigDecimal value;
    }

    @Data @AllArgsConstructor
    public static class SalesReport {
        private String period;
        private long orderCount;
        private BigDecimal totalRevenue;
    }

    @Data
    public static class ReportsResponse {
        private List<RevenueReport> revenueData;
        private List<StockReport> stockData;
        private List<SalesReport> salesData;
    }
}
