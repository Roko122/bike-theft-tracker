package com.rkrs.bikethefttracker.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TheftReportMapItemResponse(
    UUID id,
    String brand,
    String model,
    String type,
    String color,
    String status,
    GeoPoint location,
    LocalDateTime theftTime
) {
}
