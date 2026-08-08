package com.wasana.wtmms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(length = 10)
    private String avatar;

    @Column(name = "phone")
    private String phone;

    @Column(name = "department")
    private String department;

    @Column(name = "two_fa_enabled")
    private boolean twoFaEnabled;

    @Column(name = "email_notifications")
    private boolean emailNotifications = true;

    @Column(name = "low_stock_alerts")
    private boolean lowStockAlerts = true;

    @Column(name = "weekly_reports")
    private boolean weeklyReports = true;

    @Column(name = "ai_forecast_updates")
    private boolean aiForecastUpdates = true;

    @Column(name = "language")
    private String language = "Sinhala / English (Sri Lanka)";

    @Column(name = "timezone")
    private String timezone = "Asia/Colombo (UTC+5:30)";

    @Column(name = "date_format")
    private String dateFormat = "DD/MM/YYYY";

    @Column(name = "currency")
    private String currency = "Sri Lankan Rupee (Rs./LKR)";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (avatar == null && name != null) {
            avatar = name.chars()
                .filter(c -> c == ' ' || name.indexOf(c) == 0)
                .limit(2)
                .collect(StringBuilder::new, (sb, c) -> sb.append((char) c), StringBuilder::append)
                .toString().toUpperCase();
            String[] parts = name.split(" ");
            StringBuilder sb = new StringBuilder();
            for (String p : parts) if (!p.isEmpty()) sb.append(p.charAt(0));
            avatar = sb.toString().toUpperCase();
            if (avatar.length() > 2) avatar = avatar.substring(0, 2);
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return status == UserStatus.Active; }

    public enum Role { Admin, BusinessOwner, InventoryManager, SalesManager }
    public enum UserStatus { Active, Inactive }
}
