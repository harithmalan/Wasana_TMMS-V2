package com.wasana.wtmms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wasana.wtmms.dto.AuthDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void shouldReturnTokenWhenCredentialsAreValid() throws Exception {
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("premasiri@wasana.lk");
        request.setPassword("password");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("premasiri@wasana.lk"))
                .andExpect(jsonPath("$.user.role").value("Admin"));
    }

    @Test
    public void shouldReturnUnauthorizedWhenPasswordIsInvalid() throws Exception {
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("premasiri@wasana.lk");
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void shouldReturnUnauthorizedWhenEmailIsInvalid() throws Exception {
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("invalid@wasana.lk");
        request.setPassword("password");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
