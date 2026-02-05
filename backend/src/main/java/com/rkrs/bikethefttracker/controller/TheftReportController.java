package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.service.TheftReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
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

    @PostMapping
    public ResponseEntity<TheftReportResponse> createTheftReport(
            @RequestBody CreateTheftReportRequest createTheftReportRequest) {

        System.out.println(createTheftReportRequest);
        TheftReportResponse createdTheftReport = theftReportService.createTheftReport(createTheftReportRequest);

        return new ResponseEntity<>(createdTheftReport, HttpStatus.CREATED);
    }
}
