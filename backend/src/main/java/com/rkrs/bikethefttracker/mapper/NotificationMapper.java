package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.NotificationResponse;
import com.rkrs.bikethefttracker.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toNotificationResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getTheftReport().getId());
    }
}
