package com.rkrs.bikethefttracker.dto;

import com.rkrs.bikethefttracker.entity.Status;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

public record TheftReportMapItemData (
        UUID id,
        String brand,
        String model,
        String type,
        String color,
        Status status,
        Point location,
        LocalDateTime theftTime
) {
}
