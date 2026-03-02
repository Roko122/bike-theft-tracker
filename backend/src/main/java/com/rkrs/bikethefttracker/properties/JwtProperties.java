package com.rkrs.bikethefttracker.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
    Long accessTokenExpirationTime,
    String accessTokenCookieName,
    Long refreshTokenExpirationTime,
    String refreshTokenCookieName,
    String secret
) {
}
