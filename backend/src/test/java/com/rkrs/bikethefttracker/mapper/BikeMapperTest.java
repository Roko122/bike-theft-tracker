package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.dto.BikeResponse;
import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
import com.rkrs.bikethefttracker.dto.CreateUserRequest;
import com.rkrs.bikethefttracker.dto.UserResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BikeMapperTest {

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private BikeMapper bikeMapper;

    @Test
    @DisplayName("toBikeResponse palauttaa oikein mapitetun BikeResponse-olion")
    void toBikeResponse_mapsAllFieldsAndUsesUserMapper() {
        UUID bikeId = UUID.fromString("f8f9a4c8-a31d-4f86-b772-bd9807576d3f");
        UUID userId = UUID.fromString("93dfc323-c909-4df7-b15f-e7f7cba5419f");
        User user = User.builder()
                .id(userId)
                .username("teemu")
                .email("teemu@example.com")
                .build();
        Bike bike = Bike.builder()
                .id(bikeId)
                .brand("Cube")
                .model("Nuroad")
                .type("Gravel")
                .color("Green")
                .serialNumber("SN-12345")
                .description("Lime tape")
                .user(user)
                .build();
        UserResponse mappedUserResponse = new UserResponse(userId, "teemu");

        when(userMapper.toUserResponse(bike.getUser())).thenReturn(mappedUserResponse);

        BikeResponse response = bikeMapper.toBikeResponse(bike);

        assertEquals(bike.getId(), response.id());
        assertEquals(bike.getBrand(), response.brand());
        assertEquals(bike.getModel(), response.model());
        assertEquals(bike.getType(), response.type());
        assertEquals(bike.getColor(), response.color());
        assertEquals(bike.getSerialNumber(), response.serialNumber());
        assertEquals(bike.getDescription(), response.description());
        assertEquals(mappedUserResponse, response.user());

        verify(userMapper).toUserResponse(bike.getUser());
    }

    @Test
    @DisplayName("toBike asettaa brand-, model-, type-, color-, serialNumber- ja description-kentät oikein")
    void toBike_mapsCreateBikeRequestFields() {
        CreateBikeRequest request = new CreateBikeRequest(
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                "SN-12345",
                "Lime tape",
                new CreateUserRequest("teemu", "teemu@example.com")
        );

        Bike bike = bikeMapper.toBike(request);

        assertEquals(request.brand(), bike.getBrand());
        assertEquals(request.model(), bike.getModel());
        assertEquals(request.type(), bike.getType());
        assertEquals(request.color(), bike.getColor());
        assertEquals(request.serialNumber(), bike.getSerialNumber());
        assertEquals(request.description(), bike.getDescription());
    }
}
