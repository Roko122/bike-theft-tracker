package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.UserDetailsResponse;
import com.rkrs.bikethefttracker.dto.UserResponse;
import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.RoleType;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;
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
    @DisplayName("toUserDetailsResponse palauttaa kirjautuneen kayttajan perustiedot ja roolit")
    void toUserDetailsResponse_mapsUserAndAuthorities() {
        UUID userId = UUID.fromString("5f091d4b-f4a4-4f5d-a645-5163dfa1e958");
        User user = User.builder()
                .id(userId)
                .username("teemu")
                .password("secret")
                .roles(Set.of(new Role(RoleType.ROLE_USER), new Role(RoleType.ROLE_ADMIN)))
                .build();

        UserDetailsResponse response = userMapper.toUserDetailsResponse(new CustomUserDetails(user));

        assertEquals(userId, response.id());
        assertEquals("teemu", response.username());
        assertEquals(2, response.roles().size());
        assertEquals(Set.of("ROLE_USER", "ROLE_ADMIN"), Set.copyOf(response.roles()));
    }
}
