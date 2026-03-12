package com.rkrs.bikethefttracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bike_images")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class BikeImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "bike_id")
    private Bike bike;

    @Column
    private String imagePath;
}
