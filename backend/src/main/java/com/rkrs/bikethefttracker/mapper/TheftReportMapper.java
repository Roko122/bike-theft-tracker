package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.*;
import com.rkrs.bikethefttracker.entity.BikeImage;
import com.rkrs.bikethefttracker.entity.TheftReport;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

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
        BikeResponse bike = bikeMapper.toBikeResponse(theftReport);
        List<String> images = this.imagePaths(theftReport.getBike().getImages(), theftReport.getId());

        return new TheftReportResponse(
                theftReport.getId(),
                theftReport.getDescription(),
                theftReport.getTheftTime(),
                theftReport.getTheftAddress(),
                location,
                theftReport.getStatus(),
                theftReport.getCreatedAt(),
                bike,
                images
        );
    }

    public TheftReport toTheftReport(CreateTheftReportRequest request) {
        Point location = geoPointMapper.toPoint(request.location());

        return TheftReport.builder()
                .description(request.description())
                .theftTime(request.theftTime())
                .theftAddress(request.theftAddress())
                .location(location)
                .build();
    }

    public TheftReportMapItemResponse toTheftReportMapItemResponse(TheftReportMapItemData data) {
        GeoPoint point = geoPointMapper.toGeoPoint(data.location());

        return new TheftReportMapItemResponse(
                data.id(),
                data.brand(),
                data.model(),
                data.type(),
                data.color(),
                data.status(),
                point,
                data.theftTime()
        );
    }

    private List<String> imagePaths(List<BikeImage> bikeImages, UUID theftReportId) {
        if (bikeImages == null || bikeImages.isEmpty()) {
            return Collections.emptyList();
        }

        return bikeImages.stream().map(image -> this.buildImageUrl(image, theftReportId)).toList();
    }

    private String buildImageUrl(BikeImage bikeImage, UUID id) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/theft-reports/" + id + "/bike/")
                .path(bikeImage.getImageName())
                .toUriString();
    }
}
