package com.rkrs.bikethefttracker.dto;

import com.rkrs.bikethefttracker.entity.Status;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UpdateTheftReportRequest(
        UUID id,

        @NotBlank(message = "Description must not be empty.")
        @Size(max = 300, message = "Description must not exceed {max} characters.")
        String description,

        @NotNull(message = "Theft time is required.")
        @Past(message = "Theft time must be in the past.")
        LocalDateTime theftTime,

        @Size(max = 150, message = "Theft address must not exceed {max} characters.")
        String theftAddress,

        @Valid
        GeoPoint location,
        Status status,
        LocalDateTime createdAt,

        @Valid
        UpdateBikeRequest bike,

        List<String> images

) {
}
