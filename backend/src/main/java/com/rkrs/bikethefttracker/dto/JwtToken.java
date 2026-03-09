package com.rkrs.bikethefttracker.dto;

import java.util.UUID;

public record JwtToken(
        String token,
        UUID jwtId
) {
}
