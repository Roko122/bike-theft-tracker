package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.domain.Status;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TheftReportController.class)
class TheftReportControllerGetAllTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TheftReportService theftReportService;

    @Test
    @DisplayName("Hakee kaikki varkausilmoitukset ja palauttaa oikeat tiedot.")
    void getTheftReportMapItems_returnsItems() throws Exception {
        UUID firstId = UUID.fromString("2cbb2a36-8d49-44e1-b119-6c6408af6d6f");
        UUID secondId = UUID.fromString("3fe9e0ee-a2ea-4236-bd10-1901b3e1eabb");
        GeoPoint firstLocation = new GeoPoint(24.9458, 60.1921);
        GeoPoint secondLocation = new GeoPoint(24.95, 60.17);

        List<TheftReportMapItemResponse> response = List.of(
                new TheftReportMapItemResponse(
                        firstId,
                        "Trek",
                        "Domane",
                        "Road",
                        "Black",
                        Status.ACTIVE,
                        firstLocation,
                        LocalDateTime.of(2024, 1, 2, 3, 4, 5)
                ),
                new TheftReportMapItemResponse(
                        secondId,
                        "Giant",
                        "Defy",
                        "Road",
                        "Blue",
                        Status.SIGHTED,
                        secondLocation,
                        LocalDateTime.of(2024, 2, 3, 10, 20, 30)
                )
        );

        when(theftReportService.getAllTheftReportMapItems()).thenReturn(response);

        mockMvc.perform(get("/api/v1/theft-reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(firstId.toString()))
                .andExpect(jsonPath("$[0].brand").value("Trek"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[0].location.longitude").value(24.9458))
                .andExpect(jsonPath("$[0].location.latitude").value(60.1921))
                .andExpect(jsonPath("$[1].id").value(secondId.toString()))
                .andExpect(jsonPath("$[1].model").value("Defy"))
                .andExpect(jsonPath("$[1].status").value("SIGHTED"))
                .andExpect(jsonPath("$[1].theftTime").value("2024-02-03T10:20:30"));
    }
}
