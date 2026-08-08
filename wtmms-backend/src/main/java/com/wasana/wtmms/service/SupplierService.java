package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.SupplierDto;
import com.wasana.wtmms.entity.Supplier;
import com.wasana.wtmms.exception.DuplicateResourceException;
import com.wasana.wtmms.exception.ResourceNotFoundException;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final EntityMapper mapper;
    private final NotificationService notificationService;

    public List<SupplierDto.Response> findAll(String search) {
        List<Supplier> suppliers = (search != null && !search.isBlank())
                ? supplierRepository.findByNameContainingIgnoreCase(search)
                : supplierRepository.findAll();
        return suppliers.stream().map(mapper::toSupplierResponse).toList();
    }

    public SupplierDto.Response findById(Long id) {
        return mapper.toSupplierResponse(getOrThrow(id));
    }

    public SupplierDto.SummaryResponse getSummary() {
        List<Supplier> active = supplierRepository.findByStatus(Supplier.SupplierStatus.Active);
        double avgRating = active.stream().mapToDouble(Supplier::getRating).average().orElse(0);
        double avgOnTime = active.stream().mapToInt(Supplier::getOnTime).average().orElse(0);
        SupplierDto.SummaryResponse summary = new SupplierDto.SummaryResponse();
        summary.setAvgRating(Math.round(avgRating * 10.0) / 10.0);
        summary.setAvgOnTime((int) Math.round(avgOnTime));
        summary.setActiveCount(active.size());
        summary.setTotalCount((int) supplierRepository.count());
        return summary;
    }

    @Transactional
    public SupplierDto.Response create(SupplierDto.Request request) {
        if (supplierRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        Supplier supplier = mapper.toSupplier(request);
        if (supplier.getLastOrder() == null) supplier.setLastOrder(LocalDate.now());
        Supplier saved = supplierRepository.save(supplier);
        
        notificationService.createSystemNotification("success", "New Supplier Registered", 
                "Supplier " + request.getName() + " (" + request.getCountry() + ") has been added.");
                
        return mapper.toSupplierResponse(saved);
    }

    @Transactional
    public SupplierDto.Response update(Long id, SupplierDto.Request request) {
        Supplier supplier = getOrThrow(id);
        if (supplierRepository.existsByEmailAndIdNot(request.getEmail(), id))
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        supplier.setName(request.getName());
        supplier.setCountry(request.getCountry());
        supplier.setContact(request.getContact());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setRating(request.getRating());
        supplier.setOnTime(request.getOnTime());
        supplier.setMaterials(request.getMaterials());
        if (request.getLastOrder() != null) supplier.setLastOrder(request.getLastOrder());
        supplier.setStatus(request.getStatus());
        return mapper.toSupplierResponse(supplierRepository.save(supplier));
    }

    @Transactional
    public void delete(Long id) {
        if (!supplierRepository.existsById(id)) throw new ResourceNotFoundException("Supplier not found: " + id);
        supplierRepository.deleteById(id);
    }

    private Supplier getOrThrow(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }
}
