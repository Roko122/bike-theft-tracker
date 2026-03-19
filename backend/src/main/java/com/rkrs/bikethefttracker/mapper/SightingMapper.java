package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.SightingRequest;
import com.rkrs.bikethefttracker.dto.SightingResponse;
import com.rkrs.bikethefttracker.entity.Sighting;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Component
public class SightingMapper {

    private final GeoPointMapper geoPointMapper;

    public SightingMapper(GeoPointMapper geoPointMapper) {
        this.geoPointMapper = geoPointMapper;
    }

    public Sighting toSighting(SightingRequest sightingRequest, User user, TheftReport theftReport) {
        Point location = geoPointMapper.toPoint(sightingRequest.location());

        return Sighting.builder()
                .location(location)
                .reporter(user)
                .description(sightingRequest.description())
                .theftReport(theftReport)
                .build();
    }

    public SightingResponse toSightingResponse(Sighting sighting, String username) {
        GeoPoint geoPoint = geoPointMapper.toGeoPoint(sighting.getLocation());
        String imageUrl = buildImageUrl(sighting);

        return new SightingResponse(
                sighting.getId(),
                geoPoint,
                sighting.getDescription(),
                username,
                imageUrl,
                sighting.getCreatedAt()
        );
    }

    private String buildImageUrl(Sighting sighting) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/sightings/")
                .path(sighting.getTheftReport().getId().toString())
                .path("/")
                .path(sighting.getImageName())
                .toUriString();
    }
}
