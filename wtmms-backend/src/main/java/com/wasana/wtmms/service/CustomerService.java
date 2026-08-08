package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.CustomerDto;
import com.wasana.wtmms.entity.Customer;
import com.wasana.wtmms.exception.DuplicateResourceException;
import com.wasana.wtmms.exception.ResourceNotFoundException;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final EntityMapper mapper;
    private final NotificationService notificationService;

    public List<CustomerDto.Response> findAll(String search) {
        List<Customer> customers = (search != null && !search.isBlank())
                ? customerRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(search, search)
                : customerRepository.findAll();
        return customers.stream().map(mapper::toCustomerResponse).toList();
    }

    public CustomerDto.Response findById(Long id) {
        return mapper.toCustomerResponse(getOrThrow(id));
    }

    @Transactional
    public CustomerDto.Response create(CustomerDto.Request request) {
        if (customerRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
            
        Customer saved = customerRepository.save(mapper.toCustomer(request));
        
        notificationService.createSystemNotification("success", "New Customer Added", 
                "Customer " + request.getName() + " from " + request.getCity() + " has been registered.");
                
        return mapper.toCustomerResponse(saved);
    }

    @Transactional
    public CustomerDto.Response update(Long id, CustomerDto.Request request) {
        Customer customer = getOrThrow(id);
        if (customerRepository.existsByEmailAndIdNot(request.getEmail(), id))
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        customer.setName(request.getName());
        customer.setContact(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setCity(request.getCity());
        customer.setRating(request.getRating());
        customer.setSegment(request.getSegment());
        return mapper.toCustomerResponse(customerRepository.save(customer));
    }

    @Transactional
    public void delete(Long id) {
        if (!customerRepository.existsById(id)) throw new ResourceNotFoundException("Customer not found: " + id);
        customerRepository.deleteById(id);
    }

    private Customer getOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }
}
