package com.rkrs.bikethefttracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@NoArgsConstructor @AllArgsConstructor @Builder
@Getter @Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleType name;
}
