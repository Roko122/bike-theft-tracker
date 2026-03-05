package com.rkrs.bikethefttracker.dto;

import java.util.Date;
import java.util.UUID;

public record JwtToken(
        String token,
        Date expiryTime,
        UUID jwtId
) {
}
