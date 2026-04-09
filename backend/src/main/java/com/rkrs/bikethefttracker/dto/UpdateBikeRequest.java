package com.rkrs.bikethefttracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateBikeRequest(
        UUID id,

        @NotBlank(message = "Brand must not be empty.")
        @Size(max = 30, message = "Brand must not exceed {max} characters.")
        String brand,

        @NotBlank(message = "Model must not be empty.")
        @Size(max = 30, message = "Model must not exceed {max} characters.")
        String model,

        @NotBlank(message = "Type must not be empty.")
        @Size(max = 30, message = "Type must not exceed {max} characters.")
        String type,

        @NotBlank(message = "Color must not be empty.")
        @Size(max = 30, message = "Color must not exceed {max} characters.")
        String color,

        @Size(max = 30, message = "Serial number must not exceed {max} characters.")
        String serialNumber,

        @NotBlank(message = "Description must not be empty.")
        @Size(max = 300, message = "Description must not exceed {max} characters.")
        String description,

        UserResponse user
) {
}
