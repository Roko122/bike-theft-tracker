package com.rkrs.bikethefttracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(

        @NotBlank(message = "Username must not be empty.")
        @Size(min = 3, max = 20, message = "Username must be between {min}-{max} characters.")
        String username,

        @NotBlank(message = "Password must not be empty.")
        @Size(min = 8, max = 64, message = "Password must be between {min}-{max} characters.")
        String password
) {
}
