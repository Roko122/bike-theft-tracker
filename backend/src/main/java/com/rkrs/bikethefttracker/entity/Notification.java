package com.rkrs.bikethefttracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean read;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User recipient;

    @JoinColumn(name = "theft_report_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private TheftReport theftReport;

    @PrePersist
    private void onCreate() {
        read = false;
        createdAt = LocalDateTime.now();
    }
}
