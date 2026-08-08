package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.InventoryDto;
import com.wasana.wtmms.entity.InventoryItem;
import com.wasana.wtmms.exception.ResourceNotFoundException;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final EntityMapper mapper;
    private final NotificationService notificationService;

    public List<InventoryDto.Response> findAll(String search) {
        List<InventoryItem> items = (search != null && !search.isBlank())
                ? inventoryRepository.findByTypeContainingIgnoreCase(search)
                : inventoryRepository.findAll();
        return items.stream().map(mapper::toInventoryResponse).toList();
    }

    public InventoryDto.Response findById(String id) {
        return mapper.toInventoryResponse(getOrThrow(id));
    }

    public List<InventoryDto.Response> findAlerts() {
        return inventoryRepository.findByStatusNot(InventoryItem.StockStatus.InStock)
                .stream().map(mapper::toInventoryResponse).toList();
    }

    @Transactional
    public InventoryDto.Response create(InventoryDto.Request request) {
        long count = inventoryRepository.count();
        String id = String.format("IT-%03d", count + 1);
        while (inventoryRepository.existsById(id)) {
            count++;
            id = String.format("IT-%03d", count + 1);
        }
        InventoryItem item = mapper.toInventoryItem(request);
        item.setId(id);
        item.setStatus(calcStatus(request.getQty(), request.getReorder()));
        InventoryItem saved = inventoryRepository.save(item);
        
        notificationService.createSystemNotification("info", "New Inventory Item", 
                "Added " + request.getQty() + " " + request.getUnit() + " of " + request.getType() + " (" + id + ")");
                
        return mapper.toInventoryResponse(saved);
    }

    @Transactional
    public InventoryDto.Response update(String id, InventoryDto.Request request) {
        InventoryItem item = getOrThrow(id);
        item.setType(request.getType());
        item.setGrade(request.getGrade());
        item.setQty(request.getQty());
        item.setUnit(request.getUnit());
        item.setPrice(request.getPrice());
        item.setLocation(request.getLocation());
        item.setReorder(request.getReorder());
        InventoryItem.StockStatus newStatus = calcStatus(request.getQty(), request.getReorder());
        item.setStatus(newStatus);
        InventoryItem saved = inventoryRepository.save(item);
        
        if (newStatus == InventoryItem.StockStatus.Critical) {
            notificationService.createSystemNotification("critical", "Critical Stock Alert", 
                    request.getType() + " stock is critical (" + request.getQty() + " " + request.getUnit() + " remaining).");
        } else if (newStatus == InventoryItem.StockStatus.LowStock) {
            notificationService.createSystemNotification("warning", "Low Stock Alert", 
                    request.getType() + " stock is low (" + request.getQty() + " " + request.getUnit() + " remaining).");
        }
        
        return mapper.toInventoryResponse(saved);
    }

    @Transactional
    public void delete(String id) {
        if (!inventoryRepository.existsById(id)) throw new ResourceNotFoundException("Item not found: " + id);
        inventoryRepository.deleteById(id);
    }

    private InventoryItem.StockStatus calcStatus(int qty, int reorder) {
        if (qty <= reorder * 0.5) return InventoryItem.StockStatus.Critical;
        if (qty <= reorder) return InventoryItem.StockStatus.LowStock;
        return InventoryItem.StockStatus.InStock;
    }

    private InventoryItem getOrThrow(String id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + id));
    }
}
