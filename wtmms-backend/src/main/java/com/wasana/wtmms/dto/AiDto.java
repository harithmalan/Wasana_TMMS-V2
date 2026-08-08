package com.wasana.wtmms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

public class AiDto {

    @Data @AllArgsConstructor
    public static class ForecastPoint {
        private String week;
        private Integer actual;
        private Integer predicted;
        private Integer demand;
    }

    @Data @AllArgsConstructor
    public static class Recommendation {
        private String title;
        private String description;
        private String type;
    }

    @Data
    public static class ForecastResponse {
        private List<ForecastPoint> forecastData;
        private List<Recommendation> recommendations;
    }
}
