package com.rkrs.bikethefttracker.dto;

public record ErrorResponse(
        String error,
        int statusCode,
        String message
) {
}
