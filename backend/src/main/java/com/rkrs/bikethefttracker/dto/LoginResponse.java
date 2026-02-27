package com.rkrs.bikethefttracker.dto;

import java.util.UUID;

public record LoginResponse(
        UUID id,
        String username
) {
}
