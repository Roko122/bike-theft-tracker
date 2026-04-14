package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.BikeResponse;
import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.dto.UserResponse;
import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.RoleType;
import com.rkrs.bikethefttracker.entity.Status;
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
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TheftReportController.class)
class TheftReportControllerCreateTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TheftReportService theftReportService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private JwtProperties jwtProperties;

    @Test
    @DisplayName("Luo varkausilmoituksen ja palauttaa tallennetun ilmoituksen")
    void createTheftReport_returnsCreatedReport() throws Exception {
        LocalDateTime theftTime = LocalDateTime.of(2024, 3, 4, 5, 6, 7);
        LocalDateTime createdAt = LocalDateTime.of(2024, 3, 5, 8, 9, 10);
        GeoPoint location = new GeoPoint(24.9384, 60.1699);
        CreateBikeRequest createBikeRequest = new CreateBikeRequest(
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                "SN-12345",
                "Lime tape"
        );
        CreateTheftReportRequest request = new CreateTheftReportRequest(
                "Bike stolen near station",
                theftTime,
                "Mannerheimintie 1, Helsinki",
                location,
                createBikeRequest
        );

        UUID reportId = UUID.fromString("1f1b5b83-1dd6-4788-b7af-dac7a8eaba24");
        UUID bikeId = UUID.fromString("a8fae5b7-3eb5-46e8-a5a0-3d2f00ab0d6d");
        UUID ownerId = UUID.fromString("dfad5f2c-623b-4dc0-b463-04a231dc3a62");
        User authenticatedUser = User.builder()
                .id(ownerId)
                .username("teemu")
                .password("secret")
                .email("teemu@example.com")
                .roles(Set.of(new Role(RoleType.ROLE_USER)))
                .build();
        UsernamePasswordAuthenticationToken auth = UsernamePasswordAuthenticationToken.authenticated(
                new CustomUserDetails(authenticatedUser),
                null,
                new CustomUserDetails(authenticatedUser).getAuthorities()
        );

        TheftReportResponse response = new TheftReportResponse(
                reportId,
                request.description(),
                request.theftTime(),
                request.theftAddress(),
                request.location(),
                Status.ACTIVE,
                createdAt,
                new BikeResponse(
                        bikeId,
                        createBikeRequest.brand(),
                        createBikeRequest.model(),
                        createBikeRequest.type(),
                        createBikeRequest.color(),
                        createBikeRequest.serialNumber(),
                        createBikeRequest.description(),
                        new UserResponse(ownerId, authenticatedUser.getUsername())
                ),
                List.of("http://localhost/images/theft-reports/" + reportId + "/bike/photo.jpeg")
        );

        MockMultipartFile theftReportPart = new MockMultipartFile(
                "theftReport",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsString(request).getBytes(StandardCharsets.UTF_8)
        );
        MockMultipartFile imagePart = new MockMultipartFile(
                "images",
                "bike.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake-image".getBytes(StandardCharsets.UTF_8)
        );

        when(theftReportService.createTheftReport(any(), any(), any()))
                .thenReturn(response);

        mockMvc.perform(multipart("/api/v1/theft-reports")
                        .file(theftReportPart)
                        .file(imagePart)
                        .with(authentication(auth)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(reportId.toString()))
                .andExpect(jsonPath("$.description").value("Bike stolen near station"))
                .andExpect(jsonPath("$.theftTime").value("2024-03-04T05:06:07"))
                .andExpect(jsonPath("$.theftAddress").value("Mannerheimintie 1, Helsinki"))
                .andExpect(jsonPath("$.location.longitude").value(24.9384))
                .andExpect(jsonPath("$.location.latitude").value(60.1699))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.createdAt").value("2024-03-05T08:09:10"))
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
}
