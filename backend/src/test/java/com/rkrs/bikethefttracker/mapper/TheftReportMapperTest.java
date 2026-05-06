package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.BikeResponse;
import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemData;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.entity.BikeImage;
import com.rkrs.bikethefttracker.entity.Status;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TheftReportMapperTest {

    @Mock
    private BikeMapper bikeMapper;

    @Mock
    private GeoPointMapper geoPointMapper;

    @InjectMocks
    private TheftReportMapper theftReportMapper;

    @AfterEach
    void clearRequestContext() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    @DisplayName("toTheftReportResponse palauttaa oikein mapitetun TheftReportResponse-olion")
    void toTheftReportResponse_mapsAllFieldsAndUsesNestedMappers() {
        UUID theftReportId = UUID.fromString("889f5983-3f34-4260-b319-793eca08e2b5");
        UUID bikeId = UUID.fromString("3edab31d-2de8-49c4-9093-21840770764f");
        UUID userId = UUID.fromString("8ea21431-ebfe-4eab-bf89-8304a7848fdf");
        LocalDateTime theftTime = LocalDateTime.of(2024, 4, 5, 6, 7, 8);
        LocalDateTime createdAt = LocalDateTime.of(2024, 4, 6, 9, 10, 11);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("http");
        request.setServerName("localhost");
        request.setServerPort(80);
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point locationPoint = geometryFactory.createPoint(new Coordinate(24.9384, 60.1699));
        Bike bike = Bike.builder()
                .id(bikeId)
                .brand("Cube")
                .model("Nuroad")
                .type("Gravel")
                .color("Green")
                .serialNumber("SN-12345")
                .description("Lime tape")
                .images(List.of(BikeImage.builder().imageName("photo.jpeg").build()))
                .build();
        User user = User.builder()
                .id(userId)
                .username("teemu")
                .build();
        TheftReport theftReport = TheftReport.builder()
                .id(theftReportId)
                .description("Bike stolen near station")
                .theftTime(theftTime)
                .theftAddress("Mannerheimintie 1, Helsinki")
                .location(locationPoint)
                .status(Status.ACTIVE)
                .createdAt(createdAt)
                .bike(bike)
                .user(user)
                .build();

        GeoPoint mappedGeoPoint = new GeoPoint(24.9384, 60.1699);
        BikeResponse mappedBikeResponse = new BikeResponse(
                bikeId,
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                "SN-12345",
                "Lime tape",
                null
        );

        when(geoPointMapper.toGeoPoint(theftReport.getLocation())).thenReturn(mappedGeoPoint);
        when(bikeMapper.toBikeResponse(theftReport)).thenReturn(mappedBikeResponse);

        TheftReportResponse response = theftReportMapper.toTheftReportResponse(theftReport);

        assertEquals(theftReport.getId(), response.id());
        assertEquals(theftReport.getDescription(), response.description());
        assertEquals(theftReport.getTheftTime(), response.theftTime());
        assertEquals(theftReport.getTheftAddress(), response.theftAddress());
        assertEquals(mappedGeoPoint, response.location());
        assertEquals(theftReport.getStatus(), response.status());
        assertEquals(theftReport.getCreatedAt(), response.createdAt());
        assertEquals(mappedBikeResponse, response.bike());
        assertEquals(List.of("/images/theft-reports/" + theftReportId + "/bike/photo.jpeg"), response.images());

        verify(geoPointMapper).toGeoPoint(theftReport.getLocation());
        verify(bikeMapper).toBikeResponse(theftReport);
    }

    @Test
    @DisplayName("toTheftReport asettaa kentat oikein ja kayttaa GeoPointMapperia")
    void toTheftReport_mapsRequestFieldsAndUsesGeoPointMapper() {
        LocalDateTime theftTime = LocalDateTime.of(2024, 3, 4, 5, 6, 7);
        GeoPoint requestLocation = new GeoPoint(24.9384, 60.1699);
        CreateTheftReportRequest request = new CreateTheftReportRequest(
                "Bike stolen near station",
                theftTime,
                "Mannerheimintie 1, Helsinki",
                requestLocation,
                null
        );

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point mappedPoint = geometryFactory.createPoint(new Coordinate(24.9384, 60.1699));

        when(geoPointMapper.toPoint(request.location())).thenReturn(mappedPoint);

        TheftReport theftReport = theftReportMapper.toTheftReport(request);

        assertEquals(request.description(), theftReport.getDescription());
        assertEquals(request.theftTime(), theftReport.getTheftTime());
        assertEquals(request.theftAddress(), theftReport.getTheftAddress());
        assertEquals(mappedPoint, theftReport.getLocation());

        verify(geoPointMapper).toPoint(request.location());
    }

    @Test
    @DisplayName("toTheftReportMapItemResponse mapittaa kentat ja muuntaa locationin GeoPointiksi")
    void toTheftReportMapItemResponse_mapsAllFieldsAndUsesGeoPointMapper() {
        UUID id = UUID.fromString("8b45dfb4-cff4-4ed5-bde7-8d64a4e15608");
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point locationPoint = geometryFactory.createPoint(new Coordinate(24.95, 60.17));
        LocalDateTime theftTime = LocalDateTime.of(2024, 2, 3, 10, 20, 30);
        TheftReportMapItemData data = new TheftReportMapItemData(
                id,
                "Trek",
                "Domane",
                "Road",
                "Black",
                Status.SIGHTED,
                locationPoint,
                theftTime
        );
        GeoPoint mappedGeoPoint = new GeoPoint(24.95, 60.17);

        when(geoPointMapper.toGeoPoint(data.location())).thenReturn(mappedGeoPoint);

        TheftReportMapItemResponse response = theftReportMapper.toTheftReportMapItemResponse(data);

        assertEquals(data.id(), response.id());
        assertEquals(data.brand(), response.brand());
        assertEquals(data.model(), response.model());
        assertEquals(data.type(), response.type());
        assertEquals(data.color(), response.color());
        assertEquals(data.status(), response.status());
        assertEquals(mappedGeoPoint, response.location());
        assertEquals(data.theftTime(), response.theftTime());

        verify(geoPointMapper).toGeoPoint(data.location());
    }
}
