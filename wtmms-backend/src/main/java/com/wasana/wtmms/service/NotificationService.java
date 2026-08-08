package com.wasana.wtmms.service;

import com.wasana.wtmms.dto.NotificationDto;
import com.wasana.wtmms.entity.Notification;
import com.wasana.wtmms.entity.User;
import com.wasana.wtmms.exception.ResourceNotFoundException;
import com.wasana.wtmms.mapper.EntityMapper;
import com.wasana.wtmms.repository.NotificationRepository;
import com.wasana.wtmms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public List<NotificationDto.Response> findAll(String email) {
        User user = getUser(email);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(mapper::toNotificationResponse).toList();
    }

    public Map<String, Object> getUnreadCount(String email) {
        User user = getUser(email);
        return Map.of("count", notificationRepository.countByUserAndReadFalse(user));
    }

    @Transactional
    public NotificationDto.Response markAsRead(Long id, String email) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        notification.setRead(true);
        return mapper.toNotificationResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllRead(String email) {
        User user = getUser(email);
        notificationRepository.markAllReadByUser(user);
    }

    @Transactional
    public void createSystemNotification(String type, String title, String message) {
        List<User> users = userRepository.findAll();
        List<Notification> notifications = users.stream().map(u -> {
            Notification n = new Notification();
            n.setType(type);
            n.setTitle(title);
            n.setMessage(message);
            n.setUser(u);
            n.setRead(false);
            return n;
        }).toList();
        notificationRepository.saveAll(notifications);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
