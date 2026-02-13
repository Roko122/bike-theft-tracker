package com.rkrs.bikethefttracker.dto;

import java.util.UUID;

public record BikeResponse(
        UUID id,
        String brand,
        String model,
        String type,
        String color,
        String serialNumber,
        String description,
        UserResponse user
) {
}
