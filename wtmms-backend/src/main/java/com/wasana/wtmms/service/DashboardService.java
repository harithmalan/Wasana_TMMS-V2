package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.DashboardDto;
import com.wasana.wtmms.dto.NotificationDto;
import com.wasana.wtmms.entity.InventoryItem;
import com.wasana.wtmms.entity.Notification;
import com.wasana.wtmms.entity.User;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public DashboardDto.DashboardResponse getDashboard(String email) {
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        long totalCustomers = customerRepository.count();
        long totalInventory = inventoryRepository.count();

        List<DashboardDto.StatCard> statCards = List.of(
                new DashboardDto.StatCard("Total Revenue", "Rs. " + totalRevenue.toPlainString(), "All time"),
                new DashboardDto.StatCard("Total Orders", String.valueOf(totalOrders), "All orders"),
                new DashboardDto.StatCard("Customers", String.valueOf(totalCustomers), "Registered"),
                new DashboardDto.StatCard("Inventory Items", String.valueOf(totalInventory), "In system")
        );

        List<DashboardDto.RevenuePoint> revenueData = List.of(
                new DashboardDto.RevenuePoint("Jan", bd(420000), bd(280000), bd(140000)),
                new DashboardDto.RevenuePoint("Feb", bd(380000), bd(240000), bd(140000)),
                new DashboardDto.RevenuePoint("Mar", bd(550000), bd(310000), bd(240000)),
                new DashboardDto.RevenuePoint("Apr", bd(610000), bd(350000), bd(260000)),
                new DashboardDto.RevenuePoint("May", bd(490000), bd(290000), bd(200000)),
                new DashboardDto.RevenuePoint("Jun", bd(720000), bd(400000), bd(320000)),
                new DashboardDto.RevenuePoint("Jul", bd(680000), bd(380000), bd(300000)),
                new DashboardDto.RevenuePoint("Aug", bd(840000), bd(440000), bd(400000))
        );

        List<DashboardDto.StockMixPoint> stockMix = inventoryRepository.findAll().stream()
                .map(i -> new DashboardDto.StockMixPoint(
                        i.getType(), i.getQty(),
                        i.getPrice().multiply(BigDecimal.valueOf(i.getQty()))))
                .toList();

        User user = userRepository.findByEmail(email).orElse(null);
        List<NotificationDto.Response> alerts = user != null
                ? notificationRepository.findByUserAndReadFalse(user).stream()
                        .map(mapper::toNotificationResponse).limit(5).toList()
                : List.of();

        DashboardDto.DashboardResponse response = new DashboardDto.DashboardResponse();
        response.setStatCards(statCards);
        response.setRevenueData(revenueData);
        response.setStockMix(stockMix);
        response.setRecentAlerts(alerts);
        return response;
    }

    private BigDecimal bd(long value) { return BigDecimal.valueOf(value); }
}
