package com.wasana.wtmms.util;

import com.wasana.wtmms.entity.*;
import com.wasana.wtmms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }
        log.info("Seeding database...");
        seedUsers();
        seedInventory();
        seedCustomers();
        seedSuppliers();
        seedOrders();
        seedNotifications();
        log.info("Database seeding complete.");
    }

    private void seedUsers() {
        userRepository.saveAll(List.of(
            buildUser("M.R. Premasiri", "premasiri@wasana.lk", "password", User.Role.Admin, "MP"),
            buildUser("Nuwan Perera", "nuwan@wasana.lk", "password", User.Role.BusinessOwner, "NP"),
            buildUser("Sandun Jayasinghe", "sandun@wasana.lk", "password", User.Role.InventoryManager, "SJ"),
            buildUser("Isuru Fernando", "isuru@wasana.lk", "password", User.Role.SalesManager, "IF"),
            buildUser("Malith Rathnayake", "malith@wasana.lk", "password", User.Role.InventoryManager, "MR")
        ));
    }

    private User buildUser(String name, String email, String password, User.Role role, String avatar) {
        return User.builder()
                .name(name).email(email)
                .password(passwordEncoder.encode(password))
                .role(role).status(User.UserStatus.Active)
                .avatar(avatar).lastLogin(LocalDateTime.now())
                .build();
    }

    private void seedInventory() {
        inventoryRepository.saveAll(List.of(
            inv("TK-001", "Teak Wood", "Grade A", 1240, "m³", 7000, InventoryItem.StockStatus.InStock, "Bay A-1", 200),
            inv("MH-002", "Mahogany Timber", "Grade A+", 980, "m³", 3000, InventoryItem.StockStatus.InStock, "Bay B-2", 300),
            inv("JW-003", "Jack Wood", "Grade A", 650, "m³", 9000, InventoryItem.StockStatus.InStock, "Bay A-3", 150),
            inv("SW-004", "Satin Wood", "Grade A+", 85, "m³", 15000, InventoryItem.StockStatus.LowStock, "Bay C-1", 100),
            inv("CT-005", "Coconut Timber", "Grade B", 42, "m³", 15000, InventoryItem.StockStatus.Critical, "Bay C-2", 80)
        ));
    }

    private InventoryItem inv(String id, String type, String grade, int qty, String unit,
                               long price, InventoryItem.StockStatus status, String location, int reorder) {
        return InventoryItem.builder().id(id).type(type).grade(grade).qty(qty).unit(unit)
                .price(BigDecimal.valueOf(price)).status(status).location(location).reorder(reorder).build();
    }

    private void seedCustomers() {
        customerRepository.saveAll(List.of(
            cust("Nimal Perera", "nimal@perera.lk", "077 456 7890", "Colombo 07", 42, 2840000, 5, Customer.Segment.Premium),
            cust("Kasun Fernando", "kasun@fernando.lk", "071 345 6789", "Kurunegala", 28, 1560000, 4, Customer.Segment.Regular),
            cust("Chamara Silva", "chamara@silva.lk", "076 234 5678", "Galle", 61, 4120000, 5, Customer.Segment.Premium),
            cust("Sahan Jayawardena", "sahan@jay.lk", "075 654 3210", "Matara", 15, 680000, 3, Customer.Segment.New),
            cust("Dilshan Wijesinghe", "dilshan@wije.lk", "077 456 7890", "Kandy", 33, 1950000, 4, Customer.Segment.Regular)
        ));
    }

    private Customer cust(String name, String email, String phone, String city,
                           int orders, long spend, int rating, Customer.Segment segment) {
        return Customer.builder().name(name).contact(name).email(email).phone(phone).city(city)
                .totalOrders(orders).totalSpend(BigDecimal.valueOf(spend))
                .rating(rating).segment(segment).build();
    }

    private void seedSuppliers() {
        supplierRepository.saveAll(List.of(
            supp("Ruhunu Wood Suppliers", "M.R. Premasiri", "info@ruhunuwood.lk", "077 456 7890", 4.8, 96, "Teak Wood, Jack Wood", "2026-07-28", Supplier.SupplierStatus.Active),
            supp("Kandy Timber Traders", "Nuwan Perera", "info@kandytimber.lk", "071 345 6789", 4.5, 91, "Mahogany, Satin Wood", "2026-08-02", Supplier.SupplierStatus.Active),
            supp("Lanka Timber Solutions", "Sandun Jayasinghe", "info@lankatimber.lk", "076 234 5678", 4.2, 88, "Coconut Timber, Teak Wood", "2026-07-15", Supplier.SupplierStatus.Active),
            supp("Southern Timber Suppliers", "Isuru Fernando", "info@southerntimber.lk", "075 654 3210", 4.6, 93, "Jack Wood, Mahogany", "2026-07-20", Supplier.SupplierStatus.Inactive)
        ));
    }

    private Supplier supp(String name, String contact, String email, String phone,
                           double rating, int onTime, String materials, String lastOrder, Supplier.SupplierStatus status) {
        return Supplier.builder().name(name).country("Sri Lanka").contact(contact).email(email).phone(phone)
                .rating(rating).onTime(onTime).materials(materials)
                .lastOrder(LocalDate.parse(lastOrder)).status(status).build();
    }

    private void seedOrders() {
        orderRepository.saveAll(List.of(
            order("ORD001", "Nimal Perera", "Teak Wood 50m³, Jack Wood 20m³", 35000, "2026-07-04", Order.OrderStatus.Delivered, Order.PaymentStatus.Paid),
            order("ORD002", "Chamara Silva", "Mahogany Timber 30m³", 68500, "2026-07-04", Order.OrderStatus.Processing, Order.PaymentStatus.Partial),
            order("ORD003", "Kasun Fernando", "Jack Wood 40m³, Coconut Timber 20m³", 27000, "2026-07-03", Order.OrderStatus.Shipped, Order.PaymentStatus.Paid),
            order("ORD004", "Sahan Jayawardena", "Satin Wood 15m³", 22500, "2026-07-03", Order.OrderStatus.Pending, Order.PaymentStatus.Unpaid),
            order("ORD005", "Dilshan Wijesinghe", "Teak Wood 80m³", 56000, "2026-07-02", Order.OrderStatus.Delivered, Order.PaymentStatus.Paid),
            order("ORD006", "Nimal Perera", "Coconut Timber 30m³, Mahogany 15m³", 37500, "2026-07-01", Order.OrderStatus.Processing, Order.PaymentStatus.Partial)
        ));
    }

    private Order order(String id, String customer, String items, long amount,
                        String date, Order.OrderStatus status, Order.PaymentStatus payment) {
        return Order.builder().id(id).customer(customer).items(items)
                .amount(BigDecimal.valueOf(amount)).date(LocalDate.parse(date))
                .status(status).payment(payment).build();
    }

    private void seedNotifications() {
        User admin = userRepository.findByEmail("premasiri@wasana.lk").orElse(null);
        if (admin == null) return;
        notificationRepository.saveAll(List.of(
            notif(admin, "critical", "Critical Stock Alert", "Coconut Timber (CT-005) stock at 42 m³ — below reorder point of 80 m³", false),
            notif(admin, "warning", "Low Stock Warning", "Satin Wood (SW-004) stock at 85 m³ — approaching reorder threshold", false),
            notif(admin, "success", "Order Delivered", "ORD005 delivered to Dilshan Wijesinghe", false),
            notif(admin, "info", "New Order Received", "ORD001 from Nimal Perera worth Rs. 35,000", true),
            notif(admin, "info", "Supplier Shipment", "Kandy Timber Traders shipment #KTT-4821 arriving 05/07/2026", true),
            notif(admin, "success", "Payment Received", "Rs. 56,000 received from Dilshan Wijesinghe", true),
            notif(admin, "warning", "Monthly Report Ready", "June 2026 financial report has been generated", true),
            notif(admin, "info", "AI Forecast Updated", "Demand forecast for July 2026 has been recalculated", true)
        ));
    }

    private Notification notif(User user, String type, String title, String message, boolean read) {
        return Notification.builder().user(user).type(type).title(title).message(message).read(read).build();
    }
}
