package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.domain.Bike;
import com.rkrs.bikethefttracker.domain.TheftReport;
import com.rkrs.bikethefttracker.dto.BikeResponse;
import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

@Component
public class TheftReportMapper {

    private final BikeMapper bikeMapper;
    private final GeoPointMapper geoPointMapper;

    public TheftReportMapper(BikeMapper bikeMapper, GeoPointMapper geoPointMapper) {
        this.bikeMapper = bikeMapper;
        this.geoPointMapper = geoPointMapper;
    }

    public TheftReportResponse toTheftReportResponse(TheftReport theftReport) {
        GeoPoint location = geoPointMapper.toGeoPoint(theftReport.getLocation());
        BikeResponse bike = bikeMapper.toBikeResponse(theftReport.getBike());

        return new TheftReportResponse(
                theftReport.getId(),
                theftReport.getDescription(),
                theftReport.getTheftTime(),
                theftReport.getTheftAddress(),
                location,
                theftReport.getStatus(),
                theftReport.getCreatedAt(),
                bike
        );
    }

    public TheftReport toTheftReport(CreateTheftReportRequest request) {
        Bike bike = bikeMapper.toBike(request.bike());
        Point location = geoPointMapper.toPoint(request.location());

        return TheftReport.builder()
                .description(request.description())
                .theftTime(request.theftTime())
                .theftAddress(request.theftAddress())
                .location(location)
                .bike(bike)
                .build();
    }
}
