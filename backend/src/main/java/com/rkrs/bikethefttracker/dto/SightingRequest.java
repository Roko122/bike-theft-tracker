package com.rkrs.bikethefttracker.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SightingRequest(
        @NotBlank(message = "Description must not be empty.")
        @Size(max = 300, message = "Description must not exceed {max} characters.")
        String description,

        @Valid
        GeoPoint location
) {
}
