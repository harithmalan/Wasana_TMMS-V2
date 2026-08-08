package com.wasana.wtmms.controller;

import com.wasana.wtmms.dto.SupplierDto;
import com.wasana.wtmms.service.SupplierService;
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
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    @Operation(summary = "Get all suppliers")
    public ResponseEntity<List<SupplierDto.Response>> getAll(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(supplierService.findAll(search));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get supplier performance summary")
    public ResponseEntity<SupplierDto.SummaryResponse> getSummary() {
        return ResponseEntity.ok(supplierService.getSummary());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get supplier by ID")
    public ResponseEntity<SupplierDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create supplier")
    public ResponseEntity<SupplierDto.Response> create(@Valid @RequestBody SupplierDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update supplier")
    public ResponseEntity<SupplierDto.Response> update(@PathVariable Long id,
                                                        @Valid @RequestBody SupplierDto.Request request) {
        return ResponseEntity.ok(supplierService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete supplier")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
