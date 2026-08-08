package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.ReportDto;
import com.wasana.wtmms.repository.InventoryRepository;
import com.wasana.wtmms.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;

    public ReportDto.ReportsResponse getReports() {
        List<ReportDto.RevenueReport> revenueData = List.of(
                new ReportDto.RevenueReport("Jan", bd(420000), bd(280000), bd(140000)),
                new ReportDto.RevenueReport("Feb", bd(380000), bd(240000), bd(140000)),
                new ReportDto.RevenueReport("Mar", bd(550000), bd(310000), bd(240000)),
                new ReportDto.RevenueReport("Apr", bd(610000), bd(350000), bd(260000)),
                new ReportDto.RevenueReport("May", bd(490000), bd(290000), bd(200000)),
                new ReportDto.RevenueReport("Jun", bd(720000), bd(400000), bd(320000)),
                new ReportDto.RevenueReport("Jul", bd(680000), bd(380000), bd(300000)),
                new ReportDto.RevenueReport("Aug", bd(840000), bd(440000), bd(400000))
        );

        List<ReportDto.StockReport> stockData = inventoryRepository.findAll().stream()
                .map(i -> new ReportDto.StockReport(
                        i.getType(), i.getQty(),
                        i.getPrice().multiply(BigDecimal.valueOf(i.getQty()))))
                .toList();

        List<ReportDto.SalesReport> salesData = List.of(
                new ReportDto.SalesReport("Q1 2026", 45, bd(1350000)),
                new ReportDto.SalesReport("Q2 2026", 62, bd(1820000)),
                new ReportDto.SalesReport("Q3 2026", 38, bd(1140000))
        );

        ReportDto.ReportsResponse response = new ReportDto.ReportsResponse();
        response.setRevenueData(revenueData);
        response.setStockData(stockData);
        response.setSalesData(salesData);
        return response;
    }

    private BigDecimal bd(long value) { return BigDecimal.valueOf(value); }
}
