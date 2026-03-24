package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.NotificationResponse;
import com.rkrs.bikethefttracker.entity.Notification;
import com.rkrs.bikethefttracker.entity.NotificationType;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.exception.NotFoundException;
import com.rkrs.bikethefttracker.mapper.NotificationMapper;
import com.rkrs.bikethefttracker.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationRepository notificationRepository, NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }

    public void createNotification(NotificationType type, User recipient, TheftReport theftReport) {
        Notification notificationToCreate = Notification.builder()
                .type(type)
                .recipient(recipient)
                .theftReport(theftReport)
                .build();

        notificationRepository.save(notificationToCreate);
    }

    public void markAsRead(User user, UUID notificationId) {
        Notification notification = notificationRepository.findByIdAndRecipient(notificationId, user)
                .orElseThrow(() -> new NotFoundException("Notification with id " + notificationId + " not found")
        );

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUnreadNotifications(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByRecipientAndReadFalse(user);
        return unreadNotifications.stream().map(notificationMapper::toNotificationResponse).toList();
    }

    public int getUnreadNotificationCount(User user) {
        return notificationRepository.countByRecipientAndReadFalse(user);
    }


}
