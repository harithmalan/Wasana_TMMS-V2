package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.AuthDto;
import com.wasana.wtmms.dto.UserDto;
import com.wasana.wtmms.entity.User;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.UserRepository;
import com.wasana.wtmms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EntityMapper mapper;

    @Transactional
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return new AuthDto.LoginResponse(token, mapper.toUserResponse(user));
    }
}
