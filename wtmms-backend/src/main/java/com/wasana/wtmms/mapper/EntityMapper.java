package com.wasana.wtmms.mapper;

import com.wasana.wtmms.dto.*;
import com.wasana.wtmms.entity.*;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EntityMapper {

    @Mapping(target = "lastLogin", expression = "java(formatLastLogin(user.getLastLogin()))")
    UserDto.Response toUserResponse(User user);

    InventoryDto.Response toInventoryResponse(InventoryItem item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    InventoryItem toInventoryItem(InventoryDto.Request request);

    CustomerDto.Response toCustomerResponse(Customer customer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contact", expression = "java(request.getName())")
    @Mapping(target = "totalOrders", constant = "0")
    @Mapping(target = "totalSpend", expression = "java(java.math.BigDecimal.ZERO)")
    @Mapping(target = "createdAt", ignore = true)
    Customer toCustomer(CustomerDto.Request request);

    SupplierDto.Response toSupplierResponse(Supplier supplier);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Supplier toSupplier(SupplierDto.Request request);

    OrderDto.Response toOrderResponse(Order order);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Order toOrder(OrderDto.Request request);

    NotificationDto.Response toNotificationResponse(Notification notification);

    default String formatLastLogin(LocalDateTime dt) {
        if (dt == null) return "Never";
        return dt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
