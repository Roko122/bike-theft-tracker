package com.rkrs.bikethefttracker.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "cors")
public record CorsProperties(
        List<String> allowedOrigins,
        boolean allowCredentials,
        List<String> allowedMethods,
        List<String> allowedHeaders
) {
}
