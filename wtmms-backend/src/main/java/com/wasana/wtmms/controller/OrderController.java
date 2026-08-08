package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.OrderDto;
import com.wasana.wtmms.entity.Order;
import com.wasana.wtmms.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Orders / Sales")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<OrderDto.Response>> getAll(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(orderService.findAll(search));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get sales summary cards")
    public ResponseEntity<OrderDto.SummaryResponse> getSummary() {
        return ResponseEntity.ok(orderService.getSummary());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create order")
    public ResponseEntity<OrderDto.Response> create(@Valid @RequestBody OrderDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update order")
    public ResponseEntity<OrderDto.Response> update(@PathVariable String id,
                                                     @Valid @RequestBody OrderDto.Request request) {
        return ResponseEntity.ok(orderService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderDto.Response> updateStatus(@PathVariable String id,
                                                           @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete / cancel order")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
