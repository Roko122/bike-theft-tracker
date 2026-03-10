package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.UserResponse;
import com.rkrs.bikethefttracker.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername()
        );
    }
}
