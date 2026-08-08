package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.AiDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiService {

    public AiDto.ForecastResponse getForecast() {
        List<AiDto.ForecastPoint> forecastData = List.of(
                new AiDto.ForecastPoint("Wk 1", 820, 810, 880),
                new AiDto.ForecastPoint("Wk 2", 760, 750, 800),
                new AiDto.ForecastPoint("Wk 3", 910, 920, 960),
                new AiDto.ForecastPoint("Wk 4", 870, 860, 910),
                new AiDto.ForecastPoint("Wk 5", null, 940, 990),
                new AiDto.ForecastPoint("Wk 6", null, 1020, 1080),
                new AiDto.ForecastPoint("Wk 7", null, 980, 1040),
                new AiDto.ForecastPoint("Wk 8", null, 1100, 1160)
        );

        List<AiDto.Recommendation> recommendations = List.of(
                new AiDto.Recommendation("Increase Teak Wood Stock", "Demand forecast shows 15% increase over next 4 weeks. Consider ordering 300m³.", "warning"),
                new AiDto.Recommendation("Coconut Timber Critical", "Stock at critical level. Immediate reorder of 150m³ recommended.", "critical"),
                new AiDto.Recommendation("Mahogany Stable", "Demand stable. Current stock sufficient for 6 weeks.", "success"),
                new AiDto.Recommendation("Satin Wood Low", "Approaching reorder threshold. Plan order within 2 weeks.", "info")
        );

        AiDto.ForecastResponse response = new AiDto.ForecastResponse();
        response.setForecastData(forecastData);
        response.setRecommendations(recommendations);
        return response;
    }
}
