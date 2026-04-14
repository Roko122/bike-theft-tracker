package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.RegisterUserRequest;
import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.RoleType;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("createUser rakentaa kayttajan, asettaa oletusroolin ja tallentaa sen")
    void createUser_success_buildsUserAndSavesIt() {
        RegisterUserRequest request = new RegisterUserRequest("teemu", "Salasana1!", "teemu@example.com");
        Role defaultRole = new Role(RoleType.ROLE_USER);
        User savedUser = User.builder()
                .username("teemu")
                .password("hashed-password")
                .email("teemu@example.com")
                .build();

        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class))).thenReturn(savedUser);

        User result = userService.createUser(request, defaultRole, "hashed-password");

        assertEquals(savedUser, result);
        verify(userRepository).save(org.mockito.ArgumentMatchers.argThat(user ->
                user.getUsername().equals("teemu")
                        && user.getPassword().equals("hashed-password")
                        && user.getEmail().equals("teemu@example.com")
                        && user.getRoles().contains(defaultRole)
        ));
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    @DisplayName("userExistsWithUsername delegoi tarkistuksen repositorioon")
    void userExistsWithUsername_returnsRepositoryResult() {
        when(userRepository.existsByUsername("teemu")).thenReturn(true);

        boolean exists = userService.userExistsWithUsername("teemu");

        assertTrue(exists);
        verify(userRepository).existsByUsername("teemu");
        verifyNoMoreInteractions(userRepository);
    }
}
