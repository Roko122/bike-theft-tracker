package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.BikeResponse;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TheftReportController.class)
class TheftReportControllerGetAllTest {

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
    @DisplayName("Hakee kirjautuneen kayttajan varkausilmoitukset ja palauttaa oikeat tiedot")
    void getTheftReportMapItems_returnsItems() throws Exception {
        UUID userId = UUID.fromString("a3474e63-0145-42f5-8efc-c96bb4c786c8");
        UsernamePasswordAuthenticationToken auth = authenticatedRequest(userId, "teemu", "teemu@example.com");
        UUID firstId = UUID.fromString("2cbb2a36-8d49-44e1-b119-6c6408af6d6f");
        UUID secondId = UUID.fromString("3fe9e0ee-a2ea-4236-bd10-1901b3e1eabb");

        List<TheftReportResponse> response = List.of(
                new TheftReportResponse(
                        firstId,
                        "Stolen near station",
                        LocalDateTime.of(2024, 1, 2, 3, 4, 5),
                        "Mannerheimintie 1",
                        new GeoPoint(24.9458, 60.1921),
                        Status.ACTIVE,
                        LocalDateTime.of(2024, 1, 2, 10, 0),
                        new BikeResponse(
                                UUID.fromString("ae897953-82c4-4fdc-bf2c-430023c3b4b6"),
                                "Trek",
                                "Domane",
                                "Road",
                                "Black",
                                "SN-101",
                                "Fast bike",
                                new UserResponse(userId, "teemu")
                        ),
                        List.of()
                ),
                new TheftReportResponse(
                        secondId,
                        "Seen at square",
                        LocalDateTime.of(2024, 2, 3, 10, 20, 30),
                        "Market Square",
                        new GeoPoint(24.95, 60.17),
                        Status.SIGHTED,
                        LocalDateTime.of(2024, 2, 3, 11, 0),
                        new BikeResponse(
                                UUID.fromString("90da3456-6b8d-40f0-848e-c8b6797ee63e"),
                                "Giant",
                                "Defy",
                                "Road",
                                "Blue",
                                "SN-202",
                                "Blue bike",
                                new UserResponse(userId, "teemu")
                        ),
                        List.of()
                )
        );

        when(theftReportService.getUsersTheftReports(any())).thenReturn(response);

        mockMvc.perform(get("/api/v1/theft-reports/me")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(firstId.toString()))
                .andExpect(jsonPath("$[0].description").value("Stolen near station"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[0].bike.brand").value("Trek"))
                .andExpect(jsonPath("$[1].id").value(secondId.toString()))
                .andExpect(jsonPath("$[1].bike.model").value("Defy"))
                .andExpect(jsonPath("$[1].status").value("SIGHTED"))
                .andExpect(jsonPath("$[1].theftTime").value("2024-02-03T10:20:30"));
    }

    private UsernamePasswordAuthenticationToken authenticatedRequest(UUID userId, String username, String email) {
        User user = User.builder()
                .id(userId)
                .username(username)
                .password("secret")
                .email(email)
                .roles(Set.of(new Role(RoleType.ROLE_USER)))
                .build();
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return UsernamePasswordAuthenticationToken.authenticated(userDetails, null, userDetails.getAuthorities());
    }
}
