package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.OrderDto;
import com.wasana.wtmms.entity.Order;
import com.wasana.wtmms.exception.ResourceNotFoundException;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final EntityMapper mapper;
    private final NotificationService notificationService;

    public List<OrderDto.Response> findAll(String search) {
        List<Order> orders = (search != null && !search.isBlank())
                ? orderRepository.findByCustomerContainingIgnoreCaseOrIdContainingIgnoreCase(search, search)
                : orderRepository.findAll();
        return orders.stream().map(mapper::toOrderResponse).toList();
    }

    public OrderDto.Response findById(String id) {
        return mapper.toOrderResponse(getOrThrow(id));
    }

    public OrderDto.SummaryResponse getSummary() {
        long total = orderRepository.count();
        BigDecimal revenue = orderRepository.sumTotalRevenue();
        BigDecimal pending = orderRepository.sumPendingPayments();
        long pendingCount = orderRepository.countByPaymentNot(Order.PaymentStatus.Paid);
        BigDecimal avg = total > 0 ? revenue.divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        OrderDto.SummaryResponse summary = new OrderDto.SummaryResponse();
        summary.setTotalOrders(total);
        summary.setTotalRevenue(revenue);
        summary.setPendingPayments(pending);
        summary.setPendingPaymentCount(pendingCount);
        summary.setAvgOrderValue(avg);
        return summary;
    }

    @Transactional
    public OrderDto.Response create(OrderDto.Request request) {
        long count = orderRepository.count();
        String id = String.format("ORD%03d", count + 1);
        while (orderRepository.existsById(id)) {
            count++;
            id = String.format("ORD%03d", count + 1);
        }
        Order order = mapper.toOrder(request);
        order.setId(id);
        Order saved = orderRepository.save(order);
        
        notificationService.createSystemNotification("info", "New Order Created", 
                "Order " + id + " created for " + request.getCustomer() + " (Rs. " + request.getAmount() + ")");
                
        return mapper.toOrderResponse(saved);
    }

    @Transactional
    public OrderDto.Response update(String id, OrderDto.Request request) {
        Order order = getOrThrow(id);
        order.setCustomer(request.getCustomer());
        order.setItems(request.getItems());
        order.setAmount(request.getAmount());
        order.setDate(request.getDate());
        order.setStatus(request.getStatus());
        order.setPayment(request.getPayment());
        return mapper.toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderDto.Response updateStatus(String id, Order.OrderStatus status) {
        Order order = getOrThrow(id);
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        
        String type = (status == Order.OrderStatus.Delivered) ? "success" : "info";
        notificationService.createSystemNotification(type, "Order Status Updated", 
                "Order " + id + " status changed to " + status);
                
        return mapper.toOrderResponse(saved);
    }

    @Transactional
    public void delete(String id) {
        if (!orderRepository.existsById(id)) throw new ResourceNotFoundException("Order not found: " + id);
        orderRepository.deleteById(id);
    }

    private Order getOrThrow(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }
}
