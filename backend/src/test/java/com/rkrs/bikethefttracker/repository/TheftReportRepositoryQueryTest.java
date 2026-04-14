package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.dto.TheftReportMapItemData;
import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.entity.Status;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class TheftReportRepositoryQueryTest {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);

    @Autowired
    private TheftReportRepository theftReportRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("findAllTheftReportMapItems palauttaa kaikki karttanakyman tiedot")
    void findAllTheftReportMapItems_returnsAllProjectedFieldsWithoutOrderAssumption() {
        PersistedReport first = persistReport(
                "user-one",
                "user-one@example.com",
                "Trek",
                "Domane",
                "Road",
                "Red",
                "SN-101",
                Status.ACTIVE,
                point(24.94, 60.17),
                LocalDateTime.of(2026, 2, 1, 10, 30)
        );
        PersistedReport second = persistReport(
                "user-two",
                "user-two@example.com",
                "Canyon",
                "Endurace",
                "Road",
                "Blue",
                "SN-202",
                Status.ACTIVE,
                point(25.05, 60.22),
                LocalDateTime.of(2026, 2, 2, 8, 0)
        );

        List<TheftReportMapItemData> items = theftReportRepository.findAllTheftReportMapItems();

        assertEquals(2, items.size());

        List<TheftReportMapItemData> sorted = items.stream()
                .sorted(Comparator.comparing(TheftReportMapItemData::id))
                .toList();

        if (first.reportId().compareTo(second.reportId()) < 0) {
            assertProjectionEquals(sorted.get(0), first);
            assertProjectionEquals(sorted.get(1), second);
        } else {
            assertProjectionEquals(sorted.get(0), second);
            assertProjectionEquals(sorted.get(1), first);
        }
    }

    @Test
    @DisplayName("findAllVisibleTheftReportMapItems palauttaa vain nakyvissa olevat varkausilmoitukset")
    void findAllVisibleTheftReportMapItems_returnsOnlyItemsInsideBoundingBox() {
        PersistedReport inside = persistReport(
                "inside-user",
                "inside@example.com",
                "Specialized",
                "Allez",
                "Road",
                "Black",
                "SN-303",
                Status.ACTIVE,
                point(25.0, 60.2),
                LocalDateTime.of(2026, 2, 3, 9, 15)
        );
        persistReport(
                "outside-user",
                "outside@example.com",
                "Giant",
                "Escape",
                "Hybrid",
                "Green",
                "SN-404",
                Status.ACTIVE,
                point(30.0, 65.0),
                LocalDateTime.of(2026, 2, 4, 11, 45)
        );

        List<TheftReportMapItemData> visibleItems = theftReportRepository.findAllVisibleTheftReportMapItems(
                24.9, 60.1, 25.1, 60.3
        );

        assertEquals(1, visibleItems.size());
        assertProjectionEquals(visibleItems.get(0), inside);
    }

    private PersistedReport persistReport(String username,
                                          String email,
                                          String brand,
                                          String model,
                                          String type,
                                          String color,
                                          String serialNumber,
                                          Status status,
                                          Point location,
                                          LocalDateTime theftTime) {
        User user = User.builder()
                .username(username)
                .password("secret")
                .email(email)
                .build();
        entityManager.persist(user);

        Bike bike = Bike.builder()
                .brand(brand)
                .model(model)
                .type(type)
                .color(color)
                .serialNumber(serialNumber)
                .description("Test bike " + serialNumber)
                .build();
        entityManager.persist(bike);

        TheftReport report = TheftReport.builder()
                .description("Test theft report for " + serialNumber)
                .theftTime(theftTime)
                .theftAddress("Test address")
                .location(location)
                .status(status)
                .user(user)
                .bike(bike)
                .build();
        entityManager.persist(report);
        entityManager.flush();

        return new PersistedReport(
                report.getId(),
                brand,
                model,
                type,
                color,
                Status.ACTIVE,
                location,
                theftTime
        );
    }

    private Point point(double lon, double lat) {
        Point p = GEOMETRY_FACTORY.createPoint(new Coordinate(lon, lat));
        p.setSRID(4326);
        return p;
    }

    private void assertProjectionEquals(TheftReportMapItemData actual, PersistedReport expected) {
        assertEquals(expected.reportId(), actual.id());
        assertEquals(expected.brand(), actual.brand());
        assertEquals(expected.model(), actual.model());
        assertEquals(expected.type(), actual.type());
        assertEquals(expected.color(), actual.color());
        assertEquals(expected.status(), actual.status());
        assertEquals(expected.theftTime(), actual.theftTime());
        assertEquals(expected.location().getSRID(), actual.location().getSRID());
        assertEquals(expected.location().getX(), actual.location().getX(), 0.000001);
        assertEquals(expected.location().getY(), actual.location().getY(), 0.000001);
    }

    private record PersistedReport(UUID reportId,
                                   String brand,
                                   String model,
                                   String type,
                                   String color,
                                   Status status,
                                   Point location,
                                   LocalDateTime theftTime) {
    }
}
