package com.wasana.wtmms.repository;

import com.wasana.wtmms.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, String> {
    List<InventoryItem> findByTypeContainingIgnoreCase(String type);
    List<InventoryItem> findByStatusNot(InventoryItem.StockStatus status);
}
