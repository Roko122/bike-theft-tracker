package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.domain.User;
import com.rkrs.bikethefttracker.dto.CreateUserRequest;
import com.rkrs.bikethefttracker.dto.UserResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserMapperTest {

    private final UserMapper userMapper = new UserMapper();

    @Test
    @DisplayName("toUserResponse palauttaa oikean id:n ja username:n")
    void toUserResponse_mapsIdAndUsername() {
        UUID userId = UUID.fromString("f893f62b-0cc6-4f2f-a95f-aea262f1451e");
        User user = User.builder()
                .id(userId)
                .username("teemu")
                .build();

        UserResponse response = userMapper.toUserResponse(user);

        assertEquals(user.getId(), response.id());
        assertEquals(user.getUsername(), response.username());
    }

    @Test
    @DisplayName("toUser asettaa username- ja email-kentät oikein")
    void toUser_mapsUsernameAndEmail() {
        CreateUserRequest request = new CreateUserRequest("teemu", "teemu@example.com");

        User user = userMapper.toUser(request);

        assertEquals(request.username(), user.getUsername());
        assertEquals(request.email(), user.getEmail());
    }
}
