package com.wasana.wtmms.config;

import com.wasana.wtmms.repository.UserRepository;
import com.wasana.wtmms.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserRepository userRepository;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/error").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/dashboard/**").hasAnyRole("Admin", "BusinessOwner", "InventoryManager", "SalesManager")
                .requestMatchers(HttpMethod.GET, "/api/inventory/**").hasAnyRole("Admin", "BusinessOwner", "InventoryManager")
                .requestMatchers("/api/inventory/**").hasAnyRole("Admin", "InventoryManager")
                .requestMatchers(HttpMethod.GET, "/api/suppliers/**").hasAnyRole("Admin", "BusinessOwner", "InventoryManager")
                .requestMatchers("/api/suppliers/**").hasAnyRole("Admin", "InventoryManager")
                .requestMatchers(HttpMethod.GET, "/api/customers/**").hasAnyRole("Admin", "BusinessOwner", "SalesManager")
                .requestMatchers("/api/customers/**").hasAnyRole("Admin", "SalesManager")
                .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyRole("Admin", "BusinessOwner", "SalesManager")
                .requestMatchers("/api/orders/**").hasAnyRole("Admin", "SalesManager")
                .requestMatchers(HttpMethod.GET, "/api/reports/**").hasAnyRole("Admin", "BusinessOwner", "InventoryManager", "SalesManager")
                .requestMatchers(HttpMethod.GET, "/api/ai/**").hasAnyRole("Admin", "BusinessOwner", "InventoryManager", "SalesManager")
                .requestMatchers("/api/users/**").hasRole("Admin")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
