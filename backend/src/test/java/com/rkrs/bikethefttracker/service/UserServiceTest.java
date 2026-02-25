package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.dto.CreateUserRequest;
import com.rkrs.bikethefttracker.mapper.UserMapper;
import com.rkrs.bikethefttracker.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("createUser mapittaa pyynnön, tallentaa käyttäjän ja palauttaa tallennetun käyttäjän")
    void createUser_success_mapsSavesAndReturnsSavedUser() {
        CreateUserRequest request = new CreateUserRequest("teemu", "teemu@example.com");
        User mappedUser = User.builder()
                .username("teemu")
                .email("teemu@example.com")
                .build();
        User savedUser = User.builder()
                .username("teemu")
                .email("teemu@example.com")
                .build();

        when(userMapper.toUser(request)).thenReturn(mappedUser);
        when(userRepository.save(mappedUser)).thenReturn(savedUser);

        User result = userService.createUser(request);

        assertEquals(savedUser, result);

        verify(userMapper).toUser(request);
        verify(userRepository).save(mappedUser);
        verifyNoMoreInteractions(userMapper, userRepository);
    }
}
