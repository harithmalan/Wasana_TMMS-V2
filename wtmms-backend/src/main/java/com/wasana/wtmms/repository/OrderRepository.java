package com.wasana.wtmms.repository;

import com.wasana.wtmms.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomerContainingIgnoreCaseOrIdContainingIgnoreCase(String customer, String id);

    @Query("SELECT COALESCE(SUM(o.amount), 0) FROM Order o")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.amount), 0) FROM Order o WHERE o.payment <> 'Paid'")
    BigDecimal sumPendingPayments();

    long countByPaymentNot(Order.PaymentStatus payment);
}
