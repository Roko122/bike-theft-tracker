package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.GeoPoint;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GeoPointMapperTest {

    private final GeoPointMapper geoPointMapper = new GeoPointMapper();

    @Test
    @DisplayName("toPoint palauttaa oikeat koordinaatit ja SRID 4326")
    void toPoint_mapsGeoPointCoordinatesAndSridCorrectly() {
        GeoPoint geoPoint = new GeoPoint(24.93, 60.17);

        Point point = geoPointMapper.toPoint(geoPoint);

        assertEquals(24.93, point.getX(), 0.000001);
        assertEquals(60.17, point.getY(), 0.000001);
        assertEquals(4326, point.getSRID());
    }

    @Test
    @DisplayName("toGeoPoint mapittaa Pointin X ja Y oikein longitude- ja latitude-arvoiksi")
    void toGeoPoint_mapsPointCoordinatesCorrectly() {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point point = geometryFactory.createPoint(new Coordinate(24.93, 60.17));

        GeoPoint geoPoint = geoPointMapper.toGeoPoint(point);

        assertEquals(point.getX(), geoPoint.longitude(), 0.000001);
        assertEquals(point.getY(), geoPoint.latitude(), 0.000001);
    }
}
