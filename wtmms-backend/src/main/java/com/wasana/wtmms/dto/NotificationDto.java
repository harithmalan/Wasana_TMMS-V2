package com.wasana.wtmms.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class NotificationDto {

    @Data
    public static class Response {
        private Long id;
        private String type;
        private String title;
        private String message;
        private boolean read;
        private LocalDateTime createdAt;
    }
}
