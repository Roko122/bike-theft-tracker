package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import com.rkrs.bikethefttracker.service.TheftReportService;
import com.rkrs.bikethefttracker.validation.annotation.Image;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/theft-reports")
public class TheftReportController {

    private final TheftReportService theftReportService;

    public TheftReportController(TheftReportService theftReportService) {
        this.theftReportService = theftReportService;
    }

    @GetMapping(params = {"minLon", "minLat", "maxLon", "maxLat"})
    public ResponseEntity<List<TheftReportMapItemResponse>> getVisibleTheftReportMapItems(
            @RequestParam double minLon,
            @RequestParam double minLat,
            @RequestParam double maxLon,
            @RequestParam double maxLat
    ) {
        List<TheftReportMapItemResponse> theftReportMapItems =
                theftReportService.getAllVisibleTheftReportMapItems(minLon, minLat, maxLon, maxLat);

        return new ResponseEntity<>(theftReportMapItems, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheftReportResponse> getTheftReport(@PathVariable UUID id) {
        TheftReportResponse theftReportResponse = theftReportService.getTheftReportResponse(id);

        return new ResponseEntity<>(theftReportResponse, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<TheftReportResponse> createTheftReport(
            @Valid @RequestPart("theftReport") CreateTheftReportRequest createTheftReportRequest,
            @RequestPart(name = "images", required = false) List<@Image MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        if (images != null && images.size() > 5) {
            throw new IllegalArgumentException("Maximum 5 images allowed");
        }

        User user = customUserDetails.getUserEntity();
        TheftReportResponse createdTheftReport = theftReportService.createTheftReport(
                createTheftReportRequest,
                user,
                images);

        return new ResponseEntity<>(createdTheftReport, HttpStatus.CREATED);
    }
}
