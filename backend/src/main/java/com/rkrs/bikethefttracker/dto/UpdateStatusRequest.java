package com.rkrs.bikethefttracker.dto;

import com.rkrs.bikethefttracker.entity.Status;

public record UpdateStatusRequest(
        Status status
) {
}
