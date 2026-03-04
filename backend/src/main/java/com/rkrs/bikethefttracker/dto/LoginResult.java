package com.rkrs.bikethefttracker.dto;

public record LoginResult(
        LoginResponse loginResponse,
        JwtToken accessToken,
        JwtToken refreshToken
) {
}
