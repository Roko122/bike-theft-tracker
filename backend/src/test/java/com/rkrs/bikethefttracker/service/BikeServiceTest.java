package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.domain.Bike;
import com.rkrs.bikethefttracker.domain.User;
import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
import com.rkrs.bikethefttracker.dto.CreateUserRequest;
import com.rkrs.bikethefttracker.mapper.BikeMapper;
import com.rkrs.bikethefttracker.repository.BikeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BikeServiceTest {

    @Mock
    private BikeMapper bikeMapper;

    @Mock
    private BikeRepository bikeRepository;

    @InjectMocks
    private BikeService bikeService;

    @Test
    @DisplayName("createBike asettaa käyttäjän, tallentaa pyorän ja palauttaa tallennetun pyorän")
    void createBike_success_setsUserSavesAndReturnsSavedBike() {
        CreateBikeRequest request = new CreateBikeRequest(
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                "SN-12345",
                "Lime tape",
                new CreateUserRequest("teemu", "teemu@example.com")
        );
        User user = User.builder().username("teemu").email("teemu@example.com").build();
        Bike mappedBike = Bike.builder()
                .brand("Cube")
                .model("Nuroad")
                .type("Gravel")
                .color("Green")
                .serialNumber("SN-12345")
                .description("Lime tape")
                .build();
        Bike savedBike = Bike.builder()
                .brand("Cube")
                .model("Nuroad")
                .type("Gravel")
                .color("Green")
                .serialNumber("SN-12345")
                .description("Lime tape")
                .user(user)
                .build();

        when(bikeMapper.toBike(request)).thenReturn(mappedBike);
        when(bikeRepository.save(mappedBike)).thenReturn(savedBike);

        Bike result = bikeService.createBike(request, user);

        assertSame(user, mappedBike.getUser());
        assertEquals(savedBike, result);

        verify(bikeMapper).toBike(request);
        verify(bikeRepository).save(mappedBike);
        verifyNoMoreInteractions(bikeMapper, bikeRepository);
    }
}
