package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.UserDto;
import com.wasana.wtmms.entity.User;
import com.wasana.wtmms.exception.DuplicateResourceException;
import com.wasana.wtmms.exception.ResourceNotFoundException;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityMapper mapper;

    public List<UserDto.Response> findAll() {
        return userRepository.findAll().stream().map(mapper::toUserResponse).toList();
    }

    public UserDto.Response findById(Long id) {
        return mapper.toUserResponse(getOrThrow(id));
    }

    @Transactional
    public UserDto.Response create(UserDto.CreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(request.getStatus())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .build();
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserDto.Response update(Long id, UserDto.UpdateRequest request) {
        User user = getOrThrow(id);
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User not found: " + id);
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDto.Response updateProfile(String email, UserDto.ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        if (request.getLanguage() != null) user.setLanguage(request.getLanguage());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone());
        if (request.getDateFormat() != null) user.setDateFormat(request.getDateFormat());
        if (request.getCurrency() != null) user.setCurrency(request.getCurrency());
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String email, UserDto.PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new IllegalArgumentException("Current password is incorrect");
        if (!request.getNewPassword().equals(request.getConfirmPassword()))
            throw new IllegalArgumentException("Passwords do not match");
        if (request.getNewPassword().length() < 6)
            throw new IllegalArgumentException("Password must be at least 6 characters");
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserDto.Response updatePreferences(String email, UserDto.PreferencesRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEmailNotifications(request.isEmailNotifications());
        user.setLowStockAlerts(request.isLowStockAlerts());
        user.setWeeklyReports(request.isWeeklyReports());
        user.setAiForecastUpdates(request.isAiForecastUpdates());
        if (request.getLanguage() != null) user.setLanguage(request.getLanguage());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone());
        if (request.getDateFormat() != null) user.setDateFormat(request.getDateFormat());
        if (request.getCurrency() != null) user.setCurrency(request.getCurrency());
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserDto.Response toggleTwoFa(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setTwoFaEnabled(!user.isTwoFaEnabled());
        return mapper.toUserResponse(userRepository.save(user));
    }

    private User getOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}
