package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.entity.Status;
import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.service.TheftReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TheftReportController.class)
class TheftReportControllerGetVisibleTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TheftReportService theftReportService;

    @Test
    @DisplayName("Palauttaa 200 OK kun kaikki bounding box -parametrit annetaan.")
    void getVisibleTheftReportMapItems_whenAllParamsProvided_returnsOk() throws Exception {
        double minLon = 24.90;
        double minLat = 60.10;
        double maxLon = 25.20;
        double maxLat = 60.30;

        UUID reportId = UUID.fromString("5bd87610-0c6b-4c48-a1f2-2de5d2f95e89");
        List<TheftReportMapItemResponse> response = List.of(
                new TheftReportMapItemResponse(
                        reportId,
                        "Trek",
                        "Domane",
                        "Road",
                        "Black",
                        Status.ACTIVE,
                        new GeoPoint(24.9384, 60.1699),
                        LocalDateTime.of(2024, 4, 5, 6, 7, 8)
                )
        );

        when(theftReportService.getAllVisibleTheftReportMapItems(minLon, minLat, maxLon, maxLat))
                .thenReturn(response);

        mockMvc.perform(get("/api/v1/theft-reports")
                        .param("minLon", String.valueOf(minLon))
                        .param("minLat", String.valueOf(minLat))
                        .param("maxLon", String.valueOf(maxLon))
                        .param("maxLat", String.valueOf(maxLat)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(reportId.toString()))
                .andExpect(jsonPath("$[0].brand").value("Trek"))
                .andExpect(jsonPath("$[0].model").value("Domane"))
                .andExpect(jsonPath("$[0].type").value("Road"))
                .andExpect(jsonPath("$[0].color").value("Black"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[0].location.longitude").value(24.9384))
                .andExpect(jsonPath("$[0].location.latitude").value(60.1699))
                .andExpect(jsonPath("$[0].theftTime").value("2024-04-05T06:07:08"));

        verify(theftReportService).getAllVisibleTheftReportMapItems(minLon, minLat, maxLon, maxLat);
        verify(theftReportService, never()).getAllTheftReportMapItems();
    }

    @Test
    @DisplayName("Palauttaa 400 Bad Request kun bounding box -parametri ei ole numeerinen.")
    void getVisibleTheftReportMapItems_whenParamIsNotNumeric_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/theft-reports")
                        .param("minLon", "invalid")
                        .param("minLat", "60.10")
                        .param("maxLon", "25.20")
                        .param("maxLat", "60.30"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 Bad Request kun bounding box -parametri on tyhjä.")
    void getVisibleTheftReportMapItems_whenParamIsBlank_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/theft-reports")
                        .param("minLat", "60.10")
                        .param("maxLon", "25.20")
                        .param("maxLat", "60.30"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(theftReportService);
    }

}
