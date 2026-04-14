package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.BikeResponse;
import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.dto.UserResponse;
import com.rkrs.bikethefttracker.entity.Status;
import com.rkrs.bikethefttracker.exception.NotFoundException;
import com.rkrs.bikethefttracker.properties.JwtProperties;
import com.rkrs.bikethefttracker.security.JwtService;
import com.rkrs.bikethefttracker.service.TheftReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TheftReportController.class)
class TheftReportControllerGetByIdTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TheftReportService theftReportService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private JwtProperties jwtProperties;

    @Test
    @DisplayName("Hakee yksittaisen varkausilmoituksen id:n perusteella")
    void getTheftReport_returnsReport() throws Exception {
        UUID reportId = UUID.fromString("6b4027a2-2c19-4f67-88b0-1f1c05f2f4c3");
        UUID bikeId = UUID.fromString("d4ee4e61-35d7-49e2-90df-b14bbf7f9a45");
        UUID ownerId = UUID.fromString("1cdef63b-2ac9-4c95-9a2f-2fce6fc298d5");
        GeoPoint location = new GeoPoint(24.9384, 60.1699);
        TheftReportResponse response = new TheftReportResponse(
                reportId,
                "Bike stolen near station",
                LocalDateTime.of(2024, 4, 5, 6, 7, 8),
                "Mannerheimintie 1, Helsinki",
                location,
                Status.ACTIVE,
                LocalDateTime.of(2024, 4, 6, 9, 10, 11),
                new BikeResponse(
                        bikeId,
                        "Cube",
                        "Nuroad",
                        "Gravel",
                        "Green",
                        "SN-12345",
                        "Lime tape",
                        new UserResponse(ownerId, "teemu")
                ),
                List.of("http://localhost/images/theft-reports/" + reportId + "/bike/photo.jpeg")
        );

        when(theftReportService.getTheftReportResponse(reportId)).thenReturn(response);

        mockMvc.perform(get("/api/v1/theft-reports/{id}", reportId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(reportId.toString()))
                .andExpect(jsonPath("$.description").value("Bike stolen near station"))
                .andExpect(jsonPath("$.theftTime").value("2024-04-05T06:07:08"))
                .andExpect(jsonPath("$.theftAddress").value("Mannerheimintie 1, Helsinki"))
                .andExpect(jsonPath("$.location.longitude").value(24.9384))
                .andExpect(jsonPath("$.location.latitude").value(60.1699))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.createdAt").value("2024-04-06T09:10:11"))
                .andExpect(jsonPath("$.bike.id").value(bikeId.toString()))
                .andExpect(jsonPath("$.bike.brand").value("Cube"))
                .andExpect(jsonPath("$.bike.model").value("Nuroad"))
                .andExpect(jsonPath("$.bike.type").value("Gravel"))
                .andExpect(jsonPath("$.bike.color").value("Green"))
                .andExpect(jsonPath("$.bike.serialNumber").value("SN-12345"))
                .andExpect(jsonPath("$.bike.description").value("Lime tape"))
                .andExpect(jsonPath("$.bike.user.id").value(ownerId.toString()))
                .andExpect(jsonPath("$.bike.user.username").value("teemu"))
                .andExpect(jsonPath("$.images[0]").value("http://localhost/images/theft-reports/" + reportId + "/bike/photo.jpeg"));
    }

    @Test
    @DisplayName("Palauttaa 404 Not Found, kun varkausilmoitusta ei loydy")
    void getTheftReport_whenMissing_returnsNotFound() throws Exception {
        UUID missingId = UUID.fromString("b2f0e9d1-0bc9-4c8b-8c1a-6b4c2d246f0c");
        String message = "TheftReport with id " + missingId + " not found";

        when(theftReportService.getTheftReportResponse(missingId))
                .thenThrow(new NotFoundException(message));

        mockMvc.perform(get("/api/v1/theft-reports/{id}", missingId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.statusCode").value(404))
                .andExpect(jsonPath("$.message").value(message));
    }
}
