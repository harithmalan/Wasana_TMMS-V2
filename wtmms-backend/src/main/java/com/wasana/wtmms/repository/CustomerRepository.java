package com.wasana.wtmms.repository;

import com.wasana.wtmms.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(String name, String city);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
}
