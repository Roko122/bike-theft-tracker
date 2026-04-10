package com.rkrs.bikethefttracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sightings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Sighting {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, columnDefinition = "geometry(Point, 4326)")
    private Point location;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column
    private String imageName;

    @JoinColumn(name = "theft_report_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TheftReport theftReport;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User reporter;

    @Column
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
