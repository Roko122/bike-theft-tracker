package com.rkrs.bikethefttracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_token", indexes = {
        @Index(name = "idx_token", columnList = "token")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshToken {

    @Id
    @GeneratedValue
    private UUID id;

    @Column
    private String token;

    @Column(name = "expiry_time")
    private Instant expiryTime;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
