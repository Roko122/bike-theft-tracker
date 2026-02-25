package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.dto.CreateUserRequest;
import com.rkrs.bikethefttracker.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername()
        );
    }

    public User toUser(CreateUserRequest createUserRequest) {
        return User.builder()
                .email(createUserRequest.email())
                .username(createUserRequest.username())
                .build();
    }
}
