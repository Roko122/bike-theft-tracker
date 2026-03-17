package com.rkrs.bikethefttracker.dto;

import java.util.List;
import java.util.UUID;

public record UserDetailsResponse(
        UUID id,
        String username,
        List<String> roles
) {
}
