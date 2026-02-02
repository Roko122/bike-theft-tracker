package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.GeoPoint;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Component;

@Component
public class GeoPointMapper {

    private final GeometryFactory geometryFactory;

    public GeoPointMapper() {
        this.geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    }

    public Point toPoint(GeoPoint geoPoint) {
        Coordinate coordinates = new Coordinate(geoPoint.longitude(), geoPoint.latitude());

        return geometryFactory.createPoint(coordinates);
    }

    public GeoPoint toGeoPoint(Point point) {
        double lon = point.getX();
        double lat = point.getY();

        return new GeoPoint(lon, lat);
    }
}
