package com.rkrs.bikethefttracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "theft_reports")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TheftReport {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(nullable = false, name = "theft_time")
    private LocalDateTime theftTime;

    @Column(nullable = true, name = "theft_address")
    private String theftAddress;

    @Column(nullable = false, columnDefinition = "geometry(Point, 4326)")
    private Point location;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bike_id")
    private Bike bike;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        status = Status.ACTIVE;
        createdAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TheftReport that = (TheftReport) o;
        return Objects.equals(id, that.id) && Objects.equals(description, that.description) && Objects.equals(theftTime, that.theftTime) && Objects.equals(theftAddress, that.theftAddress) && Objects.equals(location, that.location) && status == that.status && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, description, theftTime, theftAddress, location, status, createdAt);
    }

    @Override
    public String toString() {
        return "TheftReport{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", theftTime=" + theftTime +
                ", theftAddress='" + theftAddress + '\'' +
                ", location=" + location +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}
