package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.SightingRequest;
import com.rkrs.bikethefttracker.dto.SightingResponse;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import com.rkrs.bikethefttracker.service.SightingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/theft-reports/{theftReportId}/sightings")
public class SightingController {

    private final SightingService sightingService;

    public SightingController(SightingService sightingService) {
        this.sightingService = sightingService;
    }

    @GetMapping
    public ResponseEntity<List<SightingResponse>> getSightings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID theftReportId) {

        List<SightingResponse> sightingResponses = sightingService.getAllSightings(theftReportId, userDetails.getUserEntity());
        return new ResponseEntity<>(sightingResponses, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<SightingResponse> createSighting(@Valid @RequestPart("sighting") SightingRequest sightingRequest,
                                                           @RequestPart(name = "image", required = false) MultipartFile image,
                                                           @AuthenticationPrincipal CustomUserDetails userDetails,
                                                           @PathVariable UUID theftReportId) {

        SightingResponse sightingResponse = sightingService.createSighting(
                sightingRequest, image, userDetails.getUserEntity(), theftReportId);
        return new ResponseEntity<>(sightingResponse, HttpStatus.CREATED);
    }
}
