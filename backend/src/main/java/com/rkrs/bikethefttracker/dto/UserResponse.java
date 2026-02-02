package com.rkrs.bikethefttracker.dto;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String username
) {
}
