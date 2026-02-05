package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.domain.User;
import com.rkrs.bikethefttracker.dto.UserInfo;
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

    public User toUser(UserInfo userInfo) {
        return User.builder()
                .email(userInfo.email())
                .username(userInfo.username())
                .build();
    }
}
