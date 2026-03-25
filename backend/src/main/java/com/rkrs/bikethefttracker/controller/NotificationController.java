package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.NotificationCountResponse;
import com.rkrs.bikethefttracker.dto.NotificationResponse;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import com.rkrs.bikethefttracker.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        List<NotificationResponse> unreadNotifications = notificationService.getUnreadNotifications(customUserDetails.getUserEntity());

        return new ResponseEntity<>(unreadNotifications, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<NotificationCountResponse> getUnreadNotificationsCount(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        int count = notificationService.getUnreadNotificationCount(customUserDetails.getUserEntity());

        return new ResponseEntity<>(new NotificationCountResponse(count), HttpStatus.OK);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable UUID id,
                                                       @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        notificationService.markAsRead(customUserDetails.getUserEntity(), id);

        return ResponseEntity.ok().build();
    }
}
