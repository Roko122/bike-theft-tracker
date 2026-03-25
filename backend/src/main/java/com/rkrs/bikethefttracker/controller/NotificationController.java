package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.NotificationResponse;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import com.rkrs.bikethefttracker.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
