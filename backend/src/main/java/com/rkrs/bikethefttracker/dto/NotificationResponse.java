package com.rkrs.bikethefttracker.dto;

import com.rkrs.bikethefttracker.entity.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        NotificationType type,
        boolean read,
        LocalDateTime time,
        UUID theftReport
) {
}
