package com.rkrs.bikethefttracker.domain;

import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TheftReportEntityTest {

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void prePersist_setsDefaults() {
        User owner = User.builder()
                .username("user")
                .email("user@example.com")
                .build();
        entityManager.persist(owner);

        Bike bike = Bike.builder()
                .brand("Trek")
                .model("Domane")
                .type("Road")
                .color("Red")
                .serialNumber("SN-123")
                .description("Fast bike")
                .user(owner)
                .build();
        entityManager.persist(bike);

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point location = geometryFactory.createPoint(new Coordinate(24.94, 60.17));

        TheftReport report = TheftReport.builder()
                .description("Stolen from station")
                .theftTime(LocalDateTime.of(2026, 2, 1, 10, 30))
                .theftAddress("Central Station")
                .location(location)
                .bike(bike)
                .build();

        TheftReport saved = entityManager.persistFlushFind(report);

        assertNotNull(saved.getId());
        assertEquals(Status.ACTIVE, saved.getStatus());
        assertNotNull(saved.getCreatedAt());
    }

    @Test
    void prePersist_overridesProvidedStatus() {
        User owner = User.builder()
                .username("owner2")
                .email("owner2@example.com")
                .build();
        entityManager.persist(owner);

        Bike bike = Bike.builder()
                .brand("Canyon")
                .model("Endurace")
                .type("Road")
                .color("Blue")
                .serialNumber("SN-456")
                .description("Endurance bike")
                .user(owner)
                .build();
        entityManager.persist(bike);

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point location = geometryFactory.createPoint(new Coordinate(25.0, 60.2));

        TheftReport report = TheftReport.builder()
                .description("Left outside")
                .theftTime(LocalDateTime.of(2026, 2, 2, 8, 0))
                .theftAddress("Market Square")
                .location(location)
                .status(Status.CLOSED)
                .bike(bike)
                .build();

        TheftReport saved = entityManager.persistFlushFind(report);

        assertEquals(Status.ACTIVE, saved.getStatus());
    }

    @Test
    void equalsAndHashCode_matchAllRelevantFields() {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point location = geometryFactory.createPoint(new Coordinate(24.94, 60.17));
        UUID id = UUID.fromString("6b3b44bf-7c87-4c71-90b9-04c5bfab0a5f");
        LocalDateTime theftTime = LocalDateTime.of(2026, 2, 1, 10, 30);
        LocalDateTime createdAt = LocalDateTime.of(2026, 2, 1, 12, 0);

        TheftReport first = TheftReport.builder()
                .id(id)
                .description("Stolen from station")
                .theftTime(theftTime)
                .theftAddress("Central Station")
                .location(location)
                .status(Status.ACTIVE)
                .createdAt(createdAt)
                .build();

        TheftReport second = TheftReport.builder()
                .id(id)
                .description("Stolen from station")
                .theftTime(theftTime)
                .theftAddress("Central Station")
                .location(geometryFactory.createPoint(new Coordinate(24.94, 60.17)))
                .status(Status.ACTIVE)
                .createdAt(createdAt)
                .build();

        assertEquals(first, second);
        assertEquals(first.hashCode(), second.hashCode());

        second.setTheftAddress("Different address");
        assertNotEquals(first, second);
    }

}
