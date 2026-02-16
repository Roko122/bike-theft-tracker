package com.rkrs.bikethefttracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserInfo(

        @NotBlank(message = "Username must not be empty.")
        @Size(min = 3, max = 20, message = "Username must be between ${min}-${max} characters.")
        String username,

        @NotBlank(message = "Username must not be empty.")
        @Size(min = 6, max = 254, message = "Email must be between ${min}-${max} characters.")
        @Email(message = "Email must be valid.")
        String email
) {
}
