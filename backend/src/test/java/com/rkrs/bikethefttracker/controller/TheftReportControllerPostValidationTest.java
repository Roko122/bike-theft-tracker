package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.RoleType;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.properties.JwtProperties;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import com.rkrs.bikethefttracker.security.JwtService;
import com.rkrs.bikethefttracker.service.TheftReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Set;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TheftReportController.class)
class TheftReportControllerPostValidationTest {

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
    @DisplayName("Palauttaa 400 kun request partista puuttuu pakollinen kentta")
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
                    "description": "Lime tape"
                  }
                }
                """;

        mockMvc.perform(multipart("/api/v1/theft-reports")
                        .file(theftReportPart(requestBody))
                        .with(authentication(authenticatedRequest())))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"));

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 kun pakollinen String-kentta on tyhja")
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
                    "description": "Lime tape"
                  }
                }
                """;

        mockMvc.perform(multipart("/api/v1/theft-reports")
                        .file(theftReportPart(requestBody))
                        .with(authentication(authenticatedRequest())))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"));

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 kun kentta on vaarassa muodossa")
    void createTheftReport_whenFieldFormatIsInvalid_returnsBadRequest() throws Exception {
        String requestBody = """
                {
                  "description": "Bike stolen near station",
                  "theftTime": "not-a-date",
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
                    "description": "Lime tape"
                  }
                }
                """;

        mockMvc.perform(multipart("/api/v1/theft-reports")
                        .file(theftReportPart(requestBody))
                        .with(authentication(authenticatedRequest())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Request body is invalid or contains incorrect field values."));

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 kun theftTime on tulevaisuudessa")
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
                    "description": "Lime tape"
                  }
                }
                """.formatted(futureTheftTime);

        mockMvc.perform(multipart("/api/v1/theft-reports")
                        .file(theftReportPart(requestBody))
                        .with(authentication(authenticatedRequest())))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"));

        verifyNoInteractions(theftReportService);
    }

    @Test
    @DisplayName("Palauttaa 400 kun kuvia on yli sallitun maaran")
    void createTheftReport_whenTooManyImages_returnsBadRequest() throws Exception {
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
                    "description": "Lime tape"
                  }
                }
                """;

        var requestBuilder = multipart("/api/v1/theft-reports")
                .file(theftReportPart(requestBody))
                .with(authentication(authenticatedRequest()));

        for (int i = 0; i < 6; i++) {
            requestBuilder.file(new MockMultipartFile(
                    "images",
                    "bike" + i + ".jpg",
                    MediaType.IMAGE_JPEG_VALUE,
                    ("fake-image-" + i).getBytes(StandardCharsets.UTF_8)
            ));
        }

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest());

        verifyNoInteractions(theftReportService);
    }

    private MockMultipartFile theftReportPart(String content) {
        return new MockMultipartFile(
                "theftReport",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                content.getBytes(StandardCharsets.UTF_8)
        );
    }

    private UsernamePasswordAuthenticationToken authenticatedRequest() {
        User user = User.builder()
                .username("teemu")
                .password("secret")
                .email("teemu@example.com")
                .roles(Set.of(new Role(RoleType.ROLE_USER)))
                .build();
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return UsernamePasswordAuthenticationToken.authenticated(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}
