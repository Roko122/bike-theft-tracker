package com.rkrs.bikethefttracker.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SightingResponse(
        UUID id,
        GeoPoint location,
        String description,
        String reporter,
        LocalDateTime createdAt
) {
}
