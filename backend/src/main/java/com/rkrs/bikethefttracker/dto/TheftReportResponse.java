package com.rkrs.bikethefttracker.dto;

import com.rkrs.bikethefttracker.entity.Status;

import java.time.LocalDateTime;
import java.util.UUID;

public record TheftReportResponse(
    UUID id,
    String description,
    LocalDateTime theftTime,
    String theftAddress,
    GeoPoint location,
    Status status,
    LocalDateTime createdAt,
    BikeResponse bike
) {
}
