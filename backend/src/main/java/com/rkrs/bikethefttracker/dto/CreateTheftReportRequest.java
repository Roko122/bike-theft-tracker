package com.rkrs.bikethefttracker.dto;

import java.time.LocalDateTime;

public record CreateTheftReportRequest(
        String description,
        LocalDateTime theftTime,
        String theftAddress,
        GeoPoint location,
        BikeInfo bike
) {
}
