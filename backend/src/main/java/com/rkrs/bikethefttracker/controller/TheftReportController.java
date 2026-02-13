package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.service.TheftReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/theft-reports")
public class TheftReportController {

    private final TheftReportService theftReportService;

    public TheftReportController(TheftReportService theftReportService) {
        this.theftReportService = theftReportService;
    }

    @GetMapping
    public ResponseEntity<List<TheftReportMapItemResponse>> getTheftReportMapItems() {
        List<TheftReportMapItemResponse> theftReportMapItems = theftReportService.getAllTheftReportMapItems();

        return new ResponseEntity<>(theftReportMapItems, HttpStatus.OK);
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
            @Valid @RequestBody CreateTheftReportRequest createTheftReportRequest) {

        TheftReportResponse createdTheftReport = theftReportService.createTheftReport(createTheftReportRequest);

        return new ResponseEntity<>(createdTheftReport, HttpStatus.CREATED);
    }
}
