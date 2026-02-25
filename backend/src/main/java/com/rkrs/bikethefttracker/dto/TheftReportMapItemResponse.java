package com.rkrs.bikethefttracker.dto;

import com.rkrs.bikethefttracker.entity.Status;

import java.time.LocalDateTime;
import java.util.UUID;

public record TheftReportMapItemResponse(
    UUID id,
    String brand,
    String model,
    String type,
    String color,
    Status status,
    GeoPoint location,
    LocalDateTime theftTime
) {
}
