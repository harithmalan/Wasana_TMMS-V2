package com.wasana.wtmms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {

    @Data @AllArgsConstructor
    public static class StatCard {
        private String label;
        private String value;
        private String sub;
    }

    @Data @AllArgsConstructor
    public static class RevenuePoint {
        private String month;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal profit;
    }

    @Data @AllArgsConstructor
    public static class StockMixPoint {
        private String type;
        private Integer qty;
        private BigDecimal value;
    }

    @Data
    public static class DashboardResponse {
        private List<StatCard> statCards;
        private List<RevenuePoint> revenueData;
        private List<StockMixPoint> stockMix;
        private List<NotificationDto.Response> recentAlerts;
    }
}
