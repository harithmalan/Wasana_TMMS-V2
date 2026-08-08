package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.InventoryDto;
import com.wasana.wtmms.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get all inventory items")
    public ResponseEntity<List<InventoryDto.Response>> getAll(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(inventoryService.findAll(search));
    }

    @GetMapping("/alerts")
    @Operation(summary = "Get low stock and critical items")
    public ResponseEntity<List<InventoryDto.Response>> getAlerts() {
        return ResponseEntity.ok(inventoryService.findAlerts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get inventory item by ID")
    public ResponseEntity<InventoryDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(inventoryService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create inventory item")
    public ResponseEntity<InventoryDto.Response> create(@Valid @RequestBody InventoryDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update inventory item")
    public ResponseEntity<InventoryDto.Response> update(@PathVariable String id,
                                                         @Valid @RequestBody InventoryDto.Request request) {
        return ResponseEntity.ok(inventoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete inventory item")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
