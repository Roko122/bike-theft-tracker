package com.rkrs.bikethefttracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(

        @NotBlank(message = "Username must not be empty.")
        @Size(min = 3, max = 20, message = "Username must be between {min}-{max} characters.")
        String username,

        @NotBlank(message = "Password must not be empty.")
        @Size(min = 8, max = 64, message = "Password must be between {min}-{max} characters.")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&^#()-_+=\\[\\]{}/|:;,.<>]).*$",
                message = "Password must contain uppercase, lowercase, number and special character.")
        String password,

        @NotBlank(message = "Email must not be empty.")
        @Size(min = 6, max = 254, message = "Email must be between {min}-{max} characters.")
        @Email(message = "Email must be valid.")
        String email
) {
}
