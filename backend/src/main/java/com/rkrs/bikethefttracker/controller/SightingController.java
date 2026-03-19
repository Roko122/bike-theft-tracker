package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.SightingRequest;
import com.rkrs.bikethefttracker.dto.SightingResponse;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/theft-reports/{theftReportId}/sightings")
public class SightingController {

    @GetMapping
    public List<SightingResponse> getSightings(@PathVariable UUID theftReportId) {
        return null;
    }

    @PostMapping
    public SightingResponse createSighting(@RequestBody SightingRequest sightingRequest,
                                           @PathVariable UUID theftReportId,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        return null;
    }
}
