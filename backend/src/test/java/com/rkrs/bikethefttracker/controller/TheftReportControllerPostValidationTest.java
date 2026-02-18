package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.service.TheftReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TheftReportController.class)
class TheftReportControllerPostValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TheftReportService theftReportService;

    @Test
    @DisplayName("Palauttaa 400 kun request bodysta puuttuu pakollinen kenttä.")
    void createTheftReport_whenRequiredFieldMissing_returnsBadRequest() throws Exception {
        String requestBody = """
                {
                  "description": "Bike stolen near station",
                  "theftAddress": "Mannerheimintie 1, Helsinki",
                  "location": {
                    "longitude": 24.9384,
                    "latitude": 60.1699
                  },
                  "bike": {
                    "brand": "Cube",
                    "model": "Nuroad",
                    "type": "Gravel",
                    "color": "Green",
                    "serialNumber": "SN-12345",
                    "description": "Lime tape",
                    "user": {
                      "username": "teemu",
                      "email": "teemu@example.com"
                    }
                  }
                }
                """;

        mockMvc.perform(post("/api/v1/theft-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 kun pakollinen String-kenttä on tyhjä.")
    void createTheftReport_whenRequiredStringFieldIsBlank_returnsBadRequest() throws Exception {
        String requestBody = """
                {
                  "description": "",
                  "theftTime": "2024-03-04T05:06:07",
                  "theftAddress": "Mannerheimintie 1, Helsinki",
                  "location": {
                    "longitude": 24.9384,
                    "latitude": 60.1699
                  },
                  "bike": {
                    "brand": "Cube",
                    "model": "Nuroad",
                    "type": "Gravel",
                    "color": "Green",
                    "serialNumber": "SN-12345",
                    "description": "Lime tape",
                    "user": {
                      "username": "teemu",
                      "email": "teemu@example.com"
                    }
                  }
                }
                """;

        mockMvc.perform(post("/api/v1/theft-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 kun kenttä on väärässä muodossa.")
    void createTheftReport_whenFieldFormatIsInvalid_returnsBadRequest() throws Exception {
        String requestBody = """
                {
                  "description": "Bike stolen near station",
                  "theftTime": "2024-03-04T05:06:07",
                  "theftAddress": "Mannerheimintie 1, Helsinki",
                  "location": {
                    "longitude": 24.9384,
                    "latitude": 60.1699
                  },
                  "bike": {
                    "brand": "Cube",
                    "model": "Nuroad",
                    "type": "Gravel",
                    "color": "Green",
                    "serialNumber": "SN-12345",
                    "description": "Lime tape",
                    "user": {
                      "username": "teemu",
                      "email": "not-an-email"
                    }
                  }
                }
                """;

        mockMvc.perform(post("/api/v1/theft-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 kun theftTime on tulevaisuudessa.")
    void createTheftReport_whenTheftTimeIsInFuture_returnsBadRequest() throws Exception {
        String futureTheftTime = LocalDateTime.now().plusDays(1).withNano(0).toString();
        String requestBody = """
                {
                  "description": "Bike stolen near station",
                  "theftTime": "%s",
                  "theftAddress": "Mannerheimintie 1, Helsinki",
                  "location": {
                    "longitude": 24.9384,
                    "latitude": 60.1699
                  },
                  "bike": {
                    "brand": "Cube",
                    "model": "Nuroad",
                    "type": "Gravel",
                    "color": "Green",
                    "serialNumber": "SN-12345",
                    "description": "Lime tape",
                    "user": {
                      "username": "teemu",
                      "email": "teemu@example.com"
                    }
                  }
                }
                """.formatted(futureTheftTime);

        mockMvc.perform(post("/api/v1/theft-reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(theftReportService);
    }
}
