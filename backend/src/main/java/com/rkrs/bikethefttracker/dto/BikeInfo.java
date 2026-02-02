package com.rkrs.bikethefttracker.dto;

public record BikeInfo(
        String brand,
        String model,
        String type,
        String color,
        String serialNumber,
        String description,
        OwnerInfo owner
) {
}
