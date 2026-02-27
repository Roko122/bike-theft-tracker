package com.rkrs.bikethefttracker.dto;

public record LoginRequest(
        String username,
        String password
) {
}
